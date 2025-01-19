<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useNoteCardStore } from "../../stores/notecardStore";
import { useTitle } from "@vueuse/core";
import NoteCardGridView from "./NoteCardGridView.vue";
import NoteCardCarousel from "@/components/NoteCard/NoteCardCarousel.vue";
import NoteCardForm from "@/components/NoteCard/NoteCardForm.vue";
import { storeToRefs } from "pinia";
import NoteCardActions from "@/components/NoteCard/NoteCardActions.vue";

const notecardStore = useNoteCardStore();
const { notecards, gridView } = storeToRefs(notecardStore);

onMounted(async () => {
    useTitle("Cárta Nótaí");
    try {
        await notecardStore.getNoteCards();
        notecardStore.initGridViewSetting();
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

<template>
    <div class="h-full w-full justify-self-center grid grid-rows-[1fr,2fr,9fr] sm:w-4/5 lg:w-2/3">
        <h1 class="header-1 m-0">Cárta Nótaí</h1>

        <NoteCardActions />

        <div v-show="showSingleCard" class="flex pt-2 pb-2 transition ease-in-out duration-500">
            <NoteCardCarousel :cards="notecards" :key="notecards.length"></NoteCardCarousel>
        </div>

        <div v-show="showNoteCardGrid" class="transition ease-in-out duration-500 h-[90%] mt-2">
            <NoteCardGridView :cards="notecards" :key="notecards.length" />
        </div>
    </div>
    <NoteCardForm></NoteCardForm>
</template>
