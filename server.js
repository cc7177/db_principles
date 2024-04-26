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

app.get('/add_vehicle_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/add_vehicle.html'));
  });

app.get('/update_vehicle_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/update_vehicle.html'));
  });

app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM vehicles', (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});


app.get('/api/get_vehicle', (req, res) => {
    db.query('SELECT * FROM vehicles WHERE VehicleID=?', [req.query.id], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

app.post('/api/addVehicle', (req, res) => {
    const LicensePlate=req.body.licensePlate;
    const Make=req.body.make;
    const Model=req.body.model;
    const Year=req.body.year;
    const Color=req.body.color;
    const VehicleType=req.body.vehicleType;
    const Status=req.body.status;
    const Mileage=req.body.mileage;

    db.query('INSERT INTO Vehicles VALUES (?,?,?,?,?,?,?,?,?)', ['0', LicensePlate, Make, Model, Year, Color, VehicleType, Status, Mileage], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect(`http://${HOST}:${PORT}`);
});

app.post('/api/updateVehicle', (req, res) => {
    const VehicleID=req.body.vehicleID;
    const LicensePlate=req.body.licensePlate;
    const Make=req.body.make;
    const Model=req.body.model;
    const Year=req.body.year;
    const Color=req.body.color;
    const VehicleType=req.body.vehicleType;
    const Status=req.body.status;
    const Mileage=req.body.mileage;

    db.query('UPDATE Vehicles SET LicensePlate=?, Make=?, Model=?, Year=?, Color=?, VehicleType=?, Status=?, Mileage=? WHERE VehicleID=?', [LicensePlate, Make, Model, Year, Color, VehicleType, Status, Mileage, VehicleID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect(`http://${HOST}:${PORT}`);
});

app.delete('/api/removeVehicle', (req, res) => {
    const VehicleID=req.query.id;

    db.query('DELETE FROM Vehicles WHERE VehicleID=?', [VehicleID], (err, results) => {
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
