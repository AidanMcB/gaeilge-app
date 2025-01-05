<script lang='ts' setup>
defineProps<{
    isLoading: boolean;
    isQuizComplete: boolean;
    error: string;
}>();

const emits = defineEmits(['goBack']);
</script>

<template>
    <span v-if='isLoading' class='flex flex-col justify-center items-center h-5/6'>
        <i class='pi pi-spinner animate-spin text-emerald-500 text-8xl'></i>
    </span>
    <div v-if='error.length > 0 && !isLoading' class='flex flex-col justify-center items-center h-full'>
        <span class='text-rose-500 text-2xl basis-2/3'>{{ error }}</span>
    </div>
    <div v-if='error.length === 0 && !isLoading && !isQuizComplete' class='flex flex-col justify-center items-center h-full' data-testid='unfinished-quiz'>
        <span class='text-center text-emerald-500 text-2xl mb-12'> You have not answered all 10 quiz questions!</span>
        <button @click="emits('goBack')" class='btn-secondary'>
            Go Back
        </button>
    </div>
</template>