/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     tags: [Project]
 *     summary: Create project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [name, workspaceId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project created
 *
 *   get:
 *     tags: [Project]
 *     summary: Get projects
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project list
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *
 *   put:
 *     tags: [Project]
 *     summary: Update project
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 *
 *   delete:
 *     tags: [Project]
 *     summary: Delete project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */
