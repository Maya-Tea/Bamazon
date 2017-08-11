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
  console.log("\n");
  inquirer.prompt([{
    type: "list",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "Quit"
    ],
    name: "initialAction"
  }]).then(function(answer) {
    switch (answer.initialAction) {
      case "View Product Sales by Department":
        showProducts();
        break;

      case "Create New Department":
        newDepartment();
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
  var quer = "SELECT COUNT(department_id) AS NumberOfDepartments FROM departments";
  //var quer="SELECT COUNT(item_id) FROM products";

  connection.query(quer, function(error, result) {
    var numberItems = result[0].NumberOfDepartments;
    if (numberItems === 0) {
      console.log("\nNo Departments.. Chose a new action!\n");
      initialMenu();
    } else {
    //  (SELECT department_name, SUM(product_sales) FROM products GROUP BY department_name) AS t
       connection.query("SELECT * FROM departments INNER JOIN (SELECT department_name, SUM(product_sales) AS departmentSales FROM products GROUP BY department_name) AS t ON departments.department_name=t.department_name", function(err, res) {

        if (err) throw err;
        console.log("\nSALES BY DEPARTMENT\n");
        var values=[];
      for (var i = 0; i < res.length; i++) {

          const profit=toMoney(res[i].departmentSales-res[i].over_head_costs);
          values.push([res[i].department_id, res[i].department_name, toMoney(res[i].departmentSales), toMoney(res[i].over_head_costs), profit]);


       }
       console.table(['Department Id','Department Name', 'Product Sales', 'Department Overhead', 'Profit'], values);

       //console.log("\n");
       initialMenu();



      });
    }
  })

}


function newDepartment() {
  console.log("\nAdd an Item\n")
  inquirer.prompt([{
    name: "department_name",
    message: "What is the Department Name?"
  }, {
    name: "overhead",
    message: "What is the overhead cost?"
  }]).then(function(answers) {

    var query = connection.query(
      "INSERT INTO departments SET ?", {
        department_name: answers.department_name,
        over_head_costs: answers.overhead,
      },
      function(err, res) {
        console.log(res.affectedRows + " product added!\n");

        inquirer.prompt([{
          type: "list",
          message: "Would you like to add another Department?",
          choices: ["Yes", "No"],
          name: "more"
        }]).then(function(answer) {
          if (answer.more === "No") {
            console.log("\nDepartment List\n")
            var query = connection.query(
              "SELECT * FROM departments",
              function(err, res) {
                for(var i=0; i<res.length; i++){
                console.log("Department Id: " + res[i].department_id + " || Department Name: " + res[i].department_name + " || Department Overhead: " + toMoney(res[i].over_head_costs));
              }
                initialMenu();
              }
            );

          } else {
            addDepartmet();

          };
        });
      }
    );

  });
};
