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
    setLoading(true)

    let pdfWindow = null

    try {
        // Detect iOS devices
        const isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (
                navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1
            )

        // Open the window immediately on iOS.
        // This avoids Safari's popup blocker because this happens
        // directly as a result of the user's click.
        if (isIOS) {
            pdfWindow = window.open("", "_blank")
        }

        const response = await generateResumePdf({
            interviewReportId
        })

        const blob = new Blob([response], {
            type: "application/pdf"
        })

        const url = window.URL.createObjectURL(blob)

        if (isIOS) {
            // Open the generated PDF in the already-opened tab
            if (pdfWindow) {
                pdfWindow.location.href = url
            } else {
                // Fallback if Safari blocked the new tab
                window.location.href = url
            }
        } else {
            // Desktop: download normally
            const link = document.createElement("a")

            link.href = url
            link.setAttribute(
                "download",
                `resume_${interviewReportId}.pdf`
            )

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Give the browser time to start the download
            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 1000)
        }

    } catch (error) {
        console.log("Error downloading resume PDF:", error)

        if (pdfWindow && !pdfWindow.closed) {
            pdfWindow.close()
        }
    } finally {
        setLoading(false)
    }
}

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}