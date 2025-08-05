const { query } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🔄 Iniciando criação das tabelas...');

    // Tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'user',
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de planos
    await query(`
      CREATE TABLE IF NOT EXISTS planos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        duracao_dias INTEGER DEFAULT 30,
        max_dispositivos INTEGER DEFAULT 2,
        qualidade_maxima VARCHAR(50) DEFAULT 'HD',
        recursos JSONB,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de assinaturas
    await query(`
      CREATE TABLE IF NOT EXISTS assinaturas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        plano_id INTEGER REFERENCES planos(id),
        data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_fim TIMESTAMP,
        status VARCHAR(50) DEFAULT 'ativa',
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de categorias
    await query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        icone VARCHAR(255),
        ordem INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de canais
    await query(`
      CREATE TABLE IF NOT EXISTS canais (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        categoria_id INTEGER REFERENCES categorias(id),
        logo_url VARCHAR(500),
        stream_url VARCHAR(500),
        qualidade VARCHAR(50) DEFAULT 'HD',
        idioma VARCHAR(50) DEFAULT 'pt-BR',
        pais VARCHAR(50) DEFAULT 'BR',
        ativo BOOLEAN DEFAULT true,
        ordem INTEGER DEFAULT 0,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de filmes
    await query(`
      CREATE TABLE IF NOT EXISTS filmes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        titulo_original VARCHAR(255),
        descricao TEXT,
        ano INTEGER,
        duracao INTEGER,
        genero VARCHAR(255),
        diretor VARCHAR(255),
        elenco TEXT,
        classificacao VARCHAR(50),
        nota_imdb DECIMAL(3,1),
        capa_url VARCHAR(500),
        trailer_url VARCHAR(500),
        video_url VARCHAR(500),
        qualidade VARCHAR(50) DEFAULT 'HD',
        idioma VARCHAR(50) DEFAULT 'pt-BR',
        legendas JSONB,
        ativo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de séries
    await query(`
      CREATE TABLE IF NOT EXISTS series (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        titulo_original VARCHAR(255),
        descricao TEXT,
        ano_inicio INTEGER,
        ano_fim INTEGER,
        genero VARCHAR(255),
        criador VARCHAR(255),
        elenco TEXT,
        classificacao VARCHAR(50),
        nota_imdb DECIMAL(3,1),
        capa_url VARCHAR(500),
        trailer_url VARCHAR(500),
        total_temporadas INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'em_andamento',
        ativo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de episódios
    await query(`
      CREATE TABLE IF NOT EXISTS episodios (
        id SERIAL PRIMARY KEY,
        serie_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
        temporada INTEGER NOT NULL,
        episodio INTEGER NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        duracao INTEGER,
        video_url VARCHAR(500),
        capa_url VARCHAR(500),
        data_lancamento DATE,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(serie_id, temporada, episodio)
      )
    `);

    // Tabela de favoritos
    await query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL, -- 'canal', 'filme', 'serie'
        item_id INTEGER NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, tipo, item_id)
      )
    `);

    // Tabela de histórico
    await query(`
      CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL, -- 'canal', 'filme', 'episodio'
        item_id INTEGER NOT NULL,
        tempo_assistido INTEGER DEFAULT 0,
        duracao_total INTEGER,
        data_visualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de EPG (Electronic Program Guide)
    await query(`
      CREATE TABLE IF NOT EXISTS epg_programas (
        id SERIAL PRIMARY KEY,
        canal_id INTEGER REFERENCES canais(id) ON DELETE CASCADE,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(255),
        data_inicio TIMESTAMP NOT NULL,
        data_fim TIMESTAMP NOT NULL,
        classificacao VARCHAR(50),
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para melhor performance
    await query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario ON assinaturas(usuario_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_canais_categoria ON canais(categoria_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_episodios_serie ON episodios(serie_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico(usuario_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_epg_canal ON epg_programas(canal_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_epg_data ON epg_programas(data_inicio, data_fim)');

    console.log('✅ Todas as tabelas foram criadas com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

const insertSampleData = async () => {
  try {
    console.log('🔄 Inserindo dados de exemplo...');

    // Inserir planos
    await query(`
      INSERT INTO planos (nome, descricao, preco, max_dispositivos, qualidade_maxima, recursos) 
      VALUES 
        ('Básico', 'Plano básico com canais essenciais', 29.90, 2, 'HD', '["100+ canais", "Qualidade HD", "2 dispositivos"]'),
        ('Premium', 'Plano completo com todos os recursos', 49.90, 5, '4K', '["200+ canais", "Qualidade 4K", "5 dispositivos", "VOD incluído"]'),
        ('Família', 'Plano ideal para toda a família', 79.90, 10, '4K', '["300+ canais", "Qualidade 4K", "10 dispositivos", "Controle parental"]')
      ON CONFLICT DO NOTHING
    `);

    // Inserir categorias
    await query(`
      INSERT INTO categorias (nome, descricao, ordem) 
      VALUES 
        ('Canais Abertos', 'Canais de TV aberta brasileiros', 1),
        ('Esportes', 'Canais dedicados ao esporte', 2),
        ('Filmes', 'Canais de filmes e cinema', 3),
        ('Notícias', 'Canais de jornalismo e notícias', 4),
        ('Documentários', 'Canais educativos e documentários', 5),
        ('Infantil', 'Programação para crianças', 6)
      ON CONFLICT DO NOTHING
    `);

    // Inserir canais
    await query(`
      INSERT INTO canais (nome, descricao, categoria_id, logo_url, stream_url) 
      VALUES 
  ('Band', 'Rede Bandeirantes de Televisão', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Band_logo.svg/200px-Band_logo.svg.png', 'https://example.com/band.m3u8'),
  ('RedeTV!', 'Canal de TV aberta brasileiro', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/RedeTV%21_logo_2021.svg/200px-RedeTV%21_logo_2021.svg.png', 'https://example.com/redetv.m3u8'),
  ('TV Cultura', 'Canal educativo e cultural', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/TV_Cultura_logo.svg/200px-TV_Cultura_logo.svg.png', 'https://example.com/cultura.m3u8'),
  ('CNN Brasil', 'Canal de notícias 24 horas', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/CNN_Brasil_logo.svg/200px-CNN_Brasil_logo.svg.png', 'https://example.com/cnnbrasil.m3u8'),
  ('BandNews TV', 'Canal de notícias brasileiro', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/BandNews_TV_logo.svg/200px-BandNews_TV_logo.svg.png', 'https://example.com/bandnews.m3u8'),
  ('Cartoon Network', 'Desenhos animados e programação infantil', 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png', 'https://example.com/cartoon.m3u8'),
  ('Discovery Kids', 'Conteúdo educativo e entretenimento infantil', 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Discovery_Kids_logo_2009.svg/200px-Discovery_Kids_logo_2009.svg.png', 'https://example.com/discoverykids.m3u8'),
  ('Disney Channel', 'Entretenimento infantil e juvenil', 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Disney_Channel_logo_2014.svg/200px-Disney_Channel_logo_2014.svg.png', 'https://example.com/disney.m3u8'),
  ('HBO', 'Canal premium com filmes e séries', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Logo.svg/200px-HBO_Logo.svg.png', 'https://example.com/hbo.m3u8'),
  ('Telecine Pipoca', 'Filmes recentes e blockbusters', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Telecine_logo_2020.svg/200px-Telecine_logo_2020.svg.png', 'https://example.com/telecinepipoca.m3u8'),
  ('Megapix', 'Canal de filmes variados', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Megapix_2012_logo.svg/200px-Megapix_2012_logo.svg.png', 'https://example.com/megapix.m3u8'),
  ('Premiere', 'Futebol brasileiro ao vivo', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Premiere_logo.svg/200px-Premiere_logo.svg.png', 'https://example.com/premiere.m3u8'),
  ('Sportv', 'Esportes nacionais e internacionais', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/SporTV_logo_2021.svg/200px-SporTV_logo_2021.svg.png', 'https://example.com/sportv.m3u8'),
  ('ESPN 2', 'Esportes internacionais', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png', 'https://example.com/espn2.m3u8'),
  ('Fox Sports', 'Canais de esportes variados', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Fox_Sports_logo.svg/200px-Fox_Sports_logo.svg.png', 'https://example.com/foxsports.m3u8'),
  ('National Geographic', 'Documentários sobre ciência e natureza', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/National_Geographic_Channel.svg/200px-National_Geographic_Channel.svg.png', 'https://example.com/natgeo.m3u8'),
  ('History Channel', 'Documentários históricos', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/History_Logo.svg/200px-History_Logo.svg.png', 'https://example.com/history.m3u8'),
  ('Animal Planet', 'Programas sobre vida selvagem', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Animal_Planet_2018_logo.svg/200px-Animal_Planet_2018_logo.svg.png', 'https://example.com/animalplanet.m3u8'),
  ('TV Brasil', 'Conteúdo cultural e informativo nacional', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/TV_Brasil_logo_2019.svg/200px-TV_Brasil_logo_2019.svg.png', 'https://example.com/tvbrasil.m3u8'),
  ('Boomerang', 'Animações clássicas e novas', 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Boomerang_2014_logo.svg/200px-Boomerang_2014_logo.svg.png', 'https://example.com/boomerang.m3u8')
      ON CONFLICT DO NOTHING
    `);

    //-- Inserir filmes (todos com URLs do TMDb)
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
      ('Coringa', 'Origem do vilão mais icônico.', 2019, 122, 'Drama', 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', true),
      ('Homem de Ferro', 'História do bilionário que vira super-herói.', 2008, 126, 'Ação', 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', false),
      ('Deadpool', 'Anti-herói com humor ácido.', 2016, 108, 'Ação', 'https://image.tmdb.org/t/p/w500/inVq3FRqcYIRl2la8iZikYYxFNR.jpg', true),
      ('O Hobbit: Uma Jornada Inesperada', 'A aventura começa para Bilbo Bolseiro.', 2012, 169, 'Fantasia', 'https://image.tmdb.org/t/p/w500/6t6IpEv0CTFphH0MzEZSscA9e3v.jpg', true),
      ('Pantera Negra', 'Herói do reino de Wakanda.', 2018, 134, 'Ação', 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', false),
      ('A Bela e a Fera', 'Clássico conto de amor.', 2017, 129, 'Romance', 'https://image.tmdb.org/t/p/w500/hlCUA3bUpkgOULFM9bC8N7hra19.jpg', false),
      ('Guardiões da Galáxia Vol. 2', 'Continuação das aventuras cósmicas.', 2017, 136, 'Aventura', 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg', true),
      ('Logan', 'Última missão do Wolverine.', 2017, 137, 'Ação', 'https://image.tmdb.org/t/p/w500/f0CtZbae9cXj8bkWdCHzUHx5lsR.jpg', true),
      ('Cisne Negro', 'Drama psicológico intenso.', 2010, 108, 'Drama', 'https://image.tmdb.org/t/p/w500/bxVxZb45UEpCrDJMwSZuZ4V6Ll0.jpg', true),
      ('Clube da Luta', 'Luta contra o sistema.', 1999, 139, 'Drama', 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg', false),
      ('A Chegada', 'Contato com alienígenas.', 2016, 116, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg', true),
      ('Esquadrão Suicida', 'Anti-heróis em missão perigosa.', 2016, 123, 'Ação', 'https://image.tmdb.org/t/p/w500/e1mjopzAS2KNsvpbpahQ1a6SkSn.jpg', false)
    ON CONFLICT DO NOTHING;
    `)
    
    //-- Inserir séries (todos com URLs do TMDb)
    await query (`
    INSERT INTO series (titulo, descricao, ano_inicio, genero, total_temporadas, capa_url, destaque) 
    VALUES 
      ('Breaking Bad', 'Um professor de química vira fabricante de metanfetamina.', 2008, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', true),
      ('La Casa de Papel', 'Grupo assalta a Casa da Moeda da Espanha.', 2017, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', true),
      ('Stranger Things', 'Série de ficção científica ambientada nos anos 80.', 2016, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', true),
      ('Game of Thrones', 'Famílias nobres lutam pelo Trono de Ferro.', 2011, 'Fantasia', 8, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', true),
      ('The Witcher', 'Baseada nos livros de Andrzej Sapkowski.', 2019, 'Fantasia', 3, 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', true),
      ('Dark', 'Mistério de desaparecimentos em uma pequena cidade.', 2017, 'Suspense', 3, 'https://image.tmdb.org/t/p/w500/5jtx6zB7mG0D5XODPA9g6yXJ7Ul.jpg', true),
      ('Friends', 'Comédia sobre grupo de amigos em Nova York.', 1994, 'Comédia', 10, 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg', true),
      ('The Mandalorian', 'Caçador de recompensas na galáxia Star Wars.', 2019, 'Ação', 3, 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', true),
      ('Westworld', 'Parque temático com androides conscientes.', 2016, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/rTh4K5uw9HypmpGslcKd4QfHl93.jpg', true),
      ('The Office (US)', 'Comédia sobre o cotidiano de escritório.', 2005, 'Comédia', 9, 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg', true),
      ('Black Mirror', 'Contos distópicos sobre a tecnologia.', 2011, 'Suspense', 5, 'https://image.tmdb.org/t/p/w500/f5QpafA4tgf7x5FFXZn0BX8E0hQ.jpg', true),
      ('Better Call Saul', 'Pré-sequência de Breaking Bad focada no advogado.', 2015, 'Crime', 6, 'https://image.tmdb.org/t/p/w500/1ztP3C9WZsSYYJD56CXfKZtEHrS.jpg', true),
      ('Narcos', 'História dos cartéis de droga na Colômbia.', 2015, 'Crime', 3, 'https://image.tmdb.org/t/p/w500/o4rJ6uVsWtJQp3W0W4X6rt8U1Yj.jpg', true),
      ('House of Cards', 'Drama político sobre um congressista americano.', 2013, 'Drama', 6, 'https://image.tmdb.org/t/p/w500/47dpEjqOySHC6UyZyWMulJhWohM.jpg', true),
      ('Ozark', 'Consultor financeiro se envolve com o crime organizado.', 2017, 'Crime', 4, 'https://image.tmdb.org/t/p/w500/68QJ2Q6FwNqL6KDj3RLi2j0qEB3.jpg', true),
      ('Sherlock', 'Séries de mistérios com o famoso detetive.', 2010, 'Mistério', 4, 'https://image.tmdb.org/t/p/w500/f9zGxLHGyQ9kfmfF9nrh6OmWIIy.jpg', true),
      ('Dexter', 'Um analista forense que é também serial killer.', 2006, 'Crime', 8, 'https://image.tmdb.org/t/p/w500/k7VB30oe8FnB8fM6A1Uj3AB4uVv.jpg', true),
      ('The Crown', 'Drama sobre o reinado da Rainha Elizabeth II.', 2016, 'Drama', 5, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ehUMAA3qDR5HNor9DB60g72KNQZ.jpg', true),
      ('The Boys', 'Super-heróis corruptos e vigilantes.', 2019, 'Ação', 4, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/dACU11CzrA2aUWAWvlpuP92nmV7.jpg', true),
      ('Mindhunter', 'Agentes do FBI entrevistam serial killers.', 2017, 'Crime', 2, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/fbKE87mojpIETWepSbD5Qt741fp.jpg', true),
      ('True Detective', 'Séries de casos criminais com detetives.', 2014, 'Mistério', 3, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/1fxr55V72a2gtqyn2b8pf6FslOf.jpg', true),
      ('Lost', 'Sobreviventes de um acidente aéreo em uma ilha misteriosa.', 2004, 'Drama', 6, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/3NVsXuJg8NZZxVghQ90XYugOcfG.jpg', true),
      ('The Walking Dead', 'Grupo de sobreviventes em um mundo pós-apocalíptico.', 2010, 'Terror', 11, 'https://image.tmdb.org/t/p/w500/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg', true),
      ('Vikings', 'A saga dos guerreiros vikings.', 2013, 'Histórico', 6, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg', true),
      ('How I Met Your Mother', 'Comédia sobre grupo de amigos e suas vidas.', 2005, 'Comédia', 9, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/578tlvbrpFwc959bQTT93W2RYA.jpg', true),
      ('Peaky Blinders', 'Gangue familiar na Inglaterra pós-guerra.', 2013, 'Crime', 6, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/i0uajcHH9yogXMfDHpOXexIukG9.jpg', true),
      ('The Expanse', 'Ficção científica e política no sistema solar.', 2015, 'Ficção Científica', 6, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8djpxDeWpINnGhjpFXQjnBe6zbx.jpg', true),
      ('The Simpsons', 'Série animada sobre uma família americana.', 1989, 'Comédia', 34, 'https://image.tmdb.org/t/p/w500/qcr9bBY6MVeLzriKCmJOv1562uY.jpg', true),
      ('Rick and Morty', 'Série animada de ficção científica e comédia.', 2013, 'Animação', 5, 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/5qfd0e2uMbVInX3YdeFbDsfxi1t.jpg', true)
    ON CONFLICT DO NOTHING;
    `);

    // Inserir usuário administrador
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await query(`
      INSERT INTO usuarios (nome, email, senha, tipo) 
      VALUES ('Administrador', 'admin@iptvpro.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    console.log('✅ Dados de exemplo inseridos com sucesso!');
    console.log('👤 Usuário admin criado: admin@iptvpro.com / admin123');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
    throw error;
  }
};

// Função para criar a tabela vod_content que consolida filmes e séries
const createVodContentTable = async () => {
  try {
    console.log('🔄 Criando tabela vod_content...');
    
    // Criar a tabela vod_content que consolida filmes e séries
    await query(`
      CREATE TABLE IF NOT EXISTS vod_content (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        titulo_original VARCHAR(255),
        descricao TEXT,
        ano INTEGER,
        duracao INTEGER,
        genero VARCHAR(255),
        capa_url VARCHAR(500),
        stream_url VARCHAR(500),
        tipo VARCHAR(50) NOT NULL, -- 'filme' ou 'serie'
        destaque BOOLEAN DEFAULT false,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para melhor performance
    await query('CREATE INDEX IF NOT EXISTS idx_vod_content_tipo ON vod_content(tipo)');
    await query('CREATE INDEX IF NOT EXISTS idx_vod_content_destaque ON vod_content(destaque)');
    await query('CREATE INDEX IF NOT EXISTS idx_vod_content_genero ON vod_content(genero)');
    await query('CREATE INDEX IF NOT EXISTS idx_vod_content_ano ON vod_content(ano)');

    console.log('✅ Tabela vod_content criada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar tabela vod_content:', error);
    throw error;
  }
};

// Função para verificar se a tabela vod_content já está populada
const isVodContentPopulated = async () => {
  try {
    const result = await query('SELECT COUNT(*) as count FROM vod_content');
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar população da tabela vod_content:', error);
    return false;
  }
};

// Função para popular a tabela vod_content com dados de filmes e séries
const populateVodContentTable = async () => {
  try {
    // Verificar se a tabela já está populada
    const isPopulated = await isVodContentPopulated();
    if (isPopulated) {
      console.log('✅ Tabela vod_content já está populada, pulando...');
      return true;
    }

    console.log('🔄 Populando tabela vod_content...');
                    
    console.log('✅ Tabela vod_content populada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao popular tabela vod_content:', error);
    throw error;
  }
};

module.exports = {
  createTables,
  insertSampleData,
  populateVodContentTable,
}