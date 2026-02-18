/**
 * @swagger
 * tags:
 *   name: WorkspaceMember
 *   description: Workspace member management
 */

/**
 * @swagger
 * /workspace-members/{workspaceId}/add:
 *   post:
 *     tags: [WorkspaceMember]
 *     summary: Add workspace member (OWNER / ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Member added successfully
 */

/**
 * @swagger
 * /workspace-members/{workspaceId}/role:
 *   put:
 *     tags: [WorkspaceMember]
 *     summary: Update member role (OWNER only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated successfully
 */

/**
 * @swagger
 * /workspace-members/{workspaceId}/remove:
 *   delete:
 *     tags: [WorkspaceMember]
 *     summary: Remove workspace member (OWNER / ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 */
