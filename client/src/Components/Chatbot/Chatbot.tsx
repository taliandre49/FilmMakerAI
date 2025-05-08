import { useState } from 'react';
// import db from '../../firebase';
// import { getDatabase } from 'firebase/database';

function ChatBox() {
  const [input, setInput] = useState('');
  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('message sending')
    e.preventDefault()
    console.log('input', input.trim() )
    if (!input.trim()) return;
    await fetch('http://localhost:8080/api', {
      method: 'post',
      headers: { 'Content-Type': 'application/json',
       }, 
      body: JSON.stringify({ text: input }),
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log('error runnig fetch post', err))
    console.log('sending message to backend')
    setInput('');
  };

  return (
    <div className="flex gap-2">
        <h1>Film Maker Chatbot</h1>
        <div className="content-history">

        </div>
      <input
        type="text"
        className="border px-4 py-2 flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask the AI to modify the shot list..."
      />
      <button
        onClick={(e) => sendMessage(e)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}

export default ChatBox;
