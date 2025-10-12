<template>
    <div class="card h-full flex flex-col">
        <PrimeDataView
            :value="cards"
            layout="grid"
            paginator
            :rows="12"
            :totalRecords="cards.length"
            :first="currentPage * 12"
            @page="onPageChange"
            :dataKey="'notecard-grid-id'"
            :pt="{
                root: { class: ['h-full flex flex-col'] },
                content: { class: ['flex-1 overflow-auto !border-0'] },
                dataview: { class: ['border-0 !border-0 outline-none'] },
                pcPaginator: { class: ['!py-2 flex-shrink-0'] },
                grid: { class: ['border-0 !border-0 outline-none'] }
            }"
        >
            <template #grid="slotProps">
                <div class="bg-base-black-main grid grid-cols-3 grid-rows-4 gap-4 p-2 h-full">
                    <NoteCard
                        v-for="card in slotProps.items"
                        data-testid="notecard-preview"
                        :key="card.id"
                        :notecard="card"
                        variant="!h-full"
                    />
                </div>
            </template>
        </PrimeDataView>
    </div>
</template>

<script setup lang="ts">
import NoteCard from '@/components/noteCard/NoteCard.vue';
import type { INoteCard } from '@/ts/notecard';
import { computed, ref } from 'vue';

const props = defineProps<{
    cards: INoteCard[];
}>();

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

<style lang="scss">
.p-dataview-paginator-bottom {
    padding: 0.5em 0;
    .p-paginator.p-component {
        background: rgb(40, 40, 40);
        color: var(--text-color);
    }
}
.p-dataview.no-border .p-dataview-content {
    border: none;
}
.p-dataview-grid {
    border: none !important;
}
[data-p-active='true'] {
    background: rgb(16 185 129);
    color: white;
}
</style>
