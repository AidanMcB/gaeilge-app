import type { Answer, QuizQuestion, QuizQuestionData, StoredData } from "@/ts/interfaces";
import { defineStore } from "pinia";
import questionDataJSON from "../assets/quizQuestionsA.json";
import { getLocalStorage } from "@/utils/helper";
  
export const useQuizStore = defineStore("quizStore", {
	state: () => ({
		id: 0,
        storedData: {} as StoredData,
		currentQuizData: {} as QuizQuestionData,
		allQuizData: questionDataJSON as QuizQuestionData[],
		activeQuestion: {} as QuizQuestion,
        sectionId: 0,
        questionId: 0,
        activeQuestionNumber: '1',
        selected: ''
	}),
	actions: {
        initQuestionView(sectionId: number, questionId: number) {
            this.sectionId = sectionId;
            this.questionId = questionId;
            this.activeQuestionNumber = localStorage.getItem('question_number') || '0';
            
            this.setStoredData();
            this.setActiveQuiz(sectionId);
            this.setActiveQuestion(questionId);
            this.selected = '';
        },
		setActiveQuiz(quizSection: number): void {
			const quiz = this.allQuizData.find((q) => q.section === quizSection);
			if (quiz) {
				this.currentQuizData = quiz;
			}
		},
		setActiveQuestion(questionId: number): void {
			const question = this.currentQuizData.questions.find((q) => q.id == questionId);
			if (question) {
                // check for answered questions in localStorage
                const index = this.storedData.submittedAnswers?.findIndex(q => questionId === q.id);
                if (index > -1) {
                    this.setActiveQuestionFromSubmittedAnswers(index);
                } else {
                    this.activeQuestion = question;
                }
			}
		},
        setStoredData(): void {
            this.storedData = getLocalStorage('answered_questions');
        },
        submitAnswer(answeredQuestion: Answer): void {
            const matchedQuestion = this.currentQuizData.questions.find(q => q.id === answeredQuestion.questionId);
            if (!matchedQuestion) {
                return
            }
            if (this.storedData) {
                // If not the first question
                if (this.storedData.submittedAnswers) {
                    const index = this.storedData.submittedAnswers?.findIndex(q => q.id === this.questionId);
                    // if this question has not yet been answered, add the selected answer
                    if (index === -1) {
                        this.storedData.submittedAnswers.push({
                            ...matchedQuestion,
                            isCorrect: answeredQuestion.isCorrect,
                            isSubmitted: true,
                            selectedAnswer: answeredQuestion.selectedAnswer
                        });
                        localStorage.setItem('answered_questions', JSON.stringify(this.storedData));
                    } else {
                        console.log('Already Answered');
                    }
                // first question being answered 
                } else {
                    const newStoredData = {
                        section: this.currentQuizData.section,
                        submittedAnswers: [ {
                            ...matchedQuestion,
                            answer: answeredQuestion.answer,
                            isCorrect: answeredQuestion.isCorrect,
                            isSubmitted: true,
                            selectedAnswer: answeredQuestion.selectedAnswer
                        }]
                    };
    
                    this.storedData = newStoredData;
                    localStorage.setItem('answered_questions', JSON.stringify(newStoredData)); 
                }
            // Create stored data if does not exist
            } else {
                const newStoredData: StoredData = { 
                    section: this.sectionId, 
                    submittedAnswers: [ {
                        ...matchedQuestion,
                        isCorrect: answeredQuestion.isCorrect,
                        isSubmitted: true,
                        selectedAnswer: answeredQuestion.selectedAnswer
                    } 
                ] };
                localStorage.setItem('answered_questions', JSON.stringify(newStoredData));
                this.storedData = newStoredData;
            }
        },
        nextQuestion(): number {
            const questionNumber = parseInt(this.activeQuestionNumber || '1') || 1;
            // Increment question_number to display in UI
            localStorage.setItem('question_number', (questionNumber + 1).toString());

            const allQuestionIds: number[] = this.currentQuizData.questions.map(q => q.id);
            const answeredQuestionIds: number[] = this.storedData.submittedAnswers?.map(q => q.id) || [];
            const remainingQuestionIds: number[] = allQuestionIds.filter(id => !answeredQuestionIds.includes(id));

            const nextQuestionId = remainingQuestionIds[Math.floor(Math.random()*remainingQuestionIds.length)];
            return nextQuestionId;
        },
        setActiveQuestionFromSubmittedAnswers(index: number): void {
            const answeredQuestionData = this.storedData.submittedAnswers[index];
            const storedQuestionData = this.currentQuizData.questions.find(q => q.id == answeredQuestionData.id) || {} as QuizQuestion;

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
        clearStoredData(): void {
            this.id = 0;
            this.storedData = {} as StoredData;
            this.currentQuizData = {} as QuizQuestionData;
            this.allQuizData = questionDataJSON as QuizQuestionData[];
            this.activeQuestion = {} as QuizQuestion;
            this.sectionId = 0;
            this.questionId = 0;
            this.activeQuestionNumber = '1';
            this.selected = '';
        }
	},
});
