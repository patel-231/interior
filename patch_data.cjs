const fs = require('fs');
let code = fs.readFileSync('src/lib/dataService.ts', 'utf-8');

// Change ownerId to organizationId in subscribeToCollection
code = code.replace(
  "ownerId: string",
  "organizationId: string"
);
code = code.replace(
  "where('ownerId', '==', ownerId)",
  "where('organizationId', '==', organizationId)"
);

// Remove the seeding logic as requested (REMOVE DEMO DATA)
code = code.replace(
  /export const seedInitialData = async \([\s\S]*?};/m,
  "export const seedInitialData = async () => {};"
);

fs.writeFileSync('src/lib/dataService.ts', code);
