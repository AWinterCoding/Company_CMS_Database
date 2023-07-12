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
async function init(){
    quitCondition = false;
    while(!quitCondition){quitCondition = await runMenu();}
}

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
        console.log(answers.menu);
    switch(answers.menu){
        case "View all Departments":
            db.query(`SELECT * FROM departments`, function(err, results){
                console.log("\nHere are all of the Departments \n");
                results.forEach(element => {
                    console.log(element.department);
                });
            });
            break;
        case "View all Roles":
            db.query(`SELECT * FROM roles`, function(err, results){
                console.log("\nHere are all of the Roles\n");
                results.forEach(element => {
                    console.log(element.job_title);
                });
            });
            break;
        case "View all Employees":
            db.query(`SELECT * FROM employees`, function(err, results){
                console.log("\nHere are all of the Employees\n");
                results.forEach(element => {
                    console.log(`${element.first_name} ${element.last_name}`);
                });
            });
            break;
        case "Add a Department":
            console.log("AddDepartment");
            break;
        case "Add a Role":
            console.log("AddRole");
            break;
        case "Add an Employee":
            console.log("AddEmployee");
            break;
        case "Update an Employee Role":
            console.log("Update Employee");
            break;
        case "Quit":
            return menuCondition = true;
    }
}
    );
    return menuCondition;
}

init();