import {ImageUp, Send, X} from "lucide-react";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, updateDoc, doc, arrayUnion, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from "../../firebase-config/firebase";
import {ReplyChatType} from "./Chats.tsx";
import {randomName} from "../../lib/utils.ts";

interface ChatMessageProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  scrollNewChat:  React.RefObject<HTMLDivElement>;
  scrollReplyChat: React.RefObject<HTMLDivElement>;
  id: string | undefined;
  setReplyChat: React.Dispatch<React.SetStateAction<ReplyChatType | null>>;
  setViewReply:  React.Dispatch<React.SetStateAction<string[]>>;

}

function ChatMessage(
  { message, setMessage, setIsLoading, scrollNewChat, scrollReplyChat, id, setReplyChat, setViewReply }: ChatMessageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const sendMessage = async () => {
    // const { uid, displayName, photoURL } = user || {};
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

    if(id) {
      try {
        await updateDoc(doc(database, "messages", id), {
          replies: arrayUnion({
            user_name: randomName(),
            user_image: null,
            text: message,
            file: fileURL,
            createdAt: Timestamp.now(),
            // uid,
          })
        })
        setMessage("");
        setFile(null);
        setFilePreview(null);
        setReplyChat(null);
        setViewReply((prev) => [...prev, id])
        scrollReplyChat.current?.scrollIntoView({behavior: "smooth"})
        return;
      } catch (e) {
        console.error(e)
      }
    }

    try {
      await addDoc(collection(database, "messages"), {
        user_name: randomName(),
        user_image: null,
        text: message,
        file: fileURL,
        createdAt: serverTimestamp(),
        replies: []
      });
    } catch (e) {
      console.error(e);
    }

    setMessage("");
    setFile(null);
    setFilePreview(null);
    scrollNewChat.current?.scrollIntoView({behavior: "smooth"})
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  console.log(message.length)
  return (
    <>
      <div className="relative">
        {filePreview && (
          <div className="relative rounded-md mb-2 bg-gray-100/80 border border-dashed flex justify-center items-center">
            <X className="absolute top-3 right-3 text-red-500" onClick={() => {
              setFile(null);
              setFilePreview(null);
            }}/>
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
          <div className="py-2 flex items-center gap-2">
            <input id="upload-image" type="file" className="sr-only" onChange={handleImageChange} />
            <label htmlFor="upload-image">
              <ImageUp className="h-5 w-5" />
            </label>
          </div>
          {(message.length >= 1 || file) && (
            <button onClick={sendMessage} className="bg-white flex items-center h-9 px-4 py-2 text-sm border rounded-md">
              Gass
              <Send className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatMessage;
