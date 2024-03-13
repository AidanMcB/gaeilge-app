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
	state: string; // TBD: make enum value
	selectedAnswer: string;
	category: string; // TBD: make enum value
}

export interface StoredData {
    section: number;
    submittedAnswers: Answer[];
}

export interface Answer {
    questionId: number;
    questionText: string;
    isCorrect: boolean;
    answer: string;
    correctAnswer: string;
}
