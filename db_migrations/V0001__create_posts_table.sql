CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL DEFAULT 'Автор',
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO posts (author, category, title, content, status) VALUES
('Анна Петрова', 'care', 'Как наладить режим сна малыша', 'Делюсь опытом: ритуалы перед сном творят чудеса. Тёплая ванна, спокойная музыка и приглушённый свет — и кроха засыпает за 10 минут.', 'published'),
('Анна Петрова', 'nutrition', 'Первый прикорм без стресса', 'Начинали с овощных пюре по чайной ложке. Главное — не торопиться и следить за реакцией. Через месяц малыш ел уже всё с удовольствием!', 'published'),
('Анна Петрова', 'development', 'Развивающие игры до года', 'Простые игры с фактурными игрушками отлично развивают мелкую моторику. Рассказываю, что работало у нас лучше всего.', 'published');
