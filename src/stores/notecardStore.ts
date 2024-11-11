import * as notecardService from '@/services/notecards.service';
import { type NewNoteCardForm, type INoteCard } from '@/ts/notecard.interfaces';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNoteCardStore = defineStore('useNotecardStore', () => {
    const notecards = ref<INoteCard[]>([]);
    const preFilteredNotecards = ref();
	const isEditAllMode = ref(false);
	const selectedCard = ref<INoteCard>();
	const isModalEditMode = ref(false);
	const isAddEditModalOpen = ref(false);
	const isDeleteModalOpen = ref(false);
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
		const resp = await notecardService._getAllNoteCards();
		notecards.value = resp;
		preFilteredNotecards.value = resp;
	}

	async function addNewNoteCard(
		newNoteCardData: NewNoteCardForm
	): Promise<void> {
		try {
			const resp = await notecardService._addNoteCard(newNoteCardData);
			notecards.value = [...notecards.value, resp];
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
				const index = notecards.value.findIndex(
					(card: INoteCard) => card.id === id
				);
				notecards.value.splice(index, 1);
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

	function closeAddEditModal(): void {
		isAddEditModalOpen.value = false;
	}

	function openAddEditModal(type: 'add' | 'edit', card?: INoteCard): void {
		if (type === 'edit' && card) {
			setSelectedCard(card);
			isModalEditMode.value = true;
		} else if (type === 'add') {
			selectedCard.value = {} as INoteCard;
			isModalEditMode.value = false;
		}
		isAddEditModalOpen.value = true;
	}

	function toggleGridView(): void {
		gridView.value = !gridView.value;
		clearTextFilter();
	}

	function openDeleteModal(card: INoteCard): void {
		setSelectedCard(card);
		isDeleteModalOpen.value = true;
	}

	function closeDeleteModal(): void {
		isDeleteModalOpen.value = false;
	}

	return {
		getNoteCards,
		addNewNoteCard,
		deleteNoteCard,
		editNoteCard,
		toggleEditMode,
		setSelectedCard,
		closeAddEditModal,
		openAddEditModal,
		toggleGridView,
		openDeleteModal,
		closeDeleteModal,
		textFilter,
		clearTextFilter,
		initGridViewSetting,
		notecards,
		isEditAllMode,
		selectedCard,
		isAddEditModalOpen,
		isDeleteModalOpen,
		isModalEditMode,
        gridView,
	};
});
