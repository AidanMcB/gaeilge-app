import type { Answer, QuizQuestion, QuizData, SubmittedData } from '@/ts/interfaces';
import { defineStore } from 'pinia';
import { getLocalQuizData } from '@/utils/helper';
import { MultipleChoiceDataKeys } from '@/ts/enums';
import * as quizService from '@/services/quiz.service';

export const useQuizStore = defineStore('quizStore', {
	state: () => ({
        // Source of truth for quiz and questions
		activeQuiz: {} as QuizData,
        // Currently active questions
		activeQuestion: {} as QuizQuestion,
        // Current section id and submitted answers
        submittedData: {} as SubmittedData,
        sectionId: 0,
        questionId: 0,
        selected: ''
	}),
	actions: {
        startNewQuiz(quizData: QuizData): Number {
            this.clearQuizData();
            this.setActiveQuiz(quizData);
            quizService._setSubmittedQuizData({ section: quizData.id, questions: []});
            return Math.floor(Math.random() * 10)+1;
        },
        // Getters
        getSubmittedData(): SubmittedData {
            return getLocalQuizData(MultipleChoiceDataKeys.AnsweredQuestions);
        },
        getActiveQuestion(questionId: number): QuizQuestion | undefined {
            // from URL
            const question = this.activeQuiz?.questions?.find((q: QuizQuestion) => q.id === questionId);
            if (question) {
                return question;
            }
            return undefined;
        },
        // Setters
        async initQuestionView(sectionId: number, questionId: number) {
            this.sectionId = sectionId;
            this.questionId = questionId;
            this.setSubmittedData();
            await this.setActiveQuiz(undefined, sectionId);
            this.setActiveQuestion(questionId);
            this.selected = '';
        },
        async setActiveQuiz(quizData?: QuizData, quizId?: number): Promise<void> {
            if (quizData) {
                this.activeQuiz = quizData;
            } 
            if (quizId) {
                const quiz = await quizService._getQuizById(quizId);
                if (quiz) {
                    this.activeQuiz = quiz
                }
            }
        },
		setActiveQuestion(questionId: number): void {
			const question = this.activeQuiz.questions.find((q) => q.id == questionId);
			if (question) {
                // check for answered questions in localStorage
                const index = this.submittedData.questions?.findIndex(q => questionId === q.id);
                if (index > -1) {
                    this.setActiveQuestionFromSubmittedAnswers(index);
                } else {
                    this.activeQuestion = question;
                }
			}
		},
        async setSubmittedData(): Promise<void> {
            this.submittedData = await quizService._getSubmittedAnswers();
        },
        submitAnswer(answeredQuestion: Answer): void {
            const matchedQuestion = this.activeQuiz.questions.find(q => q.id === answeredQuestion.questionId);
            if (!matchedQuestion) {
                // question does not exist
                return;
            }
            if (this.submittedData) {
                // If not the first question
                if (this.submittedData.questions) {
                    const index = this.submittedData.questions?.findIndex(q => q.id === this.questionId);
                    // if this question has not yet been answered, add the selected answer
                    if (index === -1) {
                        this.submittedData.questions.push({
                            ...matchedQuestion,
                            isCorrect: answeredQuestion.isCorrect,
                            isSubmitted: true,
                            selectedAnswer: answeredQuestion.selectedAnswer
                        });
                        quizService._setSubmittedQuizData(this.submittedData);
                    } else {
                        console.log('Already Answered');
                    }
                // first question being answered 
                } else {
                    const newSubmittedData = {
                        section: this.activeQuiz.section,
                        questions: [ {
                            ...matchedQuestion,
                            answer: answeredQuestion.answer,
                            isCorrect: answeredQuestion.isCorrect,
                            isSubmitted: true,
                            selectedAnswer: answeredQuestion.selectedAnswer
                        }]
                    };
                    quizService._setSubmittedQuizData(newSubmittedData);
                    this.submittedData = newSubmittedData;
                }
            // Create stored data if does not exist
            } else {
                const newSubmittedData: SubmittedData = { 
                    section: this.sectionId, 
                    questions: [ {
                        ...matchedQuestion,
                        isCorrect: answeredQuestion.isCorrect,
                        isSubmitted: true,
                        selectedAnswer: answeredQuestion.selectedAnswer
                    } 
                ]};
                quizService._setSubmittedQuizData(newSubmittedData);
                this.submittedData = newSubmittedData;
            }
        },
        setActiveQuestionFromSubmittedAnswers(index: number): void {
            const answeredQuestionData = this.submittedData.questions[index];
            const storedQuestionData = this.activeQuiz.questions.find(q => q.id == answeredQuestionData.id) || {} as QuizQuestion;

            this.activeQuestion = {
                ...storedQuestionData,
                isCorrect: answeredQuestionData.isCorrect,
                selectedAnswer: answeredQuestionData.selectedAnswer,
                isSubmitted: true
            }
            this.selected = '';
        },
        updateSelected(val: string): void {
            this.selected = val;
        },
        clearQuizData(): void {
            this.submittedData = {} as SubmittedData;
            this.activeQuiz = {} as QuizData;
            this.activeQuestion = {} as QuizQuestion;
            this.sectionId = 0;
            this.questionId = 0;
            this.selected = '';
        }
	},
});
