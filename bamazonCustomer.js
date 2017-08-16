
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('console.table');
var config = require('./keys.js');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: config.password,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  showProducts();
});

function showProducts() {
  var quer="SELECT COUNT(item_id) AS NumberOfProducts FROM products";


  //var quer="SELECT COUNT(item_id) FROM products";
  connection.query(quer, function(error,result){
    var numberItems=result[0].NumberOfProducts;
    if(numberItems===0){
      console.log("\nNo Items in Inventory.. Come back soon!\n");
      connection.end();
    }
    else{
    var query = "SELECT item_id, product_name, stock_quantity, price FROM products";
    connection.query(query, function(err, res) {
      console.log("\nITEMS IN INVENTORY\n");
      var values=[];
      for (var i = 0; i < res.length; i++) {

        var price = toMoney(res[i].price);
        values.push([res[i].item_id, res[i].product_name, price, res[i].stock_quantity])

      }
      console.table(['Item Id','Product Name', 'Price', 'Number in Stock'], values);
      console.log('\n');
      productPurchase();

    });
    }
  })

}

function toMoney(value){
  return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function productPurchase() {
  inquirer
    .prompt([{
        name: "productWanted",
        type: "input",
        message: "Type in the item_id of the product you wish to buy--->"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like?"
      }
    ])
    .then(function(answers) {
      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, {
        item_id: answers.productWanted
      }, function(err, res) {
        //console.log(res[0].price);
        var price=toMoney(res[0].price);
        var cost;

        console.log("\nYou requested " + answers.quantity + " " + res[0].product_name + "\nWe have " + res[0].stock_quantity + " in stock at " + price + " per unit");

        if (res[0].stock_quantity >= answers.quantity) {
          cost= answers.quantity*res[0].price;
          var newSale=res[0].product_sales+cost;
          console.log("\nThank you for your order. Your total is " + toMoney(cost));
          var newQuantity = res[0].stock_quantity - answers.quantity;
          updateInventory(res[0].item_id, newQuantity, newSale);
          anotherPurchase();

        } else {
          console.log("We do not have enough " + res[0].product_name + " in stock\n")
          inquirer
            .prompt({
              name: "purchaseRest",
              type: "confirm",
              message: "Would you like to buy the " + res[0].stock_quantity + " we have?",
              default: true
            })
            .then(function(answer) {
              if (answer.purchaseRest) {
                cost= res[0].stock_quantity * res[0].price;
                var newSale=res[0].product_sales+cost;
                console.log("Thank you for your order! Your total is " + toMoney(cost));
                updateInventory(res[0].item_id, 0, newSale);
              }
              anotherPurchase();
            });


        }
        //Poke();
      });
    });
}

function anotherPurchase() {
  console.log('\n');
  inquirer
    .prompt({
      name: "purchaseMore",
      type: "confirm",
      message: "Would you like to make another purchase?",
      default: true
    })
    .then(function(answer) {
      if (answer.purchaseMore) {
        showProducts();
      } else {
        console.log("Thanks for shopping. Have a good day!\n")
        connection.end();
      }
    });
}


function updateInventory(id, newQuantity, newSale) {

    connection.query(
      "UPDATE products SET ? WHERE ?", [{
          stock_quantity: newQuantity, product_sales:newSale
        },
        {
          item_id: id, item_id: id
        }
      ]

    );
    // logs the actual query being run
    //  console.log(query.sql);

}
