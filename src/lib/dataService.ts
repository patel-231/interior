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

export const seedInitialData = async (ownerId: string) => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('ownerId', '==', ownerId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Seed Projects
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), { ...p, ownerId });
      }
      for (const t of INITIAL_TASKS) {
        await setDoc(doc(db, 'tasks', t.id), { ...t, ownerId });
      }
      for (const m of INITIAL_MATERIAL_REQUESTS) {
        await setDoc(doc(db, 'materialRequests', m.id), { ...m, ownerId });
      }
      for (const i of INITIAL_ISSUES) {
        await setDoc(doc(db, 'issueReports', i.id), { ...i, ownerId });
      }
      for (const u of INITIAL_UPDATES) {
        await setDoc(doc(db, 'siteUpdates', u.id), { ...u, ownerId });
      }
      for (const f of INITIAL_FILES) {
        await setDoc(doc(db, 'projectFiles', f.id), { ...f, ownerId });
      }
      console.log('Seeded initial data!');
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

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
