function printDepartments(departmentArray){
    console.log("===============================================================");
    console.log("| Id |   Department   |");
    departmentArray.forEach(element => {
        console.log(`| ${element.id} | ${element.department} |`);
    });
    console.log("===============================================================")

}
function printRoles(roleArray){

}
function printEmployees(employeeArray){

}

module.exports = {
    departmentPrint: printDepartments,
};