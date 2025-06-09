import { useState, useEffect, useRef} from 'react';


function ChatBox({dataRendered, onDataRendered}:{ dataRendered: boolean; onDataRendered: () => void}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isDev = window.location.hostname === 'localhost';
    const apiUrl = isDev
    ? 'http://localhost:8080/api'
    : 'https://fillmshotai-server.vercel.app/api';

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
    
        setLoading(true);
        setError(null); // clear previous errors


        // Start timeout timer
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please try again.');
        }, 20000); // 20 seconds timeout
    
        try {
        /*
            This fetch function connects to our backend entry point inorder to run
            the backend logic of connecting to OpenAI and storing data in a databse.
        */
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
        });
        
        console.log(res.body)
        
        // If response is OK before timeout, clear timeout timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        } catch (err) {
            console.error('Error running fetch post', err);
            setError('Network error occurred. Please try again.');
            setLoading(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
        } finally {
            setLoading(false);
            console.log(error)
       
    }
    
  };

        // This code ensures that the loading state is tied to the pointer specifed in App.tsx to remove loading state once information is displayed
        //This enables a new  request aswell!
        useEffect(() => {
            if (dataRendered) {
              // The parent told us last shot is visible!
              setLoading(false);
              setInput('');
              onDataRendered(); // notify parent that we've handled the event
            }
          }, [dataRendered, onDataRendered]);
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
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer hover:bg-sky-700  z-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                disabled={loading}
            >
                {loading ? 'Running...' : 'Send'}
            </button>
        </div>
        
        {/* conditionally display components based on if current query is in process or not! */}
        {loading && (
            <div className="text-lg text-gray-500 animate-pulse">
            The AI is thinking... ⏳
            </div>
        )}
        
    </div>
  );
}

export default ChatBox;
