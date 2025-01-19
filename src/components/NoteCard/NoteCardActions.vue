<script lang='ts' setup>
import { watchDebounced } from '@vueuse/core';
import { useNoteCardStore } from '../../stores/notecardStore';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const notecardStore = useNoteCardStore();
const { gridView, isEditAllMode } = storeToRefs(notecardStore)

function openModalAsAddMode(): void {
    notecardStore.openAddEditModal('add');
}

function toggleGridView() {
    notecardStore.toggleGridView();
    localStorage.setItem('grid-view', gridView.toString())
}

const searchInput = ref('');

watchDebounced(searchInput, () => {
    notecardStore.textFilter(searchInput.value);
}, { debounce: 500, maxWait: 5000 })


</script>

<template>
    <div class='flex flex-wrap items-center w-full md:px-10'>
        <PrimeButton class='btn-primary h-10 bg-emerald-400' title='Create a new card' @click='openModalAsAddMode'>
            <i class='pi pi-plus'></i> Cárta nua
        </PrimeButton>
        <PrimeButton @click='notecardStore.toggleEditMode' 
            class='bright-hover h-10 w-10 flex justify-center border border-emerald-500 transition ease-in-out duration-500 ml-auto text-white ml-auto'
            :class="{ 'bg-emerald-400 text-white': isEditAllMode }"
            :disabled='!gridView'
            >
            <i class='pi pi-pencil'></i>
        </PrimeButton>
        <PrimeButton @click='toggleGridView' :title="gridView ? 'Show Single Card view' : 'Show Grid view'" class='bright-hover h-10 w-10 flex justify-center border border-emerald-500 transition ease-in-out duration-500 ml-2 text-white' 
            :class="{ 'bg-emerald-400 text-white': gridView }">
            <i class='pi pi-th-large'></i>
        </PrimeButton>
        <PrimeInputText 
            :id='"notecard-filter"' 
            v-model='searchInput'  
            class='w-full h-12 !bg-mute-standard border border-rounded ! p-1 transition ease-in-out duration-500' 
            :pt="{
            root: { class: ['!border-emerald-500'] }
            }"
        />
    </div>
</template>