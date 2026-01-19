const express = require("express");
const router = express.Router();

const referenceController = require("./reference.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Reference
 *   description: Reference APIs
 */

/**
 * @swagger
 * /references:
 *   post:
 *     summary: Add reference
 *     tags: [Reference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - designation
 *               - organization
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               designation:
 *                 type: string
 *                 example: Engineering Manager
 *               organization:
 *                 type: string
 *                 example: Google
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               email:
 *                 type: string
 *                 example: john.doe@gmail.com
 *     responses:
 *       201:
 *         description: Reference added successfully
 */
router.post("/", universalAuth, referenceController.addReference);

/**
 * @swagger
 * /references:
 *   get:
 *     summary: Get all references
 *     tags: [Reference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: References fetched successfully
 */
router.get("/", universalAuth, referenceController.getReferences);

/**
 * @swagger
 * /references/{id}:
 *   put:
 *     summary: Update reference
 *     tags: [Reference]
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
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               designation:
 *                 type: string
 *                 example: Tech Lead
 *               organization:
 *                 type: string
 *                 example: Microsoft
 *               phone:
 *                 type: string
 *                 example: 9123456789
 *               email:
 *                 type: string
 *                 example: jane.smith@gmail.com
 *     responses:
 *       200:
 *         description: Reference updated successfully
 */
router.put("/:id", universalAuth, referenceController.updateReference);

/**
 * @swagger
 * /references/{id}:
 *   delete:
 *     summary: Delete reference
 *     tags: [Reference]
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
 *         description: Reference deleted successfully
 */
router.delete("/:id", universalAuth, referenceController.deleteReference);

module.exports = router;
