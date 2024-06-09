
<script setup lang='ts'>
import { ref } from 'vue';
import { useNoteCardStore } from '../stores/notecardStore';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

    const notecardStore = useNoteCardStore();
    const isSubmitted = ref(false);

    async function submitForm(): Promise<void> {
        isSubmitted.value = true;
        if (notecardStore.selectedCard?.id) {
            try {
                await notecardStore.deleteNoteCard(notecardStore.selectedCard.id);
                notecardStore.closeDeleteModal();
                toast.add({ severity: 'success', summary: 'Rath!', detail: 'Scriosadh cárta nótaí.', life: 3000 });

            } catch(err) {
                console.error('Failed to delete notecard');
                toast.add({ severity: 'error', summary: 'Úps!', detail: 'Chuaigh rud eigin mícheart.', life: 3000 });
            }
        }
    }

</script>


<template>
    <PrimeDialog :visible="notecardStore.isDeleteModalOpen" modal header='Scrios an Cárta Nótaí'
        :pt="{ 
            root: { class: ['outer'] },
            title: { class: ['font-bold'] },
            header: { class: ['border border-emerald-500 border-t-2xl border-b-0 bg-mute-standard text-neutral-300'] },
            content: { class: ['border border-emerald-500 border-t-2xl border-t-0 bg-mute-standard text-neutral-300 p-6'] }, 
            closebutton: { class: ['hidden'] }
        }"
    >
        <div class='flex justify-around items-center gap-3 mb-3'>
            <span class='italic text-sm'>ID</span>
            <label for='english' class='font-semibold w-6rem text-lg'>{{ notecardStore.selectedCard?.id }}</label>
        </div>
        <div class='flex justify-around items-center gap-3 mb-3'>
            <span class='italic text-sm'>Béarla</span>
            <label for='english' class='font-semibold w-6rem text-lg'>{{ notecardStore.selectedCard?.englishPhrase }}</label>
        </div>
        <div class='flex justify-around items-center gap-3 mb-5'>
            <span class='italic text-sm'>Gaeilge</span>
            <label for='irish' class='font-semibold w-6rem text-lg'>{{ notecardStore.selectedCard?.irishPhrase }}</label>
        </div>

        <div class='flex justify-around'>
            <PrimeButton class='btn-secondary ml-2' label='Cancel' severity='secondary' @click='notecardStore.closeDeleteModal'></PrimeButton>
            <PrimeButton class='btn-danger' label='Delete' @click="submitForm()"></PrimeButton>
        </div>
    </PrimeDialog>
</template>

<style lang='scss'>
.outer {
    min-width: 25rem;
}
@media screen and (max-width: 450px) {
    .outer {
        width: 25rem;
    }
}
</style>

