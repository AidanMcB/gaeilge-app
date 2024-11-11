<script lang='ts' setup>
import { watchDebounced } from '@vueuse/core';
import { useNoteCardStore } from '../../stores/notecardStore';
import { ref } from 'vue';

const notecardStore = useNoteCardStore();

function openModalAsAddMode(): void {
    notecardStore.openAddEditModal('add');
}

function toggleGridView() {
    notecardStore.toggleGridView();
    localStorage.setItem('grid-view', notecardStore.gridView.toString())
}

const searchInput = ref('');

watchDebounced(searchInput, () => {
    notecardStore.textFilter(searchInput.value);
}, { debounce: 500, maxWait: 5000 })


</script>

<template>
    <div class='flex flex-wrap items-center w-full'>
        <PrimeButton class='btn-primary h-12' title='Create a new card' @click='openModalAsAddMode'>
            Cárta nua
        </PrimeButton>
        <PrimeButton @click='notecardStore.toggleEditMode' class='bright-hover h-10 w-10 flex justify-center border border-emerald-500 transition ease-in-out duration-500 ml-auto text-white ml-auto'
            :class="{ 'bg-emerald-400 text-white': !notecardStore.isEditAllMode }">
            <i class='pi pi-pencil' v-if='!notecardStore.isEditAllMode'></i>
            <i class='pi pi-times' v-if='notecardStore.isEditAllMode'></i>
        </PrimeButton>
        <PrimeButton @click='toggleGridView' :title="notecardStore.gridView ? 'Show Single Card view' : 'Show Grid view'" class='bright-hover h-10 w-10 flex justify-center border border-emerald-500 transition ease-in-out duration-500 ml-2 text-white' 
            :class="{ 'bg-emerald-400 text-white': notecardStore.gridView }">
            <i class='pi pi-th-large'></i>
        </PrimeButton>
        <InputText 
            :id='"notecard-filter"' 
            v-model='searchInput'  
            class='w-full h-12 !bg-mute-standard border border-rounded ! p-1 transition ease-in-out duration-500' 
            :pt="{
            root: { class: ['!border-emerald-500'] }
            }"
        />
        <!-- <MultiSelectDropdown :id='"category-filter"' class='h-12 transition ease-in-out duration-500' :class="[notecardStore.gridView ? 'opacity-100' : 'opacity-0']"></MultiSelectDropdown> -->
    </div>
</template>