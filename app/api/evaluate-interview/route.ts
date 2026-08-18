import { NextRequest, NextResponse } from 'next/server';

const INTERVIEW_EVALUATION_SYSTEM_PROMPT = `You are an expert hiring committee evaluator and senior interview coach. Analyze the full transcript of this completed mock interview session and return a strict JSON evaluation report.

Rules:
1. Return ONLY valid JSON matching the schema below. Do not wrap in Markdown fences (no \`\`\`json).
2. Evaluate responses objectively based on technical precision, STAR structure, and depth.
3. Provide realistic, high-impact model answers for questions where the candidate underperformed.

JSON Schema:
{
  "interview_summary": {
    "overall_score": 0,
    "verdict": "Strong Hire | Hire | Leaning Hire | Needs Practice | Not Ready",
    "star_framework_adherence_percentage": 0,
    "confidence_score": 0,
    "tone_analysis": "string",
    "detected_keywords": ["string"],
    "missed_key_concepts": ["string"]
  },
  "strengths": ["string"],
  "high_priority_improvements": ["string"],
  "question_evaluations": [
    {
      "question_number": 1,
      "question_text": "string",
      "candidate_answer_transcript": "string",
      "score": 0,
      "feedback": "string",
      "model_answer": "string"
    }
  ]
}`;

interface QuestionTranscript {
  questionNumber: number;
  questionText: string;
  candidateAnswer: string;
}

interface InterviewPayload {
  targetRole: string;
  interviewType: string;
  persona: string;
  jobDescription?: string;
  transcripts: QuestionTranscript[];
}

// Fallback evaluation engine when Gemini API is unavailable or unconfigured
function generateFallbackEvaluation(payload: InterviewPayload) {
  const { targetRole, interviewType, transcripts } = payload;
  const totalQuestions = transcripts.length || 1;
  
  let wordCount = 0;
  let starKeywordsCount = 0;
  
  const techKeywords = ['architecture', 'api', 'performance', 'database', 'optimization', 'testing', 'scale', 'async', 'component', 'design', 'state', 'cache', 'security', 'lead', 'team', 'metrics', 'impact'];
  const starKeywords = ['situation', 'task', 'action', 'result', 'because', 'impact', 'led', 'achieved', 'improved', 'metric', 'decreased', 'increased', 'resolved'];
  
  const detectedKeywordsSet = new Set<string>();
  const missedConcepts = ['System Bottlenecks & Caching', 'Measurable Business Metrics (KPIs)', 'Edge-case Error Handling', 'Cross-functional Collaboration'];

  const questionEvaluations = transcripts.map((t, idx) => {
    const text = t.candidateAnswer.trim();
    const words = text.split(/\s+/).filter(Boolean);
    wordCount += words.length;

    words.forEach(w => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      if (techKeywords.includes(lower)) detectedKeywordsSet.add(lower);
      if (starKeywords.includes(lower)) starKeywordsCount++;
    });

    let qScore = 65;
    if (words.length > 50) qScore += 15;
    if (words.length > 100) qScore += 10;
    if (words.length < 15) qScore -= 25;

    qScore = Math.min(95, Math.max(30, qScore));

    let feedback = '';
    let modelAnswer = '';

    if (words.length < 20) {
      feedback = 'The answer was very brief and lacked specific context, technical methodology, or measurable results.';
      modelAnswer = `In my previous project as a ${targetRole}, I encountered a critical situation where initial system latency exceeded SLA targets. I took ownership of analyzing execution bottlenecks, refactored data pipelines with caching mechanisms, and reduced response times by 42% while improving reliability.`;
    } else if (qScore >= 80) {
      feedback = 'Solid response with clear articulation. To elevate further, quantify the exact impact and highlight key architectural trade-offs.';
      modelAnswer = `A strong answer directly frames the problem in terms of scale and constraints: "When designing this solution for ${targetRole}, I prioritized modular decoupling, benchmarked database queries, and implemented monitoring to ensure sub-100ms response latency."`;
    } else {
      feedback = 'Good foundation, but structure could be strengthened using the STAR method (Situation, Task, Action, Result). Ensure you explicitly state what metric was improved.';
      modelAnswer = `To optimize this response: "I addressed this challenge by structuring the workflow into distinct phases: assessing user requirements, engineering a resilient fallback strategy, and conducting integration testing that achieved 99.9% uptime."`;
    }

    return {
      question_number: t.questionNumber || idx + 1,
      question_text: t.questionText || `Question ${idx + 1}`,
      candidate_answer_transcript: t.candidateAnswer || '(No answer provided)',
      score: qScore,
      feedback,
      model_answer: modelAnswer
    };
  });

  const avgScore = Math.round(
    questionEvaluations.reduce((acc, q) => acc + q.score, 0) / totalQuestions
  );

  let verdict: "Strong Hire" | "Hire" | "Leaning Hire" | "Needs Practice" | "Not Ready" = "Needs Practice";
  if (avgScore >= 88) verdict = "Strong Hire";
  else if (avgScore >= 78) verdict = "Hire";
  else if (avgScore >= 68) verdict = "Leaning Hire";
  else if (avgScore >= 55) verdict = "Needs Practice";
  else verdict = "Not Ready";

  const starAdherence = Math.min(95, Math.max(40, Math.round((starKeywordsCount / (totalQuestions * 3)) * 100) + 45));
  const confidence = Math.min(95, Math.max(50, Math.round((wordCount / (totalQuestions * 40)) * 70) + 20));

  return {
    interview_summary: {
      overall_score: avgScore,
      verdict,
      star_framework_adherence_percentage: starAdherence,
      confidence_score: confidence,
      tone_analysis: wordCount > 100 ? "Professional, articulate, and structured with assertive delivery." : "Hesitant at times with opportunities for concise, structured delivery.",
      detected_keywords: Array.from(detectedKeywordsSet).slice(0, 8).concat(['STAR Framework', 'Problem Solving']),
      missed_key_concepts: missedConcepts
    },
    strengths: [
      `Demonstrated active engagement for ${interviewType} interview format.`,
      `Clear focus on target role expectations (${targetRole}).`,
      `Good willingness to structure technical and situational reasoning.`
    ],
    high_priority_improvements: [
      "Elaborate on specific technical trade-offs and architectural decisions.",
      "Consistently apply the STAR framework (Situation, Task, Action, Result) with measurable metrics.",
      "Reduce pauses and avoid abrupt answer conclusions by summarizing key takeaways."
    ],
    question_evaluations: questionEvaluations
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload: InterviewPayload = await req.json();
    const { targetRole, interviewType, persona, jobDescription, transcripts } = payload;

    if (!transcripts || !Array.isArray(transcripts) || transcripts.length === 0) {
      return NextResponse.json({ error: 'Transcripts are required for interview evaluation.' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY ||
                         process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
                         process.env.NEXT_PUBLIC_OPENROUTER_API_KEY_1;

    let evaluationResult = null;

    if (geminiApiKey) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'];

      const userPromptText = JSON.stringify({
        target_role: targetRole,
        interview_type: interviewType,
        persona: persona,
        job_description: jobDescription || 'N/A',
        session_transcript: transcripts.map(t => ({
          question_number: t.questionNumber,
          question: t.questionText,
          candidate_answer: t.candidateAnswer
        }))
      });

      for (const model of modelsToTry) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

          const requestBody = {
            systemInstruction: {
              parts: [{ text: INTERVIEW_EVALUATION_SYSTEM_PROMPT }]
            },
            contents: [
              {
                parts: [{ text: userPromptText }]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          };

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
              evaluationResult = JSON.parse(cleaned);
              break;
            }
          }
        } catch (apiErr) {
          console.warn(`Gemini API evaluation with model ${model} failed:`, apiErr);
        }
      }
    }

    // Fallback if Gemini key is absent or API fails
    if (!evaluationResult) {
      evaluationResult = generateFallbackEvaluation(payload);
    }

    return NextResponse.json({
      success: true,
      data: evaluationResult
    });

  } catch (error: unknown) {
    console.error('API Error in evaluate-interview:', error);
    const errObj = error as Error;
    return NextResponse.json({
      error: errObj.message || 'Internal server error while evaluating interview.'
    }, { status: 500 });
  }
}
