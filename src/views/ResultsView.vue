<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { _getSubmittedAnswers } from '../services/quiz.service';
import { useQuizStore } from '../stores/quizStore';
import { type QuizQuestion, type SubmittedData } from '../ts/interfaces';
import { calcPercent, clearAllStoredData } from '../utils/helper';

    const router = useRouter();
    const store = useQuizStore();
    const state = ref({
        isLoading: true,
        error: '',
        answeredQuestions: {} as SubmittedData,
        isQuizComplete: false,
        percentage: 0,
        correctAnswers: 0
    });

    onMounted(async () => {
        try {
            const submittedAnswers = await _getSubmittedAnswers();
            if (submittedAnswers) {
                state.value.answeredQuestions = submittedAnswers;
                state.value.isLoading = false;
                if (submittedAnswers?.questions?.length === 10) {
                    state.value.isQuizComplete = true;
                    state.value.correctAnswers = submittedAnswers.questions.filter(answ => answ.isCorrect === true)?.length;
                    state.value.percentage = calcPercent(submittedAnswers.questions.filter(answ => answ.isCorrect === true)?.length, 10);
                }
            }
        } catch (err) {
            state.value.error = err as string;
            console.error('Error getting submitted answers. Error: ', err);
        }

    })

    function returnHome() {
        clearAllStoredData();
        router.push('/');
    }

    function tryAnotherQuiz() {
        store.clearQuizData();
        clearAllStoredData();
        router.push('/section-select');
    }

    function isCorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.correctAnswer);
    }

    function isIncorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.selectedAnswer && option != question.correctAnswer);
    }

    function goBack(): void {
        // Return to previous view
        router.go(-1);
    } 

</script>

<template>
    <div class='wrapper'>

        <span v-if='state.isLoading' class='flex flex-col justify-center items-center h-5/6'>
            <i class='pi pi-spinner animate-spin text-emerald-500 text-8xl'></i>
        </span>

        <div v-if='state.error.length > 0 && !state.isLoading' class='flex flex-col justify-center items-center h-full'>
            <span class='text-rose-500 text-2xl basis-2/3'>{{ state.error }}</span>
        </div>

        <div v-if='state.error.length === 0 && !state.isLoading && !state.isQuizComplete' class='flex flex-col justify-center items-center h-full'>
            <span class='text-center text-emerald-500 text-2xl mb-12'> You have not answered all 10 quiz questions!</span>
            <button @click='goBack()' 
                class='transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md bg-orange-600 p-2 text-white lg:text-2xl lg:p-4 hover:bg-orange-500 hover:text-white'>
                Go Back
            </button>
        </div>

        <div id='page-content' v-if='state.error.length === 0 && !state.isLoading && state.isQuizComplete'
        :class="{
            'transition-all duration-400': true,
            'opacity-100': !state.isLoading && state.isQuizComplete,
            'opacity-0': state.isLoading && !state.isQuizComplete
        }">
            
            <h1 :class="{
                'text-3xl m-4 text-center font-bold lg:text-6xl': true,
                'text-emerald-500': state.percentage > 80,
                'text-orange-500': state.percentage > 70 && state.percentage < 80,
                'text-rose-500': state.percentage < 70
            }">
                {{ state.percentage }}%
            </h1>
            <h1 class='text-xl m-2 sm:text-lg lg:text-2xl'>You answered {{ state.correctAnswers }} / 10 questions correctly.</h1>
            <div class='card-grid grid gap-10 place-content-center mt-6 mb-1'>

                <PrimeCard v-for='(q, index) in state.answeredQuestions.questions' :header='q.question' :key='q.id'>
                    <template #title>
                        <span class='card-title text-lg font-bold sm:text-xl md:text-2xl'>{{ index+1 }}. {{ q.question }}</span>
                    </template>
                    <template #content>
                        <div class='grid gap-2 grid-cols-2 grid-rows-4 md:grid-cols-3 place-content-center m-4 lg:text-2xl'>
                            <div class='row-span-4 flex items-center'>
                                <span v-if='!q.isCorrect' class='inline-flex items-center border border-rose-500 rounded-md bg-transparent text-base p-1 font-bold text-red-700 ring-1 ring-inset ring-red-600/10 lg:text-2xl lg:p-4'>Incorrect</span>
                                <span v-if='q.isCorrect' class='inline-flex items-center border border-emerald-500 rounded-md bg-transparent text-base p-1 font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 lg:text-2xl'>Correct</span>
                            </div>
                            <div v-for='choice in q.choices' :key='choice' class='mr-2 flex justify-start items-center md:row-span-2 lg:mb-2 lg:mt-2'>
                                <span :class="{
                                    'text-emerald-600': isCorrect(q, choice),
                                    'text-rose-500': isIncorrect(q, choice),
                                }">
                                    {{ choice }}
                                </span>
                            </div>
                        </div>

                        <hr class='h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 lg:m-4' />            
                    </template>
                </PrimeCard>
            
                <div class='flex justify-evenly mb-16'>
                    <PrimeButton 
                        class='transition ease-in-out duration-300 text-lg border border-emerald-500 rounded-md bg-emerald-600 p-2 text-white lg:text-2xl lg:p-4 hover:bg-emerald-500 hover:text-white' 
                        @click='tryAnotherQuiz' severity='secondary'>
                        Try another quiz
                    </PrimeButton>
                    <PrimeButton 
                        class='transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md bg-orange-600 p-2 text-white lg:text-2xl lg:p-4 hover:bg-orange-500 hover:text-white' 
                        @click='returnHome' severity='info'>
                        Home
                    </PrimeButton>
                </div>
            </div>
        </div>


    </div>

</template>

<style lang='scss'>
@import '../styles/variables';
h1 {
    text-align: center;
    font-weight: bold;
}
.button-section {
    margin: 2em;
}
.p-card {
    .p-card-body{
        padding: 1em;
    }
    color: #fff;

    .p-card-title {
        font-weight: bold;
    }
}
</style>