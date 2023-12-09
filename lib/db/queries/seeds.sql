-- Inserting values into the 'departments' table
INSERT INTO departments (name)
VALUES ("Marketing"),
       ("Finance"),
       ("Logistics"),
       ("Research"),
       ("Customer Relations");

-- Inserting values into the 'roles' table
INSERT INTO roles (title, salary, department_id)
VALUES ("Director", 8000, 3),
       ("Analyst", 4000, 1);

-- Inserting values into the 'employees' table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
       ("Jane", "Smith", 2, 1);
