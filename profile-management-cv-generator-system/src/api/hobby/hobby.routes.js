const express = require("express");
const router = express.Router();

const hobbyController = require("./hobby.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Hobby
 *   description: Hobby APIs
 */

/**
 * @swagger
 * /hobbies:
 *   post:
 *     summary: Add hobby
 *     tags: [Hobby]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Playing Cricket
 *     responses:
 *       201:
 *         description: Hobby added successfully
 */
router.post("/", universalAuth, hobbyController.addHobby);

/**
 * @swagger
 * /hobbies:
 *   get:
 *     summary: Get all hobbies
 *     tags: [Hobby]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hobbies fetched successfully
 */
router.get("/", universalAuth, hobbyController.getHobbies);

/**
 * @swagger
 * /hobbies/{id}:
 *   put:
 *     summary: Update hobby
 *     tags: [Hobby]
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
 *                 example: Reading Books
 *     responses:
 *       200:
 *         description: Hobby updated successfully
 */
router.put("/:id", universalAuth, hobbyController.updateHobby);

/**
 * @swagger
 * /hobbies/{id}:
 *   delete:
 *     summary: Delete hobby
 *     tags: [Hobby]
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
 *         description: Hobby deleted successfully
 */
router.delete("/:id", universalAuth, hobbyController.deleteHobby);

module.exports = router;
