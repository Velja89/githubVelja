import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDtgzraa6KPc9DEWEU91XDp2QxPaS8DB1w',
  authDomain: 'instagram-clone-app-b7b87.firebaseapp.com',
  projectId: 'instagram-clone-app-b7b87',
  storageBucket: 'instagram-clone-app-b7b87.appspot.com',
  messagingSenderId: '908924739820',
  appId: '1:908924739820:web:7522bdb5e5a91250db05c9',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
