<script setup lang='ts'>
import type { QuizQuestion } from '../ts/interfaces';

const props = defineProps<{
    question: QuizQuestion;
    index: number;
}>();

function isCorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.correctAnswer);
    }

    function isIncorrect(question: QuizQuestion, option: string): boolean {
        return (option === question.selectedAnswer && option != question.correctAnswer);
    }
</script>

<template>
    <PrimeCard :header='props.question.question' :key='props.question.id'>
        <template #title>
            <span class='card-title text-lg font-bold sm:text-xl md:text-2xl'>{{ index+1 }}. {{ props.question.question }}</span>
        </template>
        <template #content>
            <div class='grid gap-2 grid-cols-2 grid-rows-4 md:grid-cols-3 place-content-center m-4 lg:text-2xl'>
                <div class='row-span-4 flex items-center'>
                    <span v-if='!props.question.isCorrect' class='inline-flex items-center border border-rose-500 rounded-md bg-transparent text-base p-1 font-bold text-red-700 ring-1 ring-inset ring-red-600/10 lg:text-2xl lg:p-4'>Incorrect</span>
                    <span v-if='props.question.isCorrect' class='inline-flex items-center border border-emerald-500 rounded-md bg-transparent text-base p-1 font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 lg:text-2xl'>Correct</span>
                </div>
                <div v-for='choice in props.question.choices' :key='choice' class='mr-2 flex justify-start items-center md:row-span-2 lg:mb-2 lg:mt-2'>
                    <span :class="{
                        'text-emerald-600': isCorrect(props.question, choice),
                        'text-rose-500': isIncorrect(props.question, choice),
                    }">
                        {{ choice }}
                    </span>
                </div>
            </div>
            <hr class='h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 lg:m-4' />            
        </template>
    </PrimeCard>
</template>