import type { QuizQuestion, QuizQuestionData } from "@/ts/interfaces";
import { defineStore } from "pinia";
import questionDataJSON from "../assets/quizQuestionsA.json";
  
export const useQuizStore = defineStore("quizStore", {
	state: () => ({
		id: 0,
		currentQuizData: {} as QuizQuestionData,
		allQuizData: questionDataJSON as QuizQuestionData[],
		activeQuestion: {} as QuizQuestion,
	}),
	actions: {
		setActiveQuiz(quizSection: number): void {
			const quiz = this.allQuizData.find(
				(q) => q.section === quizSection
			);
			if (quiz) {
				this.currentQuizData = quiz;
			}
		},
		setActiveQuestion(questionId: number): void {
			const question = this.currentQuizData.questions.find(
				(q) => q.id === questionId
			);
			if (question) {
				this.activeQuestion = question;
			}
		},
        // checkAnswer(answer: string, question: QuizQuestion): {} {
            
        // }
		// addTodo(item: string) {
		// 	this.todoList.push({ item, id: this.id++, completed: false });
		// },
		// deleteTodo(itemID: number) {
		// 	this.todoList = this.todoList.filter((object) => {
		// 		return object.id !== itemID;
		// 	});
		// },
		// toggleCompleted(idToFind: number) {
		// 	const todo = this.todoList.find((obj) => obj.id === idToFind);
		// 	if (todo) {
		// 		todo.completed = !todo.completed;
		// 	}
		// },
		// inputAlert() {
		// 	this.showAlert = true;
		// 	setTimeout(() => {
		// 		this.showAlert = false;
		// 	}, 1000);
		// },
	},
});
