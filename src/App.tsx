import React, { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { LogOut, LayoutDashboard, Briefcase, CheckSquare, ShieldAlert } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Data state
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            await fetchData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async (uData: any) => {
    try {
      const qProjects = query(collection(db, 'projects'), where('orgId', '==', uData.orgId));
      const projSnapshot = await getDocs(qProjects);
      setProjects(projSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const qTasks = query(collection(db, 'tasks'), where('orgId', '==', uData.orgId));
      const taskSnapshot = await getDocs(qTasks);
      setTasks(taskSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Fetch error - permissions might deny access:", e);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Note: In a real app, you would create the user document via cloud function or securely.
        // For testing, we just create a worker role for the demo org.
        // We'll skip registration here as rule requires owner/admin to modify roles safely,
        // but for simplicity we allow initial creation if we were to loosen rules.
        alert("Registration is restricted. Ask your admin to create your account.");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const seedData = async () => {
    if (!userData || !['owner', 'admin'].includes(userData.role)) return;
    try {
      const orgId = userData.orgId;
      const projRef = await addDoc(collection(db, 'projects'), {
        orgId,
        name: 'New Site Design',
        status: 'In Progress',
        assignedWorkers: ['some_worker_id'] // you can replace this with actual worker uids
      });
      await addDoc(collection(db, 'project_financials'), {
        orgId,
        projectId: projRef.id,
        profit: 50000,
        clientPayment: 100000
      });
      await addDoc(collection(db, 'tasks'), {
        orgId,
        projectId: projRef.id,
        title: 'Paint the living room',
        assignedTo: 'some_worker_id'
      });
      alert("Seeded test data! Refresh to see.");
      fetchData(userData);
    } catch (e) {
      console.error(e);
      alert("Error seeding data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">Interior Design Platform</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 font-medium hover:bg-slate-800 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isManager = userData?.role && ['owner', 'admin', 'project_manager', 'supervisor'].includes(userData.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-slate-900" />
          <h1 className="text-xl font-bold text-slate-900">Interior Design Platform</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-right">
            <p className="font-medium text-slate-900">{user.email}</p>
            <p className="text-slate-500 capitalize">{userData?.role || 'No Role'}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!userData ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col items-start gap-4">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-amber-900">Account Not Configured</h2>
                <p className="text-amber-800 mt-1">Your account does not have an assigned role or organization. Please contact your administrator.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                const orgRef = await addDoc(collection(db, 'organizations'), {
                  name: 'Demo Interior Design Co.',
                  financials: {}
                });
                await setDoc(doc(db, 'users', user.uid), {
                  uid: user.uid,
                  orgId: orgRef.id,
                  email: user.email,
                  role: 'owner'
                });
                alert("Setup complete! Please refresh the page.");
              }}
              className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Initialize Demo Organization (Test Only)
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {isManager && (
              <div className="flex justify-end">
                <button
                  onClick={seedData}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Seed Test Data
                </button>
              </div>
            )}

            <section>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5" />
                {isManager ? "Organization Projects" : "Assigned Projects"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                  <p className="text-slate-500 col-span-full">No projects found.</p>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-semibold text-lg text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Status: {project.status}</p>
                      {isManager && (
                        <div className="mt-4 text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded inline-block">
                          Financials hidden from workers
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <CheckSquare className="w-5 h-5" />
                {isManager ? "All Tasks" : "My Assigned Tasks"}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                {tasks.length === 0 ? (
                  <div className="p-6 text-slate-500 text-center">No tasks found.</div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{task.title}</h4>
                        <p className="text-sm text-slate-500">Project: {projects.find(p => p.id === task.projectId)?.name || task.projectId}</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-slate-900" />
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
