import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
import QuestionView from '../views/QuestionView.vue';
import ResultsView from '../views/ResultsView.vue';
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
            path: '/quiz',
            name: 'quiz',
            component: QuizView,
        },
        {
            path: '/quiz/section/:section_id/question/:question_id',
            name: 'question',
            component: QuestionView
        },
        {
            path: '/quiz/section/:section_id/results',
            name: 'results',
            component: ResultsView
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
