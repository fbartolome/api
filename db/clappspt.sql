CREATE DATABASE clappspt;

USE clappspt;

CREATE TABLE IF NOT EXISTS products
(
    productid serial PRIMARY KEY NOT NULL,
    productname text NOT NULL,
    stock int DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX products_productname_uindex ON products (productname);
