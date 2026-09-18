export type QuestionType = "single" | "multiple" | "true_false" | "code";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category =
  | "Web Development"
  | "Data Science"
  | "Cybersecurity"
  | "Mathematics"
  | "General Knowledge"
  | "ICT"
  | "Programming";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: QuestionOption[];
  correctAnswers: string[]; // option IDs
  points: number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  durationMinutes: number; // in minutes
  passingPercentage: number;
  totalPoints: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  author: string;
  iconName?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isFlagged?: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  category: Category;
  studentName: string;
  studentRollNo: string;
  grade?: string;
  studentPhone?: string;
  parentPhone?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  timeTakenSeconds: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: UserAnswer[];
  telegramStatus?: "sent" | "failed" | "not_configured" | "pending";
}

export type GradeType = "الصف الأول الثانوي" | "الصف الثاني الثانوي";

export interface UserProfile {
  id: string;
  name: string;
  rollNo: string;
  role: "student" | "instructor";
  email: string;
  grade?: GradeType | string;
  studentPhone?: string;
  parentPhone?: string;
  registered?: boolean;
}
