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
    const questionArray = [{
        name: "menu",
        type: "list",
        message: "What would you like to do?",
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
    const response = await inquirer.prompt(questionArray).then((answers) =>
    {
    console.log(answers);
    });
}

init();