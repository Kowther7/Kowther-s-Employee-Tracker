// Import required packages
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const mysqlConnection = require("./lib/db/mysql.js");

// Import question sets for user input
const { Questions } = require("./lib/questions/Questions");

// Import functions for database operations
const { getDepartments, addDepartment } = require("./lib/routes/department");
const {
  getEmployees,
  addEmployee,
  updateEmployee,
} = require("./lib/routes/employee");
const { getRoles, addRole } = require("./lib/routes/role");

// Establish database connection
const db = mysqlConnection;

// Function to display a stylized header
function displayHeader() {
  console.log(chalk.bgCyan.bold(`***********************************************`));
  console.log(" ");
  console.log(chalk.cyan.bold(figlet.textSync("Kowther's")));
  console.log(chalk.cyan.bold(figlet.textSync("Employee Traker")));
  console.log(" ");
  console.log(chalk.bgCyan.bold(`***********************************************`));
  console.log(" ");
}

// Function to display a farewell message
function sayGoodbye() {
  console.log(" ");
  console.log(chalk.yellow.bold(figlet.textSync("Bye for now")));
  console.log(" ");
}

// Function to initiate the application
function initialize() {
  inquirer.prompt(Questions).then(async (answers) => {
    const { action } = answers; // Renamed from 'question' to 'action' for clarity
    switch (action) {
      case "Display All Employees":
        getEmployees();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployee();
        break;
      case "Display All Roles":
        getRoles();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Display All Departments":
        getDepartments();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Exit":
        sayGoodbye();
        db.end(); // Close the database connection
        break;
      default:
        db.end(); // Close the database connection for other cases
        break;
    }
  });
}

// initialization of the app
displayHeader();
initialize();

exports.initialize = initialize; 
// To be able to call initialize, avoiding circular dependencies with routes

//module.exports = initialize;
