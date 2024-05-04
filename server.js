require('dotenv').config();

const express = require('express');
const path = require('node:path');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;
const HOST = process.env.HOST;
const DB_NAME = process.env.DB_NAME;

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const Pool = require('pg').Pool
const db = new Pool({
  user: process.env.DB_USERNAME,
  host: 'dpg-com28521hbls7399hmf0-a',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

db.connect((err) => {
    if (err) {
        console.error(`Error connecting to ${DB_NAME}:`, err);
        return;
    }

    console.log(`Connected to ${DB_NAME}!`);
});


//Routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/getPage/:table', function(req, res) {
    res.sendFile(path.join(__dirname, `/${req.params.table}.html`));
  });

app.get('/getForm/add/:entity', function(req, res) {
    res.sendFile(path.join(__dirname, `/add_${req.params.entity}.html`));
  });

app.get('/getForm/update/:entity', function(req, res) {
    res.sendFile(path.join(__dirname, `/update_${req.params.entity}.html`));
  });


app.get('/api/getTable/:table', (req, res) => {
    const tableName = req.params.table;

    query = `SELECT * FROM ${tableName}`

    if(req.params) {
      const orderBy = req.query.order
      const orderType = req.query.type

      query = query + ` ORDER BY ${orderBy} ${orderType}`;
    }

    db.query(query, (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

// app.get('/api/getRecord/:table', (req, res) => {
//     const tableName = req.params.table;
//     const columnName = req.query.column;
//     const columnValue = req.query.value;

//     db.query(`SELECT * FROM ${tableName} WHERE ${columnName}=$1`, [columnValue], (err, results) => {
//         if(err) {
//             console.error('Error executing query...', err);
//             res.status(500).json({error: 'Internal Server Error'})
//             return;
//         }
//         res.json(results);
//     });
// });

app.get('/api/getRecord/:table', (req, res) => {
  const tableName = req.params.table;
  const columnName = req.query.column;
  const columnValue = req.query.value;

  db.query(`CALL get_record_by_id($1, $2, $3)`, [tableName, columnName, columnValue], (err, results) => {
      if(err) {
          console.error('Error executing query...', err);
          res.status(500).json({error: 'Internal Server Error'})
          return;
      }
      res.json(results);
  });
});


app.post('/api/updateRecord/:table', (req, res) => {
  const tableName = req.params.table;
  const primaryKeyColumn = req.body.primaryKeyColumn;
  const primaryKeyValue = req.body.primaryKeyValue;

  const excludedColumns = [primaryKeyColumn, 'primaryKeyColumn', 'primaryKeyValue']

  // Exclude the primary key column from the update columns
  const updateColumns = Object.keys(req.body).filter(column => !excludedColumns.includes(column));

  // Generate SET clause
  const setClause = updateColumns.map((column, index) => `${column}=$${index + 1}`).join(', ');

  // Values array for the query
  const parameterValues = updateColumns.map(column => { 
    const input_col = req.body[column];
    if (typeof input_col === 'string'){

      return input_col.toUpperCase();

    } else {

      return input_col;
      
    }
  
  });

  parameterValues.push(primaryKeyValue);

  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKeyColumn}=$${updateColumns.length + 1}`;

  console.log(query);

  db.query(query, parameterValues, (err, results) => {
    if (err) {
      console.error('Error executing query...', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.redirect(`/getPage/${tableName}`);
  });
});

app.post('/api/createRecord/:table', (req, res) => {
    const tableName = req.params.table;
  
    // insert columns
    const insertColumns = Object.keys(req.body);
  
    const placeHolderArray = insertColumns.map((column, index) => `$${index + 1}`).join(', ');
  
    // Values array for the query
    const parameterValues = insertColumns.map(column =>{ 
      const input_col = req.body[column];
      if (typeof input_col === 'string'){

        return input_col.toUpperCase();

      } else {

        return input_col;

      }
    
    });
  
    const query = `INSERT INTO ${tableName} (${insertColumns}) VALUES (${placeHolderArray})`;
   
    db.query(query, parameterValues, (err, results) => {
      if (err) {
        console.error('Error executing query...', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.redirect(`/getPage/${tableName}`);
    });
  });

app.delete('/api/removeRecord/:table', function(req, res) {
    const tableName = req.params.table;
    const columnName = req.query.column;
    const columnValue = req.query.value;

    db.query(`DELETE FROM ${tableName} WHERE ${columnName}=$1`, [columnValue], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    return;

  });


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
