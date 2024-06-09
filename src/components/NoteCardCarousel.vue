<script setup lang='ts'>
import { type NoteCard } from '../ts/notecard.interfaces';

const props = defineProps<{
    notecards: NoteCard[];
}>()

const pt = {
    root: { class: ['flex justify-center w-full ml-2 mr-2'] },
    item: { class:  ['h-full flex justify-center'] },
    nextButton: { class: ['lg:h-20 lg:w-20 hover:bg-emerald-400/[0.5]'] },
    nextButtonIcon: { class: ['lg:h-[38px] lg:w-[38px]'] },
    previousButton: { class: ['lg:h-20 lg:w-20 hover:bg-emerald-400/[0.5]'] },
    previousButtonIcon: { class: ['lg:h-[38px] lg:w-[38px]'] },
    content: {class: [''] },
}
</script>


<template>
    <PrimeCarousel :value="props.notecards" :numVisible="1" :numScroll="1" orientation="horizontal" verticalViewPortHeight="330px" contentClass="flex align-items-center" :pt="pt">
        <template #item="slotProps">
            <div class='ml-2 mr-2 w-full md:w-2/3'>
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