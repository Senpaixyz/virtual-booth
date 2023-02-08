const mysql = require('mysql');

// make this as env later
const host = 'sql12.freemysqlhosting.net';
const user = 'sql12596602';
const password = 'U2CINsijCH';
const database = 'sql12596602'; // virtual-booth

// Create a connection to the database
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});


// Connect to the database
connection.connect((error) => {
    if (error) throw error;
    console.log('Successfully connected to the database');

    checkUsersTable();
});

// Create users table
const createUsersTable = () => {
    connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE
    )
  `, (error) => {
        if (error) throw error;
        console.log('Successfully created the users table');
    });
};

// Check if the 'users' table exists
const checkUsersTable = () => {
    connection.query(`
    SELECT *
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = '${database}'
    AND TABLE_NAME = 'users'
  `, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            console.log('The users table does not exist');
            createUsersTable();
            console.log('creating a new users table');
        } else {
            console.log('The users table exists');
        }
    });
};

// Create a function for performing a SELECT operation
const getUsersData = (table) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const getUserData = (table,inputEmail) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE email = ?`,[inputEmail], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

// Create a function for performing an INSERT operation
const insertData = (table, data, callback) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (error, results) => {
        if (error) throw error;
        callback(results);
    });
};

// Create a function for performing an UPDATE operation
const updateData = (table, data, condition, callback) => {
    connection.query(`UPDATE ${table} SET ? WHERE ?`, [data, condition], (error, results) => {
        if (error) throw error;
        callback(results);
    });
};

// Create a function for performing a DELETE operation
const deleteData = (table, condition, callback) => {
    connection.query(`DELETE FROM ${table} WHERE ?`, condition, (error, results) => {
        if (error) throw error;
        callback(results);
    });
};

// Export the module as an object
module.exports = {
    getUsersData,
    getUserData,
    insertData,
    updateData,
    deleteData
};