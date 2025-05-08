import express from 'express';
import path from 'path';
import {collection, addDoc } from "firebase/firestore";
import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';


config();

const app = express();
app.use(cors());
app.use(express.json());

 
const port = 8080;

const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp); 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.post('/api', async (req, res) => {
    console.log('connected to node post ')
    const { text } = req.body;



  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages:[
        {
          role: 'system',
          content: `You are a film production assistant that helps filmmakers draft and refine shot-lists.
      Return your answer as a JSON object with two fields:
      {
        "shots": [array of shot objects with id, scene, description],
        "explanation": "Brief reasoning for your changes and suggestions for next steps"
      }
      Do not include any extra commentary outside this object.`,
        },
        {
          role: 'user',
          content: `User request: ${text}`,
        },
      ]
    });
    console.log('messsage content',  completion.choices[0].message)
    const response = completion.choices[0].message.content;

    const parsed = JSON.parse(response!);
    const { shots, explanation } = parsed;
    console.log(shots,explanation)
    

    await addDoc(collection(db, "shotlists"),{
    shots,
    explanation,
    timestamp: Date.now() })


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate shot-list.' });
  }
});


app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
