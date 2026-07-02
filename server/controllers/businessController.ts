import { Request, Response } from 'express';
import connection from '../dbConnection';

import logActivity from '../utils/logActivity';

export const getBusinessById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const [rows]: any =
      await connection
        .promise()
        .query(
          `
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
          `,
          [id]
        );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Business not found'
      });
    }

    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updateBusiness = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const {
    name,
    address,
    contact_number,
    email,
    tin_number,
    tax_type,
    receipt_footer,
    user_id
  } = req.body;

  try {
    const [oldRows]: any =
      await connection
        .promise()
        .query(
          `
          SELECT
            name
          FROM businesses
          WHERE id = ?
          `,
          [id]
        );

    if (oldRows.length === 0) {
      return res.status(404).json({
        error: 'Business not found'
      });
    }

    await connection
      .promise()
      .query(
        `
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
        `,
        [
          name,
          address,
          contact_number,
          email,
          tin_number,
          tax_type,
          receipt_footer,
          id
        ]
      );

    await logActivity({
      user_id,
      business_id: Number(id),
      module: 'Business',
      action: 'UPDATE_BUSINESS',
      description:
        `Updated business information for "${oldRows[0].name}" to "${name}"`
    });

    res.json({
      success: true,
      message: 'Business information updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message
    });
  }
};