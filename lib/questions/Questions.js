// Array of questions for user input
const Questions = [
    {
      type: "list",
      name: "action",
      message: "What task would you like to perform?",
      choices: [
        "Display All Employees",
        "Display All Roles",
        "Display All Departments",
        "Add an Employee",
        "Add a Role",
        "Add a Department",
        "Update Employee Role",
        "Exit",
      ],
      validate(answer) {
        const validChoices = [
          "Display All Employees",
          "Display All Roles",
          "Display All Departments",
          "Add an Employee",
          "Add a Role",
          "Add a Department",
          "Update Employee Role",
          "Exit",
        ];
        return validChoices.includes(answer)
          ? true
          : "Invalid choice, please select a valid option.";
      },
    },
  ];
  
  module.exports = { Questions };
  