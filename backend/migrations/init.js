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

    // Inserir filmes
    await query(`
     INSERT INTO filmes (titulo, descricao, ano, duracao, genero, capa_url, destaque) 
VALUES
  ('Avatar: O Caminho da Água', 'Sequência do épico de ficção científica de James Cameron.', 2022, 192, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', true),
  ('Top Gun: Maverick', 'Depois de mais de 30 anos de serviço como aviador da Marinha.', 2022, 130, 'Ação', 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', true),
  ('Homem-Aranha: Sem Volta Para Casa', 'Peter Parker tem sua identidade secreta revelada.', 2021, 148, 'Ação', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', false),
  ('Interestelar', 'Exploração espacial para salvar a humanidade.', 2014, 169, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', true),
  ('O Poderoso Chefão', 'História da família mafiosa Corleone.', 1972, 175, 'Crime', 'https://image.tmdb.org/t/p/w500/eEslKSwcqmiNS6va24Pbxf2UKmJ.jpg', true),
  ('Pulp Fiction', 'Histórias entrelaçadas do submundo do crime.', 1994, 154, 'Crime', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', false),
  ('Matrix', 'Realidade simulada e rebelião contra máquinas.', 1999, 136, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', true),
  ('Gladiador', 'Um general romano busca vingança.', 2000, 155, 'Ação', 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', false),
  ('A Origem', 'Invasão dos sonhos para manipulação.', 2010, 148, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg', true),
  ('O Senhor dos Anéis: A Sociedade do Anel', 'Início da jornada para destruir o Anel.', 2001, 178, 'Fantasia', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', true),
  ('Forrest Gump', 'História de vida de um homem simples.', 1994, 142, 'Drama', 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', false),
  ('O Rei Leão', 'História do jovem leão Simba.', 1994, 88, 'Animação', 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', true),
  ('Titanic', 'Romance e tragédia no navio Titanic.', 1997, 195, 'Romance', 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', true),
  ('Jurassic Park', 'Parque com dinossauros clonados.', 1993, 127, 'Aventura', 'https://image.tmdb.org/t/p/w500/c414cDeQ9b6qLPLeKmiJh7Ph7Gl.jpg', false),
  ('Os Vingadores', 'Super-heróis se unem para salvar o mundo.', 2012, 143, 'Ação', 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', true),
  ('Guardiões da Galáxia', 'Equipe improvável salva o universo.', 2014, 121, 'Aventura', 'https://image.tmdb.org/t/p/w500/y31QB9kn3XSudA15tV7UWQ9XLuW.jpg', false),
  ('Star Wars: O Despertar da Força', 'Nova ameaça surge na galáxia.', 2015, 138, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', true),
  ('Dunkirk', 'Evacuação na Segunda Guerra Mundial.', 2017, 106, 'Guerra', 'https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg', false),
  ('Coringa', 'Origem do vilão mais icônico.', 2019, 122, 'Drama', 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', true),
  ('Homem de Ferro', 'História do bilionário que vira super-herói.', 2008, 126, 'Ação', 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', false),
  ('Deadpool', 'Anti-herói com humor ácido.', 2016, 108, 'Ação', 'https://image.tmdb.org/t/p/w500/inVq3FRqcYIRl2la8iZikYYxFNR.jpg', true),
  ('O Hobbit: Uma Jornada Inesperada', 'A aventura começa para Bilbo Bolseiro.', 2012, 169, 'Fantasia', 'https://image.tmdb.org/t/p/w500/6t6IpEv0CTFphH0MzEZSscA9e3v.jpg', true),
  ('Pantera Negra', 'Herói do reino de Wakanda.', 2018, 134, 'Ação', 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', false),
  ('A Bela e a Fera', 'Clássico conto de amor.', 2017, 129, 'Romance', 'https://image.tmdb.org/t/p/w500/6aUZhsH2aXw3EK87PbtZ6G0bWwU.jpg', false),
  ('Guardiões da Galáxia Vol. 2', 'Continuação das aventuras cósmicas.', 2017, 136, 'Aventura', 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg', true),
  ('Logan', 'Última missão do Wolverine.', 2017, 137, 'Ação', 'https://image.tmdb.org/t/p/w500/9EXvPpPlLA1ILReZQghT6jVnHPm.jpg', false),
  ('Cisne Negro', 'Drama psicológico intenso.', 2010, 108, 'Drama', 'https://image.tmdb.org/t/p/w500/bxlrA0sF9jQdF9Q1I7dshwQ44z6.jpg', true),
  ('Clube da Luta', 'Luta contra o sistema.', 1999, 139, 'Drama', 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg', false),
  ('A Chegada', 'Contato com alienígenas.', 2016, 116, 'Ficção Científica', 'https://image.tmdb.org/t/p/w500/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg', true),
  ('Esquadrão Suicida', 'Anti-heróis em missão perigosa.', 2016, 123, 'Ação', 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', false)
ON CONFLICT DO NOTHING;
    `);

    // Inserir séries
    await query(`
      INSERT INTO series (titulo, descricao, ano_inicio, genero, total_temporadas, capa_url, destaque) 
VALUES 
  ('Breaking Bad Temporada 4 Versão 1', 'Um professor de química vira fabricante de metanfetamina.', 2009, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', false),
  ('La Casa de Papel Temporada 3 Versão 2', 'Grupo assalta a Casa da Moeda da Espanha.', 2017, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg', false),
  ('Stranger Things Temporada 1 Versão 3', 'Série de ficção científica ambientada nos anos 80.', 2018, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', false),
  ('Breaking Bad Temporada 2 Versão 4', 'Um professor de química vira fabricante de metanfetamina.', 2010, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', true),
  ('Game of Thrones Temporada 2 Versão 5', 'Famílias nobres lutam pelo Trono de Ferro.', 2012, 'Fantasia', 8, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', false),
  ('Breaking Bad Temporada 2 Versão 6', 'Um professor de química vira fabricante de metanfetamina.', 2008, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', true),
  ('Breaking Bad Temporada 5 Versão 7', 'Um professor de química vira fabricante de metanfetamina.', 2009, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', false),
  ('Breaking Bad Temporada 3 Versão 8', 'Um professor de química vira fabricante de metanfetamina.', 2009, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', false),
  ('La Casa de Papel Temporada 1 Versão 9', 'Grupo assalta a Casa da Moeda da Espanha.', 2017, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg', true),
  ('Game of Thrones Temporada 6 Versão 10', 'Famílias nobres lutam pelo Trono de Ferro.', 2013, 'Fantasia', 8, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', true),
  -- adicione aqui os próximos 20 registros gerados
  ('Stranger Things Temporada 2 Versão 11', 'Série de ficção científica ambientada nos anos 80.', 2017, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', true),
  ('The Witcher Temporada 1 Versão 12', 'Baseada nos livros de Andrzej Sapkowski.', 2019, 'Fantasia', 3, 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', true),
  ('Stranger Things Temporada 4 Versão 13', 'Série de ficção científica ambientada nos anos 80.', 2018, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', false),
  ('La Casa de Papel Temporada 2 Versão 14', 'Grupo assalta a Casa da Moeda da Espanha.', 2018, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg', true),
  ('Game of Thrones Temporada 7 Versão 15', 'Famílias nobres lutam pelo Trono de Ferro.', 2014, 'Fantasia', 8, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', false),
  ('Breaking Bad Temporada 1 Versão 16', 'Um professor de química vira fabricante de metanfetamina.', 2010, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg', false),
  ('Stranger Things Temporada 3 Versão 17', 'Série de ficção científica ambientada nos anos 80.', 2019, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', false),
  ('The Witcher Temporada 2 Versão 18', 'Baseada nos livros de Andrzej Sapkowski.', 2020, 'Fantasia', 3, 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', false),
  ('Game of Thrones Temporada 4 Versão 19', 'Famílias nobres lutam pelo Trono de Ferro.', 2012, 'Fantasia', 8, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', true),
  ('La Casa de Papel Temporada 4 Versão 20', 'Grupo assalta a Casa da Moeda da Espanha.', 2019, 'Crime', 5, 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg', false),
  ('The Witcher Temporada 3 Versão 21', 'Baseada nos livros de Andrzej Sapkowski.', 2021, 'Fantasia', 3, 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', true),
  ('Stranger Things Temporada 2 Versão 22', 'Série de ficção científica ambientada nos anos 80.', 2016, 'Ficção Científica', 4, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', false)
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

module.exports = {
  createTables,
  insertSampleData
};

