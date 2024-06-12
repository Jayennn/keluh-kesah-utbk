import {auth, provider} from "./firebase-config/firebase";
import {signInWithPopup} from "firebase/auth";
import {redirect} from "react-router-dom";
function App() {

  const signInGoogle = async() => {
    const data = await signInWithPopup(auth, provider);
    if(data){
      return redirect('/chats')
    }
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 md:px-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="font-bold text-4xl tracking-tighter text-gray-900">Keluh Kesah UTBK</h1>
          <p className="text-lg font-medium text-gray-500">
            Share your thoughts and experiences about the UTBK exam.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={signInGoogle} className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
              Share your story
            </button>
            <button className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
              Instagram
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
