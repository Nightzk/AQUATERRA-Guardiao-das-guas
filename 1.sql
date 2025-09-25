
CREATE TABLE players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  health INTEGER DEFAULT 100,
  max_health INTEGER DEFAULT 100,
  experience INTEGER DEFAULT 0,
  current_area TEXT DEFAULT 'village',
  x_position INTEGER DEFAULT 50,
  y_position INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  pollution_level INTEGER DEFAULT 0,
  is_restored BOOLEAN DEFAULT 0,
  background_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enemies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  health INTEGER NOT NULL,
  attack_power INTEGER NOT NULL,
  description TEXT,
  area_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  target_area_id INTEGER,
  reward_experience INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  quest_id INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT 0,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO areas (name, type, description, pollution_level, background_image) VALUES
('Vila Costeira', 'village', 'Uma pequena vila de pescadores onde sua jornada começa', 20, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),
('Recife de Coral', 'reef', 'Recife colorido ameaçado pelo branqueamento', 60, 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800'),
('Manguezal', 'mangrove', 'Ecossistema vital que precisa de proteção', 40, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'),
('Oceano Profundo', 'ocean', 'Águas misteriosas com criaturas ancestrais', 80, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800');

INSERT INTO enemies (name, type, health, attack_power, description, area_id) VALUES
('Monstro de Plástico', 'pollution', 80, 25, 'Criatura formada por resíduos plásticos', 2),
('Tempestade Viva', 'climate', 120, 35, 'Manifestação das mudanças climáticas', 4),
('Pescador Ganancioso', 'human', 60, 20, 'Pratica pesca predatória', 1),
('Poluição Tóxica', 'pollution', 100, 30, 'Mancha tóxica que destrói a vida marinha', 3);

INSERT INTO quests (title, description, type, target_area_id, reward_experience) VALUES
('Limpar o Recife', 'Remova a poluição do recife de coral e restaure sua beleza', 'cleanup', 2, 50),
('Proteger o Manguezal', 'Impeça o desmatamento do manguezal', 'protection', 3, 75),
('Conscientizar a Vila', 'Eduque os pescadores sobre práticas sustentáveis', 'education', 1, 40),
('Enfrentar a Tempestade', 'Confronte a manifestação climática no oceano', 'boss', 4, 100);
