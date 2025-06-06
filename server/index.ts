import 'openai/shims/node'
import express from 'express';
import path from 'path';
import {collection, addDoc } from "firebase/firestore";
import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from 'dotenv';
import {OpenAI} from 'openai';
import cors from 'cors';
import { doc, setDoc } from 'firebase/firestore';



let conversation: { role: 'user' | 'assistant'; content: string }[] = [];

config();

const app = express();
app.use(cors());
app.use(express.json());

 
const port = 8080;

//Don't forget to updat your credentials and configurations in the server/.env file
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp); 

//Don't forget to updat your credentials and configurations in the server/.env file
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.post('/api', async (req, res) => {
    const { text } = req.body;
    conversation.push({ role: 'user', content: text });


  try {

    /*
    Prompt for AI to create the filmmaker shotlist in JSON format with rules and instructions for fine-tuning.

    */
    const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional film production assistant helping draft and refine a SINGULAR detailed shot-list.

            Always return a JSON object with the structure:
            {
            "shots": [
                {
                "id": string,
                "sceneName": string // Each 'scene name' should be descriptive of the scene but concise (e.g., "FIGHT 1.3. CAFE – NIGHT").
                "sceneNumber": string,
                "shotNumber": string,
                "location": string, // e.g., "INT. CAFE – NIGHT", or "unspecified" if unknown
                "description": string, // Brief description of action, characters, etc., or "unspecified" if unclear
                "shotType": string, // e.g., "Close-up", or "unspecified"
                "cameraAngle": string, // e.g., "Over-the-shoulder", or "unspecified"
                "movement": string, // e.g., "Dolly in", or "none" if no movement, or "unspecified"
                "equipment": string, // e.g., "Steadicam", or "unspecified"
                "framing": string, // e.g., "2.39:1", or "unspecified"
                "setupTime": string, // Optional setup time in minutes, or "unspecified"
                "audioNotes": string // Optional audio or props, or "none"/"unspecified"
                }
            ],
            "explanation": string // a brief summary of what you added, changed, or suggest next
            }

            Instructions:
            - If any detail is not provided or inferable from the context, respond with "unspecified" or "none"—do not fabricate or assume.
            - Be creative *only* when context supports it. If uncertain, default to "unspecified."
            - Do not include any commentary outside the JSON object.

            Rules:
            - Each 'scene' should be descriptive but concise (e.g., "INT. CAFE – NIGHT").
            - Be creative but grounded in practical filmmaking.
            - If the user asks for revisions, try to improve the list without removing good ideas unless instructed.
            - If the user asks to modify, add to, alter, same scene only change fields the user requests, everything else should stay the same.
            - Keep your responses short and structured. Do not include commentary outside the JSON.
            - If you have no changes, return the previous list and explain why.
            - Each 'sceneName' must be a concise, standard scene heading (e.g., "FIGHT. CAFE – NIGHT"). If not specified, infer a reasonable scene name based on context, but never leave it as "unspecified".

            
            Always respond ONLY with the JSON.`,
        
          },
          ...conversation,
          {
            role: 'user',
            content: `User input: ${text}`,
            
          },
        ]
      });

    const response = completion.choices[0].message.content;
    conversation.push({ role: 'assistant', content: response! });
    const parsed = JSON.parse(response!);
    const { shots, explanation } = parsed;

    /*
      The following Code takes the disected data JSON received from the AI and adds/modifes the firebase Database accordingly
        - note the conditional is for type of running productions example if you are runnig for testing this should not run!
    */

    if (process.env.NODE_ENV !== 'test') {
      await setDoc(doc(db, "shotlists", "current"), {
        shots,
        explanation,
        timestamp: Date.now()
      });
    }
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate shot-list.' });
  }
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
}

export default app;