DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price decimal(9,2) default 10,
  stock_quantity INTEGER(9) default 0,
  product_sales decimal(9,2) default 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs decimal(9,2) default 10,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("clothing", "200");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("kitchen", "180");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("accessories", "100");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("games", "10");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("instruments", "30");


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("banana boxers","clothing","9.99","33");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pineapple boxers","clothing","8.88","10");


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("moon necklaces","accessories","5.75","110");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("curly straws","kitchen",".10","3");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cat barrettes","accessories","5","108");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("twister","games","20","1");


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("javascript leggings","clothing","12.57","4");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("garlic smooshers","kitchen","4","55");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("moon necklaces","accessories","5.75","110");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("curly straws","kitchen",".10","3");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cat barrettes","accessories","5","108");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("twister","games","20","1");


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("guitar strings","instruments","14.29","25");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("juicers","kitchen","45","12");






SELECT*FROM products;
