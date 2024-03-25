
<script setup lang='ts'>
import { useQuizStore } from '../stores/quizQuestionStore';
import { type QuizQuestion } from '../ts/interfaces';

    const store = useQuizStore();

    function isSubmittedAndCorrect(option: string): boolean {
        return store.activeQuestion.isSubmitted && option === store.activeQuestion.correctAnswer;
    }

    function isSubmittedAndIncorrect(option: string): boolean {
        return (
            (store.activeQuestion.isSubmitted && store.selected === option && store.selected !== store.activeQuestion.correctAnswer) 
                ||
            (store.activeQuestion.isSubmitted && option == store.activeQuestion.selectedAnswer && !store.activeQuestion.isCorrect)
        );
    }

</script>

<template>
    <span v-for='opt in store.activeQuestion.choices' :key='opt' :disabled='store.activeQuestion.isSubmitted'
           :class="{
               'text-emerald-500': (!store.activeQuestion.isSubmitted && store.selected === opt) || isSubmittedAndCorrect(opt),
               'text-rose-500': isSubmittedAndIncorrect(opt),
               'option': true
           }"
    >
        <span v-if='store.activeQuestion.isSubmitted' class='mr-2'>
            <i class='pi pi-check text-emerald-500' v-if='isSubmittedAndCorrect(opt)'></i>
            <i class='pi pi-times text-rose-500' v-if='isSubmittedAndIncorrect(opt)'></i>
        </span>

        <input
            type='radio'
            @change='store.updateSelected(opt)'
            name='question'
            :id='opt' 
            :value='opt' 
            :disabled='store.activeQuestion.isSubmitted'
            v-if='!store.activeQuestion.isSubmitted'
            :class="{
                    'option mr-2 lg:mr-4': true,
                    'text-rose-500': isSubmittedAndIncorrect(opt),
                    'text-emerald-500': isSubmittedAndCorrect(opt),
               }"
        />
        <label :for='opt' :class="{
            'text-emerald-500': store.selected === opt && !store.activeQuestion.isSubmitted,
            'lg:text-4xl': true
        }"> {{ opt }} </label>
    </span>

</template>
