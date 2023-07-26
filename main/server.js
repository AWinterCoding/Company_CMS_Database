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
    selectDepartments(false);
    selectEmployees(false);
    selectRoles(false);
    runMenu();
}

//function to prompt the menu and move forward after making a selection
async function runMenu(){
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
    // let quitCondition = false;
    // while(!quitCondition){
   await inquirer.prompt(questionArray).then((answers) =>{
        // if(answers.menu == "Quit"){
            // quitCondition = true;
        // }else{
            menuCheck(answers);
        // }
    }
    );
}
// }

let rolelist = [];
let departmentlist = [];
let employeelist = [];
let employeeid = [];

//function to check the answer of the prompt and then determining what process to complete
function menuCheck(answers){
    switch(answers.menu){
        case "View all Departments":
            selectDepartments(true);
            break;
        case "View all Roles":
            selectRoles(true);
            break;
        case "View all Employees":
            selectEmployees(true);
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
            quitCondition = true;
    }
}

//function that creates a new department
async function departmentCreation(){
    const question = [{
        name: "deptName",
        type: "input",
        message: "What would you like the new department to be called?",
    }];
    await inquirer.prompt(question).then((answer)=>{
  db.query(`INSERT INTO departments (department)
  VALUES ("${answer.deptName}")`, function(err, result){
    if(err){
        console.log(err);
    }else{
        selectDepartments(true);
    }
  });

    })
}

//function to create a new  role.
async function roleCreation(){
    let departmentNames = [];
    departmentlist.forEach(element => {
        departmentNames.push(element.department);
    });
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
        choices: departmentNames
    }
];

// we need to do a nested query here unfortunately, otherwise the query 
// to grab the department id won't complete before the other query is initiated
    inquirer.prompt(question).then((answer)=>{
        db.query(`SELECT * FROM departments WHERE department = "${answer.department}"`, function(err, results){
            if(err){
                console.log(err);
            }
            db.query(`INSERT INTO roles (job_title, salary, department_id)
            VALUES ("${answer.roleName}", ${answer.salary}, ${results[0].id})`, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    selectRoles(true);
                }
            });
    });
    })
}

//function to create a new employee
async function employeeCreation(){
    let roleName = [];
    rolelist.forEach(element => {
        roleName.push(element.job_title);
    });
    let employeeName = [];
    employeelist.forEach(element => {
        employeeName.push(`${element.first_name} ${element.last_name}`);
    });
    employeeName.push("N/A");
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
        choices: roleName
    },
    {
        name: "manager_id",
        type: "list",
        message: "manager list",
        choices: employeeName
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
                    if(answer.manager_id == `${employeelist[i].first_name} ${employeelist[i].last_name}`){
                        position = i;
                    }
                }
            id = employeeid[position];
        }
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES ("${answer.first_name}", "${answer.last_name}", ${results[0].id}, ${id})`, function(err, result){
              selectEmployees(true);
            });
    });
    })
}

//method to select all departments
function selectDepartments(printTrue){
    db.query(`SELECT * FROM departments`, function(err, results){
        if(err){
            console.log(err);
        }else{
        departmentlist = [];
        results.forEach(element => {
            departmentlist.push(element);
        });
        if(printTrue){
            generateUI.departmentPrint(departmentlist);
        }
    }
    });
}

//method to select all roles
function selectRoles(printTrue){
    selectDepartments();
    db.query(`SELECT roles.id, roles.job_title, roles.salary, departments.department 
    FROM roles 
    LEFT JOIN departments 
    ON roles.department_id=departments.id`, 
    function(err, results){
        if(err){
            console.log(err);
        }else{
        rolelist = [];
        results.forEach(element => {
            rolelist.push(element);
        });
        if(printTrue){
            generateUI.rolePrint(rolelist);
        }
    }
    });
}

//method to select all employees
function selectEmployees(printTrue){
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, departments.department, roles.job_title, roles.salary, managers.first_name AS manager_first_name, managers.last_name AS manager_last_name
    FROM employees
    LEFT JOIN roles
    ON roles.id=employees.role_id
    LEFT JOIN departments
    ON departments.id=roles.department_id
    LEFT JOIN employees AS managers
    ON employees.manager_id=managers.id
    `, function(err, results){
        if(err){
            console.log(err);
        }else{
        employeelist = [];
        results.forEach(element => {
            employeelist.push(element);
            employeeid.push(element.id);
        });
        if(printTrue){
            generateUI.employeePrint(employeelist);
        }
    }
    });
}

function updateRole(){
    let employeeName = [];
    employeelist.forEach(element => {
        employeeName.push(`${element.first_name} ${element.last_name}`);
    });
    let roleName = [];
    rolelist.forEach(element => {
        roleName.push(`${element.job_title}`)
    });
    const question = [{
        name: "employeeSelect",
        type: "list",
        message: "which employee would you like to update",
        choices: employeeName
    },
    {
        name: "roleSelection",
        type: "list",
        message: "which role would you like this user to have",
        choices: roleName
    }
]
    inquirer.prompt(question).then((answer)=>{
        let employeeMatch;
        for(i = 0; i < employeelist.length; i++){
            if(`${employeelist[i].first_name} ${employeelist[i].last_name}` == answer.employeeSelect){
                employeeMatch = i;
            }
        }
        //doing a double query in order to confirm the role id then use that role id to do the update on the employees
        //the for loop above grabs the employee id to use for the update
        db.query(`SELECT * FROM roles WHERE job_title = "${answer.roleSelection}"`, function(err, results){
            if(err){
                console.log(err);
            }
             db.query(`UPDATE employees SET role_id = ${results[0].id} WHERE id = ${employeeid[employeeMatch]}`, function(err, results){
                if(err){
                    console.log(err);
                }else{
                    selectEmployees(true);
                }
             });
         });
    });
}

init();