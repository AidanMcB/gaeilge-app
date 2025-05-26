<script setup lang="ts">
const props = defineProps<{
    mainText: string;
    actionText: string;
    isVisible: boolean;
    handleClick: () => void;
}>();
</script>

<template>
    <div
        data-testid="banner-message"
        :class="{
            'w-full flex justify-center transition ease-in-out duration-1000': true,
            'opacity-90 ': props.isVisible,
            'opacity-0': !props.isVisible
        }"
    >
        <div
            severity="success"
            class="text-white bg-emerald-500 p-2 rounded text-center md:text-xl"
        >
            {{ props.mainText }}
            <button @click="props.handleClick()" class="font-bold hover:underline">
                {{ props.actionText }}
            </button>
        </div>
    </div>
</template>
