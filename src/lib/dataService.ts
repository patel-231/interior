import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Task, ProjectFile, MaterialRequest, IssueReport, SiteUpdate } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_ISSUES,
  INITIAL_UPDATES,
  INITIAL_FILES,
} from '../mockData';

export const seedInitialData = async () => {};

export const subscribeToCollection = <T>(
  collectionName: string, 
  ownerId: string, 
  callback: (data: T[]) => void
) => {
  const q = query(collection(db, collectionName), where('ownerId', '==', ownerId));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => doc.data() as T);
    callback(data);
  });
};

// Generic update function
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

// Generic add function
export const addDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data);
};
