"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductPerformanceReport = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
const getProductPerformanceReport = async (req, res) => {
    try {
        const { business_id, startDate, endDate } = req.query;
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

        ${startDate
            ? 'AND DATE(s.created_at) >= ?'
            : ''}

        ${endDate
            ? 'AND DATE(s.created_at) <= ?'
            : ''}

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
            values.push(startDate);
        }
        if (endDate) {
            values.push(endDate);
        }
        dbConnection_1.default.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({
                    message: 'Database query failed'
                });
            }
            res.json(results);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch product performance report'
        });
    }
};
exports.getProductPerformanceReport = getProductPerformanceReport;
