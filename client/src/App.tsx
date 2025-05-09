
import { useEffect, useState, useRef } from 'react';
import db from './firebase';
import {onSnapshot,doc } from 'firebase/firestore';
import ChatBox from './Components/Chatbot/Chatbot';
import firebase from 'firebase/compat/app';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface Shot {
  id: string;
  sceneName: string;
  sceneNumber: string;
  shotNumber: string;
  location: string;
  description: string;
  shotType: string;
  cameraAngle: string;
  movement: string;
  equipment: string;
  framing: string;
  setupTime?: string;
  audioNotes?: string;
}

function App() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [explanation, setExplanation] = useState('');
  const [dataRendered, setDataRendered] = useState(false);
  const lastShotRef = useRef<HTMLDivElement | null>(null);


  console.log('shots', shots.length, shots)

  useEffect(() => {
      const unloadCallback = () => {firebase.app().delete()}
      window.addEventListener("beforeunload", unloadCallback);
      return () =>{
        async () => {
        window.removeEventListener("beforeunload", unloadCallback);
      }}
    }, [])
    

  useEffect(() => {
    const unsubscribe =  onSnapshot(doc(db, 'shotlists', 'current'), (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setShots(data.shots || []);
            setExplanation(data.explanation || '');
          }
        });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // When shots are updated, observe the last shot to detect visibility
    console.log(shots.length)
    console.log(lastShotRef.current)
    if (shots.length > 0 && lastShotRef.current) {
      console.log('shots.length > 0 && lastShotRef.current', lastShotRef.current)
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log('last shot is visible')
            setDataRendered(true); // Set loading to false once the last shot data is visible
          }
        },
        { threshold: 1.0 }
      );

      observer.observe(lastShotRef.current);

      return () => observer.disconnect();
    }
  }, [shots]);


    /*

      This function utilizes the package jspdf to create a downloadable pdf for the user to share the filmshot

    */

    const exportPDF = () => {
      if (shots.length === 0) return;
    
      const doc = new jsPDF();
      const lastShot = shots[shots.length - 1];
    
      doc.setFontSize(16);
      doc.text("Latest AI-Generated Shot", 14, 22);
      doc.setFontSize(12)
      doc.text(`Scene Name: ${lastShot.sceneName}, (page 1 of 2)`, 14, 28);
    
      const tableBodyPg1 = [[
        lastShot.sceneNumber || '—',
        lastShot.shotNumber || '—',
        lastShot.location || '—',
        lastShot.description || '—',
        lastShot.shotType || '—',
      ]];
      const tableBodyPg2 = [[
        lastShot.cameraAngle || '—',
        lastShot.movement || '—',
        lastShot.equipment || '—',
        lastShot.framing || '—',
        lastShot.setupTime || '—',
        lastShot.audioNotes || '—',
      ]];
    
    
      autoTable(doc, {
        startY: 30,
        head: [[
          'Scene #', 'Shot #', 'Location', 'Description', 'Shot Type'
        ]],
        body: tableBodyPg1,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        columnStyles: {
          4: { cellWidth: 20 }, // make 'Description' column wider in order for visbility
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          halign: 'center',
        },
        margin: { top: 20 },
      });
      // seperating the contents of the filmshot onto two different pages so content is visible to user
      doc.addPage()
      doc.setPage(2)
      doc.setFontSize(16);
      doc.text("Latest AI-Generated Shot", 14, 22);
      doc.setFontSize(12)
      doc.text(`Scene Name: ${lastShot.sceneName}, (page 2 of 2)`, 14, 28);


      autoTable(doc, {
        startY: 30,
        head: [[
          'Camera Angle','Movement', 'Equipment', 'Framing', 'Setup Time', 'Audio Notes'
        ]],
        body: tableBodyPg2,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          halign: 'center',
        },
        margin: { top: 20 },
      });
    
      doc.save('latest-shot.pdf');
    };
    

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🎥 AI Shot List Collaborator
      </h1>

      {shots.length > 0 ? (
        <div key = {JSON.stringify(shots)}className="mb-6 space-y-4 transition-opacity duration-700 opacity-0 animate-fadeIn">
          {shots.map((shot,index) => (
          <div key={`${shot.id}-${Math.random()}`} className="border p-4 mb-4 rounded bg-white shadow" ref={index === shots.length - 1 ? lastShotRef : null}>
            <h2 className="font-bold text-lg">{shot.sceneName}</h2>
            <p><strong>Description:</strong> {shot.description}</p>
            <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
              <p><strong>SceneNumber.ShotNumber:</strong> {shot.sceneNumber}.{shot.shotNumber}</p>
              <p><strong>Location:</strong> {shot.location}</p>
              <p><strong>Shot Type:</strong> {shot.shotType}</p>
              <p><strong>Angle:</strong> {shot.cameraAngle}</p>
              <p><strong>Movement:</strong> {shot.movement}</p>
              <p><strong>Equipment:</strong> {shot.equipment}</p>
              <p><strong>Framing:</strong> {shot.framing}</p>
              {shot.setupTime && <p><strong>Setup Time:</strong> {shot.setupTime}</p>}
              {shot.audioNotes && <p><strong>Audio/Props:</strong> {shot.audioNotes}</p>}
            </div>
          </div>
        
        ))}

        </div>
      ) : (
        <div className="mb-6 text-gray-600 italic">
          No shots currently logged. Chat with the bot to add new shots!
        </div>
      )}

      {explanation && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
          <strong>🤖 AI Notes:</strong> {explanation}
        </div>
      )}
      {shots.length > 0 &&
      <button
        onClick={exportPDF}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Download Shot List as PDF
      </button>
      }
      <ChatBox  onDataRendered={() => {
        if (dataRendered) {
          setDataRendered(false); // reset signal
        }
      }} />
    </div>
  </div>

  );
}

export default App;