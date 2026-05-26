import { Request, Response } from 'express';
import connection from '../dbConnection';

/* =========================
   CHECKOUT
========================= */

export const checkout = async (
  req: Request,
  res: Response
) => {

  const {
    business_id,
    user_id,
    items,
    total_amount,
    payment_method
  } = req.body;

  // Validation

  if (!items || items.length === 0) {

    return res.status(400).json({
      error: 'Cart is empty'
    });

  }

  if (!user_id) {

    return res.status(400).json({
      error:
        'User session identity missing.'
    });

  }

  const db =
    await connection
      .promise()
      .getConnection();

  try {

    await db.beginTransaction();

    // Get Business Name

    const [businessRows]: any =
      await db.query(

        `
          SELECT name
          FROM businesses
          WHERE id = ?
        `,

        [business_id]

      );

    if (
      businessRows.length === 0
    ) {

      throw new Error(
        'Business not found'
      );

    }

    const businessName =
      businessRows[0]
        .name;

    // Generate Invoice Number

    const invoiceNumber =
      `INV-${Date.now()}`;

    // Create Sale

    const salesSql = `

      INSERT INTO sales (

        business_id,
        user_id,
        invoice_number,
        total_amount,
        payment_method

      )

      VALUES (?, ?, ?, ?, ?)

    `;

    const [salesResult]: any =
      await db.query(

        salesSql,

        [
          business_id,
          user_id,
          invoiceNumber,
          total_amount,
          payment_method
        ]

      );

    const saleId =
      salesResult.insertId;

    // Process Cart Items

    for (const item of items) {

      // Verify Product

      const [productRows]: any =
        await db.query(

          `
            SELECT
              stock_quantity
            FROM products
            WHERE id = ?
            AND business_id = ?
          `,

          [
            item.id,
            business_id
          ]

        );

      if (
        productRows.length === 0
      ) {

        throw new Error(
          `Product ID ${item.id} not found`
        );

      }

      const currentStock =
        productRows[0]
          .stock_quantity;

      // Prevent Overselling

      if (
        currentStock <
        item.quantity
      ) {

        throw new Error(

          `Insufficient stock for product ID ${item.id}`

        );

      }

      // Insert Sale Item

      const itemSql = `

        INSERT INTO sale_items (

          sale_id,
          product_id,
          product_name,
          quantity,
          subtotal,
          price_at_sale

        )

        VALUES (?, ?, ?, ?, ?, ?)

      `;

      await db.query(

        itemSql,

        [
          saleId,
          item.id,
          item.name,
          item.quantity,
          Number(item.selling_price) *
            item.quantity,
          item.selling_price
        ]

      );

      // Deduct Stock

      await db.query(

        `
          UPDATE products
          SET stock_quantity =
            stock_quantity - ?
          WHERE id = ?
          AND business_id = ?
        `,

        [
          item.quantity,
          item.id,
          business_id
        ]

      );

      // Inventory Movement Log

      const movementSql = `

        INSERT INTO inventory_movements (

          product_id,
          business_id,
          user_id,
          movement_type,
          quantity,
          reference_id,
          notes

        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

      `;

      await db.query(

        movementSql,

        [
          item.id,
          business_id,
          user_id,
          'SALE',
          item.quantity,
          saleId,
          `Stock deducted from sale #${saleId}`
        ]

      );

    }

    await db.commit();

    res.status(200).json({

      success: true,

      message:
        'Transaction completed successfully!',

      receipt: {

        saleId,

        invoiceNumber,

        businessName,

        totalAmount:
          total_amount,

        paymentMethod:
          payment_method,

        createdAt:
          new Date(),

        items

      }

    });

  } catch (error: any) {

    await db.rollback();

    console.error(
      '❌ Transaction Failed:',
      error.message
    );

    res.status(500).json({

      success: false,
      error: error.message

    });

  } finally {

    db.release();

  }

};

/* =========================
   SALES HISTORY
========================= */

export const getSalesHistory = async (
  req: Request,
  res: Response
) => {

  const { business_id } =
    req.query;

  try {

    const sql = `

      SELECT

        sales.id,
        sales.invoice_number,
        sales.total_amount,
        sales.payment_method,
        sales.created_at,

        users.name AS cashier_name

      FROM sales

      INNER JOIN users
        ON sales.user_id = users.id

      WHERE sales.business_id = ?

      ORDER BY sales.created_at DESC

    `;

    const [results] =
      await connection
        .promise()
        .query(

          sql,

          [business_id]

        );

    res.status(200).json(
      results
    );

  } catch (error: any) {

    console.error(
      '❌ Sales History Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   SALE DETAILS
========================= */

export const getSaleDetails = async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  try {

    const saleSql = `

      SELECT

        sales.id,
        sales.invoice_number,
        sales.total_amount,
        sales.payment_method,
        sales.created_at,

        users.name AS cashier_name,

        businesses.name AS business_name

      FROM sales

      INNER JOIN users
        ON sales.user_id = users.id

      INNER JOIN businesses
        ON sales.business_id = businesses.id

      WHERE sales.id = ?

    `;

    const [saleRows]: any =
      await connection
        .promise()
        .query(
          saleSql,
          [id]
        );

    if (
      saleRows.length === 0
    ) {

      return res.status(404).json({
        error: 'Sale not found'
      });

    }

    const itemsSql = `

      SELECT

        sale_items.quantity,
        sale_items.price_at_sale,

        products.name

      FROM sale_items

      INNER JOIN products
        ON sale_items.product_id = products.id

      WHERE sale_items.sale_id = ?

    `;

    const [itemsRows] =
      await connection
        .promise()
        .query(
          itemsSql,
          [id]
        );

    res.status(200).json({

      sale:
        saleRows[0],

      items:
        itemsRows

    });

  } catch (error: any) {

    console.error(
      '❌ Sale Details Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   DASHBOARD ANALYTICS
========================= */

export const getDashboardAnalytics = async (
  req: Request,
  res: Response
) => {

  const { business_id } =
    req.query;

  try {

    // Total Sales

    const [salesCountRows]: any =
      await connection
        .promise()
        .query(

          `
            SELECT
              COUNT(*) AS totalSales
            FROM sales
            WHERE business_id = ?
          `,

          [business_id]

        );

    // Revenue

    const [revenueRows]: any =
      await connection
        .promise()
        .query(

          `
            SELECT
              IFNULL(
                SUM(total_amount),
                0
              ) AS totalRevenue
            FROM sales
            WHERE business_id = ?
          `,

          [business_id]

        );

    // Products

    const [productsRows]: any =
      await connection
        .promise()
        .query(

          `
            SELECT
              COUNT(*) AS totalProducts
            FROM products
            WHERE business_id = ?
          `,

          [business_id]

        );

    // Low Stock

    const [lowStockRows]: any =
      await connection
        .promise()
        .query(

          `
            SELECT
              COUNT(*) AS lowStockCount
            FROM products
            WHERE business_id = ?
            AND stock_quantity <= 5
          `,

          [business_id]

        );

    // Recent Sales

    const [recentSales]: any =
      await connection
        .promise()
        .query(

          `
            SELECT

              invoice_number,
              total_amount,
              created_at

            FROM sales

            WHERE business_id = ?

            ORDER BY created_at DESC

            LIMIT 5
          `,

          [business_id]

        );

    res.status(200).json({

      totalSales:
        salesCountRows[0]
          .totalSales,

      totalRevenue:
        revenueRows[0]
          .totalRevenue,

      totalProducts:
        productsRows[0]
          .totalProducts,

      lowStockCount:
        lowStockRows[0]
          .lowStockCount,

      recentSales

    });

  } catch (error: any) {

    console.error(
      '❌ Dashboard Analytics Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   LOW STOCK
========================= */

export const getLowStockProducts = async (
  req: Request,
  res: Response
) => {

  const { business_id } =
    req.query;

  try {

    const sql = `

      SELECT

        id,
        name,
        stock_quantity,
        selling_price

      FROM products

      WHERE business_id = ?

      AND stock_quantity <= 5

      ORDER BY stock_quantity ASC

    `;

    const [results] =
      await connection
        .promise()
        .query(

          sql,

          [business_id]

        );

    res.status(200).json(
      results
    );

  } catch (error: any) {

    console.error(
      '❌ Low Stock Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   RESTOCK
========================= */

export const restockProduct = async (
  req: Request,
  res: Response
) => {

  const {

    product_id,
    quantity,
    user_id,
    business_id

  } = req.body;

  if (
    !product_id ||
    !quantity ||
    quantity <= 0
  ) {

    return res.status(400).json({
      error:
        'Invalid restock data'
    });

  }

  const db =
    await connection
      .promise()
      .getConnection();

  try {

    await db.beginTransaction();

    const [productRows]: any =
      await db.query(

        `
          SELECT *
          FROM products
          WHERE id = ?
          AND business_id = ?
        `,

        [
          product_id,
          business_id
        ]

      );

    if (
      productRows.length === 0
    ) {

      throw new Error(
        'Product not found'
      );

    }

    await db.query(

      `
        UPDATE products
        SET stock_quantity =
          stock_quantity + ?
        WHERE id = ?
        AND business_id = ?
      `,

      [
        quantity,
        product_id,
        business_id
      ]

    );

    await db.query(

      `
        INSERT INTO inventory_movements (

          product_id,
          business_id,
          user_id,
          movement_type,
          quantity,
          notes

        )

        VALUES (?, ?, ?, ?, ?, ?)
      `,

      [
        product_id,
        business_id,
        user_id,
        'RESTOCK',
        quantity,
        `Restocked ${quantity} units`
      ]

    );

    await db.commit();

    res.status(200).json({

      success: true,

      message:
        'Product restocked successfully'

    });

  } catch (error: any) {

    await db.rollback();

    console.error(
      '❌ Restock Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  } finally {

    db.release();

  }

};

/* =========================
   INVENTORY ADJUSTMENT
========================= */

export const adjustInventory = async (
  req: Request,
  res: Response
) => {

  const {

    product_id,
    adjustment_quantity,
    reason,
    user_id,
    business_id

  } = req.body;

  if (
    !product_id ||
    !adjustment_quantity ||
    !reason
  ) {

    return res.status(400).json({
      error:
        'Missing required fields'
    });

  }

  const db =
    await connection
      .promise()
      .getConnection();

  try {

    await db.beginTransaction();

    const [productRows]: any =
      await db.query(

        `
          SELECT *
          FROM products
          WHERE id = ?
          AND business_id = ?
        `,

        [
          product_id,
          business_id
        ]

      );

    if (
      productRows.length === 0
    ) {

      throw new Error(
        'Product not found'
      );

    }

    const product =
      productRows[0];

    const newStock =
      product.stock_quantity +
      adjustment_quantity;

    if (newStock < 0) {

      throw new Error(
        'Adjustment would create negative stock'
      );

    }

    await db.query(

      `
        UPDATE products
        SET stock_quantity = ?
        WHERE id = ?
        AND business_id = ?
      `,

      [
        newStock,
        product_id,
        business_id
      ]

    );

    const movementType =
      adjustment_quantity > 0
        ? 'ADJUSTMENT'
        : 'DAMAGE';

    await db.query(

      `
        INSERT INTO inventory_movements (

          product_id,
          business_id,
          user_id,
          movement_type,
          quantity,
          notes

        )

        VALUES (?, ?, ?, ?, ?, ?)
      `,

      [
        product_id,
        business_id,
        user_id,
        movementType,
        Math.abs(
          adjustment_quantity
        ),
        reason
      ]

    );

    await db.commit();

    res.status(200).json({

      success: true,

      message:
        'Inventory adjusted successfully'

    });

  } catch (error: any) {

    await db.rollback();

    console.error(
      '❌ Inventory Adjustment Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  } finally {

    db.release();

  }

};

/* =========================
   SERVICES
========================= */

export const getServices = async (
  req: Request,
  res: Response
) => {

  const { business_id } =
    req.query;

  try {

    const sql = `

      SELECT *

      FROM services

      WHERE business_id = ?

      ORDER BY created_at DESC

    `;

    const [results] =
      await connection
        .promise()
        .query(

          sql,

          [business_id]

        );

    res.status(200).json(
      results
    );

  } catch (error: any) {

    console.error(
      '❌ Services Fetch Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   CREATE SERVICE
========================= */

export const createService = async (
  req: Request,
  res: Response
) => {

  const {

    business_id,
    name,
    description,
    service_price

  } = req.body;

  if (
    !business_id ||
    !name ||
    !service_price
  ) {

    return res.status(400).json({
      error:
        'Missing required fields'
    });

  }

  try {

    const sql = `

      INSERT INTO services (

        business_id,
        name,
        description,
        service_price

      )

      VALUES (?, ?, ?, ?)

    `;

    await connection
      .promise()
      .query(

        sql,

        [
          business_id,
          name,
          description,
          service_price
        ]

      );

    res.status(201).json({

      success: true,

      message:
        'Service created successfully'

    });

  } catch (error: any) {

    console.error(
      '❌ Service Creation Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   SALES REPORT
========================= */

export const getSalesReport = async (
  req: Request,
  res: Response
) => {

  const {

    startDate,
    endDate,
    business_id

  } = req.query;

  if (
    !startDate ||
    !endDate
  ) {

    return res.status(400).json({

      error:
        'Start date and end date are required'

    });

  }

  try {

    const sql = `

      SELECT

        sales.id,
        sales.invoice_number,
        sales.total_amount,
        sales.payment_method,
        sales.created_at,

        users.name AS cashier_name

      FROM sales

      INNER JOIN users
        ON sales.user_id = users.id

      WHERE sales.business_id = ?

      AND DATE(sales.created_at)
        BETWEEN ? AND ?

      ORDER BY sales.created_at DESC

    `;

    const [rows]: any =
      await connection
        .promise()
        .query(

          sql,

          [
            business_id,
            startDate,
            endDate
          ]

        );

    const totalRevenue =
      rows.reduce(

        (
          sum: number,
          sale: any
        ) =>

          sum +
          Number(
            sale.total_amount
          ),

        0

      );

    res.status(200).json({

      totalTransactions:
        rows.length,

      totalRevenue,

      sales: rows

    });

  } catch (error: any) {

    console.error(
      '❌ Sales Report Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   PROFIT REPORT
========================= */

export const getProfitReport =
  async (req: any, res: any) => {

    try {

      const { business_id } =
        req.params;

      const [rows] =
        await connection
          .promise()
          .query(

          `
          SELECT

            si.product_id,

            COALESCE(
              si.product_name,
              p.name
            ) AS product_name,

            SUM(si.quantity)
              AS quantity_sold,

            SUM(
              si.price_at_sale
              * si.quantity
            ) AS revenue,

            SUM(
              p.cost_price
              * si.quantity
            ) AS cost,

            SUM(
              (
                si.price_at_sale
                - p.cost_price
              )
              * si.quantity
            ) AS profit

          FROM sale_items si

          LEFT JOIN products p
            ON si.product_id = p.id

          LEFT JOIN sales s
            ON si.sale_id = s.id

          WHERE
            s.business_id = ?

          GROUP BY
            si.product_id

          ORDER BY
            quantity_sold DESC
          `,

          [business_id]

        );

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        error:
          'Failed to fetch profit report.'

      });

    }

  };