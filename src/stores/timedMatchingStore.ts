import { defineStore } from "pinia";
import translateTerms from "../assets/translateTerms.json";
import type { MatchingData, VocabGroup } from "@/ts/matching.interfaces";
  
export const useMatchingStore = defineStore("matchingStore", {
	state: () => ({
		id: 0,
		currentMatchingData: {} as MatchingData,
		allMatchingData: translateTerms as MatchingData[],
		activeVocabGroup: {} as VocabGroup,
	}),
	actions: {
		setCurrentMatchingDataBySection(vocabSection: number): void {
			const matchingDataSection = this.allMatchingData.find( (data) => data.section === vocabSection );
			if (matchingDataSection) {
				this.currentMatchingData = matchingDataSection;
			}
		},
		setActiveVocabGroupById(vocabGroupId: number): void {
			const vocabGroup = this.currentMatchingData?.vocab.find( (group) => group.id === vocabGroupId );
			if (vocabGroup) {
				this.activeVocabGroup = vocabGroup;
			}
		},
        clearActiveVocabGroup(): void {
            this.activeVocabGroup = {} as VocabGroup;
        }
	},
});
