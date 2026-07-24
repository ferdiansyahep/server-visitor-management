const express = require("express");
const router = express.Router();
const visitorController = require('../controllers/visitor.controller');

/**
 * @swagger
 * /visitors:
 *   get:
 *     summary: Mengambil semua data visitor
 *     tags:
 *       - Visitor
 *     responses:
 *       200:
 *         description: Berhasil mengambil data visitor
 */
router.get("/visitors", visitorController.getAll);

/**
 * @swagger
 * /visitors:
 *   post:
 *     summary: Menambahkan visitor baru
 *     tags:
 *       - Visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               nik:
 *                 type: string
 *               tujuan:
 *                 type: string
 *               fotoUrl:
 *                 type: string
 *               waktuMasuk:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Visitor berhasil ditambahkan
 */
router.post("/visitors", visitorController.create);

/**
 * @swagger
 * /visitors/{id}:
 *   get:
 *     summary: Mengambil visitor berdasarkan ID
 *     tags:
 *       - Visitor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data visitor ditemukan
 *       404:
 *         description: Visitor tidak ditemukan
 */
router.get("/visitors/:id", visitorController.getById);

/**
 * @swagger
 * /visitors/{id}:
 *   delete:
 *     summary: Menghapus visitor
 *     tags:
 *       - Visitor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Visitor berhasil dihapus
 */
router.delete("/visitors/:id", visitorController.delete);

/**
 * @swagger
 * /ai-summary:
 *   get:
 *     summary: Generate AI Summary
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: Ringkasan AI berhasil dibuat
 */
router.get("/ai-summary", visitorController.getAiSummary);

/**
 * @swagger
 * /stream:
 *   get:
 *     summary: Server Sent Events
 *     tags:
 *       - Realtime
 *     responses:
 *       200:
 *         description: Stream realtime visitor
 */
router.get("/stream", visitorController.subscribeStream);

module.exports = router;