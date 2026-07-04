"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// Using a createPool instead of createConnection ensures the database connection never dies or quits
const connection = mysql2_1.default.createPool({
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
exports.default = connection;
