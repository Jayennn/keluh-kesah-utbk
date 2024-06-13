import { useEffect, useState } from "react";
import placeholderUser from "../../assets/placeholder/placeholder-user.jpg";
import { Trash2 } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  Timestamp,
  deleteDoc,
  doc
} from "firebase/firestore";
import { auth, database } from "../../firebase-config/firebase";
import moment from "moment";
import ChatMessage from "./ChatMessage.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import {motion, AnimatePresence} from "framer-motion";
type MessagesType = {
  user_name: string;
  user_image: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
  file: string | null;
  id: string;
};

function Chats() {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<MessagesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteChatHandler = async (id: string) => {
    try {
      await deleteDoc(doc(database, "messages", id));
      console.log(`Document with ID ${id} deleted`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    const q = query(
      collection(database, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages: MessagesType[] = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({
          ...doc.data() as MessagesType,
          id: doc.id
        });
      });

      setChats(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="space-y-3 p-4">

        {chats.length < 1 ? (
          <div className="grid place-content-center h-[75vh]">
            <p className="text-center">Selamat datang di Keluh Kesah UTBK</p>
          </div>
        ) : (
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={chat.id}
                className="pb-2 flex  transition-all"
              >
                <div className="flex space-x-3">
                  <div className="flex space-x-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <img className="object-contain" src={chat.user_image ?? placeholderUser} alt="user-image"/>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ">
                    <div className="user-info ">
                      <p className="text-base font-medium">{chat.user_name}</p>
                      <p className="text-xs leading-3 text-gray-500">{moment(chat.createdAt?.toDate()).fromNow()}</p>
                    </div>
                    <div className="space-y-2">
                        {chat.file && (
                          <div className="p-4 ">
                            {isLoading ? (
                              <p>Loading Brok</p>
                            ) : (
                              <img className="w-[25rem] h-auto" src={chat.file} alt="file-uploaded"/>
                            )}
                          </div>
                        )}
                      <p className="leading-6 text-sm">{chat.text}</p>
                    </div>
                  </div>
                </div>
                {chat.uid === user?.uid && (
                  <Trash2 className="mt-3 w-5 h-5 hover:rotate-6 hover:text-red-500 transition-all" onClick={() => deleteChatHandler(chat.id)} />
                )}
              </motion.div>
              ))}
          </AnimatePresence>
        )}
      </div>

      <ChatMessage
        setMessage={setMessage}
        message={message}
        setIsLoading={setIsLoading}
      />
    </>
  );
}

export default Chats;
