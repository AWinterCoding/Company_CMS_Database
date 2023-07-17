INSERT INTO departments(id, department)
VALUES  (001, "Human Resources"),
        (002, "Sales"),
        (003, "Technical Support"),
        (004, "Product Development");

INSERT INTO roles(id, job_title, salary, department_id)
VALUES  (001, "Developer", 80000, 004),
        (002, "Developer Lead", 120000, 004),
        (003, "Junior Developer", 60000, 004),
        (004, "Technical Support Rep", 45000, 003),
        (005, "Senior Technical Rep", 60000, 003),
        (006, "Quality Assurance", 50000, 003),
        (007, "Sales Rep", 70000, 002),
        (008, "Senior Sales Rep", 85000, 002),
        (009, "Human Resources Rep", 70000, 001),
        (010, "Human Resources Manager", 85000, 001);


INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
VALUES  (001, "Mike", "Snow", 001, 004),
        (002, "Jim", "Dean", 001, 004),
        (003, "Jeremy", "Leans", 001, 004),
        (004, "Luke", "Mark", 002, NULL),
        (005, "Pam", "Golden", 003, 004),
        (006, "Michael", "Scott", 004, 008),
        (007, "James", "Waterson", 004, 008),
        (008, "Rick", "Riordan", 005, NULL),
        (009, "John", "Smith", 006, NULL),
        (010, "John", "Wick", 007, 012),
        (011, "Linus", "Korkevich", 007, 012),
        (012, "Brenda", "Holmes", 008, NULL),
        (013, "Elizabeth", "Knight", 009, 015),
        (014, "Kalee", "Nelson", 009, 015),
        (015, "Luis", "Ross", 010, NULL);