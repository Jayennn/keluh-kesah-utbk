  import {ImageUp, Send, X} from "lucide-react";
import React, {useContext, useRef, useState} from "react";
import {addDoc, collection, updateDoc, doc, arrayUnion, Timestamp, getDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from "../../firebase-config/firebase";
import {ReplyChatType} from "./Chats.tsx";
import {UserContext, UserContextType} from "../../contexts/UserContext.tsx";

interface ChatMessageProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  scrollNewChat:  React.RefObject<HTMLDivElement>;
  scrollReplyChat: React.RefObject<HTMLDivElement>;
  setReplyChat: React.Dispatch<React.SetStateAction<ReplyChatType | null>>;
  setViewReply:  React.Dispatch<React.SetStateAction<string[]>>;
  replyChat: ReplyChatType | null
  message: string
}

function ChatMessage(
  {message, setMessage, scrollNewChat, scrollReplyChat, setReplyChat, setViewReply, replyChat }: ChatMessageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgess, setUploadProgress] = useState<{
    progress: number,
    status: boolean
  }>({ progress: 0, status: false });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const {name} = useContext(UserContext) as UserContextType;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const afterReply = (messageId: string) => {
    setMessage("");
    setFile(null);
    setFilePreview(null);
    setReplyChat(null);
    setViewReply((prev) => [...prev, messageId]);
    scrollReplyChat.current?.scrollIntoView({ behavior: "smooth" });
  };

  const afterSend = () => {
    setMessage("");
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
    scrollNewChat.current?.scrollIntoView({ behavior: "smooth" });
  };


  const resetInputFields = () => {
    setMessage("");
    setFile(null);
    setFilePreview(null);
  };

  const replyToMessage = async (messageId: string, text: string, fileURL: unknown, _replyTo: string) => {
    try {
      await updateDoc(doc(database, "messages", messageId), {
        replies: arrayUnion({
          user_name: name,
          user_image: null,
          text,
          file: fileURL,
          createdAt: Timestamp.now(),
          messageId: new Date().getTime().toString(),
          _replyTo
        }),
      });
      afterReply(messageId)
    } catch (error) {
      console.error(error);
    }
  }

  const replyToReplyMessage = async(messageId: string, text: string, fileURL: unknown, _replyTo: string) => {
    try {
      const messageRef = doc(database, "messages", messageId);
      const messageDoc = await getDoc(messageRef);
      console.log(messageDoc.data())
      if (!messageDoc.exists()) {
        throw new Error(`Document with ID ${messageId} does not exist`);
      }

      const updatedReplies = arrayUnion({
        user_name: name,
        user_image: null,
        text,
        file: fileURL,
        createdAt: Timestamp.now(),
        messageId: new Date().getTime().toString(),
        _replyTo,
      });

      await updateDoc(messageRef, {
        replies: updatedReplies,
      });

      afterReply(messageId);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  const uploadFile = (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {

          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({
            progress: progress,
            status: true
          })
        },

        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          setUploadProgress({
            progress: 0,
            status: false
          })
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  const createNewMessage = async (text: string, fileURL: unknown) => {
    try {
      await addDoc(collection(database, "messages"), {
        user_name: name,
        user_image: null,
        text,
        file: fileURL,
        createdAt: Timestamp.now(),
        replies: [],
      });
      afterSend();
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    let fileURL: unknown = null;

    if (file) {
      fileURL = await uploadFile(file);
    }

    if(replyChat?.replyMessageId){
      await replyToReplyMessage(replyChat.id, message, fileURL, replyChat._replyTo);
      return;
    }

    if (replyChat?.id) {
      console.log("messageID", replyChat.id)
      await replyToMessage(replyChat.id, message, fileURL, replyChat._replyTo);
    } else {
      await createNewMessage(message, fileURL);
    }

    resetInputFields();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    console.log("EVENT CHANGE", event.target)
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };


  return (
    <>`
      <div className="relative">
        {filePreview && (
          <div className="relative rounded-md mb-2 p-4 bg-gray-100/80 border border-dashed flex justify-center items-center">
            <X className="absolute top-3 right-3 text-red-500" onClick={() => {
              setFile(null);
              setFilePreview(null);
              if(fileInputRef.current){
                fileInputRef.current.value = "";
              }
            }}/>
            <div className="flex flex-col gap-2">
              <img src={filePreview} alt="file-upload" className="w-[20rem] h-[20rem] object-contain p-4 rounded-md" />
              {uploadProgess.status && (
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/70">
                  <div className="h-full w-full flex-1 bg-black/90 transition-all" style={{ transform: `translateX(-${100 - (uploadProgess.progress || 0)}%)` }}></div>
                </div>
              )}
            </div>
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
            <input id="upload-image" type="file"  className="sr-only" onChange={handleImageChange} ref={fileInputRef} />
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
