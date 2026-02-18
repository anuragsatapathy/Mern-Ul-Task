/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: Activity logs
 */

/**
 * @swagger
 * /activities:
 *   get:
 *     tags: [Activity]
 *     summary: Get user activities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user activities retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
