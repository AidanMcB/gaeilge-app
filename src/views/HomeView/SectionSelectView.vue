<script setup lang="ts">
import { useQuizStore } from '../../stores/useQuizStore';
import { Practice } from '../../ts/Constants';
import { useMatchingStore } from '../../stores/useMatchingStore';
import { _getAllQuizData } from '../../services/quiz.service';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { _getNewVocabSectionById } from '../../services/matching.service';
import type { QuizData } from '@/ts/Quiz';
import type { PracticeType } from '@/ts/Base';

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
});

async function handleCardClick(sectionId: number, type: PracticeType): Promise<void> {
    if (type == Practice.Matching) {
        const matchingData = await _getNewVocabSectionById(sectionId);
        if (matchingData) {
            await matchingStore.startNewMatching(matchingData);
            router.push(`/matching/section/${sectionId}/`);
        }
    } else if (type == Practice.Quiz) {
        const quizData = state.value.allQuizData.find((quiz) => quiz.id == sectionId);
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
    <div
        data-testid="section-select"
        class="h-full flex flex-col"
        :class="{ 'justify-center items-center': state.isLoading }"
    >
        <h1 v-if="!state.isLoading" class="header-1">Roghnaigh modúl</h1>

        <span v-if="state.isLoading" class="flex flex-col justify-center items-center h-5/6">
            <i class="pi pi-spinner animate-spin text-emerald-500 text-8xl"></i>
        </span>

        <div
            v-if="state.error.length > 0 && !state.isLoading"
            class="flex flex-col justify-center items-center h-full"
        >
            <span class="text-rose-500 text-2xl basis-2/3">{{ state.error }}</span>
        </div>

        <div
            :activeIndex="0"
            v-if="!state.isLoading"
            class="p-2 flex-grow overflow-y-auto"
            :class="{
                'grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 transition-all duration-200': true,
                'opacity-100': !state.isLoading,
                'opacity-0': state.isLoading
            }"
        >
            <PrimeCard
                unstyled
                :data-testid="'section-' + quizSection.id"
                role="section"
                v-for="quizSection in state.allQuizData"
                :key="quizSection.id"
                class="p-2 border border-emerald-500 rounded lg:p-6"
                :pt="{
                    body: { class: 'flex flex-col h-full' },
                    footer: { class: 'flex mt-auto justify-around' }
                }"
            >
                <template #title>
                    <h1 class="text-xl font-bold text-center lg:text-4xl lg:p-4">
                        {{ 'Section ' + quizSection.section }}
                    </h1>
                </template>
                <template #content>
                    <div class="p-2 h-full">
                        <span class="lg:text-xl">{{ quizSection.description }}</span>
                    </div>
                </template>
                <template #footer>
                    <PrimeButton
                        @click="handleCardClick(quizSection.section, Practice.Matching)"
                        data-testid="matching"
                        :disabled="!quizStore.isSectionUnlocked(quizSection.id)"
                        class="btn-action"
                    >
                        Matching
                    </PrimeButton>
                    <PrimeButton
                        @click="handleCardClick(quizSection.section, Practice.Quiz)"
                        data-testid="quiz"
                        :disabled="!quizStore.isSectionUnlocked(quizSection.id)"
                        class="btn-action"
                    >
                        Quiz
                    </PrimeButton>
                </template>
            </PrimeCard>
        </div>
    </div>
</template>
