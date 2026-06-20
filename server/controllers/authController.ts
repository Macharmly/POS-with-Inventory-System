import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import connection from '../dbConnection';

import {
  Request,
  Response
} from 'express';

export const loginUser = async (
  req: Request,
  res: Response
) => {

  const {
    email,
    password,
    business_id
  } = req.body;

  try {

    const sql = `
      SELECT *
      FROM users
      WHERE email = ?
      AND business_id = ?
    `;

    connection.query(

      sql,

      [
        email,
        business_id
      ],

      async (
        err,
        results
      ) => {

        if (err) {

          console.error(
            'DATABASE ERROR:',
            err
          );

          return res.status(500).json({
            error: 'Database error'
          });

        }

        const rows =
          results as any[];

        if (rows.length === 0) {

          console.log(
            '❌ USER NOT FOUND'
          );

          return res.status(401).json({

            error:
              'Invalid email or password'

          });

        }

        const user = rows[0];

        // Compare hashed password

        const validPassword =
          await bcrypt.compare(
            password,
            user.password_hash
          );

        if (!validPassword) {

          return res.status(401).json({

            error:
              'Invalid email or password'

          });

        }

        // Generate JWT token

        const token = jwt.sign(

          {

            id: user.id,

            email:
              user.email,

            username:
              user.name,

            role:
              user.role,

            business_id:
              user.business_id

          },

          'hardware_secret_key',

          {
            expiresIn: '1d'
          }

        );

        res.json({

          token,

          user: {

            id: user.id,

            email:
              user.email,

            username:
              user.name,

            role:
              user.role,

            business_id:
              user.business_id,

            profile_picture:
              user.profile_picture

          }

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