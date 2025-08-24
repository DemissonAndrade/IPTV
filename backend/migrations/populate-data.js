const { query } = require('../config/database');

// Função para verificar se a tabela já tem dados
const hasData = async (tableName) => {
  try {
    const result = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error(`Erro ao verificar dados da tabela ${tableName}:`, error);
    return false;
  }
};

// Função para popular filmes apenas se não existirem
const populateFilmes = async () => {
  try {
    const hasFilmes = await hasData('filmes');
    if (hasFilmes) {
      console.log('✅ Tabela filmes já possui dados, pulando...');
      return;
    }

    console.log('🔄 Inserindo filmes de exemplo...');
    
    await query(`
      INSERT INTO filmes (titulo, descricao, ano, duracao, genero, capa_url, destaque) 
      VALUES
        ('Avatar: O Caminho da Água', 'Sequência do épico de ficção científica de James Cameron.', 2022, 192, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', true),
        ('Top Gun: Maverick', 'Depois de mais de 30 anos de serviço como aviador da Marinha.', 2022, 130, 'Ação', 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', true),
        ('Homem-Aranha: Sem Volta Para Casa', 'Peter Parker tem sua identidade secreta revelada.', 2021, 148, 'Ação', 'https://image.tmdb.org/t/p/w500/fVzXp3NwovUlLe7fvoRynCmBPNc.jpg', false),
        ('Interestelar', 'Exploração espacial para salvar a humanidade.', 2014, 169, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', true),
        ('O Poderoso Chefão', 'História da família mafiosa Corleone.', 1972, 175, 'Crime', 'https://image.tmdb.org/t/p/w500/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg', true),
        ('Pulp Fiction', 'Histórias entrelaçadas do submundo do crime.', 1994, 154, 'Crime', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', false),
        ('Matrix', 'Realidade simulada e rebelião contra máquinas.', 1999, 136, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', true),
        ('Gladiador', 'Um general romano busca vingança.', 2000, 155, 'Ação', 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', false),
        ('A Origem', 'Invasão dos sonhos para manipulação.', 2010, 148, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg', true),
        ('O Senhor dos Anéis: A Sociedade do Anel', 'Início da jornada para destruir o Anel.', 2001, 178, 'Fantasia', 'https://image.tmdb.org/t/p/w500/56zTpe2xvaA4alU51sRWPoKPYZy.jpg', true),
        ('Forrest Gump', 'História de vida de um homem simples.', 1994, 142, 'Drama', 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', false),
        ('O Rei Leão', 'História do jovem leão Simba.', 1994, 88, 'Animação', 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', true),
        ('Titanic', 'Romance e tragédia no navio Titanic.', 1997, 195, 'Romance', 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', true),
        ('Jurassic Park', 'Parque com dinossauros clonados.', 1993, 127, 'Aventura', 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', false),
        ('Os Vingadores', 'Super-heróis se unem para salvar o mundo.', 2012, 143, 'Ação', 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', true),
        ('Guardiões da Galáxia', 'Equipe improvável salva o universo.', 2014, 121, 'Aventura', 'https://image.tmdb.org/t/p/w500/y31QB9kn3XSudA15tV7UWQ9XLuW.jpg', false),
        ('Star Wars: O Despertar da Força', 'Nova ameaça surge na galáxia.', 2015, 138, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', true),
        ('Dunkirk', 'Evacuação na Segunda Guerra Mundial.', 2017, 106, 'Guerra', 'https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg', false),
        ('Coringa', 'Origem do vilão mais icônico.', 2019, 122, 'Drama', 'https://image
