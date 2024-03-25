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
    <div class='sticky bg-black-400 w-full top-0 left-0 right-0'>
        <a class='nav-card text-2xl lg:text-4xl' @click='onClickHome'>
            <i class='pi pi-home text-2xl text-orange-400 lg:text-4xl'></i>
        </a>
    </div>
</template>

<style lang='scss'>
	@import '../styles/variables.scss';
        .nav-card {
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
