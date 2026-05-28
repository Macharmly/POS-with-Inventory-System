import bcrypt from 'bcrypt';
import logActivity from '../utils/logActivity';

import {
  Request,
  Response
} from 'express';

import connection from '../dbConnection';

/* =========================
   Get Users
========================= */

export const getUsers = (
  req: Request,
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
  req: Request,
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
  req: Request,
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
  req: Request,
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
  req: Request,
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