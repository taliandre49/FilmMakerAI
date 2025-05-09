#  🎥 AI Film ShotList Collaborator

This is an  **AI Shot List Collaborator** — a real-time, GPT-4-powered application built for filmmakers and production teams to collaboratively create, refine, and manage detailed shot lists. With AI assistance and a sleek, scroll-animated UI, this app aims to streamlines pre-production planning like never before.

---

## 🚀 Features

* 🤖 **GPT-4 Powered Chatbot** to suggest, revise, or generate shots based on user prompts
* ↺ **Real-time Multi-user Sync** via Firebase for seamless collaboration
* ✍️ **Detailed Shot Metadata** support: scene/shot numbers, camera angles, movements, equipment, and more
* ✅ **Responsive & Accessible** with Tailwind CSS and clean UX patterns
* 🧠 **Context-aware AI Suggestions and Explanations** with refined conversation memory

---

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Tailwind CSS
* **Backend**: Node.js, Express
* **Database & Sync**: Firebase Realtime Database
* **AI**: OpenAI GPT-4 Turbo API
* **Testing**: Jest, React Testing Library

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/taliandre49/FilmMakerAI.git
cd FilmMakerAI
```

### 2. Install Dependencies

```bash
npm install
```

> **Note**: Ensure you have **Node.js (v18 or higher)** and **npm** installed on your system.

### 3. Configure Firebase For Client Side

* Create a project in [Firebase Console](https://console.firebase.google.com)
* Make a Web app for the Project in order to obtain your firebaseConfig (i reccomend choosing the npm SDK setup)
* Create a Database by clicking Build -> Firestore Database
* Go to the Database's rules and change the `allow read, write: if false;` to `allow read, write: if true;`
* In the root of the client directory, create a `.env` file and add your Firebase config with the name `VITE_FIREBASE_SERVICE_ACCOUNT`
FOR EXAMPLE:

```./client/.env
VITE_FIREBASE_SERVICE_ACCOUNT = {"apiKey": "",
"authDomain": "",
"projectId": "",
"storageBucket": "",
"messagingSenderId": "",
"appId": "",
"measurementId": ""}
```


### 3. Configure Firebase and Open_AI Key for Server Side

* Log into OpenAI and purchase tokens and create a new api key or use an existing api key if you already have tokens [OpenAIKeys](https://platform.openai.com/settings/organization/api-keys)
* In the root of the server directory, create a `.env` file and add the same Firebase config from about to the .env file with the name `FIREBASE_SERVICE_ACCOUNT`
* also add your OpenAI key

FOR EXAMPLE:

```./server/.env
FIREBASE_SERVICE_ACCOUNT = {"apiKey": "",
"authDomain": "",
"projectId": "",
"storageBucket": "",
"messagingSenderId": "",
"appId": "",
"measurementId": ""}

OPENAI_API_KEY = YOUR_OPEN_AI_KEY
```


### 4. Start the Development Server

```bash
npm run dev
```

Visit the app at [http://localhost:5173](http://localhost:5173) or whatever you localhost is (5173 is vite default)

---

## 🧪 Running Tests

Run the test suite with:

```bash
npm run test
```

* **Unit tests** are written with Jest and React Testing Library
* Includes tests for chatbot logic, input state, and basic UI behavior

---

## 💡 Design Notes

### Component Structure

* `ChatBox`: Handles GPT prompts, loading state, and input UI
* `ShotList`: Renders each shot with metadata, manages animation and rendering events
  
### Animation Behavior

* Fade-in effects are triggered using Tailwind classes and dynamic keys to force remounts
* All incoming shots animate whether new or replacing old ones
* `opacity-0 animate-fadeIn` is applied to key-wrapped containers to achieve this

### Downloadable File
* PDF Shot list table format is available through the `Download Shot List as PDF` button
* This ensures quick sharability of shotlist created
* This functionality was done with the `jsPDF` package  

### AI Flow

* On message submit:

  * `loading` is set to `true`
  * GPT-4 API is called via Express backend
  * Once data is added to Firebase, the frontend listens for updates
  * UI waits until all new shots are visibly rendered before dismissing the loading state

### Real-time Sync

* Firebase is used to broadcast new shots to all clients in real time
* `useEffect` hooks subscribe to updates and update state on change



## 📝 License

MIT License © \[Natalia Jordan]

---

## 📬 Contact

Questions or suggestions? Feel free to open an issue or contact [taliandre49@gmail.com](mailto:taliandre49@gmail.com)

