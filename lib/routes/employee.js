const inquirer = require("inquirer");
const mysqlConnection = require("../db/mysql");
const server = require("../../server");

// Connect to the database
const db = mysqlConnection;

// Function to retrieve and display all employees
function getEmployees() {
  db.promise()
    .query(
      "SELECT e.id, concat(e.first_name,' ',e.last_name) as 'Employee', r.title as 'Role' , concat('$',r.salary) as 'Salary' ,d.name as 'Department', concat(m.first_name,' ',m.last_name) as 'Manager' FROM employees as e LEFT JOIN roles r ON r.id = e.role_id LEFT JOIN employees m ON e.manager_id = m.id LEFT JOIN departments as d ON d.id = r.department_id"
    )
    .then(([rows, fields]) => {
      console.table(rows); // Display the result in a tabular format
      server.initialize(); // Initialize the server (potentially to return to the main menu)
    })
    .catch(console.log); // Log any errors to the console
}

// Function to add a new employee
function addEmployee() {
  // Arrays to store role and manager choices
  let rolesNamesArray = [];
  let rolesIdsArray = [];
  let managersNamesArray = [];
  let managersIdsArray = [];

  // Fetch roles data and fill the arrays
  db.promise()
    .query("SELECT *  FROM roles")
    .then(([rows, fields]) => {
      rows.forEach((role) => {
        rolesNamesArray.push(role.title);
        rolesIdsArray.push(role.id);
      });

      // Fetch managers data and fill the arrays
      db.promise()
        .query("SELECT *  FROM employees")
        .then(([rows, fields]) => {
          rows.forEach((manager) => {
            managersNamesArray.push(
              manager.first_name + " " + manager.last_name
            );
            managersIdsArray.push(manager.id);
          });
          managersNamesArray.push("No manager"); // If no manager

          // Prompt user for new employee details
          inquirer
            .prompt([
              {
                name: "firstName",
                type: "input",
                message: "Please provide the first name:",
              },
              {
                name: "lastName",
                type: "input",
                message: "Please provide the last name:",
              },
              {
                name: "role",
                type: "list",
                message: "Please select the role:",
                choices: rolesNamesArray,
              },
              {
                name: "manager",
                type: "list",
                message: "Please select the manager:",
                choices: managersNamesArray,
              },
            ])
            .then((answer) => {
              // Perform database query to add the new employee
              db.promise()
                .query(
                  "INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?)",
                  [
                    answer.firstName,
                    answer.lastName,
                    rolesIdsArray[rolesNamesArray.indexOf(answer.role)],
                    managersIdsArray[
                      managersNamesArray.indexOf(answer.manager)
                        ? managersNamesArray.indexOf(answer.manager)
                        : null
                    ],
                  ]
                )
                .then(([rows, fields]) => {
                  getEmployees(); // Display updated list of employees
                })
                .catch(console.log);
            });
        });
    });
}

// Function to update the role of an employee
function updateEmployee() {
  // Arrays to store role and employee choices
  let rolesNamesArray = [];
  let rolesIdsArray = [];
  let employeesNamesArray = [];
  let employeesIdsArray = [];

  // Fetch employees data and fill the arrays
  db.promise()
    .query(
      "SELECT e.id, concat(e.first_name,' ',e.last_name) as 'Employee' FROM employees e"
    )
    .then(([rows, fields]) => {
      rows.forEach((employee) => {
        employeesNamesArray.push(employee.Employee);
        employeesIdsArray.push(employee.id);
      });

      // Fetch roles data and fill the arrays
      db.promise()
        .query("SELECT *  FROM roles")
        .then(([rows, fields]) => {
          rows.forEach((role) => {
            rolesNamesArray.push(role.title);
            rolesIdsArray.push(role.id);
          });

          // Prompt user for employee and new role details
          inquirer
            .prompt([
              {
                name: "employee",
                type: "list",
                message: "Please select the employee you want to update:",
                choices: employeesNamesArray,
              },
              {
                name: "role",
                type: "list",
                message: "Please select the new role:",
                choices: rolesNamesArray,
              },
            ])
            .then((answer) => {
              // Perform database query to update the employee's role
              db.promise()
                .query(
                  "UPDATE employees SET role_id = (?) WHERE id = (?)",
                  [
                    rolesIdsArray[rolesNamesArray.indexOf(answer.role)],
                    employeesIdsArray[
                      employeesNamesArray.indexOf(answer.employee)
                    ],
                  ]
                )
                .then(([rows, fields]) => {
                  getEmployees(); // Display updated list of employees
                })
                .catch(console.log);
            });
        });
    });
}

module.exports = { getEmployees, addEmployee, updateEmployee };
