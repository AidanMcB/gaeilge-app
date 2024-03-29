import './matching.interfaces';

export interface TermCard {
	id: number;
	englishTerm?: string;
	irishTerm?: string;
}

export interface QuizQuestionData {
	id: number;
	section: number;
	description: string;
	questions: QuizQuestion[];
}

export interface QuizQuestion {
	id: number;
	question: string;
	choices: string[];
	correctAnswer: string;
	reason: string;
    state: string // TBD: make enum val
	selectedAnswer: string;
	category: string; // TBD: make enum value
    isSubmitted: boolean,
    isCorrect?: boolean,
}

export interface StoredData {
    section: number;
    submittedAnswers: QuizQuestion[];
}

export interface Answer {
    questionId: number;
    answer: string;
    isCorrect: boolean;
    selectedAnswer: string;
}
