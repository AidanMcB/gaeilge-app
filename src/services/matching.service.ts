import { MatchingDataKeys } from '@/ts/enums';
import translateTerms from '../assets/translateTerms.json';
import type { Term, VocabSection } from '@/ts/matching.interfaces';
import { getLocalVocabData } from '../utils/helper';

// process.env === 'develop'

// Getters
export function _getAllMatchingData(): Promise<VocabSection[]> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(translateTerms as VocabSection[]);
        }, 500);
    });
}

export function _getNewVocabSectionById(id: number): Promise<VocabSection | undefined> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(translateTerms.find((section: VocabSection) => section.section === id));
        }, 300);
    });
}

export function _getActiveVocabSection(): Promise<VocabSection> {
    // Eventually ID will be used to query DB. 
    // For now, only one matching quiz will be available in localStorage at a time, so no need to use it.
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getLocalVocabData(MatchingDataKeys.StoredMatchingData) as VocabSection);
        }, 300);
    });
}

export function _getMatchingErrorCount(): Promise<number> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                parseInt(localStorage.getItem(MatchingDataKeys.ErrorCount) || '0')
            );
        }, 300);
    });
}

export function _getTermsToPractice(): Promise<Term[]> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(localStorage.getItem(MatchingDataKeys.TermsToPractice) || '[]'));
        }, 300);
    });
}

// Setters
export function _updateActiveVocabSection(vocabData: VocabSection): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MatchingDataKeys.StoredMatchingData, JSON.stringify(vocabData) ));
        }, 300);
    });
}

export function _updateMatchingErrorCount(numOfErrors: number): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MatchingDataKeys.ErrorCount, JSON.stringify(numOfErrors) ));
        }, 300);
    });
}

export function _setTermsToPractice(terms: Term[]): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MatchingDataKeys.TermsToPractice, JSON.stringify(terms)) );
        }, 300);
    });
}