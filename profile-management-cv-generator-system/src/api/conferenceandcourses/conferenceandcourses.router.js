const express = require("express");
const router = express.Router();

const controller = require("./conferenceandcourses.controller");
const universalAuth = require("../../middlewares/universalAuth");

/**
 * @swagger
 * tags:
 *   name: Conferences & Courses
 *   description: Conference and course APIs
 */

/**
 * @swagger
 * /conference-and-courses:
 *   post:
 *     summary: Create a conference or course
 *     tags: [Conferences & Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: React Conference 2025   
 *               description:
 *                 type: string
 *                 example: Attended a React developer conference
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *     responses:
 *       201:
 *         description: Conference/Course created successfully
 */
router.post("/", universalAuth, controller.createConferenceAndCourse);

/**
 * @swagger
 * /conference-and-courses:
 *   get:
 *     summary: Get all conferences and courses
 *     tags: [Conferences & Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List fetched successfully
 */
router.get("/", universalAuth, controller.getConferenceAndCourses);

/**
 * @swagger
 * /conference-and-courses/{id}:
 *   get:
 *     summary: Get conference/course by ID
 *     tags: [Conferences & Courses]
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
 *         description: Record fetched successfully
 *       404:
 *         description: Record not found
 */
router.get("/:id", universalAuth, controller.getConferenceAndCourseById);

/**
 * @swagger
 * /conference-and-courses/{id}:
 *   put:
 *     summary: Update conference/course
 *     tags: [Conferences & Courses]
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
 *               title:
 *                 type: string
 *                 example: Advanced React Workshop
 *               description:
 *                 type: string
 *                 example: Updated details of the course
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-04-01
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.put("/:id", universalAuth, controller.updateConferenceAndCourse);

/**
 * @swagger
 * /conference-and-courses/{id}:
 *   delete:
 *     summary: Delete conference/course
 *     tags: [Conferences & Courses]
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
 *         description: Record deleted successfully
 */
router.delete("/:id", universalAuth, controller.deleteConferenceAndCourse);

module.exports = router;
