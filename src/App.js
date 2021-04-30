import "./style.css";
import firebase from "firebase";
// import "firebase/firestore";
// import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { SignIn } from "./Components/SignIn";
import { ChatRoom } from "./Components/ChatRoom";

firebase.initializeApp({
  apiKey: "AIzaSyBL5r5ym775zGClYTphPUA8zn4tvPZ--M4",
  authDomain: "looptext-70c07.firebaseapp.com",
  projectId: "looptext-70c07",
  storageBucket: "looptext-70c07.appspot.com",
  messagingSenderId: "55173207228",
  appId: "1:55173207228:web:97203631080c63619eecb9",
  measurementId: "G-M3YXEWGJ07",
});

const auth = firebase.auth();

const SignOut = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
};

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
