import { Request, Response } from 'express';

import db from '../dbConnection';

import logActivity from '../utils/logActivity';

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
  async (
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

      async (
        error: any
      ) => {

        if (error) {

          console.error(error);

          return res.status(500).json({

            error:
              'Failed to create expense.'

          });

        }

        await logActivity({

          user_id,

          business_id,

          module: 'Finance',

          action:
            'CREATE_EXPENSE',

          description:
            `Added expense: ${title} (₱${Number(amount).toFixed(2)})`

        });

        res.json({

          message:
            'Expense added successfully.'

        });

      }

    );

  };

/* =========================
   Revert Expense
========================= */

export const revertExpense =
  (
    req: Request,
    res: Response
  ) => {

    const { id } = req.params;

    db.query(

      `
        SELECT *
        FROM expenses
        WHERE id = ?
      `,

      [id],

      (
        fetchError: any,
        results: any
      ) => {

        if (
          fetchError ||
          results.length === 0
        ) {

          return res.status(500).json({

            error:
              'Expense not found.'

          });

        }

        const expense =
          results[0];

        db.query(

          `
            DELETE FROM expenses
            WHERE id = ?
          `,

          [id],

          async (
            deleteError: any
          ) => {

            if (deleteError) {

              console.error(
                deleteError
              );

              return res.status(500).json({

                error:
                  'Failed to revert expense.'

              });

            }

            await logActivity({

              user_id:
                expense.user_id,

              business_id:
                expense.business_id,

              module:
                'Finance',

              action:
                'REVERT_EXPENSE',

              description:
                `Reverted expense: ${expense.title} (₱${Number(expense.amount).toFixed(2)})`

            });

            res.json({

              message:
                'Expense reverted successfully.'

            });

          }

        );

      }

    );

  };