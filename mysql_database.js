const mysql = require('mysql');
require('dotenv').config();

let host = "";
let user = "";
let password = "";
let database = "";

if(process.env.DEBUG){
    host = process.env.LOCALHOST;
    user = process.env.LOCALHOST_USER;
    password = process.env.LOCALHOST_PASSWORD;
    database = process.env.LOCALHOST_DATABASE;
}
else{
    host = process.env.HOST;
    user = process.env.USER;
    password = process.env.PASSWORD;
    database = process.env.DATABASE;
}

// const host = 'sql12.freemysqlhosting.net';
// const user = 'sql12596602';
// const password = 'U2CINsijCH';
// const database = 'sql12596602'; // virtual-booth



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
      first_logged BOOLEAN DEFAULT 1 NOT NULL,
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


        connection.query(`SELECT * FROM ${table} WHERE email = ? LIMIT 1`,[inputEmail], (error, results) => {
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
    let query = `UPDATE ${table} SET `;
    let setValues = '';
    Object.keys(data).forEach((key, index) => {
        setValues += `${key} = '${data[key]}'`;
        if (index < Object.keys(data).length - 1) {
            setValues += ', ';
        }
    });
    query += setValues;
    query += ` WHERE ${condition}`;

    connection.query(query, (error, results) => {
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