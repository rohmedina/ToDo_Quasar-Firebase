import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyCaEi8M8ZuVGHeC5CoTMV1R2cZBMkokpUs",
  authDomain: "todo-primerproyecto.firebaseapp.com",
  databaseURL: "https://todo-primerproyecto.firebaseio.com",
  projectId: "todo-primerproyecto",
  storageBucket: "todo-primerproyecto.appspot.com",
  messagingSenderId: "227325270473",
  appId: "1:227325270473:web:760e13e3fb03adc546f018"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };
