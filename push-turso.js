const { createClient } = require('@libsql/client');
require('dotenv').config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  console.log('Connecting to Turso...');
  
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "DeviceLog" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "device_id" TEXT NOT NULL,
          "app_name" TEXT NOT NULL,
          "event_type" TEXT NOT NULL,
          "latitude" REAL NOT NULL,
          "longitude" REAL NOT NULL,
          "timestamp" DATETIME NOT NULL,
          "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "DeviceLog" created successfully on Turso!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
}

main();
