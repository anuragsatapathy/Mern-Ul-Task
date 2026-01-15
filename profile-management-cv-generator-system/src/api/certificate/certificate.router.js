const express = require("express");
const router = express.Router();

const certificateController = require("./certificate.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Certificate management APIs
 */

/**
 * @swagger
 * /certificates:
 *   post:
 *     summary: Create a certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Java Certification
 *               description:
 *                 type: string
 *                 example: Completed Java course from Udemy
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *               validTill:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *     responses:
 *       201:
 *         description: Certificate created
 */
router.post("/", universalAuth, certificateController.createCertificate);

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificates fetched successfully
 */
router.get("/", universalAuth, certificateController.getCertificates);

/**
 * @swagger
 * /certificates/{id}:
 *   get:
 *     summary: Get certificate by ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate fetched successfully
 *       404:
 *         description: Certificate not found
 */
router.get("/:id", universalAuth, certificateController.getCertificateById);

/**
 * @swagger
 * /certificates/{id}:
 *   put:
 *     summary: Update certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Java Certification
 *               description:
 *                 type: string
 *                 example: Updated course details
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *               validTill:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 */
router.put("/:id", universalAuth, certificateController.updateCertificate);

/**
 * @swagger
 * /certificates/{id}:
 *   delete:
 *     summary: Delete certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 */
router.delete("/:id", universalAuth, certificateController.deleteCertificate);

module.exports = router;
