const express = require("express");
const router = express.Router();
const multer = require("multer");

const profileController = require("./profile.controller");
const universalAuth = require("../../middlewares/universalAuth");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile APIs
 */

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Anurag Satapathy
 *               email:
 *                 type: string
 *                 example: anurag@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               address:
 *                 type: string
 *                 example: Bhubaneswar, Odisha
 *               linkedinId:
 *                 type: string
 *                 example: https://linkedin.com/in/anurag
 *               xId:
 *                 type: string
 *                 example: https://x.com/anurag
 *               summary:
 *                 type: string
 *                 example: Passionate full stack developer
 *               headline:
 *                 type: string
 *                 example: MERN Stack Developer
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               strengths:
 *                 type: string
 *                 description: JSON string of strengths array
 *                 example: '[{"title":"Leadership","description":"Led a team"}]'
 *               languages:
 *                 type: string
 *                 description: JSON string of languages array
 *                 example: '[{"name":"English","level":"Advanced","rating":5}]'
 *               selectedTemplate:
 *                 type: string
 *                 example: template1
 *     responses:
 *       200:
 *         description: Profile saved successfully
 */
router.post(
  "/",
  universalAuth,
  upload.single("profileImage"),
  profileController.saveProfile
);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 */
router.get("/", universalAuth, profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete("/", universalAuth, profileController.deleteProfile);

module.exports = router;
