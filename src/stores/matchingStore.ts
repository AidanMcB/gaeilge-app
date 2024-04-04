import { defineStore } from 'pinia';
import translateTerms from '../assets/translateTerms.json';
import type { LanguageType,  MatchingData,  Term,  VocabGroup,  VocabStoredData } from '@/ts/matching.interfaces';
import router from '@/router';
import { getLocalVocabData, randomSort } from '@/utils/helper';
import { AnswerState, Language, MatchingDataKeys } from '@/ts/enums';
  
export const useMatchingStore = defineStore('matchingStore', {
	state: () => ({
		id: 0,
        sectionId: 0,
        groupId: 0,
        activeGroupId: 0,
        activeGroupNumber: '1',
		currentMatchingData: {} as MatchingData,
		allMatchingData: translateTerms as MatchingData[],
		activeVocabGroup: {} as VocabGroup,
        storedData: {} as VocabStoredData,
        selectedEnglishTerm: {} as Term,
        selectedIrishTerm: {} as Term,
        isDisabled: false,
        sectionComplete: false,
        errorCount: 0,
	}),
	actions: {
        initVocabMatchingView(sectionId: number, vocabGroupId: number): void {
            this.sectionId = sectionId;
            this.groupId = vocabGroupId;
            this.activeGroupNumber = localStorage.getItem(MatchingDataKeys.GroupNumber) || '1';
            
            this.storedData = getLocalVocabData(MatchingDataKeys.AnsweredQuestions);
            this.errorCount = parseInt(localStorage.getItem(MatchingDataKeys.ErrorCount) || '0');
            this.setCurrentMatchingDataBySection(sectionId);
            this.setActiveVocabGroupById(vocabGroupId);
        },
		setCurrentMatchingDataBySection(vocabSection: number): void {
			const matchingDataSection = this.allMatchingData.find( (data) => data.section === vocabSection );
			if (matchingDataSection) {
				this.currentMatchingData = matchingDataSection;
			}
		},
		setActiveVocabGroupById(vocabGroupId: number): void {
            const answeredVocabGroup = this.storedData?.submittedAnswers?.find( (group) => group.id === vocabGroupId );
            const vocabGroup = this.currentMatchingData?.vocab.find( (group) => group.id === vocabGroupId );

			if (vocabGroup) {
                vocabGroup?.englishTerms.map((term) => {
                    answeredVocabGroup?.englishTerms.map((answTerm) => {
                        if (term.id === answTerm.id) {
                            term.state = AnswerState.Correct;
                        }                        
                    });            
                });
                vocabGroup?.irishTerms.map((term) => {
                    answeredVocabGroup?.irishTerms.map((answTerm) => {
                        if (term.id === answTerm.id) {
                            term.state = AnswerState.Correct;
                        }                        
                    });
                });
                const randomizedVocabGroup = {
                    id: vocabGroup.id,
                    englishTerms: vocabGroup.englishTerms.sort(randomSort),
                    irishTerms: vocabGroup.irishTerms.sort(randomSort)
                }
				this.activeVocabGroup = randomizedVocabGroup;
			}
		},
        clearActiveVocabGroup(): void {
            this.activeVocabGroup = {} as VocabGroup;
        },
        startNewMatching(section: number) {
            this.clearMatchingData();
            const vocabGroupId = Math.floor(Math.random() * 10)+1;
            localStorage.setItem(MatchingDataKeys.AnsweredQuestions, JSON.stringify({ section: section, answers: [], score: 0 }) );
            localStorage.setItem(MatchingDataKeys.GroupNumber, '1');
            router.push(`/matching/section/${section}/group/${vocabGroupId}`);
        },
        clearMatchingData(): void {
            this.id =  0;
            this.currentMatchingData =  {} as MatchingData;
            this.allMatchingData =  translateTerms as MatchingData[];
            this.activeVocabGroup =  {} as VocabGroup;
        },
        handleSelectTerm(term: Term, language: LanguageType): void {
            if (language === Language.English) {
                this.selectedEnglishTerm = term;
            } else if (language === Language.Irish) {
                this.selectedIrishTerm = term;
            }

            if (this.selectedEnglishTerm?.id && this.selectedIrishTerm?.id) {
                this.isDisabled = true;
                this._checkMatchingTerms();
            }

        },
        _checkMatchingTerms(): void {
            // Correct
            if (this.selectedEnglishTerm?.id === this.selectedIrishTerm?.id) {
                this._handleCorrectAnswer(this.selectedEnglishTerm); // arbitrary choice of English, if question is correct either will work here
            } else if (this.selectedEnglishTerm?.id !== this.selectedIrishTerm?.id) {
            // Incorrect
                this._handleIncorrectAnswer(AnswerState.Incorrect);
            }
        },
        _handleCorrectAnswer(term: Term): void {
            // // Update activeVocabGroup
            this.activeVocabGroup.englishTerms.map((term: Term) => {
                if (term.id === this.selectedEnglishTerm.id) {
                    term.state = AnswerState.Correct;
                } 
            }); 
            this.activeVocabGroup.irishTerms.map((term: Term) => {
                if (term.id === this.selectedIrishTerm.id) {
                    term.state = AnswerState.Correct;
                } 
            });

            this.selectedEnglishTerm = {} as Term;
            this.selectedIrishTerm = {} as Term;
            
            // Update storedData and localStorage
            const englishAnswer = this.activeVocabGroup.englishTerms.find(t => t.id === term.id);
            const irishAnswer = this.activeVocabGroup.irishTerms.find(t => t.id === term.id);
            if (englishAnswer && irishAnswer) {
                //  if no answers yet submitted
                if (!this.storedData.submittedAnswers) {
                    this.storedData = {
                        groupId: this.groupId,
                        submittedAnswers: [
                            { 
                                id: this.groupId, 
                                englishTerms: [{...englishAnswer, state: AnswerState.Correct }],
                                irishTerms: [{...irishAnswer, state: AnswerState.Correct }]
                            }
                        ]
                    }
                } else {
                // if not the first question submitted
                    const localSubmittedAnswers = this.storedData.submittedAnswers;
                    const group: VocabGroup | undefined = localSubmittedAnswers.find((group: VocabGroup) => group.id === this.groupId);
                    // Update group
                    if (group) {
                        group.englishTerms.push({
                            ...englishAnswer,
                            state: AnswerState.Correct
                        });
                        group.irishTerms.push({
                            ...irishAnswer,
                            state: AnswerState.Correct
                        });

                        // Update localSubmittedAnswers
                        const index = localSubmittedAnswers.findIndex((localGroup: VocabGroup) => localGroup.id === group.id);
                        if (index > -1) {
                            localSubmittedAnswers.splice(index, 1, group);
                            // Update storedData
                            this.storedData.submittedAnswers = localSubmittedAnswers;
                        }
                    }
                }
                // set localStorage via stored data
                localStorage.setItem(MatchingDataKeys.AnsweredQuestions, JSON.stringify(this.storedData));
                this.isDisabled = false;
            }
        },
        _handleIncorrectAnswer(state: AnswerState): void {
            this.selectedEnglishTerm.state = AnswerState.Incorrect;
            this.selectedIrishTerm.state = AnswerState.Incorrect;
            this.errorCount = this.errorCount + 1;
            localStorage.setItem(MatchingDataKeys.ErrorCount, JSON.stringify(this.errorCount));
            setTimeout(() => {
                // English
                this.activeVocabGroup?.englishTerms?.map((term: Term) => {
                    if (state === AnswerState.Incorrect) {
                        if (term.id === this.selectedEnglishTerm.id) {
                            term.state = AnswerState.Unanswered;
                        } 
                    }
                });
                // Irish
                this.activeVocabGroup?.irishTerms?.map((term: Term) => {
                    if (state === AnswerState.Incorrect) {
                        if (term.id === this.selectedIrishTerm.id) {
                            term.state = AnswerState.Unanswered;
                        } 
                    }
                });

                this.selectedEnglishTerm = {} as Term;
                this.selectedIrishTerm = {} as Term;
                this.isDisabled = false;
            }, 1500);
        },
        handleNextVocabGroup(): number {
            const allGroupIds: number[] = this.currentMatchingData.vocab.map(vocabGroup => vocabGroup.id);
            const completedVocabGroupIds: number[] = this.storedData.submittedAnswers?.map(q => q.id) || [];
            console.log('Complete Vocab Group: ', completedVocabGroupIds);
            const remainingVocabGroupIds: number[] = allGroupIds.filter(id => !completedVocabGroupIds.includes(id));
            console.log('Remaining Question Ids: ', remainingVocabGroupIds)

            setTimeout(() => {
                this.activeGroupNumber = (parseInt(this.activeGroupNumber )+ 1).toString();
                localStorage.setItem(MatchingDataKeys.GroupNumber, (this.activeGroupNumber).toString());
            }, 100)

            const nextVocabGroupId = remainingVocabGroupIds[Math.floor(Math.random()*remainingVocabGroupIds.length)];
            return nextVocabGroupId;
        },
	},
});
