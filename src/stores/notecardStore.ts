import * as noteCardService from "@/services/notecards.service";
import type { Category } from "@/ts/category";
import { ModalType } from "@/ts/interfaces";
import { type NewNoteCardForm, type INoteCard } from "@/ts/notecard";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useNoteCardStore = defineStore("useNotecardStore", () => {
    const notecards = ref<INoteCard[]>([]);
    const preFilteredNoteCards = ref<INoteCard[]>([]);
    const isEditAllMode = ref(false);
    const selectedCard = ref<INoteCard>();
    const selectedIndex = ref<number>(); // for card carousel

    // Modals
    const modalType = ref<ModalType>(ModalType.None);
    const isModalVisible = ref<boolean>(false);
    watch(modalType, (newValue) => {
        isModalVisible.value = newValue !== ModalType.None;
    });

    const gridView = ref(false);

    function initGridViewSetting() {
        const isGridView = localStorage.getItem("grid-view");
        if (isGridView === "true") {
            gridView.value = true;
        } else {
            gridView.value = false;
        }
    }

    async function getNoteCards(): Promise<void> {
        try {
            const resp = await noteCardService._getAllNoteCards();
            notecards.value = resp;
            preFilteredNoteCards.value = resp;
        } catch (err) {
            console.error("Failed to get note cards from db.");
        }
    }

    async function addNewNoteCard(newNoteCardData: NewNoteCardForm): Promise<void> {
        try {
            const resp = await noteCardService._addNoteCard(newNoteCardData);
            notecards.value = [...notecards.value, resp];
            preFilteredNoteCards.value = [...notecards.value, resp];
        } catch (err) {
            console.error("Problem adding a new notecard. Error: ", err);
            throw err;
        }
    }

    async function deleteNoteCard(id: number): Promise<void> {
        try {
            await noteCardService._deleteNoteCard(id);

            notecards.value = notecards.value.filter((card) => card.id !== id);
            preFilteredNoteCards.value = [...notecards.value];
            closeCardModal();
            if (selectedIndex.value && selectedIndex.value > 0) {
                selectedIndex.value -= 1; // Move carousel to the left
            }
        } catch (err) {
            console.error(`Unable to delete notecard with id ${id}. Error: `, err);
            throw err;
        }
    }

    async function editNoteCard(noteCardData: NewNoteCardForm): Promise<void> {
        try {
            const resp = await noteCardService._editNoteCard(noteCardData);
            const updatedNoteCard = { ...resp.data };
            // 1. Update preFilter cards
            const preFilteredIndex = preFilteredNoteCards.value.findIndex(
                (card: INoteCard) => card.id === noteCardData.id
            );
            preFilteredNoteCards.value.splice(preFilteredIndex, 1, updatedNoteCard);

            // 2. Update noteCards (filter may exist)
            const index = preFilteredNoteCards.value.findIndex(
                (card: INoteCard) => card.id === noteCardData.id
            );
            notecards.value.splice(index, 1, updatedNoteCard);

            // 3. Update selected card
            if (selectedCard.value) {
                selectedCard.value = { ...selectedCard.value, categories: [...updatedNoteCard.categories] };
            }

            // 4. go back to view mode
            modalType.value = ModalType.View;
        } catch (err) {
            console.error(`Unable to update notecard with id ${noteCardData.id}. Error: `, err);
            throw err;
        }
    }

    async function removeCategoryFromNoteCard(
        noteCardId: number,
        categoryId: number
    ): Promise<void> {
        try {
            await noteCardService._removeCategoryFromNoteCard(noteCardId, categoryId);

            // 1. Update pre-filtered note cards
            const preFilteredIndex = preFilteredNoteCards.value.findIndex((card: INoteCard) => card.id === noteCardId);
            const updatedCatOptions: Category[] | undefined = preFilteredNoteCards.value[preFilteredIndex].categories?.filter(cat => cat.id !== categoryId);

            const updatedNoteCard: INoteCard = {
                ...preFilteredNoteCards.value[preFilteredIndex],
                categories: updatedCatOptions
            };
            
            preFilteredNoteCards.value[preFilteredIndex] = updatedNoteCard;

            // 2. Update noteCards (filter may exist). Same Categories apply
            const index = notecards.value.findIndex((card: INoteCard) => card.id === noteCardId);
            notecards.value[index] = updatedNoteCard;

            setSelectedCard(notecards.value[index])
        } catch (err) {
            console.error("Failed to remove Category from Note Card. Error: ", err);
            throw err;
        }
    }

    function textFilter(searchInput: string): void {
        const filteredNoteCards = preFilteredNoteCards.value.filter(
            (card: INoteCard) =>
                card.englishPhrase.includes(searchInput) || card.irishPhrase.includes(searchInput)
        );
        notecards.value = [...filteredNoteCards];
    }

    function clearTextFilter(): void {
        notecards.value = [...preFilteredNoteCards.value];
    }

    function toggleEditMode(): void {
        isEditAllMode.value = !isEditAllMode.value;
    }

    function setSelectedCard(card: INoteCard): void {
        selectedCard.value = card;
    }

    function closeCardModal(): void {
        selectedCard.value = undefined;
        isModalVisible.value = false;
        modalType.value = ModalType.None;
    }

    function openAddEditModal(type: "add" | "edit", card?: INoteCard): void {
        isModalVisible.value = true;
        if (type === "edit" && card) {
            setSelectedCard(card);
            modalType.value = ModalType.Edit;
        } else if (type === "add") {
            selectedCard.value = {} as INoteCard;
            modalType.value = ModalType.Create;
        }
    }

    function openViewCardModal(card: INoteCard): void {
        selectedCard.value = card;
        modalType.value = ModalType.View;
    }

    function toggleGridView(): void {
        gridView.value = !gridView.value;
        clearTextFilter();
    }

    return {
        getNoteCards,
        addNewNoteCard,
        deleteNoteCard,
        editNoteCard,
        toggleEditMode,
        setSelectedCard,
        openAddEditModal,
        toggleGridView,
        textFilter,
        clearTextFilter,
        initGridViewSetting,
        openViewCardModal,
        closeCardModal,
        removeCategoryFromNoteCard,
        notecards,
        isEditAllMode,
        selectedCard,
        gridView,
        modalType,
        isModalVisible,
        selectedIndex
    };
});
