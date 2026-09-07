import fs from 'fs';

try {
  const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
  const envContent = `VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_APP_ID=${config.appId}
VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_DATABASE_ID=${config.firestoreDatabaseId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket || ''}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId || ''}
`;
  fs.writeFileSync('./.env.local', envContent);
  console.log('Successfully created .env.local from firebase-applet-config.json');
} catch (err) {
  console.error('Error creating .env.local:', err.message);
}
