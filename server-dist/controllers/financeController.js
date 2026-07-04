"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertExpense = exports.createExpense = exports.getExpenses = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
const logActivity_1 = __importDefault(require("../utils/logActivity"));
/* =========================
   Get Expenses
========================= */
const getExpenses = (req, res) => {
    const { business_id } = req.params;
    const { startDate, endDate } = req.query;
    let query = `
      SELECT
        expenses.*,
        users.name
      FROM expenses
      LEFT JOIN users
      ON users.id = expenses.user_id
      WHERE expenses.business_id = ?
    `;
    const queryParams = [
        business_id
    ];
    if (startDate &&
        endDate) {
        query += `
        AND DATE(expenses.created_at)
        BETWEEN ? AND ?
      `;
        queryParams.push(startDate, endDate);
    }
    query += `
      ORDER BY expenses.created_at DESC
    `;
    dbConnection_1.default.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Failed to fetch expenses.'
            });
        }
        res.json(results);
    });
};
exports.getExpenses = getExpenses;
/* =========================
   Create Expense
========================= */
const createExpense = async (req, res) => {
    const { business_id, user_id, category, title, amount, notes } = req.body;
    dbConnection_1.default.query(`
        INSERT INTO expenses (

          business_id,
          user_id,
          category,
          title,
          amount,
          notes

        )

        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        business_id,
        user_id,
        category,
        title,
        amount,
        notes
    ], async (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Failed to create expense.'
            });
        }
        await (0, logActivity_1.default)({
            user_id,
            business_id,
            module: 'Finance',
            action: 'CREATE_EXPENSE',
            description: `Added expense: ${title} (₱${Number(amount).toFixed(2)})`
        });
        res.json({
            message: 'Expense added successfully.'
        });
    });
};
exports.createExpense = createExpense;
/* =========================
   Revert Expense
========================= */
const revertExpense = (req, res) => {
    const { id } = req.params;
    dbConnection_1.default.query(`
        SELECT *
        FROM expenses
        WHERE id = ?
      `, [id], (fetchError, results) => {
        if (fetchError ||
            results.length === 0) {
            return res.status(500).json({
                error: 'Expense not found.'
            });
        }
        const expense = results[0];
        dbConnection_1.default.query(`
            DELETE FROM expenses
            WHERE id = ?
          `, [id], async (deleteError) => {
            if (deleteError) {
                console.error(deleteError);
                return res.status(500).json({
                    error: 'Failed to revert expense.'
                });
            }
            await (0, logActivity_1.default)({
                user_id: expense.user_id,
                business_id: expense.business_id,
                module: 'Finance',
                action: 'REVERT_EXPENSE',
                description: `Reverted expense: ${expense.title} (₱${Number(expense.amount).toFixed(2)})`
            });
            res.json({
                message: 'Expense reverted successfully.'
            });
        });
    });
};
exports.revertExpense = revertExpense;
