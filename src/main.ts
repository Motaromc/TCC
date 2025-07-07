import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCq-JZasxlCSyrQGb52adCe4zXxffQsPWk",
  authDomain: "listatelefonica-34b6a.firebaseapp.com",
  projectId: "listatelefonica-34b6a",
  storageBucket: "listatelefonica-34b6a.firebasestorage.app",
  messagingSenderId: "390889779958",
  appId: "1:390889779958:web:f0d2e7931938f2fe24b2d7",
  measurementId: "G-5994KC58Y0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
