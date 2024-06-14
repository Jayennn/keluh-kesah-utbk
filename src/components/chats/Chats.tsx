import {useEffect, useRef, useState} from "react";
import placeholderUser from "../../assets/placeholder/placeholder-user.jpg";
import {ChevronDown, X} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { database } from "../../firebase-config/firebase";
import ChatMessage from "./ChatMessage.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {cn, formatDuration} from "../../lib/utils.ts";

type ReplyMessageType = {
  user_name: string;
  user_image: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
  file: string | null;
  id: string;
}

type MessagesType = {
  user_name: string;
  user_image: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
  file: string | null;
  id: string;
  replies?: ReplyMessageType[]
};

export type ReplyChatType = {
  user_name: string,
  id: string
}

function Chats() {
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<MessagesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [replyChat, setReplyChat] = useState<ReplyChatType | null>(null);
  const [viewReply, setViewReply] = useState<string[]>([]);
  const scrollNewChat = useRef<HTMLDivElement>(null);
  const scrollReplyChat = useRef<HTMLDivElement>(null);

  /**/
  // const deleteChatHandler = async (id: string) => {
  //   try {
  //     await deleteDoc(doc(database, "messages", id));
  //     console.log(`Document with ID ${id} deleted`);
  //   } catch (e) {
  //     console.error("Error deleting document: ", e);
  //   }
  // };


  useEffect(() => {
    const q = query(
      collection(database, "messages"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const messagesData: MessagesType[] = QuerySnapshot.docs.map((doc) =>  ({
        ...doc.data(),
        id: doc.id
      } as MessagesType));
      setChats(messagesData.reverse());
    });

    return () => unsubscribe();
  }, []);
  console.log(viewReply)
  return (
    <>
      <div className="space-y-3 min-h-screen bg-white font-poppins">
        {chats.length < 1 ? (
          <div className="grid place-content-center h-[75vh]">
            <p className="text-center text-lg font-bold uppercase">Selamat datang di Keluh Kesah UTBK</p>
          </div>
        ) : (
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                ref={scrollNewChat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={chat.id}
                className={cn(
                  "p-4 flex justify-between transition-all",
                  replyChat?.id === chat.id && "bg-gray-200/50"
                )}
              >
                <div className="flex space-x-3">
                  <div className="flex space-x-3 relative">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border">
                      <img className="object-contain" src={chat.user_image ?? placeholderUser} alt="user-image"/>
                    </div>
                    {/*{chat.replies && chat.replies?.length >= 1 && (*/}
                    {/*  <div className="absolute w-[25px] h-[90px] rounded-bl-md top-10 border-l-[2px] border-b-[2px]"></div>*/}
                    {/*)}*/}
                  </div>
                  <div className="flex flex-col space-y-4 ">
                    <div className="user-info ">
                      <p className="text-sm font-medium">{chat.user_name}</p>
                      <p className="text-xs leading-3 text-gray-500">{formatDuration(chat.createdAt)}</p>
                    </div>
                    <div className="relative space-y-2">
                      <div aria-label="message-body" className="space-y-2 relative">
                        {(chat.replies && chat.replies?.length >= 1) && (
                          <div className="absolute w-[2px] h-full top-0 -left-[30px] border-l-[2px] bg-black"></div>
                        )}
                        {chat.file && (
                          <div className="py-2">
                            {isLoading ? (
                              <p>Loading Brok</p>
                            ) : (
                              <img className="w-[15rem] md:w-[20rem] h-auto" src={chat.file} alt="file-uploaded"/>
                            )}
                          </div>
                        )}
                        <p className="leading-6 text-sm max-w-4xl">{chat.text}</p>
                        {/* BUTTON REPLY CHAT & SHOW CHAT*/}
                      </div>
                        <div className="flex flex-col space-y-4">
                          <button
                            onClick={() => setReplyChat(
                              {
                                id: chat.id,
                                user_name: chat.user_name
                              }
                            )}
                            className="inline-flex items-center"
                          >
                            {/*<ReplyAll className="w-5 h-5" />*/}
                            <p className="text-sm text-gray-500">Reply</p>
                          </button>
                          {(chat.replies && chat.replies?.length >= 1) && (
                            <p className={cn(
                              "text-xs font-medium text-gray-600 cursor-pointer inline-flex",
                              viewReply.find(reply => reply === chat.id) && "hidden"
                            )} onClick={() => setViewReply((prev) => [...prev, chat.id])}>
                              View {chat.replies.length} replies
                              <ChevronDown className="ml-2 w4 h-4"/>
                            </p>
                          )}
                        </div>

                    </div>
                      {/* REPLIES CHATS */}
                      <div className="flex flex-col space-y-6 pl-4">
                        {chat.replies?.map((reply) => (
                          <div ref={scrollReplyChat} key={reply.id}  className={cn("hidden", viewReply.find(reply => reply === chat.id) && "block")}>

                            <div className="reply-radius flex space-x-3 relative">
                              <div className="flex space-x-3">
                                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                  <img className="object-contain" src={reply.user_image ?? placeholderUser} alt="user-image"/>
                                </div>
                              </div>
                              <div>
                                <div className="user-info">
                                  <div className="inline-flex gap-2 items-center">
                                    <p className="text-sm font-medium">{reply.user_name} to </p>
                                    <p className="text-sm text-gray-500">
                                      {chat.user_name}
                                    </p>
                                  </div>
                                  <p className="text-xs leading-3 text-gray-500">{formatDuration(reply.createdAt)}</p>
                                </div>
                                <div className="space-y-2">
                                  {reply.file && (
                                    <div className="py-2">
                                      {isLoading ? (
                                        <p>Loading Brok</p>
                                      ) : (
                                        <img className="w-[15rem] md:w-[20rem] h-auto" src={reply.file} alt="file-uploaded"/>
                                      )}
                                    </div>
                                  )}
                                  <p className="leading-6 text-sm">{reply.text}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                  </div>

                </div>
                {/*<Trash2 className="mt-2 w-4 h-4 sm:w-5 sm:h-5 hover:rotate-6 hover:text-red-500 transition-all" onClick={() => deleteChatHandler(chat.id)} />*/}
              </motion.div>
              ))}
          </AnimatePresence>
        )}
      </div>
      <div className="sticky bottom-0 w-full bg-white">
        <AnimatePresence>
          {
            replyChat && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-200/50 py-2 px-4 flex items-center justify-between mb-2"
              >
                <p className="text-sm">Replying to {replyChat?.user_name}</p>
                <X className="w-5 h-5 hover:text-red-500 hover:rotate-180 transition-all" onClick={() => setReplyChat(null)}/>
              </motion.div>
            )
          }
        </AnimatePresence>
        <div className="p-3 pt-0">
          <ChatMessage
            id={replyChat?.id}
            setViewReply={setViewReply}
            setMessage={setMessage}
            message={message}
            setIsLoading={setIsLoading}
            scrollNewChat={scrollNewChat}
            scrollReplyChat={scrollReplyChat}
            setReplyChat={setReplyChat}
          />
        </div>
      </div>
    </>
  );
}

export default Chats;
