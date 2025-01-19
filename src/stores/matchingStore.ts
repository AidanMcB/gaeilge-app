import { defineStore } from 'pinia';
import type { LanguageType,  Term,  VocabSection } from '@/ts/matching';
import { AnswerState, Language } from '@/ts/enums';
import * as matchingService from '@/services/matching.service';
import { calcPercent, clearCachedMatchingData } from '@/utils/helper';
import { ref } from 'vue';

export const useMatchingStore = defineStore('matchingStore', () => {
    // Source of truth for 4 irish terms and english terms
	const activeVocab = ref<VocabSection>({} as VocabSection);
    // Source of truth for All Vocab data
    const vocabData = ref<VocabSection>({} as VocabSection);
    // Terms that were wrong
    const termsToPractice = ref<Term[]>([] as Term[]);
    const isDisabled = ref<boolean>(false);
    const errorCount = ref<number>(0);
    const isLoading = ref<boolean>(true);

    async function startNewMatching(matchingData: VocabSection): Promise<void> {
        vocabData.value = matchingData; // Set vocabData data
        clearMatchingData(); // clear all previous data in state and storage
        await updateMatchingInDb();
        isLoading.value = false;
    }

    async function updateMatchingInDb(): Promise<void> {
        try {
            await matchingService._updateActiveVocabSection(vocabData.value);
        } catch (err) {
            console.error('Failed to update quiz data. Error: ', err);
        }
    }

    async function initMatchingView() {
        isLoading.value = true;
        if (!vocabData.value || ! !vocabData.value.irishTerms || !vocabData.value.englishTerms) {
            const fetchedMatchingData = await getVocabDatFromDb();
            if (fetchedMatchingData) {
                vocabData.value = fetchedMatchingData;
            }
        }

        assignActiveVocabSection();
        await initTermsToPractice();
        await initErrorCount();
        isLoading.value = false;
    }

    async function getVocabDatFromDb(): Promise<VocabSection | void> {
        try {
            const vocabData = await matchingService._getActiveVocabSection();
            if (vocabData) {
                return vocabData;
            }
        } catch (err) {
            console.error('Failed to get active Quiz Data. Error: ', err);
        }
    }

    function assignActiveVocabSection(): void {
        // filter terms that state === AnswerState.Unanswered;
        const unAnsweredTerms: Term[] = vocabData.value.englishTerms.filter(term => term.state === AnswerState.Unanswered || !term.state);
        // grab 4 random unused irish terms
        const randomEnglishTerms: Term[] = unAnsweredTerms.sort(() => Math.random() - Math.random()).slice(0, 4);
        const irishTranslationTerms: Term[] = [] as Term[];
        // match to the 4 unused english terms
        vocabData.value.irishTerms.filter(irTerm => {
            randomEnglishTerms.forEach(engTerm => {
                if (engTerm.id === irTerm.id) {
                    irishTranslationTerms.push(irTerm);
                }
            })
        });
    
        const newActiveVocab: VocabSection = {
            id: vocabData.value.id,
            section: vocabData.value.section,
            englishTerms: randomEnglishTerms,
            irishTerms: irishTranslationTerms,
        };
            
        activeVocab.value = newActiveVocab;
    }

    async function addTermToPractice(term: Term): Promise<void> {
        if (termsToPractice.value.findIndex((t: Term) => t.id === term.id) === -1) {
            termsToPractice.value = [...termsToPractice.value, term];
            await updateTermsToPracticeInDb();
        }
    }

    async function initErrorCount(): Promise<void> {
        const err = await getErrorCount();
        if (err) {
            errorCount.value = err;
        }
    }

    async function getErrorCount(): Promise<number | undefined> {
       const terms = await getTermsToPractice();
        if (terms) {
            return terms.length;
        } else {
            return 0;
       }
    }
 
    async function getTermsToPractice(): Promise<Term[] | undefined> {
        try {
            const terms = matchingService._getTermsToPractice();
            if (terms) {
                return terms;
            }
        }
        catch (err) {
            console.error('Failed to set the terms to practice. Error: ', err);
            return undefined;
        }
    }

    async function initTermsToPractice(): Promise<void> {
        const terms = await getTermsToPractice();
        if (terms) {
            termsToPractice.value = terms;
        }
    }

    async function handleSelectTerm(selectedTerm: Term, language: LanguageType): Promise<void> {
        if (language === Language.English) {
            activeVocab.value.englishTerms.map((term: Term) => selectTermCb(term, selectedTerm));
        } else if (language === Language.Irish) {
            activeVocab.value.irishTerms.map((term: Term) => selectTermCb(term, selectedTerm));    
        }
        
        if(areTwoTermsSelected()) {
            const irishIndex = activeVocab.value.irishTerms.findIndex(term => term.isSelected === true);
            const englishIndex = activeVocab.value.englishTerms.findIndex(term => term.isSelected === true);
        
            if (irishIndex > -1 && englishIndex > -1) {
                if (isSelectedVocabCorrect(englishIndex, irishIndex)) {
                    handleCorrectAnswer(englishIndex, irishIndex);
                } else {
                    await handleIncorrectAnswer(englishIndex, irishIndex);
                }
            }
        }
    }

    function selectTermCb(term: Term, selectedTerm: Term): void {
        if (term.id === selectedTerm.id) {
            term.isSelected = true;
        } else if (term.state === AnswerState.Unanswered || !term.state) {
            term.isSelected = false;
        }
    }

    function isSelectedVocabCorrect(englishIndex: number, irishIndex: number): boolean {
        return (activeVocab.value.englishTerms[englishIndex].id === activeVocab.value.irishTerms[irishIndex].id)
    }

    async function updateTermsToPracticeInDb(): Promise<void> {    
        try {
            const resp = matchingService._setTermsToPractice(termsToPractice.value);
            if (resp) {
                return resp;
            }
        }
        catch (err) {
            console.error('Failed to set the terms to practice. Error: ', err);
            return undefined;
        }
    }

    function areTwoTermsSelected(): boolean {
        const answeredEnglishTerm: Term[] = activeVocab.value.englishTerms.filter(term => term.isSelected === true);
        const answeredIrishTerm: Term[] = activeVocab.value.irishTerms.filter(term => term.isSelected === true);
        return (answeredEnglishTerm?.length > 0 && answeredIrishTerm?.length > 0);
    }

    function handleCorrectAnswer(englishIndex: number, irishIndex: number): void {
        // Update activeVocab state
        activeVocab.value.englishTerms[englishIndex].state = AnswerState.Correct;
        activeVocab.value.irishTerms[irishIndex].state = AnswerState.Correct;

        // Find index of terms in activeVocabSection
        const activeSectionEnglishIndex = vocabData.value.englishTerms.findIndex(term => term.id === activeVocab.value.englishTerms[englishIndex].id);
        const activeSectionIrishIndex = vocabData.value.irishTerms.findIndex(term => term.id === activeVocab.value.irishTerms[irishIndex].id);

        // Update activeVocabSection state
        vocabData.value.englishTerms[activeSectionEnglishIndex].state = AnswerState.Correct;
        vocabData.value.irishTerms[activeSectionIrishIndex].state = AnswerState.Correct;
        
        // Update db (localStorage)
        matchingService._updateActiveVocabSection(vocabData.value);
        setVocabToUnselected(englishIndex, irishIndex);
    }

    async function handleIncorrectAnswer(englishIndex: number, irishIndex: number): Promise<void> {
        isDisabled.value = true;
        activeVocab.value.englishTerms[englishIndex].state = AnswerState.Incorrect;
        activeVocab.value.irishTerms[irishIndex].state = AnswerState.Incorrect;
        // add irishTerm to terms-to-practice
        await addTermToPractice(activeVocab.value.irishTerms[irishIndex]);
        await incrementErrorCount();
        setTimeout(() => {
            setVocabToUnselected(englishIndex, irishIndex);
            setVocabStatesToUnanswered(englishIndex, irishIndex);
        }, 500);
    }

    function setVocabToUnselected(englishIndex: number, irishIndex: number): void {
        activeVocab.value.englishTerms[englishIndex].isSelected = false
        activeVocab.value.irishTerms[irishIndex].isSelected = false;
    }

    async function incrementErrorCount(): Promise<void> {
        errorCount.value += 1;
        matchingService._updateMatchingErrorCount(errorCount.value);         // set error in DB (localStorage) also
    }

    function setVocabStatesToUnanswered(englishIndex: number, irishIndex: number): void {
        activeVocab.value.englishTerms[englishIndex].state = AnswerState.Unanswered;
        activeVocab.value.irishTerms[irishIndex].state = AnswerState.Unanswered;
        isDisabled.value = false;
    }

    function getTranslatedTerm(term: Term): Term {
        let index;
        if (term.lang === Language.English) {
            index = vocabData.value.irishTerms.findIndex((t: Term) => t.id === term.id);
            return vocabData.value.irishTerms[index];
        } else {
            index = vocabData.value.englishTerms.findIndex((t: Term) => t.id === term.id);
            return vocabData.value.englishTerms[index];
        }
    }

    function getPercentageAnswered(): number | undefined {
        if (vocabData.value.englishTerms && vocabData.value.englishTerms.length > 0){
            const answered: Term[] = vocabData.value.englishTerms.filter((term: Term) => term.state === AnswerState.Correct);
           return calcPercent(answered.length, vocabData.value.englishTerms.length);
        }
    }

    function nextBatchOfVocabQuestions(): void {
        activeVocab.value = {} as VocabSection;
        assignActiveVocabSection();
    }

    function isComplete(): boolean {
        if ( vocabData.value && 
            vocabData.value.englishTerms?.filter(term => term.state === AnswerState.Correct).length === vocabData.value?.englishTerms?.length
        ) { 
            return true;
        }
        return false
    }

    function clearMatchingData(): void {
        if (activeVocab.value && activeVocab.value.irishTerms) {
            activeVocab.value = clearCachedMatchingData(activeVocab.value);
            vocabData.value = clearCachedMatchingData(vocabData.value);
        }
    }

    return {
        activeVocab, 
        vocabData,
        termsToPractice,
        isDisabled,
        isLoading,
        errorCount,
        startNewMatching,
        initMatchingView,
        handleSelectTerm,
        isComplete,
        nextBatchOfVocabQuestions,
        getPercentageAnswered,
        getTranslatedTerm
    }

});