<script setup lang='ts'>
import { useNoteCardStore } from '@/stores/notecardStore';
import type { INoteCard } from '@/ts/notecard';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const notecardStore = useNoteCardStore();
const { selectedIndex } = storeToRefs(notecardStore);

const props = defineProps<{
    cards: INoteCard[]
}>();

const notecards = ref([...props.cards])

const carouselKey = ref(0);

watch(
    () => notecards.value,
    (newVal) => {
        carouselKey.value++;
        notecards.value = [...newVal];
    },
    { deep: true }
);

const pt = {
    root: { class: ['flex justify-center w-full'] },
    item: { class: ['h-full flex justify-center'] },
    nextButton: { class: ['lg:h-20 lg:w-20 hover:bg-emerald-400/[0.5]'] },
    nextButtonIcon: { class: ['lg:h-[38px] lg:w-[28px]'] },
    previousButton: { class: ['lg:h-20 lg:w-20 hover:bg-emerald-400/[0.5]'] },
    previousButtonIcon: { class: ['lg:h-[38px] lg:w-[38px]'] },
    content: { class: [''] },
    indicator: { class: ['mt-4 bg-emerald-800'] },
}
</script>

<template>
    <PrimeCarousel :key='carouselKey' :value="cards" :numVisible="1" :numScroll="1" :activeIndex="selectedIndex" orientation="horizontal" verticalViewPortHeight="330px" contentClass="flex align-items-center" :pt="pt">
        <template #item="slotProps">
            <div class='w-full'>
                <NoteCard data-testid='notecard-preview' :key='slotProps.data' :variant='"carousel-notecard text-4xl"' :notecard='slotProps.data'></NoteCard>
            </div>
        </template>
    </PrimeCarousel>
</template>

<style lang='scss'>
.carousel-notecard {
    height: 300px!important;
}
</style>