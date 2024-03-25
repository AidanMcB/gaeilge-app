
<script setup lang='ts'>
import { useQuizStore } from '../stores/quizQuestionStore';
import RadioButton from 'primevue/radiobutton';
import { type QuizQuestion } from '../ts/interfaces';
import { toRefs } from 'vue';

    const props = defineProps<{
        question: QuizQuestion;
    }>();

    const { question } = toRefs(props);
    const store = useQuizStore();

    function isSubmittedAndCorrect(option: string): boolean {
        return question.value.isSubmitted && option === question.value.correctAnswer
    }

    function isSubmittedAndIncorrect(option: string): boolean {
        return (
            (question.value.isSubmitted && store.selected === option && store.selected !== question.value.correctAnswer) 
                ||
            (question.value.isSubmitted && option == question.value.selectedAnswer && !question.value.isCorrect)
        );
    }

</script>

<template>
    <span v-for='opt in question.choices' :key='opt' :disabled='question.isSubmitted'
           :class="{
               'is-selected': (!question.isSubmitted && store.selected === opt),
               'is-correct': isSubmittedAndCorrect(opt),
               'is-incorrect': isSubmittedAndIncorrect(opt),
               'option': true
           }"
    >
        <span v-if='question.isSubmitted' class='mr-2'>
            <i class='pi pi-check text-emerald-500' v-if='isSubmittedAndCorrect(opt)'></i>
            <i class='pi pi-times text-rose-500' v-if='isSubmittedAndIncorrect(opt)'></i>
        </span>

        <input
            type='radio'
            @change='store.updateSelected(opt)'
            name='question'
            :id='opt' 
            :value='opt' 
            :disabled='question.isSubmitted'
            v-if='!question.isSubmitted'
            :class="{
                    'option mr-2 lg:mr-4': true,
                    'is-incorrect': isSubmittedAndIncorrect(opt),
                    'is-correct': isSubmittedAndCorrect(opt),
               }"
        />
        <label :for='opt' :class="{
            'text-emerald-500': store.selected === opt && !question.isSubmitted,
            'lg:text-4xl': true
        }"> {{ opt }} </label>
    </span>

</template>
