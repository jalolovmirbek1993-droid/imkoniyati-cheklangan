CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  ability_status TEXT CHECK(ability_status IN ('blind', 'deaf', 'mute', 'none')) DEFAULT 'none',
  role TEXT CHECK(role IN ('user', 'teacher', 'admin')) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  room TEXT NOT NULL,
  text_content TEXT NOT NULL,
  corrected_text TEXT,
  sign_gestures TEXT, -- JSON array ko'rinishida
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  text_content TEXT NOT NULL,
  media_url TEXT,
  ai_alt_text TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  category TEXT NOT NULL,
  required_ability TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  applications_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_results (
  exam_id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  mode TEXT NOT NULL,
  certificate_id TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
