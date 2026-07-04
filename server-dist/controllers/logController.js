"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
const getLogs = (req, res) => {
    dbConnection_1.default.query(`
      SELECT

        activity_logs.*,

        users.name AS user_name

      FROM activity_logs

      LEFT JOIN users
        ON users.id = activity_logs.user_id

      WHERE activity_logs.business_id = ?

      ORDER BY activity_logs.created_at DESC
    `, [req.user.business_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(results);
    });
};
exports.getLogs = getLogs;
