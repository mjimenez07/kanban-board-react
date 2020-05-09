import { firebase } from '../config';

const db = firebase.firestore();

export async function getTasks() {
  const data = await db.collection("tasks").get();
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function createTask(values) {
  const data = await db.collection("tasks").add({...values});
  console.log(data);
  return data;
}
