import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


/*
NOTE: These configurations are safe to expose on the Client side as they are scoped by Firebase security rules 
- will need to add your configurations VITE_FIREBASE BASE_SERVICE_ACCOUNT to the .env file
*/

// This sets up the firebase configuration for the project.

//Don't forget to updat your credentials and configurations in the client/.env file
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT!);


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); 

export default db;