import { Request, Response } from 'express';
import connection from '../dbConnection';

/* =========================
   GET ALL PATCH NOTES
========================= */

export const getPatchNotes = async (
  req: Request,
  res: Response
) => {

  try {

    const [rows]: any =
      await connection
        .promise()
        .query(
          `
          SELECT *
          FROM patch_notes
          ORDER BY created_at DESC
          `
        );

    res.status(200).json(
      rows
    );

  } catch (error: any) {

    console.error(
      '❌ Patch Notes Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   GET LATEST PATCH NOTE
========================= */

export const getLatestPatchNote = async (
  req: Request,
  res: Response
) => {

  try {

    const [rows]: any =
      await connection
        .promise()
        .query(
          `
          SELECT *
          FROM patch_notes
          ORDER BY created_at DESC
          LIMIT 1
          `
        );

    if (
      rows.length === 0
    ) {

      return res.status(404).json({
        error:
          'No patch notes found'
      });

    }

    res.status(200).json(
      rows[0]
    );

  } catch (error: any) {

    console.error(
      '❌ Latest Patch Note Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   CREATE PATCH NOTE
========================= */

export const createPatchNote = async (
  req: Request,
  res: Response
) => {

  const {
    title,
    version,
    content,
    created_by
  } = req.body;

  if (
    !title ||
    !version ||
    !content ||
    !created_by
  ) {

    return res.status(400).json({
      error:
        'Missing required fields'
    });

  }

  try {

    const sql = `

      INSERT INTO patch_notes (

        title,
        version,
        content,
        created_by

      )

      VALUES (?, ?, ?, ?)

    `;

    const [result]: any =
      await connection
        .promise()
        .query(

          sql,

          [
            title,
            version,
            content,
            created_by
          ]

        );

    res.status(201).json({

      success: true,

      id:
        result.insertId,

      message:
        'Patch note created successfully'

    });

  } catch (error: any) {

    console.error(
      '❌ Patch Note Creation Error:',
      error.message
    );

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   EDIT PATCH NOTE
========================= */

export const updatePatchNote = async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  const {
    version,
    title,
    content
  } = req.body;

  try {

    await connection
      .promise()
      .query(

        `
        UPDATE patch_notes
        SET
          version = ?,
          title = ?,
          content = ?
        WHERE id = ?
        `,

        [
          version,
          title,
          content,
          id
        ]

      );

    res.status(200).json({

      success: true,
      message: 'Patch note updated successfully'

    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

};

/* =========================
   DELETE PATCH NOTE
========================= */

export const deletePatchNote = async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  try {

    await connection
      .promise()
      .query(

        `
        DELETE FROM patch_notes
        WHERE id = ?
        `,

        [id]

      );

    res.status(200).json({

      success: true,
      message: 'Patch note deleted successfully'

    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

};