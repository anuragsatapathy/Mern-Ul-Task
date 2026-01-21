/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Task]
 *     summary: Create task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [title, projectId, assignedTo]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task created
 *
 *   get:
 *     tags: [Task]
 *     summary: Get tasks
 *     responses:
 *       200:
 *         description: Task list
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Task]
 *     summary: Get task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *
 *   put:
 *     tags: [Task]
 *     summary: Update task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated
 *
 *   delete:
 *     tags: [Task]
 *     summary: Delete task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
