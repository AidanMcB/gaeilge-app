<script setup lang="ts">
import { computed, ref } from "vue";
import { useNoteCardStore } from "../../stores/notecardStore";
import { type NewNoteCardForm } from "../../ts/notecard";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import { ModalType } from "@/ts/interfaces";
import { useConfirm } from "primevue/useconfirm";
import ModalSection from "./ModalSection.vue";
import AddCategory from "./AddCategory.vue";
import type { Category } from "@/ts/category";
import CategorySelect from "../CategorySelect.vue";
import CategoryChip from './CategoryChip.vue';

const toast = useToast();

const noteCardStore = useNoteCardStore();
const { modalType, selectedCard, isModalVisible } = storeToRefs(noteCardStore);

const isNewCategoryVisible = ref<boolean>(false);
const isSubmitted = ref<boolean>(false);

const noteCardForm = ref<NewNoteCardForm>({
    englishPhrase: selectedCard.value?.englishPhrase || "",
    irishPhrase: selectedCard.value?.irishPhrase || "",
    categories: []
});

function updateIrishPhrase(newValue: string): void {
    noteCardForm.value.irishPhrase = newValue;
}

function updateEnglishPhrase(newValue: string): void {
    noteCardForm.value.englishPhrase = newValue;
}

async function submitCreateCardForm() {
    isSubmitted.value = true;
    let formVal: NewNoteCardForm = { ...noteCardForm.value };
    if (
        noteCardForm.value.englishPhrase.trim().length > 0 &&
        noteCardForm.value.englishPhrase.trim().length > 0
    ) {
        try {
            await noteCardStore.addNewNoteCard(formVal);
            toast.add({
                severity: "success",
                summary: "Rath!",
                detail: "Chruthaigh tú cárta nótaí nua.",
                life: 3000
            });
            resetForm();
            isSubmitted.value = false;
            noteCardStore.closeCardModal();
        } catch (err) {
            console.error("Failed to add new notecard. Error: ", err);
            toast.add({
                severity: "error",
                summary: "Úps!",
                detail: "Chuaigh rud eigin mícheart.",
                life: 3000
            });
        }
    }
}

function handleCategoriesChange(selectedCategories: Category[]): void {
    noteCardForm.value.categories = selectedCategories;
}

function toggleAddCategory(): void {
    isNewCategoryVisible.value = !isNewCategoryVisible.value;
}

function resetForm(): void {
    noteCardForm.value = {
        englishPhrase: "",
        irishPhrase: ""
    };
}

function changeToEditMode() {
    noteCardForm.value = {
        englishPhrase: selectedCard.value?.englishPhrase || "",
        irishPhrase: selectedCard.value?.irishPhrase || ""
    };
    modalType.value = ModalType.Edit;
}

async function saveChanges() {
    if (selectedCard.value) {
        try {
            await noteCardStore.editNoteCard({
                ...noteCardForm.value,
                id: selectedCard.value.id
            });
            toast.add({
                severity: "success",
                summary: "Success",
                detail: "Updated notecard.",
                life: 3000
            });
        } catch (err) {
            toast.add({
                severity: "error",
                summary: "Failed",
                detail: "Failed to save changes to notecard.",
                life: 3000
            });
        }
    }
}

function changeToViewMode() {
    modalType.value = ModalType.View;
}

const allowEdit = computed(() => {
    return modalType.value == ModalType.Create || modalType.value == ModalType.Edit;
});

const cardHeader = computed(() => {
    if (modalType.value === ModalType.Edit) {
        return "Cárta in Eagar";
    } else if (modalType.value === ModalType.Create) {
        return "Cruthaigh Cárta Nótaí";
    } else {
        return `Cárta Nóta - ${selectedCard.value?.id}`;
    }
});

const isViewMode = computed(() => modalType.value == ModalType.View);
const isEditMode = computed(() => modalType.value === ModalType.Edit);
const isCreateMode = computed(() => modalType.value === ModalType.Create);
const hasCategories = computed(
    () =>
        selectedCard.value &&
        selectedCard.value.categories &&
        selectedCard.value?.categories.length > 0
);

const confirm = useConfirm();

const confirmDelete = (event: any) => {
    confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to delete this card?",
        icon: "pi pi-exclamation-triangle text-orange-400",
        position: "left",
        rejectProps: {
            label: "Cancel",
            severity: "secondary",
            outlined: true,
            class: "text-neutral-300"
        },
        acceptProps: {
            class: "text-rose-500",
            label: "Delete"
        },
        accept: () => {
            if (selectedCard.value) {
                try {
                    noteCardStore.deleteNoteCard(selectedCard.value.id);
                    toast.add({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "Card deleted.",
                        life: 3000
                    });
                } catch (err) {
                    console.error(err);
                    toast.add({
                        severity: "error",
                        summary: "Failed",
                        detail: "Failed to delete notecard.",
                        life: 3000
                    });
                }
            }
        }
    });
};


</script>

<template>
    <PrimeConfirmDialog
        :pt="{
            root: {
                class: ['!bg-mute-standard !text-neutral-300 !border !border-neutral-300']
            },
            pcCloseButton: { class: ['hidden'] }
        }"
    ></PrimeConfirmDialog>
    <PrimeDialog
        :modal="true"
        :closable="true"
        :dismissable-mask="true"
        v-model:visible="isModalVisible"
        @hide="noteCardStore.closeCardModal"
        :header="cardHeader"
        :pt="{
            root: { class: ['w-full mx-2 lg:mx-24 md:text-xl border border-emerald-500'] },
            title: { class: ['font-bold'] },
            header: { class: ['bg-mute-standard text-neutral-300 rounded-t-xl'] },
            content: {
                class: [
                    'bg-mute-standard text-neutral-300 py-4 px-6 rounded-b-xl flex flex-wrap gap-4'
                ]
            }
        }"
    >
        <div class="flex flex-wrap w-full">
            <ModalSection
                :allow-edit="allowEdit"
                :is-view-mode="isViewMode"
                :is-submitted="isSubmitted"
                :label="'Gaeilge'"
                :text="selectedCard?.irishPhrase || ''"
                @update-value="updateIrishPhrase"
            ></ModalSection>
        </div>

        <div class="flex flex-wrap w-full">
            <ModalSection
                :allow-edit="allowEdit"
                :is-view-mode="isViewMode"
                :is-submitted="isSubmitted"
                :label="'Béarla'"
                :text="selectedCard?.englishPhrase || ''"
                @update-value="updateEnglishPhrase"
            ></ModalSection>
        </div>

        <div v-if="allowEdit" class="flex justify-between items-center gap-4 w-full">
            <label for="category" class="font-semibold">Catagóir</label>
            <PrimeButton class="toggle-button h-6" @click="toggleAddCategory">
                <i v-if="!isNewCategoryVisible" class="pi pi-plus-circle"></i>
                <i v-if="isNewCategoryVisible" class="pi pi-minus-circle"></i>
            </PrimeButton>
            <CategorySelect
                @update-categories="handleCategoriesChange"
                :pre-selected-categories="selectedCard?.categories || []"
                id="category-select"
            ></CategorySelect>
        </div>

        <template v-else-if="hasCategories && isViewMode && selectedCard">
            <label for="category" class="font-semibold w-full">Catagóir</label>
            <CategoryChip :note-card-id='selectedCard.id' :categories='selectedCard.categories'></CategoryChip>
        </template>

        <div v-if="isNewCategoryVisible && !isViewMode" class="flex items-center w-full">
            <AddCategory></AddCategory>
        </div>

        <NoteCardFormActions
            :is-view-mode="isViewMode"
            :is-edit-mode="isEditMode"
            :is-create-mode="isCreateMode"
            @change-to-edit-mode="changeToEditMode"
            @change-to-view-mode="changeToViewMode"
            @confirm-delete="confirmDelete"
            @save-changes="saveChanges"
            @close-card-modal="noteCardStore.closeCardModal"
            @submit-create-card-form="submitCreateCardForm"
        >
        </NoteCardFormActions>
    </PrimeDialog>
</template>

<style lang="scss">
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
