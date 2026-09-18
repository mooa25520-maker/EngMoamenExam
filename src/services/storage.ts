import { Exam, ExamAttempt, UserProfile } from '../types/exam';
import { INITIAL_EXAMS } from '../data/initialExams';

const EXAMS_STORAGE_KEY = 'exampulse_exams_v4';
const ATTEMPTS_STORAGE_KEY = 'exampulse_attempts_v1';
const USER_STORAGE_KEY = 'exampulse_user_v1';

export const defaultUser: UserProfile = {
  id: 'usr-student-1',
  name: 'Alex Morgan',
  rollNo: 'CS-2026-884',
  email: 'alex.morgan@university.edu',
  role: 'student'
};

export const getExams = (): Exam[] => {
  try {
    const data = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading exams from localStorage', e);
  }
  // Fallback to initial dataset
  saveExams(INITIAL_EXAMS);
  return INITIAL_EXAMS;
};

export const saveExams = (exams: Exam[]): void => {
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
  } catch (e) {
    console.error('Error saving exams to localStorage', e);
  }
};

export const getExamById = (id: string): Exam | undefined => {
  const exams = getExams();
  return exams.find(e => e.id === id);
};

export const saveExam = (exam: Exam): void => {
  const exams = getExams();
  const index = exams.findIndex(e => e.id === exam.id);
  if (index >= 0) {
    exams[index] = exam;
  } else {
    exams.unshift(exam);
  }
  saveExams(exams);
};

export const deleteExam = (id: string): void => {
  const exams = getExams().filter(e => e.id !== id);
  saveExams(exams);
};

export const resetExamsToDefault = (): Exam[] => {
  saveExams(INITIAL_EXAMS);
  return INITIAL_EXAMS;
};

// Exam Attempts Storage
export const getAttempts = (): ExamAttempt[] => {
  try {
    const data = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading attempts from localStorage', e);
  }
  return [];
};

export const saveAttempt = (attempt: ExamAttempt): void => {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  try {
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
  } catch (e) {
    console.error('Error saving attempt to localStorage', e);
  }
};

export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading user profile', e);
  }
  return defaultUser;
};

export const saveUserProfile = (user: UserProfile): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
};
