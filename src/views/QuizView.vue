<script setup lang="ts">
import { useRouter } from 'vue-router'
import quizData from '../assets/quizQuestionsA.json';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const router = useRouter()

function handleCardClick(quizSection: number) {
    const startingQuestion = Math.floor(Math.random() * 10)+1;
    localStorage.setItem('answered_questions', JSON.stringify({ section: quizSection, answers: [] }) );
    localStorage.setItem('question_number', '1');
    router.push(`/quiz/section/${quizSection}/question/${startingQuestion}`);
}

</script>

<template>
    <div class='quiz-page'>
        <h2>Choose a section</h2>

        <Accordion :activeIndex='0' class='grid gap-4 lg:grid-cols-2 sm:grid-cols-1'>
            <AccordionTab v-for='quizSection in quizData' :key='quizSection.id' :header='"Section " + quizSection.section'>
                <p class='m-0'>
                    {{quizSection.description}}
                </p>
                <PrimeButton @click='handleCardClick(quizSection.section)' class='border border-green-500 p-1 rounded hover:bg-green-600 hover:text-red-300'>
                    Start Quiz
                </PrimeButton>
            </AccordionTab> 
            <AccordionTab class='disabled-card border-green-500'>
                <template #header>Section 2</template>
                <p class='m-0'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.
                </p>
            </AccordionTab>
            <AccordionTab class='disabled-card'>
                <template #header>Section 2</template>
                <p class='m-0'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.
                </p>
            </AccordionTab>
            <AccordionTab class='disabled-card'>
                <template #header>Section 3</template>
                <p class='m-0'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.
                </p>
            </AccordionTab>
            <AccordionTab class='disabled-card'>
                <template #header>Section 4</template>
                <p class='m-0'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ligula nec mauris placerat, vel.
                </p>
            </AccordionTab>    
        </Accordion>

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
        background: $green-1;
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