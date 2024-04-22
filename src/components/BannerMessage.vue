<script setup lang='ts'>
const props = defineProps<{
    mainText: string;
    actionText: string;
    isVisible: boolean;
    handleClick: () => void;
}>()
</script>

<template>
    <div data-testid='banner-message' :class="{
            'fixed bottom-4 left-0 w-full flex justify-center transition ease-in-out duration-1000': true,
            'opacity-90 ': props.isVisible,
            'opacity-0': !props.isVisible,
        }">
        <div severity='success' class='text-white bg-emerald-500 p-2 w-4/6 rounded text-center md:text-xl'>
            {{ props.mainText }}
            <button @click='props.handleClick()' class='font-bold' style="text-decoration: none !important;">
                {{ props.actionText }}
            </button>
        </div>
    </div>
</template>

