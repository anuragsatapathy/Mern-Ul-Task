const express = require("express");
const router = express.Router();

const educationController = require("./education.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Education
 *   description: Education APIs
 */

/**
 * @swagger
 * /education:
 *   post:
 *     summary: Add education
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - degree
 *               - institution
 *             properties:
 *               degree:
 *                 type: string
 *                 example: B.Tech 
 *               branch:
 *                 type: string
 *                 example: CSE
 *               university:
 *                 type: string
 *                 example: ABC University
 *               institution:
 *                 type: string
 *                 example: XYZ University
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *               cgpa:
 *                 type: string
 *                 example: 8.4
 *     responses:
 *       201:
 *         description: Education added successfully
 */
router.post("/", universalAuth, educationController.addEducation);

/**
 * @swagger
 * /education:
 *   get:
 *     summary: Get all education records
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Education records fetched successfully
 */
router.get("/", universalAuth, educationController.getEducation);

/**
 * @swagger
 * /education/{id}:
 *   put:
 *     summary: Update education
 *     tags: [Education]
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
 *               degree:
 *                 type: string
 *                 example: M.Tech 
 *               institution:
 *                 type: string
 *                 example: ABC Institute
 *               university:
 *                 type: string
 *                 example: ABC University
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *               cgpa:
 *                 type: string
 *                 example: 9.0
 *     responses:
 *       200:
 *         description: Education updated successfully
 */
router.put("/:id", universalAuth, educationController.updateEducation);

/**
 * @swagger
 * /education/{id}:
 *   delete:
 *     summary: Delete education
 *     tags: [Education]
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
 *         description: Education deleted successfully
 */
router.delete("/:id", universalAuth, educationController.deleteEducation);

module.exports = router;
