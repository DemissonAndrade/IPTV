const { query } = require('./config/database');

async function testVodContentTable() {
  try {
    console.log('Testing vod_content table...');
    
    // Test if the table exists
    const result = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'vod_content'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ vod_content table exists');
      
      // Test if we can query the table
      const countResult = await query('SELECT COUNT(*) FROM vod_content');
      console.log(`✅ vod_content table has ${countResult.rows[0].count} rows`);
      
      // Show some sample data
      const sampleResult = await query('SELECT * FROM vod_content LIMIT 5');
      console.log('Sample data from vod_content:');
      console.log(sampleResult.rows);
    } else {
      console.log('❌ vod_content table does not exist');
    }
  } catch (error) {
    console.error('❌ Error testing vod_content table:', error.message);
  }
}

testVodContentTable();
