
import { useEffect, useState } from 'react';
import db from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import ChatBox from './Components/Chatbot/Chatbot';
import firebase from 'firebase/compat/app';

interface Shot {
  id: string;
  scene: string;
  description: string;
}

function App() {
  const database = getDatabase();
  console.log(database)
  const [shots, setShots] = useState<Shot[]>([]);
  const [explanation, setExplanation] = useState('');
  console.log(shots)

  useEffect(() => {
    const unloadCallback = () => {firebase.app().delete()}
    window.addEventListener("beforeunload", unloadCallback);
    return () =>{
      async () => {
      window.removeEventListener("beforeunload", unloadCallback);
    }}
  }, [])

  useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'shotlists'), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const last = data[data.length - 1];
      setShots(last?.shots || []);
      setExplanation(last?.explanation || '');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Shot List Collaborator</h1>
      {shots.length >0 && <div className="mb-6">
        {shots.map((shot) => (
          <div key={shot.id} className="border p-2 mb-2 rounded bg-white">
            <strong>{shot.scene}</strong>: {shot.description}
          </div>
        ))}
      </div>
      }
      {shots.length == 0 && <div className="mb-6">
          <h3> No shots currently logged, chat with the bot to add new shots!</h3>
        </div>
        }
      {explanation && (
        <div className="p-4 bg-yellow-100 rounded mb-4">
          <strong>AI Notes:</strong> {explanation}
        </div>
      )}
      <ChatBox />
    </div>
  );
}

export default App;