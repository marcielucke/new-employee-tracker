INSERT INTO department (name)
VALUES ("Human Resources"),
    ("Clinical Services"),
    ("Accounting");

INSERT INTO role (title, department_id, salary)
VALUES
("Customer Service Rep", 1, 50000.0),
("Consultant", 2, 90000.0),
("Accountant", 3, 80000.0);


INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES
("Marcie", "Lucke", 2, NULL, 2),
("Steph", "Dietz", 3, 13, 3),
("Beth","Ryan", 1, NULL, 1);