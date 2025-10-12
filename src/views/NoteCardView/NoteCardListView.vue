<template>
    <div class="h-full w-full flex flex-col justify-self-center gap-2 p-2 sm:w-4/5 lg:w-2/3 xl:w-4/5">
        <h1 class="header-1 m-0 self-center">Cárta Nótaí</h1>

        <NoteCardActions />

        <div v-show="showSingleCard" class="h-full flex py-2 transition ease-in-out duration-500">
            <NoteCardCarousel :cards="notecards" :key="notecards.length"></NoteCardCarousel>
        </div>

        <div v-show="showNoteCardGrid" class="transition ease-in-out duration-500 h-full">
            <NoteCardGridView :cards="notecards" :key="notecards.length" />
        </div>
    </div>
    <NoteCardForm></NoteCardForm>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useNoteCardStore } from '../../stores/useNotecardStore';
import { useTitle } from '@vueuse/core';
import NoteCardGridView from './NoteCardGridView.vue';
import NoteCardCarousel from '@/components/noteCard/NoteCardCarousel.vue';
import NoteCardForm from '@/components/noteCard/NoteCardForm.vue';
import NoteCardActions from '@/components/noteCard/NoteCardActions.vue';
import { storeToRefs } from 'pinia';

const notecardStore = useNoteCardStore();
const { notecards, gridView } = storeToRefs(notecardStore);

onMounted(async () => {
    useTitle('Cárta Nótaí');
    try {
        notecardStore.initGridViewSetting();
        await notecardStore.getNoteCards();
    } catch (err) {
        console.error(err);
    }
});

const showSingleCard = computed(() => {
    return !gridView.value && notecards.value && notecards.value.length > 0;
});

const showNoteCardGrid = computed(() => {
    return gridView.value && notecards.value && notecards.value.length > 0;
});
</script>
