<script setup lang='ts'>
import { computed, onMounted } from 'vue';
import { useNoteCardStore } from '../../stores/notecardStore';
import { useTitle } from '@vueuse/core';
import NoteCardGridView from './NoteCardGridView.vue';
import NoteCardListHeader from './NoteCardListHeader.vue';

const notecardStore = useNoteCardStore();

onMounted(async () => {
    useTitle('Cárta Nótaí');
    await notecardStore.getNoteCards();
    notecardStore.initGridViewSetting();
});

const showSingleCard = computed(() => {
    return !notecardStore.gridView && notecardStore.notecards && notecardStore.notecards.length > 0
});

const showNoteCardGrid = computed(() => {
    return notecardStore.gridView && notecardStore.notecards && notecardStore.notecards.length > 0
});

</script>

<template>
    <div class='h-full w-full grid grid-rows-[1fr,2fr,9fr]'>
        <h1 class='header-1 m-0'>Cárta Nótaí</h1>
        <NoteCardListHeader :cards='notecardStore.notecards'/>

        <div v-if='showSingleCard' 
            class='flex pt-2 pb-2 transition ease-in-out duration-500' 
            :class="{ 
                'display-block opacity-0': notecardStore.gridView, 
                'display-none opacity-100': !notecardStore.gridView 
            }"
        >
            <NoteCardCarousel :notecards='notecardStore.notecards'></NoteCardCarousel>
        </div>

        <div v-if='showNoteCardGrid' 
            class='transition ease-in-out duration-500 h-[90%] mt-2' 
            :class="{ 'display-block opacity-0': !notecardStore.gridView, 'display-none opacity-100': notecardStore.gridView }"
        >
            <NoteCardGridView :cards='notecardStore.notecards'/>
        </div>
        
        <NoteCardForm v-if='notecardStore.isAddEditModalOpen'></NoteCardForm>
        <DeleteNoteCardForm></DeleteNoteCardForm>
    </div>
</template>