<template>
    <NoteCardActions></NoteCardActions>
    <NoteCardForm :visible='notecardStore.isAddEditModalOpen' :handleClose='notecardStore.closeAddEditModal' :isEditMode='false'></NoteCardForm>
</template>

<script lang='ts' setup>
import { useNoteCardStore } from '@/stores/notecardStore';
import type { INoteCard } from '@/ts/notecard.interfaces';

const notecardStore = useNoteCardStore();


defineProps<{
    cards: INoteCard[];

}>()
</script>