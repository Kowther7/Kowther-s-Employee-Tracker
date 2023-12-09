const inquirer = require("inquirer");
const mysqlConnection = require("../db/mysql");
const server = require("../../server");

// Connect to the database
const db = mysqlConnection;

// Function to retrieve and display all roles
function getRoles() {
  // Perform a database query to get role information
  db.promise()
    .query(
      "SELECT r.title, concat('$',r.salary) as 'Salary', d.name as 'Department' FROM roles r LEFT JOIN departments d ON r.department_id = d.id"
    )
    .then(([rows, fields]) => {
      console.table(rows); // Display the result in a tabular format
      server.initialize(); // Initialize the server (potentially to return to the main menu)
    })
    .catch(console.log); // Log any errors to the console
}

// Function to add a new role
function addRole() {
  // Arrays to store department choices
  let departmentsNamesArray = [];
  let departmentsIdsArray = [];

  // Fetch department data and fill the arrays
  db.promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      rows.forEach((department) => {
        departmentsNamesArray.push(department.name);
        departmentsIdsArray.push(department.id);
      });

      // Prompt user for new role details
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "Please provide the role title:",
          },
          {
            name: "salary",
            type: "input",
            message: "Please provide the role salary:",
          },
          {
            name: "department",
            type: "list",
            message: "Please select the department:",
            choices: departmentsNamesArray,
          },
        ])
        .then((answer) => {
          // Perform database query to add the new role
          db.promise()
            .query(
              "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
              [
                answer.title,
                answer.salary,
                departmentsIdsArray[
                  departmentsNamesArray.indexOf(answer.department)
                ],
              ]
            )
            .then(([rows, fields]) => {
              getRoles(); // Display updated list of roles
            })
            .catch(console.log);
        });
    });
}

module.exports = { getRoles, addRole };
