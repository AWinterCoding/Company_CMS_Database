const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const generateUI = require("./utils/generateUI");

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
    selectDepartments();
    selectEmployees();
    selectRoles();
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

let rolelist = [];
let departmentlist = [];
let employeelist = [];
let employeeid = [];

//function to check the answer of the prompt and then determining what process to complete
function menuCheck(answers){
    switch(answers.menu){
        case "View all Departments":
            selectDepartments();
            generateUI.departmentPrint(departmentlist);
            break;
        case "View all Roles":
            selectRoles();
            generateUI.rolePrint(rolelist);
            break;
        case "View all Employees":
            selectEmployees();
            generateUI.employeePrint(employeelist);
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
            updateRole();
            break;
        case "Quit":
            return true;
    }
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
  VALUES ("${answer.deptName}")`, function(err, result){
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
        choices: departmentlist
    }
];

// we need to do a nested query here unfortunately, otherwise the query 
// to grab the department id won't complete before the other query is initiated
    inquirer.prompt(question).then((answer)=>{
        db.query(`SELECT * FROM departments WHERE department = "${answer.department}"`, function(err, results){
            db.query(`INSERT INTO roles (job_title, salary, department_id)
            VALUES ("${answer.roleName}", ${answer.salary}, ${results[0].id})`, function(err, result){
              roleFetch();
            });
    });
    })
}

//function to create a new employee
async function employeeCreation(){
    employeelist.push("N/A");
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
        name: "role",
        type: "list",
        message: "What is the role of this employee?",
        choices: rolelist
    },
    {
        name: "manager_id",
        type: "list",
        message: "manager list",
        choices: employeelist
    }
];
    inquirer.prompt(question).then((answer)=>{
        db.query(`SELECT * FROM roles WHERE job_title = "${answer.role}"`, function(err, results){
            let id;
            if(answer.manager_id == "N/A"){
                id = "NULL"
            }else{
                let position;
                for(i = 0; i < employeelist.length; i++){
                    console.log(employeelist[i]);
                    if(answer.manager_id == employeelist[i]){
                        position = i;
                    }
                }
            id = employeeid[position];
        }
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES ("${answer.first_name}", "${answer.last_name}", ${results[0].id}, ${id})`, function(err, result){
              employeeFetch();
            });
    });
    })
}

//method to select all departments
function selectDepartments(){
    db.query(`SELECT * FROM departments`, function(err, results){
        if(err){
            console.log(err);
        }else{
        departmentlist = [];
        results.forEach(element => {
            departmentlist.push(element);
        });
    }
    });
}

//method to select all roles
function selectRoles(){
    selectDepartments();
    db.query(`SELECT roles.id, roles.job_title, roles.salary, departments.department FROM roles LEFT JOIN departments ON roles.department_id=departments.id`, function(err, results){
        if(err){
            console.log(err);
        }else{
        rolelist = [];
        results.forEach(element => {
            rolelist.push(element);
        });
    }
    });
}

//method to select all employees
function selectEmployees(){
    db.query(`SELECT * FROM employees`, function(err, results){
        employeelist = [];
        results.forEach(element => {
            employeelist.push(element);
            employeeid.push(element.id);
        });
    });
}

function updateRole(){
    const question = [{
        name: "employeeSelect",
        type: "list",
        message: "which employee would you like to update",
        choices: employeelist
    },
    {
        name: "roleSelection",
        type: "list",
        message: "which role would you like this user to have",
        choices: rolelist
    }
]
    inquirer.prompt(question).then((answer)=>{
        let employeeMatch;
        for(i = 0; i < employeelist.length; i++){
            if(employeelist[i] == answer.employeeSelect){
                employeeMatch = i;
                console.log(employeeMatch);
            }
        }
        //doing a double query in order to confirm the role id then use that role id to do the update on the employees
        //the for loop above grabs the employee id to use for the update
        db.query(`SELECT * FROM roles WHERE job_title = "${answer.roleSelection}"`, function(err, results){
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
             db.query(`UPDATE employees SET role_id = ${results[0].id} WHERE id = ${employeeid[employeeMatch]}`, function(err, results){
                if(err){
                    console.log(err);
                }else{
                    console.log(results);
                }
             });
         });
    });
}

init();