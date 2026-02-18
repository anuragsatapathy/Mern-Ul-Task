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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
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
 *     security:
 *       - bearerAuth: []
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
 *         description: Workspace details
 *
 *   put:
 *     tags: [Workspace]
 *     summary: Update workspace
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workspace updated
 *
 *   delete:
 *     tags: [Workspace]
 *     summary: Delete workspace
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
 *         description: Workspace deleted
 */

/**
 * @swagger
 * /workspaces/members/by-project/{projectId}:
 *   get:
 *     tags: [Workspace]
 *     summary: Get members by project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project members list
 */

/**
 * @swagger
 * /workspaces/{id}/invite:
 *   post:
 *     tags: [Workspace]
 *     summary: Send workspace invite (OWNER / ADMIN)
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
 *         description: Invite sent successfully
 */
