import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCoUvZsRspx0T1LoIYGnLI3hmUiVmEOMjE",
  authDomain: "projeto-comp-7d2c3.firebaseapp.com",
  projectId: "projeto-comp-7d2c3",
  storageBucket: "projeto-comp-7d2c3.firebasestorage.app",
  messagingSenderId: "834207590985",
  appId: "1:834207590985:web:3be966ece59a1cc4eded98"
};

const app = initializeApp(firebaseConfig);

const db = getFireStore(app);

export {db};