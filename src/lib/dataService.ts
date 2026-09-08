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

// Seed initial project data to Firestore if not present, so Firestore has live data
export const seedInitialData = async (ownerId: string = 'demo-owner-ready-to-use') => {
  try {
    const projSnap = await getDocs(query(collection(db, 'projects'), where('ownerId', '==', ownerId)));
    if (projSnap.empty) {
      console.log('Seeding initial construction data to Firestore...');
      await Promise.all([
        ...INITIAL_PROJECTS.map(p => setDoc(doc(db, 'projects', p.id), { ...p, ownerId }, { merge: true })),
        ...INITIAL_TASKS.map(t => setDoc(doc(db, 'tasks', t.id), { ...t, ownerId }, { merge: true })),
        ...INITIAL_MATERIAL_REQUESTS.map(m => setDoc(doc(db, 'materialRequests', m.id), { ...m, ownerId }, { merge: true })),
        ...INITIAL_ISSUES.map(i => setDoc(doc(db, 'issueReports', i.id), { ...i, ownerId }, { merge: true })),
        ...INITIAL_UPDATES.map(u => setDoc(doc(db, 'siteUpdates', u.id), { ...u, ownerId }, { merge: true })),
        ...INITIAL_FILES.map(f => setDoc(doc(db, 'projectFiles', f.id), { ...f, ownerId }, { merge: true })),
      ]);
      console.log('Seeding completed successfully.');
    }
  } catch (err) {
    console.warn('Firestore seeding skipped or offline:', err);
  }
};

export const subscribeToCollection = <T>(
  collectionName: string, 
  ownerId: string, 
  callback: (data: T[]) => void,
  fallbackData?: T[]
) => {
  try {
    const colRef = collection(db, collectionName);
    const q = ownerId ? query(colRef, where('ownerId', '==', ownerId)) : colRef;
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as T);
          callback(data);
          try {
            localStorage.setItem(`siteflow_${collectionName}`, JSON.stringify(data));
          } catch (e) {}
        } else if (fallbackData && fallbackData.length > 0) {
          try {
            const cached = localStorage.getItem(`siteflow_${collectionName}`);
            if (cached) {
              callback(JSON.parse(cached));
              return;
            }
          } catch (e) {}
          callback(fallbackData);
        }
      },
      (error) => {
        console.warn(`Firestore listener for ${collectionName} error:`, error.message);
        try {
          const cached = localStorage.getItem(`siteflow_${collectionName}`);
          if (cached) {
            callback(JSON.parse(cached));
            return;
          }
        } catch (e) {}
        if (fallbackData) callback(fallbackData);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`Could not subscribe to ${collectionName}:`, err);
    if (fallbackData) callback(fallbackData);
    return () => {};
  }
};

// Generic update function with offline fallback
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (err) {
    console.warn(`Update failed on ${collectionName}/${id}, falling back to setDoc merge:`, err);
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, { merge: true });
    } catch (e) {}
  }
};

// Generic add function
export const addDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.warn(`Add failed on ${collectionName}/${id}:`, err);
  }
};

// Generic delete function
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`Delete failed on ${collectionName}/${id}:`, err);
  }
};
