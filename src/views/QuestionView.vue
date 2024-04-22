<script setup lang='ts'>
    import { onMounted, ref } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { useQuizStore } from '../stores/quizStore';
    import { type QuizQuestion } from '../ts/interfaces';

    const route = useRoute()
    const router = useRouter();
	const store = useQuizStore();
    const state = ref({
        isLoading: true,
        sectionId: 0, 
        questionId: 0,
    });

    onMounted(async () => {
        state.value.sectionId = parseInt(route.params.section_id as string);
        state.value.questionId = parseInt(route.params.question_id as string);

        await store.initQuestionView(state.value.sectionId, state.value.questionId);
        state.value.isLoading = false;
    });

    function handleSubmit(question: QuizQuestion) {
        const selectedAnswer = store.selected;
        if (selectedAnswer) {
            store.activeQuestion.isSubmitted = true;
            const isCorrect = question.correctAnswer === selectedAnswer;
            store.activeQuestion.isCorrect = isCorrect;
            store.submitAnswer({ questionId: state.value.questionId, isCorrect, selectedAnswer: selectedAnswer });
        } 
    }

    function handleNext() {
        if (store.isLastQuestion()) {
            router.push(`/quiz/section/${state.value.sectionId}/results`);
        } else {
            const nextQuestion = store.randomNextQuestion();
            router.push(`/quiz/section/${state.value.sectionId}/question/${nextQuestion}`);
        }
    }

</script>

<template>
	<div data-testid='question-view' :data-cy='"question-"+state.questionId' :data-question-id='state.questionId'
    :class="{
        'question-view transition-all duration-200': true, 
        'submitted': store.activeQuestion.isSubmitted,
        'opacity-100': store.activeQuestion.id && !state.isLoading,
        'opacity-0': !store.activeQuestion.id || state.isLoading
    }">
        <h1 class='question text-2xl lg:text-4xl'>{{ store.activeQuestion?.question }}</h1>
        
        <div class='options-grid' v-if='store.activeQuestion?.choices'>
            <MultipleChoiceOptions/>
        </div>

        <div class='button-section'>
            <PrimeButton class='transition ease-in-out duration-300 text-lg border border-emerald-500 rounded-md bg-emerald-500 p-2 text-white lg:text-2xl lg:p-4 disabled:opacity-60' 
                @click='handleSubmit(store.activeQuestion)' 
                v-if='!store.activeQuestion.isSubmitted'
                :disabled='store.activeQuestion.isSubmitted || !store.selected'
                data-testid='submit-btn'>
                Submit
            </PrimeButton>
            <PrimeButton class='transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md p-2 lg:text-2xl lg:p-4 hover:border-orange-200 hover:bg-orange-500 hover:text-white' 
                v-if='store.activeQuestion.isSubmitted' 
                @click='handleNext' 
                severity='info'
                data-testid='next-or-see-answer-btn'>
                <span v-if='store.isLastQuestion() && store.activeQuestion.isSubmitted'>See Answers</span>
                <span v-if='!store.isLastQuestion() && store.activeQuestion.isSubmitted'>Next</span>  
            </PrimeButton>
        </div>

        <div class='flex items-center'>
            <span v-if='!store.activeQuestion.id || state.isLoading' class='text-emerald-500 lg:text-2xl'> 
                <i class='pi pi-spinner animate-spin lg:text-2xl'></i>
                loading ...
            </span>
            <p class='ml-auto lg:text-2xl'> {{ store.answeredQuestionCount }} / 10</p>
        </div>

	</div>
</template>

<style lang='scss'>
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
                cursor: pointer;
            }
        }
    }
}
.question-view.submitted {
    .options-grid{
        .option {
            pointer-events: none;
            .p-radiobutton, label {
                &:hover {
                    cursor: default;
                }
            }
        }
    }
}

</style>