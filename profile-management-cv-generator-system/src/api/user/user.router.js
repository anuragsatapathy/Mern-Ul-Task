const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Anurag
 *               email:
 *                 type: string
 *                 example: anurag@gmail.com
 *               password:
 *                 type: string
 *                 example: Anurag@1
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@1
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched
 */
router.get("/me", jwtValidation, userController.getMe);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: old123
 *               newPassword:
 *                 type: string
 *                 example: new123
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", jwtValidation, userController.resetPassword);

module.exports = router;
