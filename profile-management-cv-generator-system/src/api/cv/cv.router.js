const express = require("express");
const router = express.Router();

const cvController = require("./cv.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: CV preview and generation
 */

/**
 * @swagger
 * /cv/preview:
 *   get:
 *     summary: Preview CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CV preview generated successfully
 */
router.get("/preview", universalAuth, cvController.previewCV);

/**
 * @swagger
 * /cv/generate:
 *   get:
 *     summary: Generate CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CV generated successfully
 */
router.get("/generate", universalAuth, cvController.generateCV);

module.exports = router;
