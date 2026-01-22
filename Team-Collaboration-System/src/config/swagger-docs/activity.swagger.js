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
 *         description: List of user activities
 *       401:
 *         description: Unauthorized
 */
