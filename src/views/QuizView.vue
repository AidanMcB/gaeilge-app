<script setup lang="ts">
import { useQuizStore } from '../stores/quizQuestionStore';
import { type PracticeType } from '../ts/interfaces';
import { Practice } from '../ts/enums';
import { useMatchingStore } from '../stores/matchingStore';

const quizStore = useQuizStore();
const matchingStore = useMatchingStore();

function handleCardClick(quizSection: number, type: PracticeType) {
    if (type == Practice.Matching) {
        matchingStore.startNewMatching(quizSection);
    } else if (type == Practice.Quiz) {
        quizStore.startNewQuiz(quizSection);
    }
}

</script>

<template>
    <div class='quiz-page'>
        <h1 class='font-bold text-center text-4xl m-2 lg:text5xl lg:mb-6'>Choose a section</h1>

        <div :activeIndex='0' class='grid gap-6 lg:grid-cols-2 sm:grid-cols-1'>
            <PrimeCard role='section' v-for='quizSection in quizStore.allQuizData' :key='quizSection.id' class='p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>{{ "Section " + quizSection.section}}</h1>
                </template>
                <template #content>
                    <div class='p-2 h-full'>
                        <span class='lg:text-xl'>{{quizSection.description}}</span>
                        <div class='flex justify-around'>
                            <PrimeButton @click='handleCardClick(quizSection.section, Practice.Matching)' 
                                class='m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton @click='handleCardClick(quizSection.section, Practice.Quiz)' 
                                class='m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz 
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard> 

            <PrimeCard role='section' class='disabled-card p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>Section 2</h1>
                </template>
                <template #content>
                    <div class='p-2'>
                        <span class='lg:text-xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.</span>
                        <div class='flex justify-around'>
                            <PrimeButton
                                disabled
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton
                                disabled 
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard>

            <PrimeCard role='section' class='disabled-card p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>Section 3</h1>
                </template>
                <template #content>
                    <div class='p-2'>
                        <span class='lg:text-xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.</span>
                        <div class='flex justify-around'>
                            <PrimeButton
                                disabled
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton
                                disabled 
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard>

            <PrimeCard role='section' class='disabled-card p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>Section 4</h1>
                </template>               
                <template #content>
                    <div class='p-2'>
                        <span class='lg:text-xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.</span>
                        <div class='flex justify-around'>
                            <PrimeButton
                                disabled
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton
                                disabled 
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard>

            <PrimeCard role='section' class='disabled-card p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>Section 5</h1>
                </template>                
                <template #content>
                    <div class='p-2'>
                        <span class='lg:text-xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.</span>
                        <div class='flex justify-around'>
                            <PrimeButton
                                disabled
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton
                                disabled 
                                class='disabled:bg-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard> 
        </div>

    </div>
</template>

<style lang='scss'>
@import '../styles/_variables.scss';

.quiz-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1em;
    
    .p-card {
        color: #fff;
        .p-card-title {
            font-weight: bold;
        }
        transition: 1s;
        &:hover:not(.disabled-card) {
            transform: scale(1.05);
            cursor: pointer;
        }

        &.disabled-card {
            background-color: var(--gray-400);
            &:hover {
                cursor:not-allowed;
            }
        }
    }
}
a {
    display: flex;
    align-items: center;
    svg {
        margin-right: 6px;
    }
}

</style>