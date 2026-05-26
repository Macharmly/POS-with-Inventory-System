import { Request, Response } from 'express';

import db from '../dbConnection';

export const getProductPerformanceReport =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        business_id,
        startDate,
        endDate
      } = req.query;

      const query = `

        SELECT

          p.id AS product_id,

          p.name AS product_name,

          COALESCE(
            SUM(si.quantity),
            0
          ) AS total_quantity_sold,

          COALESCE(
            SUM(
              si.quantity *
              si.price_at_sale
            ),
            0
          ) AS total_revenue

        FROM products p

        LEFT JOIN sale_items si
          ON p.id = si.product_id

        LEFT JOIN sales s
          ON s.id = si.sale_id

        WHERE p.business_id = ?

        ${
          startDate
            ? 'AND DATE(s.created_at) >= ?'
            : ''
        }

        ${
          endDate
            ? 'AND DATE(s.created_at) <= ?'
            : ''
        }

        GROUP BY
          p.id,
          p.name

        ORDER BY
          total_quantity_sold DESC

      `;

      const values = [
        business_id
      ];

      if (startDate) {

        values.push(
          startDate as string
        );

      }

      if (endDate) {

        values.push(
          endDate as string
        );

      }

      db.query(

        query,

        values,

        (
          error: any,
          results: any
        ) => {

          if (error) {

            console.error(error);

            return res
              .status(500)
              .json({
                message:
                  'Database query failed'
              });

          }

          res.json(results);

        }

      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          'Failed to fetch product performance report'

      });

    }

  };