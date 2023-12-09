const inquirer = require("inquirer");
const mysqlConnection = require("../db/mysql");
const server = require("../../server"); // Assuming 'server' is a file or module that exports the 'init' function

const db = mysqlConnection;

// Function to retrieve and display all departments
function getDepartments() {
  db.promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      console.table(rows); // Display the result in a tabular format
      server.initialize(); // Initialize the server (potentially to return to the main menu)
    })
    .catch(console.log); // Log any errors to the console
}

// Function to add a new department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please provide the department name:",
      },
    ])
    .then((answer) => {
      // Insert the new department into the database
      db.promise()
        .query("INSERT INTO departments (name) VALUES (?)", answer.department)
        .then(([rows, fields]) => {
          getDepartments(); // After adding, display all departments (potentially to show the updated list)
        })
        .catch(console.log); // Log any errors to the console
    });
}

module.exports = { getDepartments, addDepartment };
