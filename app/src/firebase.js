// src/firebase.js
import firebase from 'firebase';
const config = {
  apiKey: 'AIzaSyDeq4qg--xA_xiRwOG29NGK8SeohHKkpqI',
  authDomain: 'modular-documents-2b3dd.firebaseapp.com',
  projectId: 'modular-documents-2b3dd',
  storageBucket: 'modular-documents-2b3dd.appspot.com',
  messagingSenderId: '412363263523',
  appId: '1:412363263523:web:2e78ed0cf9c5413e9dab96',
  measurementId: 'G-890HL1R3JK',
};
firebase.initializeApp(config);
export const firestore = firebase.firestore();
export default firebase;
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    console.log(res.user)
    
  }).catch((error) => {
    console.log(error.message)
  })
};