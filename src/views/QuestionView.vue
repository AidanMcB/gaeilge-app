<script setup lang="ts">
    import { onBeforeMount, ref } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { useQuizStore } from '../stores/quizQuestionStore';
    import RadioButton from 'primevue/radiobutton';
    import { useToast } from 'primevue/usetoast';
    import Toast from 'primevue/toast';
    import { type StoredData, type QuizQuestion, type Answer } from '../ts/interfaces';
    import { getLocalStorage } from '../utils/helper';

    const route = useRoute()
    const router = useRouter();

    const sectionId = parseInt(route.params.section_id as string);
    const questionId = parseInt(route.params.question_id as string);

	const store = useQuizStore();
    const selected = ref();
    const questionState = ref({
        isSubmitted: false,
        isCorrect: false
    });
    const storedData = ref(getLocalStorage('answered_questions'));
    const activeQuestionNumber = ref(localStorage.getItem('question_number'));

    onBeforeMount(() => {
        store.setActiveQuiz(sectionId);
        store.setActiveQuestion(questionId);

        // check for answered questions in localStorage
        const index = storedData.value.submittedAnswers?.findIndex(answer => questionId === answer.questionId);
        if (index > -1) {
            selected.value = storedData.value.submittedAnswers[index].answer;
            questionState.value.isSubmitted = true;
        }

    });

    function handleSubmit(question: QuizQuestion) {
        
        const answer = selected.value;
        if (answer) {
            questionState.value.isSubmitted = true;
            const isCorrect = question.correctAnswer === answer;
            showToast(isCorrect);

            questionState.value.isCorrect = isCorrect;
            
            const newStoredAnswer: Answer = { 
                questionId,
                isCorrect,
                answer,
                correctAnswer: question.correctAnswer,
                questionText: question.question
            };

            if (storedData.value) {
                if (storedData.value.submittedAnswers) {
                    const index = storedData.value.submittedAnswers?.findIndex(answer => answer.questionId === questionId);
                    if (index === -1) {
                        // if this question has not yet been answered, add the selected answer
                        storedData.value.submittedAnswers.push(newStoredAnswer);
                        localStorage.setItem('answered_questions', JSON.stringify(storedData.value));
                    } else {
                        // This question has already answered, shouldn't be able to get here
                        console.log('already answered');
                    }
                } else {
                    // first question being answered 
                    const newStoredData: StoredData = { section: sectionId, submittedAnswers: [ { ...newStoredAnswer} ] };
                    localStorage.setItem('answered_questions', JSON.stringify(newStoredData)); 
                }
            } else {
                // create stored data
                const newStoredData: StoredData = { section: sectionId, submittedAnswers: [ { ...newStoredAnswer} ] };
                localStorage.setItem('answered_questions', JSON.stringify(newStoredData));
            }
        }
    }

    function isLastQuestionsInQuiz(): boolean {
        if (storedData.value.submittedAnswers?.length === 10) {
            return true;
        } else {
            return false;
        }
    }

    const toast = useToast();
    const showToast = (isCorrect: boolean) => {
        if (!isCorrect) {
            toast.add({ severity: 'error', summary: 'Incorrect', detail: `The correct answer is "${store.activeQuestion.correctAnswer}".` });
        } else {
            toast.add({ severity: 'success', summary: 'Correct!' });
        }
    };

    function handleNext() {
        if (isLastQuestionsInQuiz()) {
            router.push(`/quiz/section/${sectionId}/results`);
        } else {
            const questionNumber = parseInt(activeQuestionNumber.value || '1') || 1;
            localStorage.setItem('question_number', (questionNumber + 1).toString());
            const allQuestionIds: number[] = store.currentQuizData.questions.map(q => q.id);
            const answeredQuestionIds: number[] = storedData.value.submittedAnswers?.map(answ => answ.questionId) || [];
            const remainingQuestionIds: number[] = allQuestionIds.filter(id => !answeredQuestionIds.includes(id));
            const nextQuestion = remainingQuestionIds[Math.floor(Math.random()*remainingQuestionIds.length)];
            router.push(`/quiz/section/${sectionId}/question/${nextQuestion}`);
        }
    }


</script>

<template>
	<div :class='"question-view " + (questionState.isSubmitted ? "submitted" : "")'>
        <Toast />

        <h1 class='question'>{{ store.activeQuestion?.question }}</h1>
        <div class='options-grid'>
            <span v-for='opt in store.activeQuestion.choices' :key='opt' :disabled="questionState.isSubmitted" 
                :class="{
                    'is-selected': (!questionState.isSubmitted && selected === opt),
                    'is-correct': (questionState.isSubmitted && opt === store.activeQuestion.correctAnswer),
                    'is-incorrect': (questionState.isSubmitted && selected === opt && selected !== store.activeQuestion.correctAnswer),
                    'option': true
                }"
            >
                <RadioButton v-model='selected' :inputId='opt' name='question' :value='opt' :disabled="questionState.isSubmitted"/>
                <label :for='opt'> {{ opt }} </label>
            </span>
        </div>

        <div class='button-section'>
            <PrimeButton @click="handleSubmit(store.activeQuestion)" :disabled='questionState.isSubmitted || !selected'>Submit</PrimeButton>
            <PrimeButton @click="handleNext" v-if="questionState.isSubmitted" severity='info'>
                <span v-if='isLastQuestionsInQuiz() && questionState.isSubmitted'>See Answers</span>
                <span v-if='!isLastQuestionsInQuiz() && questionState.isSubmitted'>Next</span> 
            </PrimeButton>
        </div>

        <p class='bottom-right'>{{ activeQuestionNumber }} / 10</p>
	</div>
</template>

<style lang="scss">
@import '../styles/variables';

.question-view{
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
}
.question {
    font-weight: bold;
    text-align: center;
    align-self: center;
}
.options-grid {
    display: grid;
    grid-template-columns: 1fr;
    font-size: 1.5em;
    .option {
        display: flex;
        align-items: center;
        justify-content: center;
        .p-radiobutton {
            margin-right: 6px;
        }
        &.p-radiobutton, label {
            &:hover, &:active, &:focus {
                color: $green-1;
                cursor: pointer;
            }
        }
    }
}
.question-view.submitted {
    .options-grid{
        .option {
            &.is-correct{
                color: $green-2;
            }
            &.is-incorrect {
                color: $error-1;
            }
            pointer-events: none;
            .p-radiobutton, label {
                &:hover {
                    cursor: default;
                }
            }
        }
    }
}

.p-toast.p-component.p-toast-top-right.p-ripple-disabled{
    max-width: calc(100vw - 40px);
    top: 1em;
    left: 1em;
}


</style>
