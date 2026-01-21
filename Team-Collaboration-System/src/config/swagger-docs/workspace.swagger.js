/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: Workspace management
 */

/**
 * @swagger
 * /workspaces:
 *   post:
 *     tags: [Workspace]
 *     summary: Create workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workspace created
 *
 *   get:
 *     tags: [Workspace]
 *     summary: Get user workspaces
 *     responses:
 *       200:
 *         description: Workspace list
 */

/**
 * @swagger
 * /workspaces/{id}:
 *   get:
 *     tags: [Workspace]
 *     summary: Get workspace by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace details
 *
 *   put:
 *     tags: [Workspace]
 *     summary: Update workspace
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace updated
 *
 *   delete:
 *     tags: [Workspace]
 *     summary: Delete workspace
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace deleted
 */
