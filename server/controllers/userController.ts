import bcrypt from 'bcrypt';
import logActivity from '../utils/logActivity';

import { Response } from 'express';

import {
  AuthRequest
} from '../middleware/authenticateToken';

import connection from '../dbConnection';

/* =========================
   Get Users
========================= */

export const getUsers = (
  req: AuthRequest,
  res: Response
) => {

  connection.query(

    `
    SELECT
      id,
      name,
      email,
      role,
      business_id,
      profile_picture
    FROM users
    `,

    (err, results) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          error: err.message
        });

      }

      res.json(results);

    }

  );

};

/* =========================
   Create User
========================= */

export const createUser = async (
  req: AuthRequest,
  res: Response
) => {

  const {
    name,
    email,
    password,
    role,
    business_id
  } = req.body;

  // Validation

  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !business_id
  ) {

    return res.status(400).json({
      error:
        'Please complete all required fields.'
    });

  }

  try {

    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);

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

    connection.query(

      sql,

      [
        business_id,
        name,
        email,
        hashedPassword,
        role
      ],

      async (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            error: err.message
          });

        }

        await logActivity({

          user_id: req.user!.id,

          business_id,

          module: 'User Management',

          action: 'CREATE_USER',

          description:
            `Created user: ${name}`

        });

        res.json({

          message:
            'User created successfully'

        });

      }

    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });

  }

};

/* =========================
   Update User
========================= */

export const updateUser = async (
  req: AuthRequest,
  res: Response
) => {

  const {
    name,
    email,
    password,
    role
  } = req.body;

  const { id } = req.params;

  if (
    !name ||
    !email ||
    !role
  ) {

    return res.status(400).json({
      error:
        'Please complete required fields.'
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

    const values: any[] = [

      name,
      email,
      role

    ];

    // Optional password update

    if (password) {

      const hashedPassword =
        await bcrypt.hash(password, 10);

      sql += `,

        password_hash = ?

      `;

      values.push(hashedPassword);

    }

    sql += `

      WHERE id = ?

    `;

    values.push(id);

    connection.query(

      sql,

      values,

      async (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            error: err.message
          });

        }

        await logActivity({

          user_id: req.user!.id,

          business_id: req.user!.business_id,

          module: 'User Management',

          action: 'UPDATE_USER',

          description:
            `Updated user: ${name}`

        });

        res.json({

          message:
            'User updated successfully'

        });

      }

    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });

  }

};

/* =========================
   Delete User
========================= */

export const deleteUser = (
  req: AuthRequest,
  res: Response
) => {

  const { id } = req.params;

  connection.query(

    `
    DELETE FROM users
    WHERE id = ?
    `,

    [id],

    async (err) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          error: err.message
        });

      }

      await logActivity({

        user_id: req.user!.id,

        business_id: req.user!.business_id,

        module: 'User Management',

        action: 'DELETE_USER',

        description:
          `Deleted user ID: ${id}`

      });

      res.json({

        message:
          'User deleted successfully'

      });

    }

  );

};

/* =========================
   Update Profile
========================= */

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {

  const { id } = req.params;

  const {
    name,
    password,
    profile_picture
  } = req.body;

  try {

    let sql = `

      UPDATE users

      SET

        name = ?,
        profile_picture = ?

    `;

    const values: any[] = [

      name,
      profile_picture || null

    ];

    // Optional password update

    if (password) {

      const hashedPassword =
        await bcrypt.hash(password, 10);

      sql += `,

        password_hash = ?

      `;

      values.push(hashedPassword);

    }

    sql += `

      WHERE id = ?

    `;

    values.push(id);

    connection.query(

      sql,

      values,

      async (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            error: err.message
          });

        }

        res.json({

          message:
            'Profile updated successfully'

        });

      }

    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });

  }

};

/* =========================
   Get Password Reset Requests
========================= */

export const getPasswordResetRequests = (
  req: AuthRequest,
  res: Response
) => {
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

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: err.message
      });
    }

    res.json(results);
  });
};

/* =========================
   Reset User Password
========================= */

export const resetUserPassword = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;
  const { new_password } = req.body;

  if (!new_password) {
    return res.status(400).json({
      error: 'New password is required.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const findRequestSql = `
      SELECT user_id, business_id
      FROM password_reset_requests
      WHERE id = ?
      AND status = 'pending'
    `;

    connection.query(findRequestSql, [id], (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: err.message
        });
      }

      const rows = results as any[];

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

      connection.query(
        updatePasswordSql,
        [hashedPassword, request.user_id],
        async (updateErr) => {
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

          connection.query(
            completeRequestSql,
            [id],
            async (completeErr) => {
              if (completeErr) {
                console.error(completeErr);

                return res.status(500).json({
                  error: completeErr.message
                });
              }

              await logActivity({
                user_id: req.user!.id,
                business_id: request.business_id,
                module: 'User Management',
                action: 'RESET_PASSWORD',
                description: `Reset password for user ID: ${request.user_id}`
              });

              res.json({
                message: 'Password reset successfully.'
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
};

/* =========================
   Reject Password Reset Request
========================= */

export const rejectPasswordResetRequest = (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;

  const sql = `
    UPDATE password_reset_requests
    SET status = 'cancelled',
        completed_at = NOW()
    WHERE id = ?
    AND status = 'pending'
  `;

  connection.query(
    sql,
    [id],
    async (err, result: any) => {
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

      await logActivity({
        user_id: req.user!.id,
        business_id: req.user!.business_id,
        module: 'User Management',
        action: 'REJECT_PASSWORD_RESET_REQUEST',
        description: `Rejected password reset request ID: ${id}`
      });

      res.json({
        message: 'Password reset request rejected.'
      });
    }
  );
};