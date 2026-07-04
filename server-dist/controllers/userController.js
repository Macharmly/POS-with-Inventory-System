"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectPasswordResetRequest = exports.resetUserPassword = exports.getPasswordResetRequests = exports.updateProfile = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logActivity_1 = __importDefault(require("../utils/logActivity"));
const dbConnection_1 = __importDefault(require("../dbConnection"));
/* =========================
   Get Users
========================= */
const getUsers = (req, res) => {
    dbConnection_1.default.query(`
    SELECT
      id,
      name,
      email,
      role,
      business_id,
      profile_picture
    FROM users
    `, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(results);
    });
};
exports.getUsers = getUsers;
/* =========================
   Create User
========================= */
const createUser = async (req, res) => {
    const { name, email, password, role, business_id } = req.body;
    // Validation
    if (!name ||
        !email ||
        !password ||
        !role ||
        !business_id) {
        return res.status(400).json({
            error: 'Please complete all required fields.'
        });
    }
    try {
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const sql = `

      INSERT INTO users (

        business_id,
        name,
        email,
        password_hash,
        role

      )

      VALUES (?, ?, ?, ?, ?)

    `;
        dbConnection_1.default.query(sql, [
            business_id,
            name,
            email,
            hashedPassword,
            role
        ], async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }
            await (0, logActivity_1.default)({
                user_id: req.user.id,
                business_id,
                module: 'User Management',
                action: 'CREATE_USER',
                description: `Created user: ${name}`
            });
            res.json({
                message: 'User created successfully'
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
exports.createUser = createUser;
/* =========================
   Update User
========================= */
const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const { id } = req.params;
    if (!name ||
        !email ||
        !role) {
        return res.status(400).json({
            error: 'Please complete required fields.'
        });
    }
    try {
        let sql = `

      UPDATE users

      SET

        name = ?,
        email = ?,
        role = ?

    `;
        const values = [
            name,
            email,
            role
        ];
        // Optional password update
        if (password) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            sql += `,

        password_hash = ?

      `;
            values.push(hashedPassword);
        }
        sql += `

      WHERE id = ?

    `;
        values.push(id);
        dbConnection_1.default.query(sql, values, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }
            await (0, logActivity_1.default)({
                user_id: req.user.id,
                business_id: req.user.business_id,
                module: 'User Management',
                action: 'UPDATE_USER',
                description: `Updated user: ${name}`
            });
            res.json({
                message: 'User updated successfully'
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
exports.updateUser = updateUser;
/* =========================
   Delete User
========================= */
const deleteUser = (req, res) => {
    const { id } = req.params;
    dbConnection_1.default.query(`
    DELETE FROM users
    WHERE id = ?
    `, [id], async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }
        await (0, logActivity_1.default)({
            user_id: req.user.id,
            business_id: req.user.business_id,
            module: 'User Management',
            action: 'DELETE_USER',
            description: `Deleted user ID: ${id}`
        });
        res.json({
            message: 'User deleted successfully'
        });
    });
};
exports.deleteUser = deleteUser;
/* =========================
   Update Profile
========================= */
const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, password, profile_picture } = req.body;
    try {
        let sql = `

      UPDATE users

      SET

        name = ?,
        profile_picture = ?

    `;
        const values = [
            name,
            profile_picture || null
        ];
        // Optional password update
        if (password) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            sql += `,

        password_hash = ?

      `;
            values.push(hashedPassword);
        }
        sql += `

      WHERE id = ?

    `;
        values.push(id);
        dbConnection_1.default.query(sql, values, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }
            res.json({
                message: 'Profile updated successfully'
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
exports.updateProfile = updateProfile;
/* =========================
   Get Password Reset Requests
========================= */
const getPasswordResetRequests = (req, res) => {
    const sql = `
    SELECT
      prr.id,
      prr.user_id,
      prr.email,
      prr.business_id,
      prr.status,
      prr.requested_at,
      prr.completed_at,
      u.name
    FROM password_reset_requests prr
    JOIN users u ON prr.user_id = u.id
    WHERE prr.status = 'pending'
    ORDER BY prr.requested_at DESC
  `;
    dbConnection_1.default.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(results);
    });
};
exports.getPasswordResetRequests = getPasswordResetRequests;
/* =========================
   Reset User Password
========================= */
const resetUserPassword = async (req, res) => {
    const { id } = req.params;
    const { new_password } = req.body;
    if (!new_password) {
        return res.status(400).json({
            error: 'New password is required.'
        });
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(new_password, 10);
        const findRequestSql = `
      SELECT user_id, business_id
      FROM password_reset_requests
      WHERE id = ?
      AND status = 'pending'
    `;
        dbConnection_1.default.query(findRequestSql, [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }
            const rows = results;
            if (rows.length === 0) {
                return res.status(404).json({
                    error: 'Password reset request not found.'
                });
            }
            const request = rows[0];
            const updatePasswordSql = `
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
      `;
            dbConnection_1.default.query(updatePasswordSql, [hashedPassword, request.user_id], async (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).json({
                        error: updateErr.message
                    });
                }
                const completeRequestSql = `
            UPDATE password_reset_requests
            SET status = 'completed',
                completed_at = NOW()
            WHERE id = ?
          `;
                dbConnection_1.default.query(completeRequestSql, [id], async (completeErr) => {
                    if (completeErr) {
                        console.error(completeErr);
                        return res.status(500).json({
                            error: completeErr.message
                        });
                    }
                    await (0, logActivity_1.default)({
                        user_id: req.user.id,
                        business_id: request.business_id,
                        module: 'User Management',
                        action: 'RESET_PASSWORD',
                        description: `Reset password for user ID: ${request.user_id}`
                    });
                    res.json({
                        message: 'Password reset successfully.'
                    });
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
exports.resetUserPassword = resetUserPassword;
/* =========================
   Reject Password Reset Request
========================= */
const rejectPasswordResetRequest = (req, res) => {
    const { id } = req.params;
    const sql = `
    UPDATE password_reset_requests
    SET status = 'cancelled',
        completed_at = NOW()
    WHERE id = ?
    AND status = 'pending'
  `;
    dbConnection_1.default.query(sql, [id], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Password reset request not found.'
            });
        }
        await (0, logActivity_1.default)({
            user_id: req.user.id,
            business_id: req.user.business_id,
            module: 'User Management',
            action: 'REJECT_PASSWORD_RESET_REQUEST',
            description: `Rejected password reset request ID: ${id}`
        });
        res.json({
            message: 'Password reset request rejected.'
        });
    });
};
exports.rejectPasswordResetRequest = rejectPasswordResetRequest;
