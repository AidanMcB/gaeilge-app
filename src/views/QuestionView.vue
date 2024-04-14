<script setup lang='ts'>
    import { onMounted } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { useQuizStore } from '../stores/quizStore';
    import { type QuizQuestion } from '../ts/interfaces';
    import { randomNextQuestion } from '../utils/helper';

    const route = useRoute()
    const router = useRouter();
	const store = useQuizStore();

    onMounted(async () => {
        await store.initQuestionView(parseInt(route.params.section_id as string), parseInt(route.params.question_id as string));
    });

    function handleSubmit(question: QuizQuestion) {
        const answer = store.selected;
        if (answer) {
            store.activeQuestion.isSubmitted = true;
            const isCorrect = question.correctAnswer === answer;
            store.activeQuestion.isCorrect = isCorrect;
            store.submitAnswer({ questionId: store.questionId, answer, isCorrect, selectedAnswer: answer });
        } 
    }

    function isLastQuestionsInQuiz(): boolean {
        return store.submittedData.questions?.length === 10;
    }

    function handleNext() {
        if (isLastQuestionsInQuiz()) {
            router.push(`/quiz/section/${store.sectionId}/results`);
        } else {
            const nextQuestion = randomNextQuestion(store.activeQuiz.questions, store.submittedData.questions);
            router.push(`/quiz/section/${store.sectionId}/question/${nextQuestion}`);
        }
    }

</script>

<template>
	<div :class="{
        'question-view transition-all duration-200': true, 
        'submitted': store.activeQuestion.isSubmitted,
        'opacity-100': store.activeQuestion.id,
        'opacity-0': !store.activeQuestion.id
    }">
        <h1 class='question text-2xl lg:text-4xl'>{{ store.activeQuestion?.question }}</h1>
        
        <div class='options-grid'>
            <MultipleChoiceOptions/>
        </div>

        <div class='button-section'>
            <PrimeButton class='transition ease-in-out duration-300 text-lg border border-emerald-500 rounded-md bg-emerald-500 p-2 text-white lg:text-2xl lg:p-4 disabled:opacity-60' 
                @click='handleSubmit(store.activeQuestion)' 
                v-if='!store.activeQuestion.isSubmitted'
                :disabled='store.activeQuestion.isSubmitted || !store.selected'>
                Submit
            </PrimeButton>
            <PrimeButton class='transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md p-2 lg:text-2xl lg:p-4 hover:border-orange-200 hover:bg-orange-500 hover:text-white' 
                v-if='store.activeQuestion.isSubmitted' 
                @click='handleNext' 
                severity='info'>
                <span v-if='isLastQuestionsInQuiz() && store.activeQuestion.isSubmitted'>See Answers</span>
                <span v-if='!isLastQuestionsInQuiz() && store.activeQuestion.isSubmitted'>Next</span>  
            </PrimeButton>
        </div>

        <div class='flex items-center'>
            <span v-if='!store.activeQuestion.id' class='text-emerald-500 lg:text-2xl'> 
                <i class='pi pi-spinner animate-spin lg:text-2xl'></i>
                loading ...
            </span>
            <p class='ml-auto lg:text-2xl'> {{ store.submittedData?.questions?.length }} / 10</p>
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
../stores/quizStore