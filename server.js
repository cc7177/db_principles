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

app.get('/customers', function(req, res) {
    res.sendFile(path.join(__dirname, '/customers.html'));
  });

app.get('/rentals', function(req, res) {
   res.sendFile(path.join(__dirname, '/rentals.html'));
  });

app.get('/add_vehicle_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/add_vehicle.html'));
  });

app.get('/add_customer_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/add_customer.html'));
  });

app.get('/add_rental_form', function(req, res) {
   res.sendFile(path.join(__dirname, '/add_rental.html'));
  });

app.get('/update_vehicle_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/update_vehicle.html'));
  });

app.get('/update_customer_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/update_customer.html'));
  });

app.get('/update_rental_form', function(req, res) {
    res.sendFile(path.join(__dirname, '/update_rental.html'));
  });


app.get('/api/get_vehicles', (req, res) => {
    db.query('SELECT * FROM vehicles', (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

app.get('/api/get_customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

app.get('/api/get_rentals', (req, res) => {
    db.query('SELECT * FROM rentals', (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});


app.get('/api/get_vehicle', (req, res) => {
    db.query('SELECT * FROM vehicles WHERE VehicleID=$1', [req.query.id], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

app.get('/api/get_customer', (req, res) => {
    db.query('SELECT * FROM customers WHERE customerid=$1', [req.query.id], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
        res.json(results);
    });
});

app.get('/api/get_rental', (req, res) => {
    db.query('SELECT * FROM rentals WHERE rentalid=$1', [req.query.id], (err, results) => {
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

    db.query('INSERT INTO Vehicles (licenseplate, make, model, year, color, vehicletype, status, mileage) '
           + 'VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [LicensePlate, Make, Model, Year, Color, VehicleType, Status, Mileage], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/');
});

app.post('/api/addCustomer', (req, res) => {
    const FirstName=req.body.firstname;
    const LastName=req.body.lastname;
    const DriverLicense=req.body.driverlicensenumber;
    const Email=req.body.email;
    const Phone=req.body.phone;
    const Address=req.body.address;

    db.query('INSERT INTO customers (firstname, lastname, driverlicensenumber, email, phone, address) '
           + 'VALUES ($1,$2,$3,$4,$5,$6)', [FirstName, LastName, DriverLicense, Email, Phone, Address], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/customers');
});

app.post('/api/addRental', (req, res) => {
    const VehicleID=req.body.vehicleid;
    const CustomerID=req.body.customerid;
    const StartDate=req.body.startdate;
    const EndDate=req.body.enddate;
    const ActualEndDate=req.body.actualenddate;
    const DailyRate=req.body.dailyrate;
    const TotalCost=req.body.totalcost;

    db.query('INSERT INTO rentals (vehicleid, customerid, startdate, enddate, actualenddate, dailyrate, totalcost) '
           + 'VALUES ($1,$2,$3,$4,$5,$6,$7)', [VehicleID, CustomerID, StartDate, EndDate, ActualEndDate, DailyRate, TotalCost], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/rentals');
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

    db.query('UPDATE Vehicles SET LicensePlate=$1, Make=$2, Model=$3, Year=$4, Color=$5, VehicleType=$6, Status=$7, Mileage=$8 WHERE VehicleID=$9'
             , [LicensePlate, Make, Model, Year, Color, VehicleType, Status, Mileage, VehicleID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/');
});

app.post('/api/updateCustomer', (req, res) => {
    const CustomerID=req.body.customerID;
    const FirstName=req.body.firstname;
    const LastName=req.body.lastname;
    const DriverLicense=req.body.driverlicensenumber;
    const Email=req.body.email;
    const Phone=req.body.phone;
    const Address=req.body.address;

    db.query('UPDATE customers SET fistname=$1, lastname=$2, driverlicensenumber=$3, email=$4, phone=$5, address=$6 WHERE customerid=$7'
             , [FirstName, LastName, DriverLicense, Email, Phone, Address, CustomerID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/customers');
});

app.post('/api/updateRental', (req, res) => {
    const RentalID=req.body.rentalID;
    const VehicleID=req.body.vehicleid;
    const CustomerID=req.body.customerid;
    const StartDate=req.body.startdate;
    const EndDate=req.body.enddate;
    const ActualEndDate=req.body.actualenddate;
    const DailyRate=req.body.dailyrate;
    const TotalCost=req.body.totalcost;

    db.query('UPDATE rentals SET vehicleid=$1, customerid=$2, startdate=$3, enddate=$4, actualenddate=$5, dailyrate=$6, totalcost=$7 WHERE rentalid=$8'
             , [VehicleID, CustomerID, StartDate, EndDate, ActualEndDate, DailyRate, TotalCost, RentalID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    res.redirect('/rentals');
});

app.delete('/api/removeVehicle', (req, res) => {
    const VehicleID=req.query.id;

    db.query('DELETE FROM Vehicles WHERE VehicleID=$1', [VehicleID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    return;
});

app.delete('/api/removeCustomer', (req, res) => {
    const CustomerID=req.query.id;

    db.query('DELETE FROM customers WHERE customerid=$1', [CustomerID], (err, results) => {
        if(err) {
            console.error('Error executing query...', err);
            res.status(500).json({error: 'Internal Server Error'})
            return;
        }
    });
    return;
});

app.delete('/api/removeRental', (req, res) => {
    const RentalID=req.query.id;

    db.query('DELETE FROM rentals WHERE rentalid=$1', [RentalID], (err, results) => {
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