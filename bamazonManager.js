var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('console.table');
var config = require('./keys.js');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: config.password,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //showProducts();
  initialMenu();
});

function initialMenu() {
  console.log('\n')
  inquirer.prompt([{
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory",
      "Add New Product", "Quit"
    ],
    name: "initialAction"
  }]).then(function(answer) {
    switch (answer.initialAction) {
      case "View Products for Sale":
        showProducts();
        break;

      case "View Low Inventory":
        viewLowInventory();
        break;

      case "Add to Inventory":
        addToInventory();
        break;

      case "Add New Product":
        addNewProduct();
        break;

      case "Quit":
        console.log("Thank you! Have a good day!\n");
        connection.end();
        break;
    }
  });
};
function toMoney(value){
  return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
function showProducts() {
  var quer = "SELECT COUNT(item_id) AS NumberOfProducts FROM products";
  //var quer="SELECT COUNT(item_id) FROM products";
  connection.query(quer, function(error, result) {
    var numberItems = result[0].NumberOfProducts;
    if (numberItems === 0) {
      console.log("\nNo Items in Inventory.. Chose a new action!\n");
      initialMenu();
    } else {
      var query = "SELECT * FROM products";
      connection.query(query, function(err, res) {
        var values=[];
        console.log("\nITEMS IN INVENTORY\n");
        for (var i = 0; i < res.length; i++) {
          var price=toMoney(res[i].price);
          values.push([res[i].item_id, res[i].product_name, price, res[i].stock_quantity, toMoney(res[i].product_sales), res[i].department_name]);
        }

        console.table(['Item Id','Product Name', 'Price', 'Number in Stock', 'Product Sales', 'Department'], values);

        anotherAction();

      });
    }
  })

}

function anotherAction(){
  console.log('\n');
  inquirer
    .prompt({
      type: "confirm",
      message: "Do you want to perform another action?",
      name: "confirm",
      default: true
    }).then(function(inquirerResponse) {
      if (inquirerResponse.confirm) {
        initialMenu();
      } else {
        console.log("Goodbye!\n");
        connection.end();
      }
    })
}
//
function viewLowInventory() {
  var quer = "SELECT COUNT(item_id) AS NumberOfProducts FROM products WHERE stock_quantity<5";
  //var quer="SELECT COUNT(item_id) FROM products";
  connection.query(quer, function(error, result) {
    var numberItems = result[0].NumberOfProducts;
    if (numberItems === 0) {
      console.log("\nNo Items with Low Inventory.. Chose a new action!\n");
      initialMenu();
    } else {
      var query = "SELECT * FROM products WHERE stock_quantity<5";
      connection.query(query, function(err, res) {
        console.log("\n" + numberItems + " ITEM(S) WITH LOW STOCK\n");
        var values=[];
        for (var i = 0; i < res.length; i++) {
          values.push([res[i].item_id, res[i].product_name, toMoney(res[i].price), res[i].stock_quantity,toMoney(res[i].product_sales), res[i].department_name]);
        }
        console.table(['Item Id','Product Name', 'Price', 'Number in Stock', 'Product Sales', 'Department'], values);
        anotherAction();
      });
    }
  })
}

function addToInventory() {

    inquirer
      .prompt([{
          name: "selectedProduct",
          type: "input",
          message: "Type in the item_id of the product you wish to add more of--->"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many are you adding?"
        }
      ])
      .then(function(answers) {
        connection.query(
          "SELECT stock_quantity FROM products WHERE ?",
          {item_id: answers.selectedProduct},
          function(err, res) {
            //console.log(res);
            var newQuantity=parseInt(answers.quantity)+res[0].stock_quantity;
            //console.log(newQuantity);
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newQuantity
                },
                {
                  item_id: answers.selectedProduct
                }
              ],
              function(err, res) {
                console.log(res.affectedRows + " item updated!");
                initialMenu();
              }
            );
          }
        );
      });
}

function addNewProduct() {
  console.log("\nAdd an Item\n")
  inquirer.prompt([{
    name: "product_name",
    message: "What is the Product Name?"
  }, {
    name: "department_name",
    message: "What is the Product Department?"
  }, {
    name: "stock_quantity",
    message: "How many are you adding?"
  }, {
    name: "price",
    message: "What is the Price per Unit? $"
  }]).then(function(answers) {

    var query = connection.query(
      "INSERT INTO products SET ?", {
        product_name: answers.product_name,
        department_name: answers.department_name,
        stock_quantity: answers.stock_quantity,
        price: answers.price
      },
      function(err, res) {
        console.log(res.affectedRows + " product added!\n");

        inquirer.prompt([{
          type: "list",
          message: "Would you like to add another Item?",
          choices: ["Yes", "No"],
          name: "moreItems"
        }]).then(function(answer) {
          if (answer.moreItems === "No") {
            initialMenu();
          } else {
            addNewProduct()
          };
        });
      }
    );
  });
};
