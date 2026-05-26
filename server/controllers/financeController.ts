import { Request, Response } from 'express';

import db from '../dbConnection';

/* =========================
   Get Expenses
========================= */

export const getExpenses =
  (
    req: Request,
    res: Response
  ) => {

    const { business_id } =
      req.params;

    const {
      startDate,
      endDate
    } = req.query;

    let query = `
      SELECT
        expenses.*,
        users.name
      FROM expenses
      LEFT JOIN users
      ON users.id = expenses.user_id
      WHERE expenses.business_id = ?
    `;

    const queryParams: any[] = [
      business_id
    ];

    if (
      startDate &&
      endDate
    ) {

      query += `
        AND DATE(expenses.created_at)
        BETWEEN ? AND ?
      `;

      queryParams.push(
        startDate,
        endDate
      );

    }

    query += `
      ORDER BY expenses.created_at DESC
    `;

    db.query(

      query,

      queryParams,

      (
        error: any,
        results: any
      ) => {

        if (error) {

          console.error(error);

          return res.status(500).json({

            error:
              'Failed to fetch expenses.'

          });

        }

        res.json(results);

      }

    );

  };

/* =========================
   Create Expense
========================= */

export const createExpense =
  (
    req: Request,
    res: Response
  ) => {

    const {

      business_id,
      user_id,
      category,
      title,
      amount,
      notes

    } = req.body;

    db.query(

      `
        INSERT INTO expenses (

          business_id,
          user_id,
          category,
          title,
          amount,
          notes

        )

        VALUES (?, ?, ?, ?, ?, ?)
      `,

      [

        business_id,
        user_id,
        category,
        title,
        amount,
        notes

      ],

      (
        error: any
      ) => {

        if (error) {

          console.error(error);

          return res.status(500).json({

            error:
              'Failed to create expense.'

          });

        }

        res.json({

          message:
            'Expense added successfully.'

        });

      }

    );

  };