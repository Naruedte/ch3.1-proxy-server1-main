const { Client } = require('pg');
require('dotenv').config();

async function checkTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('Tables in public schema:');
        console.table(res.rows);

        const tasksExist = res.rows.some(r => r.table_name === 'tasks' || r.table_name === 'Task');
        if (tasksExist) {
            console.log('✅ Found tasks/Task table.');
        } else {
            console.log('❌ tasks table NOT found.');
        }

    } catch (err) {
        console.error('Error checking tables:', err);
    } finally {
        await client.end();
    }
}

checkTables();
