import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAeCUt7WtrHQG4rLTx2Vq8Mio11MJET09M',
  authDomain: 'the-plant-project-12086.firebaseapp.com',
  projectId: 'the-plant-project-12086',
  storageBucket: 'the-plant-project-12086.firebasestorage.app',
  messagingSenderId: '1019010281502',
  appId: '1:1019010281502:web:9c566e4d95800104b23e0f',
  measurementId: 'G-7DNCZVYPBZ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
