const { testConnection, query } = require('./config/database');

const testDb = async () => {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    
    if (connected) {
      console.log('Database connection successful!');
      
      // Test a simple query
      const result = await query('SELECT COUNT(*) as count FROM vod_content');
      console.log(`vod_content table has ${result.rows[0].count} rows`);
    } else {
      console.log('Database connection failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testDb();
