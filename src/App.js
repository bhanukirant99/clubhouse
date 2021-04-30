import "./style.css";

import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useRef, useState } from "react";

console.log(process.env);

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "looptext-70c07.firebaseapp.com",
  projectId: "looptext-70c07",
  storageBucket: "looptext-70c07.appspot.com",
  messagingSenderId: "55173207228",
  appId: "1:55173207228:web:97203631080c63619eecb9",
  measurementId: "G-M3YXEWGJ07",
});

const firestore = firebase.firestore();
const auth = firebase.auth();

const messagesRef = firestore.collection("messages");
const query = messagesRef.orderBy("createdAt").limit(25);

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
};

const ChatRoom = () => {
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const chatRef = useRef();

  useEffect(() => {
    chatRef?.current && chatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={chatRef}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          type="text"
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">send</button>
      </form>
    </>
  );
};

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

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
