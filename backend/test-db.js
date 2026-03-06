const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection to:', process.env.DATABASE_URL);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => {
        console.log('✅ Connection Successful!');
        return client.query('SELECT NOW()');
    })
    .then((res) => {
        console.log('Select NOW() result:', res.rows[0]);
        return client.end();
    })
    .catch((err) => {
        console.error('❌ Connection Failed:', err);
        process.exit(1);
    });
