import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
};

console.log({
    apiKey: process.env.REACT_APP_FB_API_KEY,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
