<script setup lang="ts">
import { useQuizStore } from '../stores/quizStore';
import { type QuizData, type PracticeType } from '../ts/interfaces';
import { Practice } from '../ts/enums';
import { useMatchingStore } from '../stores/matchingStore';
import { _getAllQuizData } from '../services/quiz.service';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { _getNewVocabSectionById } from '../services/matching.service';

const router = useRouter();
const quizStore = useQuizStore();
const matchingStore = useMatchingStore();

const state = ref({
    allQuizData: [] as QuizData[],
    isLoading: true,
    error: ''
});

onMounted(async () => {
    try {
        const allQuizData = await _getAllQuizData();
        state.value.allQuizData = allQuizData;
        state.value.isLoading = false;
    } catch (err) {
        state.value.error = err as string;
    }
})

async function handleCardClick(sectionId: number, type: PracticeType): Promise<void> {
    if (type == Practice.Matching) {
        const matchingData = await _getNewVocabSectionById(sectionId);
        if (matchingData) {
            matchingStore.startNewMatchingQuiz(matchingData);
            router.push(`/matching/section/${sectionId}/`);
        }
    } else if (type == Practice.Quiz) {
        const quizData = state.value.allQuizData.find(quiz => quiz.id == sectionId);
        if (quizData) {
            try { 
                const startingQuestion = await quizStore.startNewQuiz(quizData);
                router.push(`/quiz/section/${sectionId}/question/${startingQuestion}`);
            } catch (err) {
                console.error(`Unable to start quiz of section ${sectionId}. Error: `, err);
            }
        } else {
            // unable to get quiz data;
        }
    }
}

</script>

<template>
    <div data-testid='section-select'>
        <h1 class='font-bold text-center text-4xl m-2 mb-6 lg:text5xl lg:mb-6'>Choose a section</h1>

        <span v-if='state.isLoading' class='flex flex-col justify-center items-center h-5/6'>
            <i class='pi pi-spinner animate-spin text-emerald-500 text-8xl'></i>
        </span>

        <div v-if='state.error.length > 0 && !state.isLoading' class='flex flex-col justify-center items-center h-full'>
            <span class='text-rose-500 text-2xl basis-2/3'>{{ state.error }}</span>
        </div>

        <div :activeIndex='0' :class="{
                'p-2 grid gap-6 lg:grid-cols-2 sm:grid-cols-1 transition-all duration-200': true,
                'opacity-100': !state.isLoading,
                'opacity-0': state.isLoading
            }">
            <PrimeCard :data-testid="'section-'+quizSection.id" role='section' v-for='quizSection in state.allQuizData' :key='quizSection.id' class='p-2 border border-emerald-500 rounded lg:p-6'>
                <template #title>
                    <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>{{ "Section " + quizSection.section}}</h1>
                </template>
                <template #content>
                    <div class='p-2 h-full'>
                        <span class='lg:text-xl'>{{quizSection.description}}</span>
                        <div class='flex justify-around'>
                            <PrimeButton @click='handleCardClick(quizSection.section, Practice.Matching)' 
                                data-testid='matching'
                                :disabled='!quizStore.isSectionUnlocked(quizSection.id)'
                                class='disabled:bg-gray-500 disabled:border-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Matching
                            </PrimeButton>
                            <PrimeButton @click='handleCardClick(quizSection.section, Practice.Quiz)' 
                                data-testid='quiz'
                                :disabled='!quizStore.isSectionUnlocked(quizSection.id)'
                                class='disabled:bg-gray-500 disabled:border-gray-500 m-3 text-white bg-emerald-600 border border-emerald-700 rounded p-1 rounded enabled:hover:bg-emerald-500 enabled:hover:text-white-300 flex lg:text-2xl'>
                                Quiz 
                            </PrimeButton>
                        </div>
                    </div>
                </template>
            </PrimeCard>
        </div>

    </div>
</template>