"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusiness = exports.getBusinessById = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
const logActivity_1 = __importDefault(require("../utils/logActivity"));
const getBusinessById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT
            id,
            name,
            type,
            address,
            contact_number,
            email,
            tin_number,
            tax_type,
            receipt_footer
          FROM businesses
          WHERE id = ?
          `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Business not found'
            });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getBusinessById = getBusinessById;
const updateBusiness = async (req, res) => {
    const { id } = req.params;
    const { name, address, contact_number, email, tin_number, tax_type, receipt_footer, user_id } = req.body;
    try {
        const [oldRows] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT
            name
          FROM businesses
          WHERE id = ?
          `, [id]);
        if (oldRows.length === 0) {
            return res.status(404).json({
                error: 'Business not found'
            });
        }
        await dbConnection_1.default
            .promise()
            .query(`
        UPDATE businesses
        SET
          name = ?,
          address = ?,
          contact_number = ?,
          email = ?,
          tin_number = ?,
          tax_type = ?,
          receipt_footer = ?
        WHERE id = ?
        `, [
            name,
            address,
            contact_number,
            email,
            tin_number,
            tax_type,
            receipt_footer,
            id
        ]);
        await (0, logActivity_1.default)({
            user_id,
            business_id: Number(id),
            module: 'Business',
            action: 'UPDATE_BUSINESS',
            description: `Updated business information for "${oldRows[0].name}" to "${name}"`
        });
        res.json({
            success: true,
            message: 'Business information updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.updateBusiness = updateBusiness;
