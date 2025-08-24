const { query } = require('../config/database');

async function addPerformanceIndexes() {
  try {
    console.log('Adicionando índices de performance...');
    
    // Índices para campos de busca
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_nome ON canais USING gin(to_tsvector('portuguese', nome));
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_categoria ON canais(categoria_id);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_qualidade ON canais(qualidade);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_idioma ON canais(idioma);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_pais ON canais(pais);
    `);
    
    // Índice composto para queries com múltiplos filtros
    await query(`
      CREATE INDEX IF NOT EXISTS idx_canais_composto ON canais(categoria_id, qualidade, idioma, pais);
    `);
    
    // Índice para EPG
    await query(`
      CREATE INDEX IF NOT EXISTS idx_epg_canal_data ON epg(canal_id, data_inicio);
    `);
    
    console.log('Índices adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar índices:', error);
    throw error;
  }
}

module.exports = { addPerformanceIndexes };

// Executar se chamado diretamente
if (require.main === module) {
  addPerformanceIndexes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
