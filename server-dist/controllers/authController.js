"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConnection_1 = __importDefault(require("../dbConnection"));
const loginUser = async (req, res) => {
    const { email, password, business_id } = req.body;
    try {
        const sql = `
      SELECT *
      FROM users
      WHERE email = ?
      AND business_id = ?
    `;
        dbConnection_1.default.query(sql, [email, business_id], async (err, results) => {
            if (err) {
                console.error('DATABASE ERROR:', err);
                return res.status(500).json({
                    error: 'Database error'
                });
            }
            const rows = results;
            if (rows.length === 0) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }
            const user = rows[0];
            const validPassword = await bcrypt_1.default.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                username: user.name,
                role: user.role,
                business_id: user.business_id
            }, 'hardware_secret_key', {
                expiresIn: '1d'
            });
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.name,
                    role: user.role,
                    business_id: user.business_id,
                    profile_picture: user.profile_picture
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};
exports.loginUser = loginUser;
const forgotPassword = async (req, res) => {
    const { email, business_id } = req.body;
    if (!email || !business_id) {
        return res.status(400).json({
            error: 'Email and business are required'
        });
    }
    try {
        const findUserSql = `
      SELECT id, email, name, business_id
      FROM users
      WHERE email = ?
      AND business_id = ?
    `;
        dbConnection_1.default.query(findUserSql, [email, business_id], (err, results) => {
            if (err) {
                console.error('DATABASE ERROR:', err);
                return res.status(500).json({
                    error: 'Database error'
                });
            }
            const rows = results;
            if (rows.length === 0) {
                return res.json({
                    message: 'If this email exists, a password reset request has been sent.'
                });
            }
            const user = rows[0];
            const insertRequestSql = `
          INSERT INTO password_reset_requests
          (
            user_id,
            email,
            business_id,
            status,
            requested_at
          )
          VALUES (?, ?, ?, 'pending', NOW())
        `;
            dbConnection_1.default.query(insertRequestSql, [
                user.id,
                user.email,
                user.business_id
            ], (insertErr) => {
                if (insertErr) {
                    console.error('PASSWORD RESET REQUEST ERROR:', insertErr);
                    return res.status(500).json({
                        error: 'Failed to create password reset request'
                    });
                }
                return res.json({
                    message: 'Password reset request sent. Please contact the administrator.'
                });
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
