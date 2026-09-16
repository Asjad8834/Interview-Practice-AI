import api from "../../../services/api";

/**
 * @description Service to generate interview report based on user's self description,
 * resume and job description.
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData);

    return response.data;
  } catch (error) {
    console.error(
      "Error generating interview report:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * @description Service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(
      `/api/interview/report/${interviewId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching interview report:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * @description Service to get all interview reports of logged-in user
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/reports");

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching interview reports:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * @description Service to generate resume PDF based on interview report
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      null,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating resume PDF:",
      error.response?.data || error.message
    );
    throw error;
  }
};