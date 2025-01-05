
<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useNoteCardStore } from '../../stores/notecardStore';
import { type NewNoteCardForm } from '../../ts/notecard.interfaces';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { ModalType } from '@/ts/interfaces';

const toast = useToast();

const notecardStore = useNoteCardStore();
const { modalType, selectedCard, isModalVisible } = storeToRefs(notecardStore);

const isNewCategoryVisible = ref(false);
const isSubmitted = ref(false);

const notecardForm = ref<NewNoteCardForm>({
    englishPhrase: selectedCard.value?.englishPhrase || '',
    irishPhrase: selectedCard.value?.irishPhrase || '', 
    newCategory: '',
});

function updateIrishPhrase(newValue: string): void {
    notecardForm.value.irishPhrase = newValue;
}

function updateEnglishPhrase(newValue: string): void {
    notecardForm.value.englishPhrase = newValue;
}
    
async function submitCreateCardForm() {
    isSubmitted.value = true;
    let formVal: NewNoteCardForm = { ...notecardForm.value };
    if (notecardForm.value.englishPhrase.trim().length > 0 && notecardForm.value.englishPhrase.trim().length > 0) {
        try {
            await notecardStore.addNewNoteCard(formVal);
            toast.add({ severity: 'success', summary: 'Rath!', detail: 'Chruthaigh tú cárta nótaí nua!', life: 3000});
            resetForm();
            isSubmitted.value = false;
            notecardStore.closeCardModal();
        } catch (err) {
            console.error('Failed to add new notecard. Error: ', err);
            toast.add({ severity: 'error', summary: 'Úps!', detail: 'Chuaigh rud eigin mícheart', life: 3000 });
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

function changeToEditMode() {
    notecardForm.value = {
        englishPhrase: selectedCard.value?.englishPhrase || '',
        irishPhrase: selectedCard.value?.irishPhrase || '', 
        newCategory: '',
    }
    modalType.value = ModalType.Edit;
}

async function saveChanges() {
    if (selectedCard.value) {
        try {
            await notecardStore.editNoteCard({
                ...notecardForm.value,
                id: selectedCard.value.id
            });
            toast.add({ severity: 'success', summary: 'Success', detail: 'Updated notecard.', life: 3000 });
            notecardStore.closeCardModal()
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Failed', detail: 'Failed to save changes to notecard.', life: 3000 });
        }
    }
}

function changeToViewMode() {
    modalType.value = ModalType.View;
}

const allowEdit = computed(() => {
    return modalType.value == ModalType.Create || modalType.value == ModalType.Edit;
})

const cardHeader = computed(() => {
    if (modalType.value === ModalType.Edit) {
        return 'Cárta in Eagar';
    } else if (modalType.value === ModalType.Create) {
        return 'Cruthaigh Cárta Nótaí';
    } else {
        return `Cárta Nóta - ${selectedCard.value?.id}`
    }
})

const isViewMode = computed(() => modalType.value == ModalType.View)
const isEditMode = computed(() => modalType.value === ModalType.Edit)
const isCreateMode = computed(() => modalType.value === ModalType.Create)

import { useConfirm } from "primevue/useconfirm";
import ModalSection from './ModalSection.vue';


const confirm = useConfirm();

const confirmDelete = (event: any) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to delete this card?',
        icon: 'pi pi-exclamation-triangle text-orange-400',
        position: 'left',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
            class: 'text-neutral-300'
        },
        acceptProps: {
            class: 'text-rose-500',
            label: 'Delete'
        },
        accept: () => {
            if (selectedCard.value) {
                try {
                    notecardStore.deleteNoteCard(selectedCard.value.id)
                    toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Card deleted!', life: 3000 });
                } catch (err) {
                    console.error(err)
                    toast.add({ severity: 'error', summary: 'Failed', detail: 'Failed to delete notecard.', life: 3000 });
                }
            }
        },
    });
};
</script>


<template>
    <!-- hide the cancel button -->
    <PrimeConfirmDialog :pt="{
        root: { class: ['mt-2 !bg-mute-standard !text-neutral-300 !border !border-neutral-300'] },
            pcCloseButton: { class: ['hidden']}
        }"
    ></PrimeConfirmDialog>
    <PrimeDialog 
        :modal="true"
        :closable="true"
        :dismissable-mask="true"
        v-model:visible="isModalVisible"
        @hide="notecardStore.closeCardModal"
        :header="cardHeader"
        :pt="{ 
            root: { class: ['w-full mx-2 lg:mx-24 md:text-xl border border-emerald-500'] },
            title: { class: ['font-bold'] },
            header: { class: ['bg-mute-standard text-neutral-300 rounded-t-xl'] },
            content: { class: ['bg-mute-standard text-neutral-300 p-6 rounded-b-xl'] }, 
        }"
    >
        <div class='flex flex-wrap mb-5 md:mb-8'>
            <ModalSection 
                :allow-edit='allowEdit' 
                :is-view-mode='isViewMode' 
                :is-submitted='isSubmitted' 
                :label='"Gaeilge"' 
                :text='selectedCard?.irishPhrase || ""'
                @update-value='updateIrishPhrase'
                >
            </ModalSection>
        </div>   
        
        <div class='flex flex-wrap mb-3 md:mb-8'>
            <ModalSection 
                :allow-edit='allowEdit' 
                :is-view-mode='isViewMode' 
                :is-submitted='isSubmitted' 
                :label='"Béarla"' 
                :text='selectedCard?.englishPhrase || ""'
                @update-value='updateEnglishPhrase'
                >
            </ModalSection>
        </div>

        <div class='flex justify-between items-center gap-3 mt-2 mb-5 md:mb-8'>
            <label for='category' class='font-semibold'>Catagóir</label>
            <template v-if='allowEdit'>
                <PrimeButton class='toggle-button' @click="toggleAddCategory">
                    <i v-if="!isNewCategoryVisible" class='pi pi-plus-circle'></i>
                    <i v-if="isNewCategoryVisible" class='pi pi-minus-circle'></i>
                </PrimeButton>
                <MultiSelectDropdown class='' id='category-select'></MultiSelectDropdown>
            </template>
        </div>

        <!-- <div v-if='isNewCategoryVisible' class='flex justify-between items-center gap-3 mb-5'>
            <label for='new-category' class='font-semibold w-6rem'>Catagóir nua</label>
            <InputText id='new-category' v-bind='notecardForm' class='border rounded border-emerald-500 bg-mute-standard p-2 w-8/12' autocomplete='off' />
        </div> -->
<!-- 
        <div v-if='showEditButton' class='flex justify-around'>
            <PrimeButton class='btn-primary ml-auto' :label="isEditMode? 'Save Edit' : 'Edit'" @click="changeToEditMode"></PrimeButton>
        </div> -->
        <NoteCardFormActions
            :is-view-mode='isViewMode'
            :is-edit-mode='isEditMode'
            :is-create-mode='isCreateMode'
            @change-to-edit-mode='changeToEditMode'
            @change-to-view-mode='changeToViewMode'
            @confirm-delete='confirmDelete'
            @save-changes='saveChanges'
            @close-card-modal='notecardStore.closeCardModal'
            @submit-create-card-form='submitCreateCardForm'
        >
        </NoteCardFormActions>
    
    </PrimeDialog>
</template>

<style lang='scss'>
.text-container {
    overflow-y: auto;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.toggle-button {
    min-width: 24px;
}
.p-multiselect-option .p-focus > [data-p-focused="false"] > [data-p-selected="true"] {
    background: var(--color-background);
}
.p-multiselect-option.p-focus {
    background: var(--color-background);
}
</style>