<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { MultipleChoiceDataKeys } from '../ts/enums';
import { type QuizQuestion } from '../ts/interfaces';
import { clearAllStoredData, getLocalQuizData } from '../utils/helper';

    const router = useRouter();
	const storedData = getLocalQuizData(MultipleChoiceDataKeys.AnsweredQuestions);

    function returnHome() {
        clearAllStoredData();
        router.push('/');
    }

    function tryAnotherQuiz() {
        clearAllStoredData();
        router.push('/quiz');
    }

    function isCorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.correctAnswer);
    }

    function isIncorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.selectedAnswer && option != question.correctAnswer);
    }

    if (!storedData) {
        // Return to previous view
        router.go(-1);
    }

    const correctAnswers = storedData.submittedAnswers.filter(answ => answ.isCorrect === true)?.length;
    const percentage = (correctAnswers / 10)*100;
</script>

<template>
    <div class='wrapper'>
        <h2 :class="{
            'text-3xl m-4 text-center font-bold lg:text-6xl': true,
            'text-emerald-500': percentage > 80,
            'text-orange-500': percentage > 70 && percentage > 80,
            'text-rose-500': percentage < 80
        }">
            {{ percentage }}%
        </h2>
        <h2 class='text-xl m-2 sm:text-lg lg:text-2xl'>You answered {{ correctAnswers }} / 10 questions correctly.</h2>
    
        <div class='card-grid grid gap-10 place-content-center mt-6 mb-1'>

            <PrimeCard v-for='(q, index) in storedData.submittedAnswers' :header='q.question' :key='q.id'>
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

</template>

<style lang='scss'>
@import '../styles/variables';
h2 {
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