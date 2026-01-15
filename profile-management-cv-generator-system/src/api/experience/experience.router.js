const express = require("express");
const router = express.Router();

const experienceController = require("./experience.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Experience
 *   description: Experience APIs
 */

/**
 * @swagger
 * /experience:
 *   post:
 *     summary: Add experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - location
 *               - role
 *               - description
 *               - fromDate
 *             properties:
 *               company:
 *                 type: string
 *                 example: Google
 *               location:
 *                 type: string
 *                 example: Bangalore
 *               role:
 *                 type: string
 *                 example: Software Engineer
 *               description:
 *                 type: string
 *                 example: Worked on backend services
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               currentlyWorking:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Experience added successfully
 */
router.post("/", universalAuth, experienceController.addExperience);

/**
 * @swagger
 * /experience:
 *   get:
 *     summary: Get all experience records
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Experience fetched successfully
 */
router.get("/", universalAuth, experienceController.getExperience);

/**
 * @swagger
 * /experience/{id}:
 *   put:
 *     summary: Update experience
 *     tags: [Experience]
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
 *               company:
 *                 type: string
 *                 example: Microsoft
 *               location:
 *                 type: string
 *                 example: Hyderabad
 *               role:
 *                 type: string
 *                 example: Senior Developer
 *               description:
 *                 type: string
 *                 example: Leading backend team
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: 2022-06-01
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-01
 *               currentlyWorking:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Experience updated successfully
 */
router.put("/:id", universalAuth, experienceController.updateExperience);

/**
 * @swagger
 * /experience/{id}:
 *   delete:
 *     summary: Delete experience
 *     tags: [Experience]
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
 *         description: Experience deleted successfully
 */
router.delete("/:id", universalAuth, experienceController.deleteExperience);

module.exports = router;


