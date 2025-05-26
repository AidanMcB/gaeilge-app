import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView/HomeView.vue";
import SectionSelectView from "../views/HomeView/SectionSelectView.vue";
import QuestionView from "../views/QuizView/QuestionView.vue";
import QuizResultsView from "../views/QuizView/QuizResultsView.vue";
import MatchingView from "../views/MatchingView/MatchingView.vue";
import MatchingResultsView from "@/views/MatchingView/MatchingResultsView.vue";
import NoteCardListView from "@/views/NoteCardView/NoteCardListView.vue";
import LoginView from "@/views/LoginView/LoginView.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginView
        },
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: { requiresAuth: true },
        },
        {
            path: "/section-select",
            name: "section-select",
            component: SectionSelectView,
            meta: { requiresAuth: true },
        },
        {
            path: "/quiz/section/:section_id/question/:question_id",
            name: "question",
            component: QuestionView,
            meta: { requiresAuth: true },
        },
        {
            path: "/quiz/section/:section_id/results",
            name: "results",
            component: QuizResultsView,
            meta: { requiresAuth: true },
        },
        {
            path: "/matching/section/:section_id/",
            name: "matching",
            component: MatchingView,
            meta: { requiresAuth: true },
        },
        {
            path: "/matching/section/:section_id/results",
            name: "matchingResults",
            component: MatchingResultsView,
            meta: { requiresAuth: true },
        },
        {
            path: "/notecards",
            name: "notecards",
            component: NoteCardListView,
            meta: { requiresAuth: true },
        }
    ]
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // Continue if route does not require auth
    if (!requiresAuth) {
        return next();
    }
    // Continue if user is already present in store
    if (authStore.user) {
        return next();
    }

    // If no user in store, check backend for active user
    const isAuthenticated = await authStore.verifyUser();
    if (isAuthenticated) {
        next();
    } else {
        next({ name: 'login' })
    }
});

export default router;
