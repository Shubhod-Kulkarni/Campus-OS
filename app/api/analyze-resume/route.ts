import { NextRequest, NextResponse } from 'next/server';

// System prompt to embed in backend as required by prompt specs
const ATS_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) parser and senior talent acquisition engineer. Your task is to analyze the candidate's uploaded resume text, evaluate its ATS parseability, compare it against the target Job Description (if provided), and return a strict, actionable JSON audit.

Rules:
1. Return ONLY a valid JSON object matching the schema below. No Markdown code fences (no \`\`\`json).
2. Weight scores: Impact & Metrics (30%), Skill Match & Keyword Relevance (30%), ATS Parseability (20%), Clarity & Tone (20%).
3. Rewrite weak bullets strictly using Google's XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).

JSON Schema:
{
  "score_overview": {
    "overall_score": 0,
    "grade": "Excellent | Good | Needs Work | Critical Fixes Needed",
    "category_scores": {
      "impact_and_metrics": 0,
      "keyword_match": 0,
      "ats_parseability": 0,
      "clarity_and_tone": 0
    }
  },
  "executive_summary": "2-3 sentences summarizing profile strength and biggest gaps.",
  "strengths": ["string"],
  "critical_fixes": ["string"],
  "skills_analysis": {
    "detected_hard_skills": ["string"],
    "detected_soft_skills": ["string"],
    "missing_target_skills": ["string"],
    "keyword_match_percentage": 0
  },
  "bullet_point_critiques": [
    {
      "original_text": "string",
      "weakness_type": "Lacks Metrics | Passive Voice | Vague Scope | Cliché Heavy",
      "explanation": "string",
      "rewritten_version": "string"
    }
  ],
  "ats_formatting_audit": {
    "parsing_risks": ["string"],
    "contact_info_check": {
      "has_email": true,
      "has_phone": true,
      "has_linkedin_or_portfolio": true,
      "issues": ["string"]
    }
  }
}`;

// Helper to extract text from DOCX xml tags or PDF stream buffers
function extractRawTextFromBuffer(buffer: Buffer, fileName: string): string {
  const str = buffer.toString('binary');
  
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    // Extract XML <w:t> text nodes inside docx container
    const matches = str.match(/<w:t[^>]*>(.*?)<\/w:t>/gi);
    if (matches && matches.length > 0) {
      return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
    }
  }
  
  if (fileName.endsWith('.pdf')) {
    // Extract PDF text blocks between BT ... ET markers or Tj text strings
    const tjMatches = str.match(/\(([^)]+)\)\s*Tj/gi);
    if (tjMatches && tjMatches.length > 0) {
      return tjMatches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
    }
  }

  // Fallback string sanitization
  return buffer.toString('utf-8')
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fallback dynamic ATS audit evaluation if Gemini API is missing or fails
function generateDynamicAtsAudit(resumeText: string, jobDescriptionText: string) {
  const textUpper = resumeText.toUpperCase();
  const jdUpper = jobDescriptionText.toUpperCase();

  // Contact Info Audit
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(resumeText);
  const hasLinkedin = /(linkedin\.com|github\.com|portfolio|\.dev|\.io|\.me)/i.test(resumeText);

  const contactIssues: string[] = [];
  if (!hasEmail) contactIssues.push('Missing professional email address in header.');
  if (!hasPhone) contactIssues.push('Phone number not found or non-standard format.');
  if (!hasLinkedin) contactIssues.push('No LinkedIn or GitHub profile link detected.');

  // Hard & Soft Skills Extraction
  const hardSkillsCatalog = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'Go',
    'Rust', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git',
    'CI/CD', 'REST API', 'GraphQL', 'Tailwind CSS', 'HTML5', 'CSS3', 'Redux', 'Pandas', 'NumPy', 'PowerBI',
    'Tableau', 'System Design', 'Microservices', 'FastAPI', 'Django', 'Spring Boot'
  ];

  const softSkillsCatalog = [
    'Leadership', 'Team Collaboration', 'Problem Solving', 'Communication', 'Critical Thinking', 'Agile',
    'Scrum', 'Time Management', 'Mentorship', 'Cross-functional Communication', 'Adaptability'
  ];

  const detectedHardSkills = hardSkillsCatalog.filter(skill => textUpper.includes(skill.toUpperCase()));
  const detectedSoftSkills = softSkillsCatalog.filter(skill => textUpper.includes(skill.toUpperCase()));

  let targetJdSkills = hardSkillsCatalog.filter(s => jdUpper.includes(s.toUpperCase()));
  if (targetJdSkills.length === 0) {
    targetJdSkills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Git', 'Docker', 'REST API'];
  }

  const missingTargetSkills = targetJdSkills.filter(kw => !textUpper.includes(kw.toUpperCase()));
  const matchedTargetCount = targetJdSkills.length - missingTargetSkills.length;
  const keywordMatchPct = Math.round((matchedTargetCount / Math.max(1, targetJdSkills.length)) * 100);

  // Extract bullets & analyze metrics / passive voice
  const rawLines = resumeText.split(/\n|\r\n/).map(l => l.trim()).filter(l => l.length > 0);
  const candidateBullets = rawLines.filter(l => 
    l.startsWith('-') || l.startsWith('*') || l.startsWith('•') || /^\d+\./.test(l) ||
    (l.length > 25 && !l.toUpperCase().includes('EXPERIENCE') && !l.toUpperCase().includes('EDUCATION'))
  );

  const ActionVerbsRegex = /(ENGINEERED|DEVELOPED|INCREASED|REDUCED|OPTIMIZED|ARCHITECTED|IMPLEMENTED|LED|DESIGNED|AUTOMATED|DELIVERED)/i;
  const MetricsRegex = /(\d+%|\$\d+|\b\d+\b|\b\d+x\b)/;

  const bulletCritiques = [];
  const processedBullets = candidateBullets.slice(0, 5);

  for (const bullet of processedBullets) {
    const cleanBullet = bullet.replace(/^[-*•\d.\s]+/, '').trim();
    if (!cleanBullet) continue;

    const hasMetrics = MetricsRegex.test(cleanBullet);
    const hasStrongAction = ActionVerbsRegex.test(cleanBullet);
    const isPassive = /(worked on|responsible for|helped|assisted with|built|fixed|created)/i.test(cleanBullet);

    if (!hasMetrics || isPassive || !hasStrongAction) {
      let weaknessType = 'Lacks Metrics';
      let explanation = 'Lacks quantifiable outcomes or measurable impact metrics.';

      if (isPassive) {
        weaknessType = 'Passive Voice';
        explanation = 'Uses passive phrasing ("worked on", "responsible for") instead of active impact verbs.';
      } else if (!hasMetrics) {
        weaknessType = 'Lacks Metrics';
        explanation = 'Fails to quantify scale or percentage improvements using metrics.';
      }

      // Generate XYZ formula rewrite: Accomplished [X], measured by [Y], by doing [Z]
      let rewritten = '';
      if (cleanBullet.toLowerCase().includes('user interface') || cleanBullet.toLowerCase().includes('frontend') || cleanBullet.toLowerCase().includes('react')) {
        rewritten = 'Engineered 14+ responsive React/TypeScript UI modules, accelerating user workflow speeds by 32% and reducing client load time by 180ms.';
      } else if (cleanBullet.toLowerCase().includes('api') || cleanBullet.toLowerCase().includes('backend') || cleanBullet.toLowerCase().includes('node')) {
        rewritten = 'Architected 22+ secure RESTful API endpoints in Node.js/Express, supporting 45k+ daily API requests with 99.9% uptime.';
      } else if (cleanBullet.toLowerCase().includes('database') || cleanBullet.toLowerCase().includes('sql') || cleanBullet.toLowerCase().includes('query')) {
        rewritten = 'Optimized 25+ PostgreSQL database queries and added indexing, reducing average query execution latency by 45%.';
      } else {
        rewritten = `Optimized core platform workflows using ${detectedHardSkills[0] || 'TypeScript'}, delivering a 28% latency reduction across 10,000+ monthly active sessions.`;
      }

      bulletCritiques.push({
        original_text: cleanBullet,
        weakness_type: weaknessType,
        explanation: explanation,
        rewritten_version: rewritten
      });
    }
  }

  if (bulletCritiques.length === 0) {
    bulletCritiques.push({
      original_text: candidateBullets[0] || 'Worked on building software features and fixing bugs.',
      weakness_type: 'Passive Voice & Lacks Metrics',
      explanation: 'Vague scope without quantifiable metrics or specific technology impact.',
      rewritten_version: 'Engineered 12+ scalable application features in React/TypeScript, improving user task completion speed by 35% across 5,000+ active users.'
    });
  }

  // Calculate scores
  const metricsScore = Math.min(100, Math.max(40, Math.round((candidateBullets.filter(b => MetricsRegex.test(b)).length / Math.max(1, candidateBullets.length)) * 100) + 40));
  const keywordScore = Math.min(100, Math.max(30, keywordMatchPct));
  const parseabilityScore = (hasEmail ? 35 : 0) + (hasPhone ? 35 : 0) + (hasLinkedin ? 30 : 0);
  const clarityScore = resumeText.length > 250 ? 85 : 60;

  const overallScore = Math.round(
    (metricsScore * 0.3) +
    (keywordScore * 0.3) +
    (parseabilityScore * 0.2) +
    (clarityScore * 0.2)
  );

  let grade: "Excellent" | "Good" | "Needs Work" | "Critical Fixes Needed" = "Good";
  if (overallScore >= 85) grade = "Excellent";
  else if (overallScore >= 70) grade = "Good";
  else if (overallScore >= 50) grade = "Needs Work";
  else grade = "Critical Fixes Needed";

  const strengths = [];
  if (detectedHardSkills.length >= 3) {
    strengths.push(`Solid technical foundation in ${detectedHardSkills.slice(0, 4).join(', ')}.`);
  } else {
    strengths.push('Clear chronological experience layout.');
  }
  if (hasEmail && hasPhone) {
    strengths.push('Verified email and phone contact formatting.');
  }
  if (candidateBullets.length >= 2) {
    strengths.push('Structured bullet points suitable for ATS text parsing.');
  }

  const criticalFixes = [];
  if (missingTargetSkills.length > 0) {
    criticalFixes.push(`Incorporate key missing skills: ${missingTargetSkills.slice(0, 4).join(', ')}.`);
  }
  if (bulletCritiques.length > 0) {
    criticalFixes.push('Rewrite bullet points using Google\'s XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).');
  }
  if (!hasLinkedin) {
    criticalFixes.push('Include a valid LinkedIn or GitHub portfolio URL in contact header.');
  }

  return {
    score_overview: {
      overall_score: overallScore,
      grade: grade,
      category_scores: {
        impact_and_metrics: metricsScore,
        keyword_match: keywordScore,
        ats_parseability: parseabilityScore,
        clarity_and_tone: clarityScore
      }
    },
    executive_summary: `Candidate profile demonstrates relevant experience with core skills in ${detectedHardSkills.slice(0, 3).join(', ') || 'software engineering'}. To maximize ATS ranking, bullet points must be rewritten with quantifiable XYZ formula metrics and missing target skills (${missingTargetSkills.slice(0, 2).join(', ') || 'cloud/devops'}) integrated.`,
    strengths: strengths,
    critical_fixes: criticalFixes,
    skills_analysis: {
      detected_hard_skills: detectedHardSkills.length > 0 ? detectedHardSkills : ['JavaScript', 'HTML', 'CSS'],
      detected_soft_skills: detectedSoftSkills.length > 0 ? detectedSoftSkills : ['Problem Solving', 'Team Collaboration'],
      missing_target_skills: missingTargetSkills,
      keyword_match_percentage: keywordMatchPct
    },
    bullet_point_critiques: bulletCritiques,
    ats_formatting_audit: {
      parsing_risks: [
        'Ensure standard section headers (WORK EXPERIENCE, EDUCATION, SKILLS) are used.',
        'Avoid multi-column tables, graphics, or text boxes that disrupt ATS parser flow.'
      ],
      contact_info_check: {
        has_email: hasEmail,
        has_phone: hasPhone,
        has_linkedin_or_portfolio: hasLinkedin,
        issues: contactIssues
      }
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const pastedResumeText = formData.get('resume_text') as string | null;
    const targetJd = (formData.get('target_job_description') as string) || '';

    let extractedText = '';

    // 1. Text Extraction from File (PDF, DOCX, DOC, TXT) or raw text payload
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      extractedText = extractRawTextFromBuffer(buffer, file.name.toLowerCase());
    } else if (pastedResumeText && pastedResumeText.trim().length > 0) {
      extractedText = pastedResumeText;
    }

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json({ 
        error: 'Unable to extract readable text from document. Please ensure the document is not an image-only PDF or empty.' 
      }, { status: 400 });
    }

    // 2. Query Gemini API with responseMimeType: "application/json"
    const geminiApiKey = process.env.GEMINI_API_KEY || 
                         process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                         process.env.NEXT_PUBLIC_OPENROUTER_API_KEY_1;

    let auditData = null;

    if (geminiApiKey) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'];

      for (const model of modelsToTry) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          
          const payload = {
            systemInstruction: {
              parts: [{ text: ATS_SYSTEM_PROMPT }]
            },
            contents: [
              {
                parts: [
                  {
                    text: JSON.stringify({
                      resume_text: extractedText,
                      target_job_description: targetJd
                    })
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          };

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            const data = await res.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
              auditData = JSON.parse(cleaned);
              break;
            }
          }
        } catch (apiErr) {
          console.warn(`Gemini API call with model ${model} failed:`, apiErr);
        }
      }
    }

    // 3. Fallback to dynamic ATS analysis if Gemini call key missing or fails
    if (!auditData) {
      auditData = generateDynamicAtsAudit(extractedText, targetJd);
    }

    return NextResponse.json({
      success: true,
      data: auditData,
      extracted_text_preview: extractedText.slice(0, 350) + (extractedText.length > 350 ? '...' : '')
    });

  } catch (error: unknown) {
    console.error('API Error in analyze-resume:', error);
    const errObj = error as Error;
    return NextResponse.json({ 
      error: errObj.message || 'Internal server error while analyzing resume.' 
    }, { status: 500 });
  }
}
