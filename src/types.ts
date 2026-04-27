
export enum UserLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  PRO = "Pro"
}

export type AppTheme = 'classic' | 'midnight' | 'paper' | 'nordic';

export interface FocusAreas {
  grammar: boolean;
  nativePolishing: boolean;
  translation: boolean;
}

export interface Character {
  name: string;
  background: string;
  personality: string;
  speechStyle: string;
}

export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  mnemonic?: string;
  example: string;
  source?: string;
  logical_analysis?: string;
  academic_context?: string;
  translation?: string;
}

export interface UserContext {
  scenario: string;
  userLevel: UserLevel;
  nativeLanguage: string;
  streakCount: number;
  theme: AppTheme;
  backgroundImage?: string;
  focusAreas: FocusAreas;
  vocabBook?: string;
  dailyQuota?: number;
}

export interface Feedback {
  has_error: boolean;
  grammar_correction: string;
  native_polishing: string;
}

export interface RoleplayReply {
  character_name: string;
  reply_text: string;
  native_translation: string;
  motivation_msg: string;
}

export interface AIResponse {
  feedback: Feedback;
  roleplay_reply: RoleplayReply;
  vocabulary: {
    word: string;
    meaning: string;
    phonetic: string;
    context_usage: string;
  }[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: Feedback;
  roleplayReply?: RoleplayReply;
  vocabulary?: {
    word: string;
    meaning: string;
    phonetic: string;
    context_usage: string;
  }[];
  timestamp: number;
}
