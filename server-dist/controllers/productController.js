"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDropdownOption = exports.getDropdownOptions = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
const logActivity_1 = __importDefault(require("../utils/logActivity"));
const dropdownTables = {
    categories: 'product_categories',
    brands: 'product_brands',
    suppliers: 'product_suppliers',
    units: 'product_units'
};
const dropdownLabels = {
    categories: 'Category',
    brands: 'Brand',
    suppliers: 'Supplier',
    units: 'Unit'
};
const getProducts = async (req, res) => {
    const { business_id, status } = req.query;
    if (!business_id) {
        return res.status(400).json({
            error: 'business_id is required.'
        });
    }
    try {
        let sql = `
      SELECT
        id,
        business_id,
        name,
        sku_barcode,
        category,
        brand,
        supplier,
        unit_type,
        description,
        status,
        cost_price,
        selling_price,
        stock_quantity,
        low_stock_threshold,
        created_at,
        updated_at
      FROM products
      WHERE business_id = ?
    `;
        const params = [business_id];
        if (status) {
            sql += `
        AND status = ?
      `;
            params.push(status);
        }
        const [results] = await dbConnection_1.default
            .promise()
            .query(sql, params);
        return res.json(results);
    }
    catch (error) {
        console.error('❌ Fetch Products Error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch products'
        });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    const { business_id, name, sku_barcode, category, brand, supplier, unit_type, description, status, cost_price, selling_price, stock_quantity, low_stock_threshold } = req.body;
    if (!business_id ||
        !name ||
        !sku_barcode ||
        cost_price === undefined ||
        selling_price === undefined ||
        stock_quantity === undefined) {
        return res.status(400).json({
            error: 'Required fields are missing.'
        });
    }
    try {
        const sql = `
      INSERT INTO products (
        business_id,
        name,
        sku_barcode,
        category,
        brand,
        supplier,
        unit_type,
        description,
        status,
        cost_price,
        selling_price,
        stock_quantity,
        low_stock_threshold
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [results] = await dbConnection_1.default
            .promise()
            .query(sql, [
            business_id,
            name,
            sku_barcode,
            category || null,
            brand || null,
            supplier || null,
            unit_type || 'pcs',
            description || null,
            status || 'active',
            cost_price,
            selling_price,
            stock_quantity,
            low_stock_threshold ?? 5
        ]);
        await (0, logActivity_1.default)({
            user_id: req.user.id,
            business_id,
            module: 'Inventory',
            action: 'CREATE_PRODUCT',
            description: `Created product "${name}" with SKU/Barcode "${sku_barcode}" and initial stock of ${stock_quantity}`
        });
        return res.status(201).json({
            message: 'Product created successfully',
            results
        });
    }
    catch (error) {
        console.error('❌ Create Product Error:', error.message);
        return res.status(500).json({
            error: 'Failed to create product'
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { business_id, name, sku_barcode, category, brand, supplier, unit_type, description, status, cost_price, selling_price, stock_quantity, low_stock_threshold } = req.body;
    if (!id ||
        !business_id ||
        !name ||
        !sku_barcode ||
        cost_price === undefined ||
        selling_price === undefined ||
        stock_quantity === undefined) {
        return res.status(400).json({
            error: 'Required fields are missing.'
        });
    }
    try {
        const [oldRows] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT
            name,
            sku_barcode,
            stock_quantity
          FROM products
          WHERE id = ?
          AND business_id = ?
          `, [
            id,
            business_id
        ]);
        if (oldRows.length === 0) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }
        const oldProduct = oldRows[0];
        const sql = `
      UPDATE products
      SET
        name = ?,
        sku_barcode = ?,
        category = ?,
        brand = ?,
        supplier = ?,
        unit_type = ?,
        description = ?,
        status = ?,
        cost_price = ?,
        selling_price = ?,
        stock_quantity = ?,
        low_stock_threshold = ?
      WHERE id = ?
      AND business_id = ?
    `;
        const [results] = await dbConnection_1.default
            .promise()
            .query(sql, [
            name,
            sku_barcode,
            category || null,
            brand || null,
            supplier || null,
            unit_type || 'pcs',
            description || null,
            status || 'active',
            cost_price,
            selling_price,
            stock_quantity,
            low_stock_threshold ?? 5,
            id,
            business_id
        ]);
        if (results.affectedRows === 0) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }
        await (0, logActivity_1.default)({
            user_id: req.user.id,
            business_id,
            module: 'Inventory',
            action: 'UPDATE_PRODUCT',
            description: `Updated product "${oldProduct.name}" to "${name}". Stock: ${oldProduct.stock_quantity} → ${stock_quantity}`
        });
        return res.json({
            message: 'Product updated successfully',
            results
        });
    }
    catch (error) {
        console.error('❌ Update Product Error:', error.message);
        return res.status(500).json({
            error: 'Failed to update product'
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { business_id } = req.body;
    if (!id || !business_id) {
        return res.status(400).json({
            error: 'Product ID and business_id are required.'
        });
    }
    try {
        const [findResults] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT
            name,
            sku_barcode,
            stock_quantity
          FROM products
          WHERE id = ?
          AND business_id = ?
          `, [
            id,
            business_id
        ]);
        if (findResults.length === 0) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }
        const product = findResults[0];
        const [deleteResults] = await dbConnection_1.default
            .promise()
            .query(`
          DELETE FROM products
          WHERE id = ?
          AND business_id = ?
          `, [
            id,
            business_id
        ]);
        await (0, logActivity_1.default)({
            user_id: req.user.id,
            business_id,
            module: 'Inventory',
            action: 'DELETE_PRODUCT',
            description: `Deleted product "${product.name}" with SKU/Barcode "${product.sku_barcode}" and remaining stock of ${product.stock_quantity}`
        });
        return res.json({
            message: 'Product deleted successfully.',
            results: deleteResults
        });
    }
    catch (error) {
        console.error('❌ Delete Product Error:', error.message);
        return res.status(500).json({
            error: 'Failed to delete product.'
        });
    }
};
exports.deleteProduct = deleteProduct;
const getDropdownOptions = async (req, res) => {
    const type = req.params.type;
    const { business_id } = req.query;
    const table = dropdownTables[type];
    if (!table) {
        return res.status(400).json({
            error: 'Invalid dropdown type.'
        });
    }
    if (!business_id) {
        return res.status(400).json({
            error: 'business_id is required.'
        });
    }
    try {
        const [results] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT id, name
          FROM ${table}
          WHERE business_id = ?
          ORDER BY name ASC
          `, [business_id]);
        return res.json(results);
    }
    catch (error) {
        console.error('❌ Fetch Dropdown Options Error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch dropdown options.'
        });
    }
};
exports.getDropdownOptions = getDropdownOptions;
const createDropdownOption = async (req, res) => {
    const type = req.params.type;
    const { business_id, name } = req.body;
    const table = dropdownTables[type];
    if (!table) {
        return res.status(400).json({
            error: 'Invalid dropdown type.'
        });
    }
    if (!business_id || !name?.trim()) {
        return res.status(400).json({
            error: 'business_id and name are required.'
        });
    }
    try {
        const cleanName = name.trim();
        const [results] = await dbConnection_1.default
            .promise()
            .query(`
          INSERT IGNORE INTO ${table} (
            business_id,
            name
          )
          VALUES (?, ?)
          `, [
            business_id,
            cleanName
        ]);
        if (results.affectedRows > 0) {
            await (0, logActivity_1.default)({
                user_id: req.user.id,
                business_id,
                module: 'Inventory',
                action: 'CREATE_DROPDOWN_OPTION',
                description: `Created ${dropdownLabels[type] || 'dropdown option'}: "${cleanName}"`
            });
        }
        return res.status(201).json({
            message: 'Option saved successfully.',
            results
        });
    }
    catch (error) {
        console.error('❌ Create Dropdown Option Error:', error.message);
        return res.status(500).json({
            error: 'Failed to create dropdown option.'
        });
    }
};
exports.createDropdownOption = createDropdownOption;
