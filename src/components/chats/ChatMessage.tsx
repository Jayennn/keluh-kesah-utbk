import { ImageUp, Send } from "lucide-react";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, database } from "../../firebase-config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface ChatMessageProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatMessage({ message, setMessage, setIsLoading }: ChatMessageProps) {
  const [user] = useAuthState(auth);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const sendMessage = async () => {
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const { uid, displayName, photoURL } = user || {};
    let fileURL = null;

    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            if(snapshot.bytesTransferred !== snapshot.totalBytes){
              setIsLoading(true)
            }
            setIsLoading(false)
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fileURL = downloadURL;
              resolve(fileURL);
            });
          }
        );
      });
    }

    try {
      await addDoc(collection(database, "messages"), {
        user_name: displayName,
        user_image: photoURL,
        text: message,
        file: fileURL,
        createdAt: serverTimestamp(),
        uid,
      });
    } catch (e) {
      console.error(e);
    }

    setMessage("");
    setFile(null);
    setFilePreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <>
      <div className="sticky bottom-0 w-full p-3 bg-white">
        <div className="relative">
          {filePreview && (
            <div className="rounded-md mb-2 bg-gray-100/80 border border-dashed flex justify-center items-center">
              <img src={filePreview} alt="file-upload" className="w-[20rem] h-[20rem] object-contain p-4 rounded-md" />
            </div>
          )}
          <textarea
            className="min-h-[100px] w-full rounded-md border border-gray-200 bg-gray-100 p-3 pr-16 text-sm focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Tulis keluh kesah"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="absolute bottom-3 px-4 flex items-center justify-between w-full">
            <div>
              <input id="upload-image" type="file" className="sr-only" onChange={handleImageChange} />
              <label htmlFor="upload-image">
                <ImageUp className="h-5 w-5" />
              </label>
            </div>
            <button onClick={sendMessage} className="bg-white flex items-center h-9 px-4 py-2 text-sm border rounded-md">
              Gass
              <Send className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatMessage;
