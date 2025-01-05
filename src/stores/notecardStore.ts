import * as notecardService from '@/services/notecards.service';
import { ModalType } from '@/ts/interfaces';
import { type NewNoteCardForm, type INoteCard } from '@/ts/notecard.interfaces';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useNoteCardStore = defineStore('useNotecardStore', () => {
    const notecards = ref<INoteCard[]>([]);
    const preFilteredNotecards = ref<INoteCard[]>([]);
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
		const isGridView = localStorage.getItem('grid-view');
		if (isGridView === 'true') {
			gridView.value = true;
		} else {
			gridView.value = false;
		}
	}

    async function getNoteCards(): Promise<void> {
        try {
            const resp = await notecardService._getAllNoteCards();
            notecards.value = resp;
            preFilteredNotecards.value = resp;
        } catch (err) {
            console.error('Failed to get note cards from db.');
        }
	}

	async function addNewNoteCard(
		newNoteCardData: NewNoteCardForm
	): Promise<void> {
		try {
			const resp = await notecardService._addNoteCard(newNoteCardData);
            notecards.value = [...notecards.value, resp];
            preFilteredNotecards.value = [...notecards.value, resp];
		} catch (err) {
			console.error('Problem adding a new notecard. Error: ', err);
			throw err;
		}
	}

	async function deleteNoteCard(id: number): Promise<void> {
		try {
			const resp = await notecardService._deleteNoteCard(id);
			if (resp.status === 200) {
				console.info(resp.message);
                notecards.value = notecards.value.filter(card => card.id !== id);
                preFilteredNotecards.value = [...notecards.value]
                closeCardModal()
                if (selectedIndex.value && selectedIndex.value > 0) {
                    selectedIndex.value -= 1;  // Move carousel to the left
                }
			}
		} catch (err) {
			console.error(
				`Unable to delete notecard with id ${id}. Error: `,
				err
			);
			throw err;
		}
	}

	async function editNoteCard(noteCardData: NewNoteCardForm): Promise<void> {
		try {
			const resp = await notecardService._editNotecard(noteCardData);
			if (resp.status === 201) {
				console.info('status', resp.message);
				const index = notecards.value.findIndex(
					(card: INoteCard) => card.id === noteCardData.id
				);
				const updatedNoteCard = {
					...notecards.value[index],
					englishPhrase: noteCardData.englishPhrase,
					irishPhrase: noteCardData.irishPhrase,
				};
				notecards.value.splice(index, 1, updatedNoteCard);
			}
		} catch (err) {
			console.error(
				`Unable to update notecard with id ${noteCardData.id}. Error: `,
				err
			);
			throw err;
		}
	}

	function textFilter(searchInput: string): void {
		const filteredNotecards = preFilteredNotecards.value.filter(
			(card: INoteCard) =>
				card.englishPhrase.includes(searchInput) ||
				card.irishPhrase.includes(searchInput)
		);
		notecards.value = [...filteredNotecards];
	}

	function clearTextFilter(): void {
		notecards.value = [...preFilteredNotecards.value];
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

    function openAddEditModal(type: 'add' | 'edit', card?: INoteCard): void {
        isModalVisible.value = true
		if (type === 'edit' && card) {
			setSelectedCard(card);
            modalType.value = ModalType.Edit
        } else if (type === 'add') {
            selectedCard.value = {} as INoteCard;
            modalType.value = ModalType.Create
		}
    }
    
    function openViewCardModal(card: INoteCard): void {
        selectedCard.value = card
        modalType.value = ModalType.View
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
		notecards,
		isEditAllMode,
		selectedCard,
        gridView,
        modalType,
        isModalVisible,
        selectedIndex
	};
});
