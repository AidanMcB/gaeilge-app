import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SectionSelectView from "../views/SectionSelectView.vue";
import QuestionView from "../views/QuizView/QuestionView.vue";
import QuizResultsView from "../views/QuizView/QuizResultsView.vue";
import MatchingView from "../views/MatchingView/MatchingView.vue";
import MatchingResultsView from "@/views/MatchingView/MatchingResultsView.vue";
import NoteCardListView from "@/views/NoteCardView/NoteCardListView.vue";
import LoginView from "@/views/LoginView/LoginView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/login",
            name: "login",
            component: LoginView
        },
        {
            path: "/section-select",
            name: "section-select",
            component: SectionSelectView
        },
        {
            path: "/quiz/section/:section_id/question/:question_id",
            name: "question",
            component: QuestionView
        },
        {
            path: "/quiz/section/:section_id/results",
            name: "results",
            component: QuizResultsView
        },
        {
            path: "/matching/section/:section_id/",
            name: "matching",
            component: MatchingView
        },
        {
            path: "/matching/section/:section_id/results",
            name: "matchingResults",
            component: MatchingResultsView
        },
        {
            path: "/notecards",
            name: "notecards",
            component: NoteCardListView
        }
    ]
});

export default router;
