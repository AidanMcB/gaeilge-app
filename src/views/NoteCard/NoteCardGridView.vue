
<template>
    <div class="card h-full flex flex-col">
        <DataView 
            :value="cards" 
            layout="grid" 
            paginator 
            :rows='12'
            :totalRecords="cards.length"
            :first="currentPage * 12"
            @page="onPageChange"
            :dataKey="'notecard-grid-id'"
            :pt="{
                root: { class: ['h-full'] },
                content: { class: ['h-full'] },
            }"
        >
            <template #grid="slotProps">
                <div class="bg-base-black-main h-full grid grid-cols-3 grid-rows-4 gap-4 p-2">
                    <NoteCard v-for='card in slotProps.items' 
                        data-testid='notecard-preview' 
                        :key='card.id' 
                        :notecard='card' 
                        variant='!h-full'
                        />
                </div>
            </template>
        </DataView>
    </div>
</template>

<script setup lang='ts'>
import NoteCard from '@/components/NoteCard/NoteCard.vue';
import type { INoteCard } from '@/ts/notecard.interfaces';
import { computed, ref } from "vue";

const props = defineProps<{
    cards: INoteCard[]
}>()

const currentPage = ref(0);

const paginatedItems = computed(() => {
    const start = currentPage.value * 12;
    const end = start + 12;
    return props.cards.slice(start, end);
});

const onPageChange = (event: any) => {
    currentPage.value = event.page;
};

</script>

<style lang='scss'>
.p-paginator.p-component {
    background: rgb(40,40,40);
    color: var(--text-color);
}
[data-p-active="true"] {
    background: rgb(16 185 129);
    color: white 
}
</style>
