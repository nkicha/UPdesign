import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const pbUrl = process.env.POCKETBASE_URL;

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!pbUrl) {
    console.error('Error: POCKETBASE_URL is not defined in env.');
    process.exit(1);
  }

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/seed-pocketbase.ts <superuser-email> <superuser-password>');
    process.exit(1);
  }

  const pb = new PocketBase(pbUrl);

  console.log(`Connecting to PocketBase at: ${pbUrl}`);
  console.log(`Attempting superuser authentication for: ${email}`);

  try {
    // In PocketBase v0.23+, superusers are authenticated using the _superusers collection
    const authData = await pb.collection('_superusers').authWithPassword(email, password);
    console.log('Superuser authenticated successfully! Token:', authData.token);
  } catch (err) {
    console.error('Authentication failed:', err);
    process.exit(1);
  }

  // 1. Create collections
  console.log('\n--- Checking and creating collections ---');

  // A. First check and create clients collection
  let clientsColId = '';
  try {
    const existing = await pb.collections.getOne('clients');
    clientsColId = existing.id;
    console.log(`Collection "clients" already exists (ID: ${clientsColId}).`);
  } catch {
    console.log('Creating collection "clients"...');
    try {
      const clientsCol = await pb.collections.create({
        name: 'clients',
        type: 'base',
        fields: [
          { name: 'nom', type: 'text', required: true },
          { name: 'telephone', type: 'text', required: true },
          { name: 'email', type: 'email', required: true, unique: true },
          { name: 'adresse', type: 'text' },
          { name: 'societe', type: 'text' }
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""'
      });
      clientsColId = clientsCol.id;
      console.log(`Collection "clients" created successfully! (ID: ${clientsColId})`);
    } catch (colErr: any) {
      console.error('Failed to create collection "clients":', colErr);
      if (colErr.response && colErr.response.data) {
        console.error('Validation details:', JSON.stringify(colErr.response.data, null, 2));
      }
      process.exit(1);
    }
  }

  // B. Define devis and commandes collections using the correct clients collection ID
  const remainingCollections = [
    {
      name: 'devis',
      type: 'base',
      fields: [
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: clientsColId,
          cascadeDelete: false,
          maxSelect: 1
        },
        { name: 'type_panneau', type: 'text', required: true },
        { name: 'dimensions', type: 'text' },
        { name: 'matiere', type: 'text' },
        { name: 'prix', type: 'number', required: true },
        { name: 'description', type: 'editor' },
        {
          name: 'statut',
          type: 'select',
          required: true,
          values: ['EN_ATTENTE', 'VALIDE', 'ANNULE', 'EN_COURS'],
          maxSelect: 1
        },
        {
          name: 'file',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880, // 5MB
          thumbs: []
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '', // public
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    },
    {
      name: 'commandes',
      type: 'base',
      fields: [
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: clientsColId,
          cascadeDelete: false,
          maxSelect: 1
        },
        { name: 'type_panneau', type: 'text', required: true },
        { name: 'dimensions', type: 'text' },
        { name: 'matiere', type: 'text' },
        { name: 'prix', type: 'number', required: true },
        {
          name: 'statut',
          type: 'select',
          required: true,
          values: ['EN_ATTENTE', 'EN_COURS', 'TERMINEE'],
          maxSelect: 1
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    }
  ];

  for (const colDef of remainingCollections) {
    try {
      const existing = await pb.collections.getOne(colDef.name);
      console.log(`Collection "${colDef.name}" already exists.`);
    } catch {
      console.log(`Creating collection "${colDef.name}"...`);
      try {
        await pb.collections.create(colDef);
        console.log(`Collection "${colDef.name}" created successfully!`);
      } catch (colErr: any) {
        console.error(`Failed to create collection "${colDef.name}":`, colErr);
        if (colErr.response && colErr.response.data) {
          console.error('Validation details:', JSON.stringify(colErr.response.data, null, 2));
        }
        process.exit(1);
      }
    }
  }

  // 2. Seed data
  console.log('\n--- Seeding data ---');

  // Map to store MySQL ID -> PocketBase ID mappings
  const clientMap: Record<number, string> = {};
  const devisMap: Record<number, string> = {};

  // A. Seed Clients
  const clientsData = [
    { id: 1, nom: 'Jean Dupont', telephone: '0612345678', email: 'jean.dupont@gmail.com', adresse: '10 Rue de la Paix, 75002 Paris', societe: 'Dupont & Co' },
    { id: 2, nom: 'Sarah Amrani', telephone: '0522345678', email: 's.amrani@outlook.com', adresse: '20 Boulevard d\'Anfa, Casablanca', societe: 'Amrani Digital' },
    { id: 3, nom: 'Mohamed El Fassi', telephone: '0661987654', email: 'mohamed.elfassi@gmail.com', adresse: '15 Avenue des FAR, Rabat', societe: 'Maroc Neon Solutions' }
  ];

  console.log('Seeding clients...');
  for (const client of clientsData) {
    try {
      // Check if client email already exists to prevent duplicate seeding
      const list = await pb.collection('clients').getList(1, 1, {
        filter: `email = "${client.email}"`
      });

      let record;
      if (list.items.length > 0) {
        record = list.items[0];
        console.log(`Client "${client.nom}" already exists (ID: ${record.id})`);
      } else {
        record = await pb.collection('clients').create({
          nom: client.nom,
          telephone: client.telephone,
          email: client.email,
          adresse: client.adresse,
          societe: client.societe
        });
        console.log(`Created client: ${client.nom} -> PocketBase ID: ${record.id}`);
      }
      clientMap[client.id] = record.id;
    } catch (err) {
      console.error(`Failed to seed client "${client.nom}":`, err);
    }
  }

  // B. Seed Devis (Quotes)
  const devisData = [
    { id: 1, client_id: 1, type_panneau: 'Néon LED', dimensions: '120x40 cm', matiere: 'Acrylique & Silicone', prix: 4500.00, description: 'Enseigne lumineuse logo \'Dupont & Co\' couleur rouge neon.', statut: 'VALIDE' },
    { id: 2, client_id: 2, type_panneau: 'Lettres 3D Relief', dimensions: '300x80 cm', matiere: 'Inox poli miroir rétroéclairé', prix: 12000.00, description: 'Enseigne extérieure en lettres boîtiers inox poli avec effet halo lumineux blanc chaud.', statut: 'EN_COURS' },
    { id: 3, client_id: 3, type_panneau: 'Caisson Lumineux', dimensions: '150x150 cm', matiere: 'Profilé alu, bâche tendue diffusante', prix: 6800.00, description: 'Caisson lumineux double face pour signalétique extérieure.', statut: 'EN_ATTENTE' }
  ];

  console.log('\nSeeding devis...');
  for (const devis of devisData) {
    const pbClientId = clientMap[devis.client_id];
    if (!pbClientId) {
      console.warn(`Skipping devis ${devis.id} because client ${devis.client_id} was not found.`);
      continue;
    }

    try {
      // Check if devis already exists
      const list = await pb.collection('devis').getList(1, 1, {
        filter: `client = "${pbClientId}" && type_panneau = "${devis.type_panneau}" && prix = ${devis.prix}`
      });

      let record;
      if (list.items.length > 0) {
        record = list.items[0];
        console.log(`Devis of type "${devis.type_panneau}" already exists for client (ID: ${record.id})`);
      } else {
        record = await pb.collection('devis').create({
          client: pbClientId,
          type_panneau: devis.type_panneau,
          dimensions: devis.dimensions,
          matiere: devis.matiere,
          prix: devis.prix,
          description: devis.description,
          statut: devis.statut
        });
        console.log(`Created devis of type "${devis.type_panneau}" -> PocketBase ID: ${record.id}`);
      }
      devisMap[devis.id] = record.id;
    } catch (err) {
      console.error(`Failed to seed devis ${devis.id}:`, err);
    }
  }

  // C. Seed Commandes (Orders)
  const commandesData = [
    { id: 1, client_id: 1, type_panneau: 'Néon LED', dimensions: '120x40 cm', matiere: 'Acrylique & Silicone', prix: 4500.00, statut: 'EN_COURS' },
    { id: 2, client_id: 3, type_panneau: 'Caisson Lumineux', dimensions: '150x150 cm', matiere: 'Profilé alu, bâche tendue diffusante', prix: 6800.00, statut: 'EN_ATTENTE' }
  ];

  console.log('\nSeeding commandes...');
  for (const cmd of commandesData) {
    const pbClientId = clientMap[cmd.client_id];
    if (!pbClientId) {
      console.warn(`Skipping commande ${cmd.id} because client ${cmd.client_id} was not found.`);
      continue;
    }

    try {
      // Check if commande already exists
      const list = await pb.collection('commandes').getList(1, 1, {
        filter: `client = "${pbClientId}" && type_panneau = "${cmd.type_panneau}" && prix = ${cmd.prix}`
      });

      if (list.items.length > 0) {
        console.log(`Commande of type "${cmd.type_panneau}" already exists for client (ID: ${list.items[0].id})`);
      } else {
        const record = await pb.collection('commandes').create({
          client: pbClientId,
          type_panneau: cmd.type_panneau,
          dimensions: cmd.dimensions,
          matiere: cmd.matiere,
          prix: cmd.prix,
          statut: cmd.statut
        });
        console.log(`Created commande of type "${cmd.type_panneau}" -> PocketBase ID: ${record.id}`);
      }
    } catch (err) {
      console.error(`Failed to seed commande ${cmd.id}:`, err);
    }
  }

  // D. Create a default admin in the users collection for testing client auth
  console.log('\nChecking test admin in the users collection...');
  try {
    const testAdminEmail = 'admin@example.com';
    const list = await pb.collection('users').getList(1, 1, {
      filter: `email = "${testAdminEmail}"`
    });

    if (list.items.length > 0) {
      console.log(`Test admin user "${testAdminEmail}" already exists.`);
    } else {
      await pb.collection('users').create({
        email: testAdminEmail,
        password: 'YourSecurePassword123',
        passwordConfirm: 'YourSecurePassword123',
        full_name: 'Admin',
        role: 'admin',
        emailVisibility: true
      });
      console.log(`Created test admin user: ${testAdminEmail} (password: YourSecurePassword123)`);
    }
  } catch (err) {
    console.error('Failed to create test admin user in users collection:', err);
  }

  console.log('\nSeeding completed successfully!');
}

run();
