import {Link, useNavigate} from "react-router-dom";
import {CircleCheck, Instagram} from "lucide-react"
import {FormEvent, useContext, useEffect, useState} from "react";

import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {database} from "./firebase-config/firebase.ts";
import {UserContext, UserContextType} from "./contexts/UserContext.tsx";

function App() {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const {setSuccess, success} = useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  useEffect(() => {
    const getNameInLocalStorage = localStorage.getItem("name");
    
    if(getNameInLocalStorage){
      navigate("/chats")
    }

  }, []);

  const checkName = async() => {
    try {
      const q = query(collection(database, "users"), where("name", "==",`@${name}`))
      const querySnapshot = await getDocs(q);


      if (!querySnapshot.empty) {
        setError("Nama udah diambil coii");
        setTimeout(() => {
          setSuccess(false);
        }, 500)
        return;
      }

      localStorage.setItem("name", `@${name}`)
      await addDoc(collection(database, "users"), {
        name: `@${name}`
      })

      setError(null)
      setSuccess(true)

    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmitAlias = async(event: FormEvent) => {
    event.preventDefault()
    await checkName()
  }


  return (
    <>
      <div className="font-poppins flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 md:px-6">
        <div className="grid max-w-md w-full space-y-6 text-center">
          <h1 className="font-bold text-4xl tracking-tighter text-gray-900">Keluh Kesah SNBT</h1>
          <p className="text-lg font-medium text-gray-500">
            Share your thoughts and experiences about the UTBK exam and SNBT.
          </p>
          {name && (
            <p className="text-sm font-medium text-gray-500">
              Aliasmu - <span className="text-black">@{name}</span>
            </p>
          )}
          <div className="flex flex-col space-y-2">
            <form className="inline-flex">
              <input onChange={(e) => setName(`${e.target.value}`)} className="font-medium flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tulis @aliasmu disini "/>
              <button disabled={success} onClick={handleSubmitAlias} className="inline-flex h-10 items-center justify-center rounded-r-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                {success ? (
                  <CircleCheck className="w-5 h-5" />
                ) : "Gass"}
              </button>
            </form>
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <button disabled={!success} onClick={() => {
              setName("")
              navigate("/chats")
            }} className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
              Share your story
            </button>
            <Link target="_blank" to="https://www.instagram.com/_giannnt?igsh=MXJ3bGUzbmx3bng0Yg==" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
              Instagram
              <Instagram className="ml-2 w-4 h-4"/>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
