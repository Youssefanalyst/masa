-- Schema for Masa Restaurant Database
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER,
  description TEXT,
  image TEXT,
  images TEXT[], -- Array of image URLs for rotating images
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_products_order ON products(display_order, category_id);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view)
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);

-- Admin write access (authenticated users can modify)
-- For demo purposes, we'll allow all authenticated users to modify
-- In production, you should add proper role checks
CREATE POLICY "Allow authenticated insert on categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO categories (id, name, image, display_order) VALUES
  ('trays', 'صواني', '/images/trays.svg', 1),
  ('poultry', 'طيور', '/images/poultry.svg', 2),
  ('mahshi', 'محاشي', '/images/mahshi.svg', 3),
  ('homecooking', 'طبيخ', '/images/homecooking.svg', 4),
  ('others', 'أخرى', '/images/others.svg', 5)
ON CONFLICT (id) DO NOTHING;

-- Note: You'll need to insert products manually or through the admin panel
-- Example product insert:
-- INSERT INTO products (category_id, name, price, image) VALUES
--   ('trays', 'كبسه بالديك الرومي', 1100, 'https://files.catbox.moe/0k3byw.jpg');
