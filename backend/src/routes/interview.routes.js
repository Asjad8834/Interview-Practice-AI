const express = require("express");

const interviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const interviewController = require("../controllers/interview.controller");

const upload = require("../middlewares/file.middleware");

/**
 * @route POST /api/interview/
 * @description generate new interview report on the users self description, resume and job description
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController );


/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController );


/**
 * @route GET /api/interview/reports
 * @description get all interview reports for the authenticated user
 * @access private
 */

interviewRouter.get("/reports", authMiddleware.authUser, interviewController.getAllInterviewReportsController );


/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf based on user self description, resume content and job description.
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController );


module.exports = interviewRouter;