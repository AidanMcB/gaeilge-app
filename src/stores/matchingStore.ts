import { defineStore } from 'pinia';
import type { LanguageType,  Term,  VocabSection } from '@/ts/matching.interfaces';
import { AnswerState, Language } from '@/ts/enums';
import * as matchingService from '@/services/matching.service';
import { calcPercent } from '@/utils/helper';

export const useMatchingStore = defineStore('matchingStore', {
	state: () => ({
        sectionId: 0,
        // Source of truth for 4 irish terms and english terms
		activeVocab: {} as VocabSection,
        // Source of truth for All Vocab data
        activeVocabSection: {} as VocabSection,
        isDisabled: false,
        termsToPractice: [] as Term[],
        errorCount: 0,
        isLoading: true
	}),
	actions: {
        // Setters
        startNewMatchingQuiz(matchingData: VocabSection): void {
            // clear all previous data in state and storage
            this.clearMatchingData();
            // Set activeVocabSection data
            this.activeVocabSection = matchingData;
            // Set db (localStorage) submitted data
            matchingService._updateActiveVocabSection(matchingData);
            this.isLoading = false;
        },
        async initVocabMatchingView(sectionId: number): Promise<void> {
            this.sectionId = sectionId;
            await this.setActiveVocabSection();
            await this.setTermsToPractice();
            this.setActiveVocab();
            this.errorCount = await this.getErrorCount() || 0;
            this.isLoading = false;
        },
        setActiveVocab(): void {
            // filter terms that state === AnswerState.Unanswered;
            const unAnsweredTerms: Term[] = this.activeVocabSection.englishTerms.filter(term => term.state === AnswerState.Unanswered || !term.state);
            // grab 4 random unused irish terms
            const randomEnglishTerms: Term[] = unAnsweredTerms.sort(() => Math.random() - Math.random()).slice(0, 4);
            const irishTranslationTerms: Term[] = [] as Term[];
            // match to the 4 unused english terms
            this.activeVocabSection.irishTerms.filter(irTerm => {
                randomEnglishTerms.forEach(engTerm => {
                    if (engTerm.id === irTerm.id) {
                        irishTranslationTerms.push(irTerm);
                    }
                })
            });

            const activeVocab: VocabSection = {
                id: this.activeVocabSection.id,
                section: this.activeVocabSection.section,
                englishTerms: randomEnglishTerms,
                irishTerms: irishTranslationTerms,
            };

            this.activeVocab = activeVocab;
        },
        setVocabToUnselected(englishIndex: number, irishIndex: number): void {
            this.activeVocab.englishTerms[englishIndex].isSelected = false
            this.activeVocab.irishTerms[irishIndex].isSelected = false;
        },
        setVocabStatesToUnanswered(englishIndex: number, irishIndex: number): void {
            this.activeVocab.englishTerms[englishIndex].state = AnswerState.Unanswered;
            this.activeVocab.irishTerms[irishIndex].state = AnswerState.Unanswered;
            this.isDisabled = false;
        },
        async setTermsToPractice(term?: Term): Promise<void> {
            // only add terms that have not yet failed
            if (term) {
                if (this.termsToPractice.findIndex((t: Term) => t.id === term.id) === -1) {
                    this.termsToPractice = [...this.termsToPractice, term];
                }
            } else {
                this.termsToPractice = await this.getTermsToPractice() || [];
            }
            try {
                const resp = matchingService._setTermsToPractice(this.termsToPractice);
                if (resp) {
                    return resp;
                }
            }
            catch (err) {
                console.error('Failed to set the terms to practice. Error: ', err);
                return undefined;
            }
        },
        clearActiveVocabGroup(): void {
            this.activeVocab = {} as VocabSection;
        },
        async setActiveVocabSection(): Promise<void> {
            try {
                const activeVocabSection = await matchingService._getActiveVocabSectionById(this.sectionId);
                if (activeVocabSection) {
                    this.activeVocabSection = activeVocabSection;
                }
            } catch (err) {
                console.error('Failed to get submitted matching data. Error: ', err);
            }
        },
        incrementErrorCount(): void {
            this.errorCount += 1;
            // set error in DB (localStorage) also
            matchingService._updateMatchingErrorCount(this.errorCount);
        },
        clearMatchingData(): void {
            this.activeVocab = {} as VocabSection;
            this.activeVocabSection = {} as VocabSection;
        },
        async handleSelectTerm(selectedTerm: Term, language: LanguageType): Promise<void> {
            if (language === Language.English) {
                this.activeVocab.englishTerms.map((term: Term) => {
                    if (term.id === selectedTerm.id) {
                        term.isSelected = true;
                    } else if (term.state === AnswerState.Unanswered || !term.state) {
                        term.isSelected = false;
                    }
                });
            } else if (language === Language.Irish) {
                this.activeVocab.irishTerms.map((term: Term) => {
                    if (term.id === selectedTerm.id) {
                        term.isSelected = true;
                    } else if (term.state === AnswerState.Unanswered || !term.state) {
                        term.isSelected = false;
                    }
                });       
            }

            if(this.areTwoTermsSelected()) {
                const irishIndex = this.activeVocab.irishTerms.findIndex(term => term.isSelected === true);
                const englishIndex = this.activeVocab.englishTerms.findIndex(term => term.isSelected === true);

                if (irishIndex > -1 && englishIndex > -1) {
                    if (this.isSelectedVocabCorrect(englishIndex, irishIndex)) {
                        this.handleCorrectAnswer(englishIndex, irishIndex);
                    } else {
                        await this.handleIncorrectAnswer(englishIndex, irishIndex);
                    }
                }
            }
        },
        handleCorrectAnswer(englishIndex: number, irishIndex: number): void {
            // Update activeVocab state
            this.activeVocab.englishTerms[englishIndex].state = AnswerState.Correct;
            this.activeVocab.irishTerms[irishIndex].state = AnswerState.Correct;

            // Find index of terms in activeVocabSection
            const activeSectionEnglishIndex = this.activeVocabSection.englishTerms.findIndex(term => term.id === this.activeVocab.englishTerms[englishIndex].id);
            const activeSectionIrishIndex = this.activeVocabSection.irishTerms.findIndex(term => term.id === this.activeVocab.irishTerms[irishIndex].id);

            // Update activeVocabSection state
            this.activeVocabSection.englishTerms[activeSectionEnglishIndex].state = AnswerState.Correct;
            this.activeVocabSection.irishTerms[activeSectionIrishIndex].state = AnswerState.Correct;
            
            // Update db (localStorage)
            matchingService._updateActiveVocabSection(this.activeVocabSection);
            this.setVocabToUnselected(englishIndex, irishIndex);
        },
        async handleIncorrectAnswer(englishIndex: number, irishIndex: number): Promise<void> {
            this.isDisabled = true;
            this.activeVocab.englishTerms[englishIndex].state = AnswerState.Incorrect;
            this.activeVocab.irishTerms[irishIndex].state = AnswerState.Incorrect;
            // add englishTerm and irishTerm to terms-to-practice
            this.setTermsToPractice(this.activeVocab.irishTerms[irishIndex]);
            this.incrementErrorCount();
            setTimeout(() => {
                this.setVocabToUnselected(englishIndex, irishIndex);
                this.setVocabStatesToUnanswered(englishIndex, irishIndex);
            }, 500);
        },
        // Getters
        async getNewVocabSectionData(sectionId: number): Promise<VocabSection | undefined> {
            try {
                const currentSectionVocab = await matchingService._getNewVocabSectionById(sectionId);
                return currentSectionVocab;
            } catch (err) {
                console.error('Failed to get current section data. Error: ', err);
                return undefined;
            }
        },
        async getErrorCount(): Promise<number | undefined> {
           const terms = await this.getTermsToPractice();
            if (terms) {
                return terms.length;
            } else {
                return 0;
           }
        },
        getTranslatedTerm(term: Term): Term {
            let index;
            if (term.lang === Language.English) {
                index = this.activeVocabSection.irishTerms.findIndex((t: Term) => t.id === term.id);
                return this.activeVocabSection.irishTerms[index];
            } else {
                index = this.activeVocabSection.englishTerms.findIndex((t: Term) => t.id === term.id);
                return this.activeVocabSection.englishTerms[index];
            }
        },
        getPercentageAnswered(): number | undefined {
            if (this.activeVocabSection.englishTerms && this.activeVocabSection.englishTerms.length > 0){
                const answered: Term[] = this.activeVocabSection.englishTerms.filter((term: Term) => term.state === AnswerState.Correct);
                return calcPercent(answered.length, this.activeVocabSection.englishTerms.length);
            }
        },
        async getTermsToPractice(): Promise<Term[] | undefined> {
            try {
                const termsToPractice = await matchingService._getTermsToPractice();
                if (termsToPractice) {
                    return termsToPractice;
                }
            } catch (err) {
                console.error('Failed to get terms to practice. Error: ', err);
                return undefined;
            }
        },
        // Checks
        areTwoTermsSelected(): boolean {
            // Check if two answers are selected
            const answeredEnglishTerm: Term[] = this.activeVocab.englishTerms.filter(term => term.isSelected === true);
            const answeredIrishTerm: Term[] = this.activeVocab.irishTerms.filter(term => term.isSelected === true);
            return (answeredEnglishTerm?.length > 0 && answeredIrishTerm?.length > 0);
        },
        isSelectedVocabCorrect(englishIndex: number, irishIndex: number): boolean {
            return (this.activeVocab.englishTerms[englishIndex].id === this.activeVocab.irishTerms[irishIndex].id)
        },
        nextBatchOfVocabQuestions(): void {
            this.activeVocab = {} as VocabSection;
            this.setActiveVocab();
        },
        isComplete(): boolean {
            if (
                this.activeVocabSection &&
                this.activeVocabSection.englishTerms?.filter(term => term.state === AnswerState.Correct).length === this.activeVocabSection?.englishTerms?.length
            ) {
                return true;
            }
            return false;
        }
	},
});
