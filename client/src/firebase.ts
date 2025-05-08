import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';



/*
NOTE: These configurations are safe to expose on the Client side as they are scoped by Firebase security rules 
*/
const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); 
console.log('logging db initialize', db)

export default db;