import { firebase } from '../config';

const db = firebase.firestore();
const modelName = 'tasks';

export async function getTasks() {
  const data = await db.collection(modelName).get();
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function createTask(values) {
  return db.collection(modelName).add({...values});
}

export async function updateTask(id, values) {
  return db.collection(modelName).doc(id).set({...values});
}

export async function deleteTask(id) {
  return db.collection(modelName).doc(id).delete();
}
