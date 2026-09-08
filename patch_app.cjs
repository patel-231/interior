const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Login import and auth
code = code.replace(
  "import { subscribeToCollection",
  "import { Login } from './components/Login';\nimport { onAuthStateChanged } from 'firebase/auth';\nimport { auth, db } from './lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';\nimport { subscribeToCollection"
);

// Add user state
code = code.replace(
  "export default function App() {",
  `export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
`
);

// Auth effect and Firebase Subscriptions
code = code.replace(
  /const targetOwnerId = 'demo-owner-ready-to-use';[\s\S]*?}, \[\]\);/m,
  `
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            setRole(userData.role);
          } else {
            setUser(null); // Or trigger a login refresh
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const orgId = user.organizationId;
    
    const unsubProjects = subscribeToCollection('projects', orgId, setProjects);
    const unsubTasks = subscribeToCollection('tasks', orgId, setTasks);
    const unsubMaterials = subscribeToCollection('material_requests', orgId, setMaterialRequests);
    const unsubIssues = subscribeToCollection('issues', orgId, setIssues);
    const unsubUpdates = subscribeToCollection('progress_updates', orgId, setUpdates);
    
    return () => {
      unsubProjects();
      unsubTasks();
      unsubMaterials();
      unsubIssues();
      unsubUpdates();
    };
  }, [user]);
  `
);

// Render logic
code = code.replace(
  "const currentWorkerProject = projects.find((p) => p.id === workerSiteId) || projects[0];",
  `const currentWorkerProject = projects.find((p) => p.id === workerSiteId) || projects[0];

  if (loadingAuth) {
    return <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => {
      setUser(u);
      setRole(u.role);
    }} />;
  }`
);

// Remove DevRoleSwitcher
code = code.replace(
  /<DevRoleSwitcher[\s\S]*?\/>/,
  ""
);

fs.writeFileSync('src/App.tsx', code);
