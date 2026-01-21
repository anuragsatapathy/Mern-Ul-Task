/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Dashboard analytics
 */

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Get dashboard analytics
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         required: true
 *     responses:
 *       200:
 *         description: Analytics data
 */
