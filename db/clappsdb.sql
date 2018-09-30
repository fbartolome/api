CREATE DATABASE clappsdb;

USE clappsdb;

CREATE TABLE products
(
  productid   bigint unsigned auto_increment
    primary key,
  productname varchar(50)     not null,
  stock       int default '0' not null,
  constraint productid
  unique (productid),
  constraint products_productname_uindex
  unique (productname)
);