const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'iptv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'asd123',
});

async function verifyFix() {
  let client;
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Check if vod_content table exists
    console.log('Checking if vod_content table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'vod_content'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ vod_content table exists');
      
      // Get table structure
      console.log('Getting table structure...');
      const tableStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'vod_content'
        ORDER BY ordinal_position;
      `);
      
      console.log('vod_content table structure:');
      tableStructure.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
      
      // Count rows
      const countResult = await client.query('SELECT COUNT(*) FROM vod_content');
      console.log(`\nTable has ${countResult.rows[0].count} rows`);
      
      // Show sample data if any
      if (parseInt(countResult.rows[0].count) > 0) {
        console.log('\nSample data:');
        const sampleData = await client.query('SELECT * FROM vod_content LIMIT 3');
        sampleData.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.titulo} (${row.tipo})`);
        });
      } else {
        console.log('\nTable is empty');
      }
    } else {
      console.log('❌ vod_content table does not exist');
      
      // Try to create it
      console.log('Attempting to create vod_content table...');
      const fs = require('fs');
      const path = require('path');
      
      const sqlFilePath = path.join(__dirname, 'migrations', 'fixVodContentTable.sql');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent.split(';').map(s => s.trim()).filter(s => s.length > 0);
      
      for (const statement of statements) {
        if (statement.trim().length > 0) {
          try {
            await client.query(statement + ';');
            console.log('✅ Executed statement');
          } catch (err) {
            console.log('❌ Error executing statement:', err.message);
            // Continue with next statement
          }
        }
      }
      
      console.log('Finished attempting to create table');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

verifyFix();
