import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDi94RhaY6ZzKEXGViPJQ4brsAifE2aZdY",
  authDomain: "kanban-board-81e54.firebaseapp.com",
  databaseURL: "https://kanban-board-81e54.firebaseio.com",
  projectId: "kanban-board-81e54",
  storageBucket: "kanban-board-81e54.appspot.com",
  messagingSenderId: "852366999129",
  appId: "1:852366999129:web:f66d876ca86eea0e29fb48"
};

firebase.initializeApp(config);

export default firebase;