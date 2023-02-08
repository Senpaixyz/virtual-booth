const mysql = require('mysql');

// convert this as env later
const host = 'sql12.freemysqlhosting.net';
const user = 'sql12596602';
const password = 'U2CINsijCH';
const database = 'sql12596602'; // virtual-booth

// const host = 'localhost';
// const user = 'root';
// const password = '';
// const database = 'virtual-booth';

// Create a connection to the database
let connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

const reconnectDatabase = () => {
    return new Promise((resolve,reject)=>{
        console.log('Reconnecting to the database');
        connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });

        connection.connect((error) => {
            if (error) throw reject(error);
            console.log('Successfully re-connected to the database');
            resolve('Successfully re-connected to the database');
        });
    });

}


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
      email VARCHAR(255) NOT NULL UNIQUE,
      speciality VARCHAR(255) NOT NULL,
      prc VARCHAR(255) NOT NULL,
      terms_and_condition BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
const getUsersData =  (table) => {
    return new Promise(async (resolve, reject) => {
        let result = [];
        if (connection.state === 'disconnected') {
            result = await reconnectDatabase();
            reject("Connection Disconnected");
        }

        connection.query(`SELECT * FROM ${table}`, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });


    });
};

const getUserData = (table,inputEmail) => {
    return new Promise(async (resolve, reject) => {
        let result = [];
        if (connection.state === 'disconnected') {
            result = await reconnectDatabase();
            reject("Connection Disconnected!");
        }


        connection.query(`SELECT * FROM ${table} WHERE email = ?`,[inputEmail], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });

    });
};

// Create a function for performing an INSERT operation
const insertData = async (table, data, callback) => {
    let result = [];
    if (connection.state === 'disconnected') {
        console.log("Connection Disconnected");
        result = await reconnectDatabase();
        throw new Error("connection-disconnected");
    }

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