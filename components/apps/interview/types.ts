export type InterviewType = 'Technical' | 'Behavioral (STAR)' | 'System Design' | 'HR Screening';

export type AvatarPersona = 'Corporate Recruiter' | 'Senior Engineering Manager' | 'Startup Lead';

export interface PersonaDetail {
  id: AvatarPersona;
  name: string;
  title: string;
  avatarBg: string;
  avatarAccent: string;
  voicePitch: number;
  voiceRate: number;
  greeting: string;
  description: string;
}

export const PERSONA_DETAILS: Record<AvatarPersona, PersonaDetail> = {
  'Corporate Recruiter': {
    id: 'Corporate Recruiter',
    name: 'Sarah Jenkins',
    title: 'Lead Talent Partner @ Fortune 500',
    avatarBg: 'from-[#3b82f6] to-[#1d4ed8]',
    avatarAccent: '#60a5fa',
    voicePitch: 1.1,
    voiceRate: 1.0,
    greeting: "Hello! Welcome to your interview session. I'll be assessing your core background, culture fit, and soft skills today.",
    description: 'Polished, structured interviewer focusing on communication, culture fit, and STAR frameworks.'
  },
  'Senior Engineering Manager': {
    id: 'Senior Engineering Manager',
    name: 'Marcus Vance',
    title: 'VP of Engineering @ Cloud Scale Systems',
    avatarBg: 'from-[#8b5cf6] to-[#6d28d9]',
    avatarAccent: '#a78bfa',
    voicePitch: 0.95,
    voiceRate: 1.02,
    greeting: "Hey there! Ready to talk code and system design? I'm looking for technical depth, trade-off clarity, and problem solving.",
    description: 'Deep technical interrogation, architectural trade-offs, data structures, and system scalability.'
  },
  'Startup Lead': {
    id: 'Startup Lead',
    name: 'Alex Rivera',
    title: 'Co-Founder & CTO @ AI Foundry',
    avatarBg: 'from-[#10b981] to-[#047857]',
    avatarAccent: '#34d399',
    voicePitch: 1.0,
    voiceRate: 1.1,
    greeting: "Welcome! We move fast here. I want to see your practical execution, speed, initiative, and high-impact mindset.",
    description: 'Fast-paced, high-energy evaluation focusing on practical execution, agility, and ownership.'
  }
};

export interface InterviewSettings {
  targetRole: string;
  jobDescription: string;
  interviewType: InterviewType;
  persona: AvatarPersona;
  questionCount: number;
}

export interface QuestionItem {
  id: number;
  question: string;
  category: string;
  hint: string;
}

export interface TranscriptItem {
  questionNumber: number;
  questionText: string;
  candidateAnswer: string;
  timestamp: string;
}

export type InterviewStage = 'setup' | 'interviewing' | 'evaluating' | 'report';

export interface QuestionEvaluation {
  question_number: number;
  question_text: string;
  candidate_answer_transcript: string;
  score: number;
  feedback: string;
  model_answer: string;
}

export interface InterviewSummary {
  overall_score: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Practice' | 'Not Ready';
  star_framework_adherence_percentage: number;
  confidence_score: number;
  tone_analysis: string;
  detected_keywords: string[];
  missed_key_concepts: string[];
}

export interface EvaluationReport {
  interview_summary: InterviewSummary;
  strengths: string[];
  high_priority_improvements: string[];
  question_evaluations: QuestionEvaluation[];
}
