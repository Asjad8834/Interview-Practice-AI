const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");


async function generateInterviewReportController(req, res) {
  try {
    // 1. Make sure a resume was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    // 2. Extract text from PDF
    const resumeContent = await (
      new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer)
      )
    ).getText();

    // 3. Get form-data fields
    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // 4. Generate report using AI
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    console.log("AI REPORT BEFORE MONGODB:");
    console.dir(interviewReportByAi, { depth: null });

    // 5. Save report to MongoDB
    const interviewReport = await interviewReportModel.create({

  user: req.user.id,

  resume: resumeContent.text,

  selfDescription: selfDescription || "",

  jobDescription,

  title: interviewReportByAi.title,

  matchScore: interviewReportByAi.matchScore,

  technicalQuestions: interviewReportByAi.technicalQuestions,

  behavioralQuestions: interviewReportByAi.behavioralQuestions,

  skillGaps: interviewReportByAi.skillGaps,

  preparationPlan: interviewReportByAi.preparationPlan,

});

    // 6. Return response
    return res.status(201).json({
      message: "Interview Report Generated Successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("INTERVIEW REPORT ERROR:");
    console.error(error);

    return res.status(500).json({
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}


async function getInterviewReportByIdController(req, res){
  try{

    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      interviewReport,
    });

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}


async function getAllInterviewReportsController(req, res){
  try{
    const interviewReports = await interviewReportModel.find({
      user: req.user.id
    }).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    return res.status(200).json({
      success: true,
      interviewReports,
    });

  } catch(error){
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}


/**
 * @description Controller to generate resume pdf based on user self description, resume content and job description.
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @access private
 */

async function generateResumePdfController(req, res) {
  try{

    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewReportId}.pdf`);
    
    res.send(pdfBuffer);

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}



module.exports = {
  generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController
};