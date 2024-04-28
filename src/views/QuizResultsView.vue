<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quizStore';
import { type QuizData } from '../ts/interfaces';
import { calcPercent, clearAllStoredData } from '../utils/helper';

    const router = useRouter();
    const store = useQuizStore();
    const state = ref({
        isLoading: true,
        error: '',
        answeredQuestions: {} as QuizData,
        isQuizComplete: false,
        percentage: 0,
        correctAnswers: 0,
        unlockedNewSection: false,
    });

    onMounted(async () => {
        try {
            const quizData = await store.getActiveQuizDataFromDb();
            if (quizData) {
                state.value.answeredQuestions = quizData;
                state.value.isLoading = false;

                if (quizData?.questions?.length === 10) {
                    state.value.isQuizComplete = true;
                    state.value.correctAnswers = quizData.questions.filter(answ => answ.isCorrect === true)?.length;
                    state.value.percentage = calcPercent(quizData.questions.filter(answ => answ.isCorrect === true)?.length, 10);

                    if (state.value.percentage > 70) {
                        // If score over 70, unlock next quiz sections
                        store.unlockSection(state.value.answeredQuestions.section + 1);
                        state.value.unlockedNewSection = true;
                    }
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

    function goBack(): void {
        // Return to previous view
        router.go(-1);
    } 

</script>

<template>
    <div class='wrapper'>

        <BannerMessage v-if='state.unlockedNewSection' :isVisible='state.unlockedNewSection' :mainText='"Congratulations! You have unlocked "' :actionText='"Section " + (state.answeredQuestions.section + 1)' :handleClick='tryAnotherQuiz'/>

        <span v-if='state.isLoading' class='flex flex-col justify-center items-center h-5/6'>
            <i class='pi pi-spinner animate-spin text-emerald-500 text-8xl'></i>
        </span>

        <div v-if='state.error.length > 0 && !state.isLoading' class='flex flex-col justify-center items-center h-full'>
            <span class='text-rose-500 text-2xl basis-2/3'>{{ state.error }}</span>
        </div>

        <div v-if='state.error.length === 0 && !state.isLoading && !state.isQuizComplete' class='flex flex-col justify-center items-center h-full' data-testid='unfinished-quiz'>
            <span class='text-center text-emerald-500 text-2xl mb-12'> You have not answered all 10 quiz questions!</span>
            <button @click='goBack()' class='btn-secondary'>
                Go Back
            </button>
        </div>

        <div id='page-content' v-if='state.error.length === 0 && !state.isLoading && state.isQuizComplete'
            :class="{
                'transition-all duration-400': true,
                'opacity-100': !state.isLoading && state.isQuizComplete,
                'opacity-0': state.isLoading && !state.isQuizComplete
        }">
            
            <h1 
                data-testid='result-percentage'
                :class="{
                'text-3xl m-4 text-center font-bold lg:text-6xl': true,
                'text-emerald-500': state.percentage > 80,
                'text-orange-500': state.percentage > 70 && state.percentage < 80,
                'text-rose-500': state.percentage < 70
            }">
                {{ state.percentage }}%
            </h1>
            <h1 class='text-xl m-2 sm:text-lg lg:text-2xl'>You answered {{ state.correctAnswers }} / 10 questions correctly in section {{ state.answeredQuestions.section }}.</h1>

            <div class='card-grid grid gap-10 place-content-center mt-6 mb-1'>
                <QuizQuestionResult v-for='(q, index) in state.answeredQuestions.questions' :question='q' :index='index' :key='q.id'></QuizQuestionResult>
                <div class='flex justify-evenly mb-16'>
                    <PrimeButton 
                        class='btn-primary' 
                        @click='tryAnotherQuiz' severity='secondary'>
                        Try another quiz
                    </PrimeButton>
                    <PrimeButton 
                        class='btn-secondary' 
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