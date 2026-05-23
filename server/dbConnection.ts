import mysql from 'mysql2';

// Using a createPool instead of createConnection ensures the database connection never dies or quits
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Leave empty if using default XAMPP/WAMP
  database: 'inventorysystem_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection pool on startup safely
connection.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Database connection pool failed:', err.message);
    return;
  }
  console.log('✅ Connected to the database successfully using persistent Pool!');
  conn.release(); // Return the connection back to the pool, keeping it alive!
});

export default connection;