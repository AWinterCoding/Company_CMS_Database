//function to print all the departments
function printDepartments(departmentArray){
    console.log("===============================================================");
    console.log("| Id |   Department   |");
    departmentArray.forEach(element => {
        console.log(`| ${element.id} | ${element.department} |`);
    });
    console.log("===============================================================");

}

//function to print all the roles
function printRoles(roleArray){
    console.log("===============================================================");
    console.log("| Id |   Job Title   |  Salary  |  Department |");
    roleArray.forEach(element => {
        console.log(`| ${element.id} |  ${element.job_title}  |  ${element.salary}  |  ${element.department} |`);
    });
    console.log("===============================================================");
}

//function to print all employees
function printEmployees(employeeArray){
    console.log("===============================================================");
    console.log("| Id |   First Name   |  Last Name  |  Department  |  Job Title  |  Salary  |");
    employeeArray.forEach(element => {
        console.log(`| ${element.id} | ${element.first_name} | ${element.last_name} | ${element.department} | ${element.job_title} | ${element.salary} |  ${element.manager_first_name} ${element.manager_last_name} |`);
    });
    console.log("===============================================================");
}

module.exports = {
    departmentPrint: printDepartments,
    rolePrint : printRoles,
    employeePrint : printEmployees
};