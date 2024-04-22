import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SectionSelectView from '../views/SectionSelectView.vue';
import QuestionView from '../views/QuestionView.vue';
import QuizResultsView from '../views/QuizResultsView.vue';
import MatchingView from '../views/MatchingView.vue';
import MatchingResultsView from '@/views/MatchingResultsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
              name: 'home',
              component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/section-select',
            name: 'section-select',
            component: SectionSelectView,
        },
        {
            path: '/quiz/section/:section_id/question/:question_id',
            name: 'question',
            component: QuestionView
        },
        {
            path: '/quiz/section/:section_id/results',
            name: 'results',
            component: QuizResultsView
        },
        {
            path: '/matching/section/:section_id/',
            name: 'matching',
            component: MatchingView,
        },
        {
            path: '/matching/section/:section_id/results',
            name: 'matchingResults',
            component:  MatchingResultsView
        },
    ]
})

export default router;
