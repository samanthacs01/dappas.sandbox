-- +goose Up

CREATE TABLE IF NOT EXISTS product_types (
	id INT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	updated_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sizes (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	product_type_id INT REFERENCES product_types(id),
	created_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	updated_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	product_type_id INT REFERENCES product_types(id),
	created_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	updated_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
	id SERIAL PRIMARY KEY,
	company_name VARCHAR(255) NOT NULL,
	contact_name VARCHAR(255) NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	contact_phone VARCHAR(255) NOT NULL,
	address TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	updated_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_product_settings (
	id SERIAL PRIMARY KEY,
	vendor_id INT REFERENCES vendors(id),
	product_type_id INT REFERENCES product_types(id),
	size_id INT REFERENCES sizes(id),
	color VARCHAR(255) NOT NULL,
	material_id INT REFERENCES materials(id),
	lead_time INT NOT NULL,
	capacity INT NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	updated_at TIMESTAMP NOT NULL DEFAULT (now() at TIME ZONE 'utc'),
	deleted_at TIMESTAMP
);

INSERT INTO product_types (id, name) VALUES (1, 'T-shirt'), (2, 'Mug'), (3, 'Tote bag');
INSERT INTO sizes (name, product_type_id) VALUES ('S', 1), ('M', 1), ('L', 1), ('XL', 1), ('XXL', 1), ('Small', 2), ('Small', 3), ('Middle', 2), ('Middle', 3), ('Large', 2), ('Large', 3);
INSERT INTO materials (name, product_type_id) VALUES ('Cotton', 1), ('Polyester', 1), ('Cotton-Polyester Blend', 1), ('Ceramic', 2), ('Glass', 2), ('Metal', 2), ('Plastic', 2), ('Bamboo', 2), 
('Canvas', 3), ('Polyester', 3), ('Cotton-Polyester Blend', 3), ('Jute (Burlap)', 3);

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
DROP TABLE IF EXISTS vendor_product_settings;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS sizes;
DROP TABLE IF EXISTS product_types;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
