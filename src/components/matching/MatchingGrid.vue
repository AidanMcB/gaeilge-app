<template>
    <div
        data-testid="active-matching-section"
        class="grid grid-cols-2 gap-4 sm:gap-8 md:gap-10 py-8 sm:py-12 md:py-16 md:p-4 w-full max-w-4xl mx-auto transition-all duration-200"
        :class="{
            'opacity-100': activeVocab?.englishTerms?.length,
            'opacity-0': !activeVocab?.englishTerms?.length
        }"
    >
        <!-- English -->
        <div class="flex flex-col justify-between" data-testid="english-col">
            <VocabCard
                v-for="term in activeVocab.englishTerms"
                :key="term.id"
                :term="term"
                :isDisabled="isDisabled"
                :lang="Language.English"
                :handleClick="handleItemClick"
            ></VocabCard>
        </div>
        <!-- Irish -->
        <div class="flex flex-col justify-between" data-testid="irish-col">
            <VocabCard
                v-for="term in activeVocab.irishTerms"
                :key="term.id"
                :term="term"
                :isDisabled="isDisabled"
                :lang="Language.Irish"
                :handleClick="handleItemClick"
            ></VocabCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type LanguageType, type Term, type VocabSection } from '../../ts/Matching';
import { Language } from '../../ts/Constants';

const emit = defineEmits<{
    (e: 'handle-item-click', term: Term, language: LanguageType): void;
}>();

defineProps<{
    isDisabled: boolean;
    activeVocab: VocabSection;
}>();

function handleItemClick(term: Term, language: LanguageType) {
    emit('handle-item-click', term, language);
}
</script>
