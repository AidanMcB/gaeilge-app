
<script setup lang='ts'>
import { ref } from 'vue';
import { useNoteCardStore } from '../../stores/notecardStore';
import { type NewNoteCardForm } from '../../ts/notecard.interfaces';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

    const notecardStore = useNoteCardStore();
    const isNewCategoryVisible = ref(false);
    const isSubmitted = ref(false);

    const notecardForm = ref<NewNoteCardForm>({
        englishPhrase: notecardStore.selectedCard?.englishPhrase || '',
        irishPhrase: notecardStore.selectedCard?.irishPhrase || '', 
        newCategory: '',
    });
    
    async function submitForm() {
        isSubmitted.value = true;
        let formVal: NewNoteCardForm = { ...notecardForm.value };
        if (!notecardStore.isModalEditMode) {
            if (notecardForm.value.englishPhrase.trim().length > 0 && notecardForm.value.englishPhrase.trim().length > 0) {
                try {
                    await notecardStore.addNewNoteCard(formVal);
                    toast.add({ severity: 'success', summary: 'Rath!', detail: 'Chruthaigh tú cárta nótaí nua!', life: 3000 });
                    resetForm();
                    isSubmitted.value = false;
                    notecardStore.closeAddEditModal();
                } catch (err) {
                    console.error('Failed to add new notecard. Error: ', err);
                    toast.add({ severity: 'error', summary: 'Úps!', detail: 'Chuaigh rud eigin mícheart', life: 3000 });
                }
            }
        } else {
            if (notecardStore.selectedCard && notecardStore.selectedCard.id) {
                formVal = { ...formVal, id: notecardStore.selectedCard.id };
                if (notecardForm.value.englishPhrase.trim().length > 0 && notecardForm.value.englishPhrase.trim().length > 0) {
                    try {
                        await notecardStore.editNoteCard(formVal);
                        toast.add({ severity: 'success', summary: 'Rath!', detail: 'Cuireadh cárta nótaí in eagar', life: 3000 });
                        isSubmitted.value = false;
                        notecardStore.closeAddEditModal();
                    } catch (err) {
                        console.error('Failed to edit notecard. Error: ', err);
                        toast.add({ severity: 'error', summary: 'Úps!', detail: 'Chuaigh rud eigin mícheart', life: 3000 });
                    }
                }
            }
        }
    }

    function toggleAddCategory() {
        isNewCategoryVisible.value = !isNewCategoryVisible.value;
    }

    function resetForm(): void {
        notecardForm.value = {
            englishPhrase: '',
            irishPhrase: '', 
            newCategory: '',
        };
    }

</script>


<template>
    <PrimeDialog 
        modal 
        :closable='false'
        :visible="notecardStore.isAddEditModalOpen" 
        :header="notecardStore.isModalEditMode ? `In Eagar Cárta Nótaí - ID: ${notecardStore.selectedCard?.id}` : 'Cruthaigh Cárta Nótaí'"
        :pt="{ 
            root: { class: ['outer md:w-2/3 md:text-xl border border-emerald-500'] },
            title: { class: ['font-bold'] },
            header: { class: ['bg-mute-standard text-neutral-300 rounded-t-xl'] },
            content: { class: ['bg-mute-standard text-neutral-300 p-6 rounded-b-xl'] }, 
            closebutton: { class: ['hidden'] }
        }"
    >
        <div class='flex justify-between items-center gap-3 mb-5 md:mb-8'>
            <label for='irish' class='font-semibold w-6rem'>Gaeilge</label>
            <InputText required id='irish' class='border rounded border-emerald-500 bg-mute-standard p-2 w-8/12' autocomplete='off' v-model='notecardForm.irishPhrase'
            :class="{ 'border-rose-500': isSubmitted && notecardForm.irishPhrase.length < 1 }"
            />
        </div>
        <div class='flex justify-between items-center gap-3 mb-3 md:mb-8'>
            <label for='english' class='font-semibold w-6rem'>Béarla</label>
            <InputText id='english' class='border rounded border-emerald-500 bg-mute-standard p-2 w-8/12' autocomplete='off' v-model='notecardForm.englishPhrase'
                :class="{ 'border-rose-500': isSubmitted && notecardForm.englishPhrase.length < 1 }"
            />
        </div>
        <div class='flex justify-between items-center gap-3 mb-5 md:mb-8'>
            <label for='category' class='font-semibold w-6rem'>Catagóir</label>
            <PrimeButton class='toggle-button' @click="toggleAddCategory">
                <i v-if="!isNewCategoryVisible" class='pi pi-plus-circle w-8/12'></i>
                <i v-if="isNewCategoryVisible" class='pi pi-minus-circle'></i>
            </PrimeButton>
            <MultiSelectDropdown class='w-8/12' id='category-select'></MultiSelectDropdown>
        </div>

        <!-- <div v-if='isNewCategoryVisible' class='flex justify-between items-center gap-3 mb-5'>
            <label for='new-category' class='font-semibold w-6rem'>Catagóir nua</label>
            <InputText id='new-category' v-bind='notecardForm' class='border rounded border-emerald-500 bg-mute-standard p-2 w-8/12' autocomplete='off' />
        </div> -->

        <div class='flex justify-around'>
            <PrimeButton class='btn-secondary ml-2 md:text-lg' label='Cancel' severity='secondary' @click='notecardStore.closeAddEditModal'></PrimeButton>
            <PrimeButton class='btn-primary md:text-lg' :label="notecardStore.isModalEditMode ? 'Save' : 'Submit'" @click="submitForm()"></PrimeButton>
        </div>
    
    </PrimeDialog>
</template>

<style lang='scss'>
.toggle-button {
    min-width: 24px;
}
.outer {
    min-width: 25rem;
}
@media screen and (max-width: 450px) {
    .outer {
        width: 25rem;
    }
}
</style>

