CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id uuid primary key default uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    description text,
    price integer
);

CREATE TABLE IF NOT EXISTS stocks (
    id uuid primary key default uuid_generate_v4() NOT NULL,
    product_id uuid,
    count integer,
    foreign key ("product_id") references "products" ("id")
);

INSERT INTO products (title, description, price) VALUES
('Evidends', 'Enim voluptate laboris quis sint exercitation qui elit culpa sunt et mollit consequat. Do laboris qui dolor consectetur.', 1743.17),
('Yurture', 'Proident ullamco magna mollit proident elit cupidatat magna voluptate eiusmod sit. Laboris aliqua laboris esse eu elit eu veniam.', 1951.72);

INSERT INTO stocks (product_id, count) VALUES
((SELECT id FROM products WHERE title = 'Evidends'), 4),
((SELECT id FROM products WHERE title = 'Yurture'), 8);