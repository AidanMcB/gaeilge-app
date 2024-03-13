<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { type StoredData } from '../ts/interfaces';
import { getLocalStorage } from '../utils/helper';

    const router = useRouter();
    const resultsData = ref(getLocalStorage('answered_questions') as StoredData);

    function returnHome() {
        localStorage.removeItem('answered_questions');
        router.push('/');
    }

    function tryAnotherQuiz() {
        localStorage.removeItem('answered_questions');
        router.push('/quiz');
    }

</script>

<template>

    <h2>You answered {{ resultsData.submittedAnswers.filter(answ => answ.isCorrect === true)?.length }} / 10 questions correctly correct</h2>
    
    <div class='button-section'>
        <PrimeButton @click='tryAnotherQuiz' severity='secondary'>Try another quiz</PrimeButton>
        <PrimeButton @click='returnHome' severity='info'>Home</PrimeButton>
    </div>

    <div class='card-grid'>
        <PrimeCard v-for='(answerData, index) in resultsData.submittedAnswers' :header='answerData.questionText' :key='answerData.questionId'
            :class="{
                'is-correct': answerData.isCorrect,
                'is-incorrect': !answerData.isCorrect
            }">
            <template #title><span class='card-title'>{{ index+1 }}. {{ answerData.questionText }}</span></template>
            <template #content>
                <p v-if='answerData.isCorrect' class='m-0 correct-content'>
                    Answer: {{ answerData.answer }}
                </p>
                <p v-if='!answerData.isCorrect' class='m-0 incorrect-content'>
                    <span>Your answer: {{ answerData.answer }}</span>
                    <span>Correct answer: {{ answerData.correctAnswer }}</span>
                </p>
            </template>
        </PrimeCard>
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
.card-grid {
    display: grid;
    grid-gap: 1em;
}
.card-title, .m-0 {
    font-size: 0.9em;
    span {
        display: flex;;
    }
}
.p-card {
    .p-card-body{
        padding: 1em;
    }
    color: #fff;
    &.is-correct {
        background: $green-1;
    }
    &.is-incorrect {
        background: $error-1;
    }
    .p-card-title {
        font-weight: bold;
    }
}
</style>