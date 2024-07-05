<script setup lang='ts'>
import { onMounted } from 'vue';
import { useNoteCardStore } from '../stores/notecardStore';
import { useTitle } from '@vueuse/core';

const notecardStore = useNoteCardStore();
const title = useTitle('Cárta Nótaí!');

onMounted(async () => {
    await notecardStore.getNoteCards();
});

</script>

<template>
    <div class='h-full w-full grid grid-rows-[1fr,2fr,9fr]'>
        <h1 class='header-1 m-0'>Cárta Nótaí</h1>
        <NoteCardActions></NoteCardActions>
        <NoteCardForm :visible='notecardStore.isAddEditModalOpen' :handleClose='notecardStore.closeAddEditModal' :isEditMode='false'></NoteCardForm>
    
        <div v-if='!notecardStore.gridView && notecardStore.notecards && notecardStore.notecards.length > 0' 
            class='flex pt-2 pb-2 transition ease-in-out duration-500' 
            :class="{ 
                'display-block opacity-0': notecardStore.gridView, 
                'display-none opacity-100': !notecardStore.gridView 
            }"
        >
            <NoteCardCarousel :notecards='notecardStore.notecards'></NoteCardCarousel>
        </div>

        <div v-if='notecardStore.gridView && notecardStore.notecards && notecardStore.notecards.length > 0' 
            class='grid notecard-grid self-end transition ease-in-out duration-500 h-[90%] mt-2' 
            :class="{ 'display-block opacity-0': !notecardStore.gridView, 'display-none opacity-100': notecardStore.gridView }"
        >
            <NoteCard v-for='card in notecardStore.notecards' data-testid='notecard-preview' :key='card.id' :notecard='card'></NoteCard>
        </div>
        
        <NoteCardForm v-if='notecardStore.isAddEditModalOpen'></NoteCardForm>
        <DeleteNoteCardForm></DeleteNoteCardForm>

    </div>
</template>