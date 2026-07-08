import { Response } from 'express';

import {
  AuthRequest
} from '../middleware/authenticateToken';

import connection from '../dbConnection';

import logActivity from '../utils/logActivity';

const dropdownTables: Record<string, string> = {
  categories: 'product_categories',
  brands: 'product_brands',
  suppliers: 'product_suppliers',
  units: 'product_units'
};

const dropdownLabels: Record<string, string> = {
  categories: 'Category',
  brands: 'Brand',
  suppliers: 'Supplier',
  units: 'Unit'
};

export const getProducts = async (
  req: AuthRequest,
  res: Response
) => {

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

    const params: any[] = [business_id];

    if (status) {
      sql += `
        AND status = ?
      `;

      params.push(status);
    }

    const [results] =
      await connection
        .promise()
        .query(
          sql,
          params
        );

    return res.json(results);

  } catch (error: any) {

    console.error(
      '❌ Fetch Products Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Failed to fetch products'
    });

  }

};

export const createProduct = async (
  req: AuthRequest,
  res: Response
) => {

  const {
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
  } = req.body;

  if (
    !business_id ||
    !name ||
    !sku_barcode ||
    cost_price === undefined ||
    selling_price === undefined ||
    stock_quantity === undefined
  ) {
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

    const [results]: any =
      await connection
        .promise()
        .query(
          sql,
          [
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
          ]
        );

    try {
      if (req.user?.id) {
        await logActivity({
          user_id: req.user.id,
          business_id,
          module: 'Inventory',
          action: 'CREATE_PRODUCT',
          description:
            `Created product "${name}" with SKU/Barcode "${sku_barcode}" and initial stock of ${stock_quantity}`
        });
      }
    } catch (logError: any) {
      console.error(
        '⚠️ Product created but activity log failed:',
        logError.message
      );
    }

    return res.status(201).json({
      message: 'Product created successfully',
      results
    });

  } catch (error: any) {

    console.error(
      '❌ Create Product Error:',
      error
    );

    return res.status(500).json({
      error: error.message,
      sqlMessage: error.sqlMessage,
      code: error.code
    });

  }

};

export const updateProduct = async (
  req: AuthRequest,
  res: Response
) => {

  const { id } = req.params;

  const {
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
  } = req.body;

  if (
    !id ||
    !business_id ||
    !name ||
    !sku_barcode ||
    cost_price === undefined ||
    selling_price === undefined ||
    stock_quantity === undefined
  ) {
    return res.status(400).json({
      error: 'Required fields are missing.'
    });
  }

  try {

    const [oldRows]: any =
      await connection
        .promise()
        .query(
          `
          SELECT
            name,
            sku_barcode,
            stock_quantity
          FROM products
          WHERE id = ?
          AND business_id = ?
          `,
          [
            id,
            business_id
          ]
        );

    if (oldRows.length === 0) {
      return res.status(404).json({
        error: 'Product not found.'
      });
    }

    const oldProduct =
      oldRows[0];

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

    const [results]: any =
      await connection
        .promise()
        .query(
          sql,
          [
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
          ]
        );

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: 'Product not found.'
      });
    }

    await logActivity({
      user_id: req.user!.id,
      business_id,
      module: 'Inventory',
      action: 'UPDATE_PRODUCT',
      description:
        `Updated product "${oldProduct.name}" to "${name}". Stock: ${oldProduct.stock_quantity} → ${stock_quantity}`
    });

    return res.json({
      message: 'Product updated successfully',
      results
    });

  } catch (error: any) {

    console.error(
      '❌ Update Product Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Failed to update product'
    });

  }

};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
) => {

  const { id } = req.params;
  const { business_id } = req.body;

  if (!id || !business_id) {
    return res.status(400).json({
      error: 'Product ID and business_id are required.'
    });
  }

  try {

    const [findResults]: any =
      await connection
        .promise()
        .query(
          `
          SELECT
            name,
            sku_barcode,
            stock_quantity
          FROM products
          WHERE id = ?
          AND business_id = ?
          `,
          [
            id,
            business_id
          ]
        );

    if (findResults.length === 0) {
      return res.status(404).json({
        error: 'Product not found.'
      });
    }

    const product =
      findResults[0];

    const [deleteResults]: any =
      await connection
        .promise()
        .query(
          `
          DELETE FROM products
          WHERE id = ?
          AND business_id = ?
          `,
          [
            id,
            business_id
          ]
        );

    await logActivity({
      user_id: req.user!.id,
      business_id,
      module: 'Inventory',
      action: 'DELETE_PRODUCT',
      description:
        `Deleted product "${product.name}" with SKU/Barcode "${product.sku_barcode}" and remaining stock of ${product.stock_quantity}`
    });

    return res.json({
      message: 'Product deleted successfully.',
      results: deleteResults
    });

  } catch (error: any) {

    console.error(
      '❌ Delete Product Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Failed to delete product.'
    });

  }

};

export const getDropdownOptions = async (
  req: AuthRequest,
  res: Response
) => {

  const type = req.params.type as string;
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

    const [results] =
      await connection
        .promise()
        .query(
          `
          SELECT id, name
          FROM ${table}
          WHERE business_id = ?
          ORDER BY name ASC
          `,
          [business_id]
        );

    return res.json(results);

  } catch (error: any) {

    console.error(
      '❌ Fetch Dropdown Options Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Failed to fetch dropdown options.'
    });

  }

};

export const createDropdownOption = async (
  req: AuthRequest,
  res: Response
) => {

  const type = req.params.type as string;

  const {
    business_id,
    name
  } = req.body;

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

    const cleanName =
      name.trim();

    const [results]: any =
      await connection
        .promise()
        .query(
          `
          INSERT IGNORE INTO ${table} (
            business_id,
            name
          )
          VALUES (?, ?)
          `,
          [
            business_id,
            cleanName
          ]
        );

    if (results.affectedRows > 0) {
      await logActivity({
        user_id: req.user!.id,
        business_id,
        module: 'Inventory',
        action: 'CREATE_DROPDOWN_OPTION',
        description:
          `Created ${dropdownLabels[type] || 'dropdown option'}: "${cleanName}"`
      });
    }

    return res.status(201).json({
      message: 'Option saved successfully.',
      results
    });

  } catch (error: any) {

    console.error(
      '❌ Create Dropdown Option Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Failed to create dropdown option.'
    });

  }

};

export const getInventoryMovements = async (
  req: AuthRequest,
  res: Response
) => {
  const { business_id } = req.query;

  try {
    const [rows]: any =
      await connection
        .promise()
        .query(
          `
          SELECT
            im.id,
            im.product_id,
            im.business_id,
            im.user_id,
            im.movement_type,
            im.quantity,
            im.reference_id,
            im.notes,
            im.created_at,
            p.name AS product_name,
            u.name AS user_name
          FROM inventory_movements im
          LEFT JOIN products p
            ON im.product_id = p.id
          LEFT JOIN users u
            ON im.user_id = u.id
          WHERE im.business_id = ?
          ORDER BY im.created_at DESC
          LIMIT 50
          `,
          [business_id]
        );

    res.json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error.message
    });
  }
};