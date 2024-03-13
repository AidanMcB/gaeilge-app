<script setup lang='ts'>
import { useRouter } from 'vue-router';
const router = useRouter();

function onClickHome() {
    localStorage.removeItem('answered_questions');
    localStorage.removeItem('question_number');
    router.push('/');
}

</script>




<template>
    <a class="card" @click='onClickHome'>
        <i class="pi pi-home"></i>
    </a>
</template>

<style lang='scss'>
@import '../styles/variables.scss';
    .card {
        position: fixed;
        top: 1em;
        right: 1em;
        color: var(--orange-400);
        &:hover {
            cursor: pointer;
        }
        &:active {
            color: var(--orange-200);
        }
    }
</style>

