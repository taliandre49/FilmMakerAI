import { useState, useEffect} from 'react';


function ChatBox({onDataRendered}:{onDataRendered: () => void}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
    
        setLoading(true);
    
        try {
        /*
            This fetch function connects to our backend entry point inorder to run
            the backend logic of connecting to OpenAI and storing data in a databse.
        */
        const res = await fetch('http://localhost:8080/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
        });
    
        const data = await res.json();
        console.log(data)
        } catch (err) {
        console.error('Error running fetch post', err);
        } finally {
            setLoading(false);
       
    }
    
  };
        useEffect(() => {
            if (loading ) {
            const timeout = setTimeout(() => {
                onDataRendered();  // parent will call this
                setLoading(false);
                setInput('');
            }, 10000); // fallback in case parent never calls it
            return () => clearTimeout(timeout);
            }
        }, [loading]);

  return (
    <div className="flex flex-col gap-2">

        <h1 className='text-xl font-semibold'> 🎬 Film Maker Chatbot</h1>
        <div className="content-history">

        </div>
        <div className="flex gap-2 pointer-events-auto">
            <input
                type="text"
                className="border px-4 py-2 flex-1 rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the AI to modify the shot list..."
            />
            <button
                onClick={(e) => sendMessage(e)}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer hover:bg-sky-700  z-100"
                disabled={loading}
            >
                {loading ? 'Running...' : 'Send'}
            </button>
        </div>
        
        {loading && (
            <div className="text-lg text-gray-500 animate-pulse">
            The AI is thinking... ⏳
            </div>
        )}
    </div>
  );
}

export default ChatBox;
