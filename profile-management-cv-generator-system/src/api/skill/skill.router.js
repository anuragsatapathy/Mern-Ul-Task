const express = require("express");
const router = express.Router();

const skillController = require("./skill.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill APIs
 */

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Add a new skill
 *     tags: [Skills]
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
 *               - name
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *                 example: Programming Language
 *               name:
 *                 type: string
 *                 example: JavaScript
 *               level:
 *                 type: string
 *                 example: Advanced
 *     responses:
 *       201:
 *         description: Skill added successfully
 */
router.post("/", universalAuth, skillController.addSkill);

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skills fetched successfully
 */
router.get("/", universalAuth, skillController.getSkill);

/**
 * @swagger
 * /skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
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
 *                 example: Framework
 *               name:
 *                 type: string
 *                 example: React
 *               level:
 *                 type: string
 *                 example: Intermediate
 *     responses:
 *       200:
 *         description: Skill updated successfully
 */
router.put("/:id", universalAuth, skillController.updateSkill);

/**
 * @swagger
 * /skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skills]
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
 *         description: Skill deleted successfully
 */
router.delete("/:id", universalAuth, skillController.deleteSkill);

module.exports = router;
