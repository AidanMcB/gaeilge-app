<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "../../stores/quizStore";
import { type QuizData } from "../../ts/interfaces";
import { calcPercent, clearAllStoredData } from "../../utils/helper";
import QuizResultsHeader from "@/components/Quiz/QuizResultsHeader.vue";

const router = useRouter();
const store = useQuizStore();
const state = ref({
    isLoading: true,
    error: "",
    answeredQuestions: {} as QuizData,
    isQuizComplete: false,
    percentage: 0,
    correctAnswers: 0,
    unlockedNewSection: false
});

onMounted(async () => {
    try {
        const quizData = await store.getActiveQuizDataFromDb();
        if (quizData) {
            state.value.answeredQuestions = quizData;
            state.value.isLoading = false;
            if (quizData?.questions?.length === 10) {
                state.value.isQuizComplete = true;
                state.value.correctAnswers = quizData.questions.filter(
                    (answ) => answ.isCorrect === true
                )?.length;
                state.value.percentage = calcPercent(
                    quizData.questions.filter((answ) => answ.isCorrect === true)?.length,
                    10
                );
                if (state.value.percentage > 70) {
                    // If score over 70, unlock next quiz sections
                    store.unlockSection(state.value.answeredQuestions.section + 1);
                    state.value.unlockedNewSection = true;
                }
            }
        }
    } catch (err) {
        state.value.error = err as string;
        console.error("Error getting submitted answers. Error: ", err);
    }
});
function returnHome() {
    clearAllStoredData();
    router.push("/");
}
function tryAnotherQuiz() {
    store.clearQuizData();
    clearAllStoredData();
    router.push("/section-select");
}
function goBack(): void {
    // Return to previous view
    router.go(-1);
}

const showQuizResults = computed(() => {
    return state.value.error.length === 0 && !state.value.isLoading && state.value.isQuizComplete;
});
</script>

<template>
    <QuizResultsHeader
        :is-loading="state.isLoading"
        :is-quiz-complete="state.isQuizComplete"
        :error="state.error"
        @go-back="goBack"
    ></QuizResultsHeader>
    <div
        v-if="showQuizResults"
        class="h-full flex flex-col justify-center gap-2"
        :class="{
            'transition-all duration-400': true,
            'opacity-100': !state.isLoading && state.isQuizComplete,
            'opacity-0': state.isLoading && !state.isQuizComplete
        }"
    >
        <h1
            data-testid="result-percentage"
            :class="{
                'text-3xl text-center font-bold lg:text-6xl': true,
                'text-emerald-500': state.percentage > 80,
                'text-orange-500': state.percentage > 70 && state.percentage < 80,
                'text-rose-500': state.percentage < 70
            }"
        >
            {{ state.percentage }}%
        </h1>
        <h1 class="text-xl sm:text-lg lg:text-2xl">
            You answered {{ state.correctAnswers }} / 10 questions correctly in section
            {{ state.answeredQuestions.section }}.
        </h1>
        <BannerMessage
            v-if="state.unlockedNewSection"
            :isVisible="state.unlockedNewSection"
            :mainText="'Congratulations! You have unlocked '"
            :actionText="'Section ' + (state.answeredQuestions.section + 1)"
            :handleClick="tryAnotherQuiz"
        />

        <div class="flex-1 overflow-y-auto my-8">
            <QuizQuestionResult
                v-for="(q, index) in state.answeredQuestions.questions"
                :question="q"
                :index="index"
                :key="q.id"
            ></QuizQuestionResult>
        </div>

        <div class="flex justify-evenly">
            <PrimeButton class="btn-primary" @click="tryAnotherQuiz" severity="secondary">
                Try another quiz
            </PrimeButton>
            <PrimeButton class="btn-secondary" @click="returnHome" severity="info">
                Home
            </PrimeButton>
        </div>
    </div>
</template>

<style lang="scss">
@import "../../styles/variables";
h1 {
    text-align: center;
    font-weight: bold;
}
.button-section {
    margin: 2em;
}
.p-card {
    .p-card-body {
        padding: 1em;
    }
    color: #fff;

    .p-card-title {
        font-weight: bold;
    }
}
</style>
