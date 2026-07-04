"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatchNote = exports.updatePatchNote = exports.createPatchNote = exports.getLatestPatchNote = exports.getPatchNotes = void 0;
const dbConnection_1 = __importDefault(require("../dbConnection"));
/* =========================
   GET ALL PATCH NOTES
========================= */
const getPatchNotes = async (req, res) => {
    try {
        const [rows] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT *
          FROM patch_notes
          ORDER BY created_at DESC
          `);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('❌ Patch Notes Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getPatchNotes = getPatchNotes;
/* =========================
   GET LATEST PATCH NOTE
========================= */
const getLatestPatchNote = async (req, res) => {
    try {
        const [rows] = await dbConnection_1.default
            .promise()
            .query(`
          SELECT *
          FROM patch_notes
          ORDER BY created_at DESC
          LIMIT 1
          `);
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'No patch notes found'
            });
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error('❌ Latest Patch Note Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getLatestPatchNote = getLatestPatchNote;
/* =========================
   CREATE PATCH NOTE
========================= */
const createPatchNote = async (req, res) => {
    const { title, version, content, created_by } = req.body;
    if (!title ||
        !version ||
        !content ||
        !created_by) {
        return res.status(400).json({
            error: 'Missing required fields'
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
        const [result] = await dbConnection_1.default
            .promise()
            .query(sql, [
            title,
            version,
            content,
            created_by
        ]);
        res.status(201).json({
            success: true,
            id: result.insertId,
            message: 'Patch note created successfully'
        });
    }
    catch (error) {
        console.error('❌ Patch Note Creation Error:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.createPatchNote = createPatchNote;
/* =========================
   EDIT PATCH NOTE
========================= */
const updatePatchNote = async (req, res) => {
    const { id } = req.params;
    const { version, title, content } = req.body;
    try {
        await dbConnection_1.default
            .promise()
            .query(`
        UPDATE patch_notes
        SET
          version = ?,
          title = ?,
          content = ?
        WHERE id = ?
        `, [
            version,
            title,
            content,
            id
        ]);
        res.status(200).json({
            success: true,
            message: 'Patch note updated successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.updatePatchNote = updatePatchNote;
/* =========================
   DELETE PATCH NOTE
========================= */
const deletePatchNote = async (req, res) => {
    const { id } = req.params;
    try {
        await dbConnection_1.default
            .promise()
            .query(`
        DELETE FROM patch_notes
        WHERE id = ?
        `, [id]);
        res.status(200).json({
            success: true,
            message: 'Patch note deleted successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.deletePatchNote = deletePatchNote;
