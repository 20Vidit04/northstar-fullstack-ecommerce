CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY,
 name TEXT NOT NULL,
 description TEXT NOT NULL,
 price REAL NOT NULL CHECK (price >= 0),
 category TEXT NOT NULL,
 image_url TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, visitor_id TEXT NOT NULL, ip_masked TEXT NOT NULL, country TEXT NOT NULL, visited_at TEXT NOT NULL DEFAULT (datetime('now')), page TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_visits_visitor ON visits(visitor_id);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
