const { query } = require('./config/database');

const checkVodContent = async () => {
  try {
    console.log('Checking vod_content table...');
    
    // Count total rows
    const countResult = await query('SELECT COUNT(*) as count FROM vod_content');
    console.log(`Total rows in vod_content: ${countResult.rows[0].count}`);
    
    // Count by type
    const typeCount = await query('SELECT tipo, COUNT(*) as count FROM vod_content GROUP BY tipo');
    console.log('Count by type:');
    typeCount.rows.forEach(row => {
      console.log(`  ${row.tipo}: ${row.count}`);
    });
    
    // Get a few sample rows
    const sample = await query('SELECT id, titulo, tipo, capa_url FROM vod_content LIMIT 10');
    console.log('Sample rows:');
    sample.rows.forEach(row => {
      console.log(`  ${row.id}: ${row.titulo} (${row.tipo})`);
    });
    
    // Check for duplicates
    const duplicateCheck = await query(`
      SELECT titulo, tipo, COUNT(*) as count 
      FROM vod_content 
      GROUP BY titulo, tipo 
      HAVING COUNT(*) > 1
      LIMIT 10
    `);
    
    if (duplicateCheck.rows.length > 0) {
      console.log('Duplicates found:');
      duplicateCheck.rows.forEach(row => {
        console.log(`  ${row.titulo} (${row.tipo}): ${row.count} copies`);
      });
    } else {
      console.log('No duplicates found');
    }
    
  } catch (error) {
    console.error('Error checking vod_content:', error.message);
  }
};

checkVodContent();
