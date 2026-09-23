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

    // Open the new window immediately from the user's click.
    // This is important for iOS Safari because opening it after
    // the async API call can be blocked.
    const pdfWindow = window.open("", "_blank");

    try {
        const response = await generateResumePdf({
            interviewReportId
        });

        const blob = new Blob([response], {
            type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);

        if (pdfWindow) {
            pdfWindow.location.href = url;
        } else {
            // Fallback if Safari blocked the new window
            const link = document.createElement("a");
            link.href = url;
            link.download = `resume_${interviewReportId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Give Safari time to load the PDF before releasing the Blob URL.
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 60000);

    } catch (error) {
        console.log("Error downloading resume PDF:", error);

        // If generation fails, close the blank tab we opened.
        if (pdfWindow && !pdfWindow.closed) {
            pdfWindow.close();
        }
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