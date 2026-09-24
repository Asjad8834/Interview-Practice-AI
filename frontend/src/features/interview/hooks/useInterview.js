import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
    setLoading(true);

    try {
        // Generate the PDF first
        const response = await generateResumePdf({
            interviewReportId,
        });

        // Convert response to PDF Blob
        const blob = new Blob([response], {
            type: "application/pdf",
        });

        // Create a temporary URL for the PDF
        const url = window.URL.createObjectURL(blob);

        // Try to open the PDF in a new tab
        const pdfWindow = window.open(url, "_blank");

        if (!pdfWindow) {
            // Popup was blocked.
            // Open the PDF in the current tab instead.
            window.location.href = url;
        }

        // Keep the URL alive while the browser loads the PDF
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 60000);

    } catch (error) {
        console.error("Error downloading resume PDF:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}