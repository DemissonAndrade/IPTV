const { query } = require('./config/database');

const testVodTable = async () => {
  try {
    console.log('Testing vod_content table...');
    
    // Check if table exists and count rows
    const result = await query('SELECT COUNT(*) as count FROM vod_content');
    console.log(`vod_content table has ${result.rows[0].count} rows`);
    
    // Get a few sample rows
    const sample = await query('SELECT id, titulo, tipo, capa_url FROM vod_content LIMIT 5');
    console.log('Sample rows:');
    sample.rows.forEach(row => {
      console.log(`  ${row.id}: ${row.titulo} (${row.tipo}) - ${row.capa_url}`);
    });
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testVodTable();
