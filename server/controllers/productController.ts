import { Response } from 'express';

import authenticateToken, {
  AuthRequest
} from '../middleware/authenticateToken';

import connection from '../dbConnection';

import logActivity from '../utils/logActivity';

export const getProducts = (
  req: AuthRequest,
  res: Response
) => {

  const { business_id } = req.query;

  if (!business_id) {

    return res.status(400).json({

      error:
        'business_id is required.'

    });

  }

  const sql = `

    SELECT
      id,
      business_id,
      name,
      sku_barcode,
      category,
      cost_price,
      selling_price,
      stock_quantity,
      low_stock_threshold

    FROM products

    WHERE business_id = ?

  `;

  connection.query(

    sql,

    [business_id],

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
      cost_price,
      selling_price,
      stock_quantity,
      low_stock_threshold
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?)

  `;

  connection.query(

    sql,

    [
      business_id,
      name,
      sku_barcode,
      category || null,
      cost_price,
      selling_price,
      stock_quantity,
      low_stock_threshold || 5
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