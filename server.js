const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const table = require('console.table'); 


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Marcie0812!',
    database: 'tracker_db2'
  });

  db.connect(function(err) {
    if (err) throw err;
    startApp();
  });

  // create function to prompt inquirer and ask which task the user would like to complete

  function startApp() {
    inquirer
    .prompt (
       { name: 'question',
        type: 'list',
        message: 'Which would you like to select?',
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
            "EXIT"
        ]
    }, ).then (function(answer) {
        switch(answer.question) {
            case "view all departments":
              viewDepartments();
              break;
            case "view all roles":
              viewRoles();
              break;
            case "view all employees":
              viewEmployees();
              break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "EXIT":
                exitapp();
                break;
          }
        });
        };

    // write function to view deparments 

    function viewDepartments(){
        db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
        });
        startApp();
    };

    // function to view roles

    function viewRoles(){
        db.query('SELECT * FROM role', function (err, results) {
            console.table(results);
        });
    startApp();
    };

// write function to view all employees 

function viewEmployees() {
    db.query('SELECT department.id, first_name AS "first", last_name AS "last", role.title, role.salary, department.name AS "department name" FROM employee, role, department', function (err, results) {
        console.table(results);
        startApp();
    });

};

// write function to add a new department to list 

function addDepartment() {
    inquirer
    .prompt ({
        name: "Department",
        type: "input",
        message: "What would you like to name the new department?"
    })  .then(function(answer) { 
        var sql = `INSERT INTO department(name)
                VALUES (?)`;

        db.query(sql, answer.Department,  function(err) {
            if (err) throw err;
            console.log("Department " + answer.Department + " successfully added!");
            startApp();
          })
        

    })
    
};

//add a new role to the list

function addRole() {
    var deptChoice = [];
    db.query("SELECT * FROM department", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        var deptList = resDept[i].name;
        deptChoice.push(deptList);
      }
    


    inquirer
    .prompt ([{ 
        name: "title",
        type: "input",
        message: "What role would you like to add?"
    },
    {
        name:"salary",
        type: "input",
        message: "What is the salary of this position?"
    },
    {
        name: "department",
        type: "list",
        message: "What department is this in?",
        choices: deptChoice

    } 
    ]).then (function(newRole) {

        var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === newRole.department) {
            chosenDept = resDept[i];
          }
        };

        var sql = `INSERT INTO role(title, department_id, salary)
        VALUES (?)`;
        var values = [newRole.title, chosenDept.id, newRole.salary]
        db.query(sql, [values], (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(result);});
                startApp();
                        });

                    });
};

// add an employee to the list 

function addEmployee (){

    var roleChoice = [];
    db.query("SELECT * FROM role", function(err, resRole) {
      if (err) throw err;
      for (var i = 0; i < resRole.length; i++) {
        var roleList = resRole[i].title;
        roleChoice.push(roleList)
      };

      var managerChoice = [];

      db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL", function(err, resManager){
        if (err) throw err;
        for (var i=0; i < resManager.length; i++) {
            var managerList = resManager[i].first_name;
            managerChoice.push(managerList);
        }


    inquirer
    .prompt([{
        name: "first",
        type: "input",
        message: "What is the employee's first name?"
    },
    {
        name: "last",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoice

    },
    {
        name: "manager",
        type: "list",
        message: "Who is this employee's Manager?",
        choices: managerChoice
    }
    ]).then (function(newEmployee){
       var sql= `INSERT INTO employee(first_name, last_name, role_id, manager_id ) VALUES (?)`;
       var values = [newEmployee.first, newEmployee.last, roleChoice.id, managerChoice.id];
       db.query(sql, [values], (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);});
            startApp();
                    });
    })
})

};