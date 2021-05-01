import "./style.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

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

const query = firestore
  .collection("testMessages")
  .where("roomId", "==", "fgfhfhfhgfhgfh");

const useAuth = (auth) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  return { user, isUserLoggedIn: user !== null };
};

const useGetOneDocRef = (query) => {
  const [docRef, setDocRef] = useState(null);

  useEffect(() => {
    query.get().then((doc) => setDocRef(doc.docs[0].ref));
  }, []);

  return { docRef };
};

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
  const [messages, setMessages] = useState([]);
  const { docRef } = useGetOneDocRef(query);
  const [formValue, setFormValue] = useState("");
  const chatRef = useRef();

  useEffect(() => {
    const unsubscribe = query.onSnapshot((doc) =>
      setMessages(doc.docs[0].data().messages)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatRef?.current && chatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await docRef.update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        id: v4(),
        text: formValue,
        createdAt: firebase.firestore.Timestamp.now(),
        uid,
        photoURL,
      }),
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
  const { isUserLoggedIn } = useAuth(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>
      <section>{isUserLoggedIn ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
