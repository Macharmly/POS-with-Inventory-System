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

export const getProducts = (
  req: AuthRequest,
  res: Response
) => {

  const { business_id, status } = req.query;

  if (!business_id) {

    return res.status(400).json({

      error:
        'business_id is required.'

    });

  }

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

  connection.query(

    sql,

    params,

    (err, results) => {

      if (err) {

        console.error(err);

        return res.status(500).json({

          error:
            'Failed to fetch products'

        });

      }

      return res.json(results);

    }

  );

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

      error:
        'Required fields are missing.'

    });

  }

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

  connection.query(

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
    ],

    (err, results) => {

      if (err) {

        console.error(err);

        return res.status(500).json({

          error:
            'Failed to create product'

        });

      }

      logActivity({

        user_id: req.user!.id,

        business_id,

        module: 'Inventory',

        action: 'CREATE_PRODUCT',

        description:
          `Created product: ${name}`

      });

      return res.status(201).json({

        message:
          'Product created successfully',

        results

      });

    }

  );

};

export const updateProduct = (
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

  connection.query(
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
    ],
    (err, results: any) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'Failed to update product'
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: 'Product not found.'
        });
      }

      logActivity({
        user_id: req.user!.id,
        business_id,
        module: 'Inventory',
        action: 'UPDATE_PRODUCT',
        description: `Updated product: ${name}`
      });

      return res.json({
        message: 'Product updated successfully',
        results
      });
    }
  );
};

export const deleteProduct = (
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

  const findSql = `
    SELECT name
    FROM products
    WHERE id = ?
    AND business_id = ?
  `;

  connection.query(
    findSql,
    [id, business_id],
    (findErr, findResults: any) => {
      if (findErr) {
        console.error(findErr);

        return res.status(500).json({
          error: 'Failed to find product.'
        });
      }

      if (findResults.length === 0) {
        return res.status(404).json({
          error: 'Product not found.'
        });
      }

      const productName =
        findResults[0].name;

      const deleteSql = `
        DELETE FROM products
        WHERE id = ?
        AND business_id = ?
      `;

      connection.query(
        deleteSql,
        [id, business_id],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            console.error(deleteErr);

            return res.status(500).json({
              error: 'Failed to delete product.'
            });
          }

          logActivity({
            user_id: req.user!.id,
            business_id,
            module: 'Inventory',
            action: 'DELETE_PRODUCT',
            description: `Deleted product: ${productName}`
          });

          return res.json({
            message: 'Product deleted successfully.',
            results: deleteResults
          });
        }
      );
    }
  );
};

export const getDropdownOptions = (
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

  const sql = `
    SELECT id, name
    FROM ${table}
    WHERE business_id = ?
    ORDER BY name ASC
  `;

  connection.query(
    sql,
    [business_id],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'Failed to fetch dropdown options.'
        });
      }

      return res.json(results);
    }
  );
};

export const createDropdownOption = (
  req: AuthRequest,
  res: Response
) => {
  const type = req.params.type as string;
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

  const sql = `
    INSERT IGNORE INTO ${table} (
      business_id,
      name
    )
    VALUES (?, ?)
  `;

  connection.query(
    sql,
    [business_id, name.trim()],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'Failed to create dropdown option.'
        });
      }

      return res.status(201).json({
        message: 'Option saved successfully.',
        results
      });
    }
  );
};