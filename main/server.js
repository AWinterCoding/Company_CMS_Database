const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

//middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//database connection

const db = mysql.createConnection(
    {
        host:"localhost",
        user: "root",
        password: "Lexibon$5101",
        database: "company_db"
    },
    console.log("Connection Successful")
);

//inquirer menu
function init(){
    quitCondition = false;
    while(!quitCondition){quitCondition =  runMenu();}
}

//function to prompt the menu and move forward after making a selection
async function runMenu(){
    let menuCondition = false;
    const questionArray = [{
        name: "menu",
        type: "list",
        message: "Please select what you would like to do?",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
            "Quit"
        ]
    }];
    await inquirer.prompt(questionArray).then((answers) =>{
        menuCondition = menuCheck(answers);
        return menuCondition;
    }
    );
}

//function to check the answer of the prompt and then determining what process to complete
function menuCheck(answers){
    switch(answers.menu){
        case "View all Departments":
            departmentFetch();
            break;
        case "View all Roles":
            roleFetch();
            break;
        case "View all Employees":
            employeeFetch();
            break;
        case "Add a Department":
            departmentCreation();
            break;
        case "Add a Role":
            roleCreation();
            break;
        case "Add an Employee":
            employeeCreation();
            break;
        case "Update an Employee Role":
            console.log("Update Employee");
            break;
        case "Quit":
            return menuCondition = true;
    }
}

function employeeFetch(){
    db.query(`SELECT * FROM employees`, function(err, results){
        console.log("\nHere are all of the Employees\n");
        results.forEach(element => {
            console.log(`${element.first_name} ${element.last_name}`);
        });
    });
}

//function that displays all current roles
function roleFetch(){
    db.query(`SELECT * FROM roles`, function(err, results){
        console.log("\nHere are all of the Roles\n");
        results.forEach(element => {
            console.log(element.job_title);
        });
    });
}

//function that displays all current departments
function departmentFetch(){
    db.query(`SELECT * FROM departments`, function(err, results){
        console.log("\nHere are all of the Departments \n");
        results.forEach(element => {
            console.log(element.department);
        });
    });
}

//function that creates a new department
async function departmentCreation(){
    const question = [{
        name: "deptName",
        type: "input",
        message: "What would you like the new department to be called?",
    }];
    inquirer.prompt(question).then((answer)=>{
  db.query(`INSERT INTO departments (department)
  VALUES (?)`, answer.deptName, function(err, result){
    departmentFetch();
  });

    })
}

//function to create a new  role.
async function roleCreation(){
    const question = [{
        name: "roleName",
        type: "input",
        message: "What would you like the new Role to be called?",
    },
    {
        name: "salary",
        type: "input",
        message: "What is the salary for this Role?"
    },
    {
        name: "department",
        type: "list",
        message: "Which department is this role located in?",
        choices: [
            1,
            2,
            3,
            4,
        ]
    }
];
    inquirer.prompt(question).then((answer)=>{
  db.query(`INSERT INTO roles (job_title, salary, department_id)
  VALUES ("${answer.roleName}", ${answer.salary}, ${answer.department})`, function(err, result){
    roleFetch();
  });
    })
}

//function to create a new employee
async function employeeCreation(){
    const question = [{
        name: "first_name",
        type: "input",
        message: "What is the Employees first name?",
    },
    {
        name: "last_name",
        type: "input",
        message: "What is the Employees last name?"
    },
    {
        name: "role_id",
        type: "list",
        message: "What is the role of this employee?",
        choices: [1,2,3,4]
    },
    {
        name: "manager_id",
        type: "input",
        message: "If the user has a manager, please enter their id here, if not leave it blank"
    }
];
    inquirer.prompt(question).then((answer)=>{
  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES ("${answer.first_name}", "${answer.last_name}", ${answer.role_id}, NULL)`, function(err, result){
    console.log(err);
    console.log(result);
    employeeFetch();
  });
    })
}
init();