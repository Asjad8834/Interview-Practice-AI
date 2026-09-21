const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


/*
const interviewReportSchema = z.object({

  matchScore: z
    .number()
    .min(0)
    .max(100),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),

        intention: z.string(),

        answer: z.string(),
      })
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),

        intention: z.string(),

        answer: z.string(),
      })
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string(),

        severity: z.enum(["low", "medium", "high"]),
      })
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number(),

        focus: z.string(),

        tasks: z.array(z.string()),
      })
    ),

});


async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription
}) {

  if (!resume || !jobDescription) {
    throw new Error("resume and jobDescription are required");
  }


  const prompt = `
You are an expert technical interviewer, hiring manager, and career coach.

Your task is to perform a DEEP and DETAILED analysis of a candidate against
a specific job description.

Do NOT provide a short or generic report.

Analyze the candidate's actual resume and self-description carefully.

Every recommendation should be connected to information found in the
candidate's profile or requirements in the job description.

==================================================
CANDIDATE RESUME
==================================================

${resume}

==================================================
CANDIDATE SELF DESCRIPTION
==================================================

${selfDescription || "N/A"}

==================================================
JOB DESCRIPTION
==================================================

${jobDescription}

==================================================
REQUIREMENTS
==================================================

1. MATCH SCORE

Calculate a realistic match score from 0-100.

Consider:

- Required skills
- Preferred skills
- Years of experience
- Technology overlap
- Project relevance
- Missing skills
- Depth of experience


2. TECHNICAL INTERVIEW

Generate 8-12 realistic technical interview questions.

Questions must be specifically tailored to:

- The candidate's resume
- Technologies on the resume
- The job description
- Expected responsibilities

For EVERY question provide ONLY:

- question
- intention
- answer

The answer should be detailed and interview-ready.

Include when relevant:

- Real-world examples
- Architecture decisions
- Tradeoffs
- Performance
- Scalability
- Failure scenarios
- Security


3. BEHAVIORAL INTERVIEW

Generate 6-8 behavioral/situational questions.

Use the candidate's actual experience wherever possible.

For EVERY question provide ONLY:

- question
- intention
- answer

Use STAR where appropriate.


4. SKILL GAPS

Identify 5-8 genuine skill gaps.

Do not invent weaknesses.

For EVERY skill gap provide ONLY:

- skill
- severity

Severity must be exactly one of:

- low
- medium
- high


5. PREPARATION PLAN

Create a detailed 14-day preparation plan.

Customize it to this candidate.

Cover relevant areas such as:

- DSA
- Backend development
- Node.js
- Databases
- SQL
- MongoDB
- REST APIs
- Authentication
- System design
- Behavioral preparation
- Resume questions
- Mock interviews

For EVERY day provide ONLY:

- day
- focus
- tasks

Every day must contain multiple concrete tasks.


IMPORTANT:

Return ONLY the fields defined by the provided response schema.

DO NOT create any additional fields.

The allowed fields are exactly:

matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan

Do not return:

candidateSummary
strengths
keyPoints
followUpQuestions
explanation
howToImprove
expectedOutcome
finalRecommendation
or any other fields.
`;


  const response = await ai.models.generateContent({

    model: "gemini-3.5-flash-lite",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema:
        zodToJsonSchema(interviewReportSchema),

      maxOutputTokens: 8000,
    }

  });


  const report = JSON.parse(response.text);

  console.log("Interview Report Generated:", report);

  return report;
}

*/

const interviewReportSchema = z.object({
  title: z.string(),

  matchScore: z.number().min(0).max(100),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});


/*
|--------------------------------------------------------------------------
| GEMINI JSON SCHEMA
|--------------------------------------------------------------------------
| IMPORTANT:
| We are NOT using zodToJsonSchema here.
| We give Gemini the exact structure we want.
|--------------------------------------------------------------------------
*/

const interviewReportJsonSchema = {
  type: "object",

  properties: {

    title: {
      type: "string",
      description:
        "The exact job title from the job description. For example: Backend Engineer."
    },

    matchScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "A realistic percentage score representing how well the candidate matches the job."
    },

    technicalQuestions: {
      type: "array",
      description:
        "Technical interview questions specifically tailored to the candidate and job description.",

      items: {
        type: "object",

        properties: {

          question: {
            type: "string",
            description:
              "A realistic technical interview question."
          },

          intention: {
            type: "string",
            description:
              "What the interviewer is trying to evaluate."
          },

          answer: {
            type: "string",
            description:
              "A detailed interview-ready answer. Include relevant technical concepts, examples, tradeoffs, and reasoning."
          }

        },

        required: [
          "question",
          "intention",
          "answer"
        ]
      }
    },


    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral and situational interview questions tailored to the candidate.",

      items: {
        type: "object",

        properties: {

          question: {
            type: "string",
            description:
              "A behavioral or situational interview question."
          },

          intention: {
            type: "string",
            description:
              "What the interviewer is trying to evaluate."
          },

          answer: {
            type: "string",
            description:
              "An interview-ready answer based on the candidate's actual experience. Use STAR where appropriate."
          }

        },

        required: [
          "question",
          "intention",
          "answer"
        ]
      }
    },


    skillGaps: {
      type: "array",
      description:
        "Important genuine skills that are missing or insufficiently demonstrated for the job.",

      items: {
        type: "object",

        properties: {

          skill: {
            type: "string",
            description:
              "The missing or weak skill."
          },

          severity: {
            type: "string",
            enum: [
              "low",
              "medium",
              "high"
            ],
            description:
              "How important the skill gap is for the target role."
          }

        },

        required: [
          "skill",
          "severity"
        ]
      }
    },


    preparationPlan: {
      type: "array",
      description:
        "A customized 14-day interview preparation plan.",

      items: {
        type: "object",

        properties: {

          day: {
            type: "integer",
            description:
              "Preparation day number from 1 to 14."
          },

          focus: {
            type: "string",
            description:
              "The primary focus for that day."
          },

          tasks: {
            type: "array",
            description:
              "Concrete tasks to complete that day.",
            items: {
              type: "string"
            }
          }

        },

        required: [
          "day",
          "focus",
          "tasks"
        ]
      }
    }

  },

  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan"
  ]
};


/*
|--------------------------------------------------------------------------
| GENERATE INTERVIEW REPORT
|--------------------------------------------------------------------------
*/

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription
}) {

  if (!resume) {
    throw new Error("Resume is required");
  }

  if (!jobDescription) {
    throw new Error("Job description is required");
  }


  const prompt = `
You are an expert technical interviewer, hiring manager,
and career coach.

Analyze the candidate against the provided job description.

IMPORTANT:
You MUST return data that exactly matches the provided JSON schema.

Do NOT return markdown.

Do NOT return explanations outside the JSON.

Do NOT change field names.

Do NOT convert objects into strings.

For technicalQuestions:
EVERY array element MUST be an OBJECT containing exactly:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

For behavioralQuestions:
EVERY array element MUST be an OBJECT containing exactly:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

For skillGaps:
EVERY array element MUST be an OBJECT containing exactly:

{
  "skill": "...",
  "severity": "low | medium | high"
}

For preparationPlan:
EVERY array element MUST be an OBJECT containing exactly:

{
  "day": 1,
  "focus": "...",
  "tasks": ["...", "..."]
}

The title MUST be the job title from the job description.

Generate:

- 8 technical questions
- 6 behavioral questions
- 5 skill gaps
- exactly 14 preparation-plan days

Technical and behavioral answers should be detailed and interview-ready.

Use the candidate's actual resume and experience.
Do not invent experience.

==================================================
RESUME
==================================================

${resume}

==================================================
SELF DESCRIPTION
==================================================

${selfDescription || "N/A"}

==================================================
JOB DESCRIPTION
==================================================

${jobDescription}

==================================================
END INPUT
==================================================
`;


  const response = await ai.models.generateContent({

    model: "gemini-3-flash-preview",

    contents: prompt,

    config: {

      responseMimeType: "application/json",

      responseJsonSchema: interviewReportJsonSchema,


    }

  });


  /*
  |--------------------------------------------------------------------------
  | DEBUG GEMINI RESPONSE
  |--------------------------------------------------------------------------
  */

  console.log("\n================ GEMINI RAW RESPONSE ================\n");

  console.log(response.text);

  console.log("\n======================================================\n");


  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }


  /*
  |--------------------------------------------------------------------------
  | PARSE JSON
  |--------------------------------------------------------------------------
  */

  let parsedReport;

  try {

    parsedReport = JSON.parse(response.text);

  } catch (error) {

    console.error("GEMINI INVALID JSON:");
    console.error(response.text);

    throw new Error("AI returned invalid JSON");
  }


  /*
  |--------------------------------------------------------------------------
  | VALIDATE AGAINST ZOD
  |--------------------------------------------------------------------------
  */

  const validationResult =
    interviewReportSchema.safeParse(parsedReport);


  if (!validationResult.success) {

    console.error("\n================ ZOD VALIDATION ERROR ================\n");

    console.error(
      JSON.stringify(
        validationResult.error.format(),
        null,
        2
      )
    );

    console.error("\n=======================================================\n");

    throw new Error(
      "AI response does not match the interview report schema"
    );
  }


  /*
  |--------------------------------------------------------------------------
  | FINAL CLEAN REPORT
  |--------------------------------------------------------------------------
  */

  const report = validationResult.data;


  console.log("\n================ AI REPORT ================\n");

  console.dir(report, {
    depth: null
  });

  console.log("\n====================================================\n");


  return report;
}



async function generatePdfFromHtml(htmlContent) {
  console.log("Puppeteer executable:", puppeteer.executablePath());
  
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}


async function generateResumePdf({ selfDescription, resume, jobDescription }) {

  if (!resume) {
    throw new Error("Resume is required");
  }

  if (!jobDescription) {
    throw new Error("Job description is required");
  }

  if (!selfDescription) {
    throw new Error("Self description is required");
  }

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume PDF. This HTML will be converted to a PDF file.")
  });

  const prompt = `Generate a professional resume for a candidate based on their self description, resume content, and job description. The resume should be tailored to the job description and highlight the candidate's strengths. Based on the following:

  Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}

  The response should be a JSON object witha single field "html" containing the HTML content of the resume. The HTML should be well-structured and ready to be converted into a PDF file.

  The resume should be tailored to the job description, highlighting the candidate's strengths and relevant experience. The resume should be professional, clear, and concise.

  The content of the resume should not sound like it was generated by AI. It should be written in a natural and human-like manner and should be single page, well-formatted, and visually appealing. The resume should be in a professional format, with clear headings, bullet points, and appropriate spacing. The resume should be tailored to the job description, highlighting the candidate's strengths and relevant experience. The resume should be professional, clear, and concise.

  One final requirement is that use a good font for the resume. The font should be professional and easy to read and proper spaacing should be present in the resume and also it should look compact and weel- orgnized. Also after every major section draw out a line to seperate teh sections. The resume should be in a professional format, with clear headings, bullet points, and appropriate spacing. The resume should be tailored to the job description, highlighting the candidate's strengths and relevant experience. The resume should be professional, clear, and concise.

  Put words that are present in the job description in the resume as to get a good match and also add action verbs and metrics in the resume whereever possible. You can highlight the content using some colors or different font styles but use a solid font not too light and the overall design should be simple and professional.

  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(resumePdfSchema),
      
    }
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;

}

module.exports = {
  generateInterviewReport,
  generateResumePdf
};