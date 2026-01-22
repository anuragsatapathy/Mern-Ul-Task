/**
 * @swagger
 * tags:
 *   name: WorkspaceMember
 *   description: Workspace member management
 */

/**
 * @swagger
 * /workspace-members/add:
 *   post:
 *     tags: [WorkspaceMember]
 *     summary: Add workspace member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [workspaceId, userId, role]
 *             properties:
 *               workspaceId:
 *                 type: string
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Member added
 */

/**
 * @swagger
 * /workspace-members/role:
 *   put:
 *     tags: [WorkspaceMember]
 *     summary: Update member role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [workspaceId, userId, role]
 *             properties:
 *               workspaceId:
 *                 type: string
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated
 */

/**
 * @swagger
 * /workspace-members/remove:
 *   delete:
 *     tags: [WorkspaceMember]
 *     summary: Remove workspace member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [workspaceId, userId]
 *             properties:
 *               workspaceId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
