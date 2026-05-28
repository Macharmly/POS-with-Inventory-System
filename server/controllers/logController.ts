import {
  Request,
  Response
} from 'express';

import connection from '../dbConnection';

export const getLogs = (
  req: Request,
  res: Response
) => {

  connection.query(

    `
      SELECT

        activity_logs.*,

        users.name AS user_name

      FROM activity_logs

      LEFT JOIN users
        ON users.id = activity_logs.user_id

      WHERE activity_logs.business_id = ?

      ORDER BY activity_logs.created_at DESC
    `,

    [req.user!.business_id],

    (err, results) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          error:
            err.message
        });

      }

      res.json(results);

    }

  );

};