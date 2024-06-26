const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Azure SQL Database connection configuration
const config = {
    user: 'criticomm',
    password: 'Netstream12@',
    server: 'criticomm.database.windows.net', 
    database: 'CRITICOMM',
    options: {
      encrypt: true, // Use this if you're on Windows Azure
    },
  };

// Connect to Azure SQL Database
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to Azure SQL Database');
    }
    return pool;
}).catch(err => {
    console.error('Database connection failed: ', err);
});

// API endpoint to get data
app.get('/api/data', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT IncidentID, ResponderID, Date, Location, Category, Description FROM incidenttable WHERE responderid='0107115469085';`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Serve static files (like your index.html)
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});