<script setup lang='ts'>
    import { useMatchingStore } from '../stores/matchingStore';
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { type LanguageType, type Term } from '../ts/matching.interfaces';
    import { Language, AnswerState } from '../ts/enums';

    const store = useMatchingStore();
    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        store.initVocabMatchingView(parseInt(route.params.section_id as string), parseInt(route.params.vocab_group_id as string));
    })

    function handleItemClick( term: Term, language: LanguageType ): void {
        if ((term.state === AnswerState.Unanswered || !term.state) && !store.isDisabled) {
            store.handleSelectTerm(term, language);
        }
    }

    function handleNext(): void {
        if (isLastQuestionsInQuiz()) {
            router.push(`/matching/section/${store.sectionId}/results`);
        } else {
            const nextVocabGroupId = store.handleNextVocabGroup();
            router.push(`/matching/section/${store.sectionId}/group/${nextVocabGroupId}`);
        }
    }
    
    function isLastQuestionsInQuiz(): boolean {
        return store.storedData.submittedAnswers?.length === 10;
    }

    function isEnglishIncorrect(english: Term): boolean {
        return english.state === AnswerState.Incorrect && english.phrase === store.selectedEnglishTerm.phrase;
    }

    function isIrishIncorrect(irish: Term): boolean {
        return irish.state === AnswerState.Incorrect && irish.phrase === store.selectedIrishTerm.phrase;
    }

</script>


<template>
    <div class='matching-wrapper w-full p-2 grid grid-rows-[1fr,1fr,8fr,1fr,1fr]'>

        <h2 class='text-3xl m-4 text-center font-bold lg:text-6xl'>        
            Matching
        </h2>

        <div class='flex justify-center flex-wrap text-xl'>
            <span v-if='store.activeVocabGroup.englishTerms?.every(el => el.state === AnswerState.Correct)' class='w-full text-center self-center text-emerald-500'>Complete!</span>
        </div>

        <div class='flex'>
            <div class='w-2/4 flex-col flex justify-between mr-4'>
                <PrimeCard 
                role='english-terms' v-for='english in store.activeVocabGroup.englishTerms' :key='english.id'
                :class="{
                    'mt-2 mb-2 p-2 h-28 basis-1/4 flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150 sm:w-36 md:w-48 LG:p-6 lg:w-60 xl:w-60': true,
                    'bg-transparent border-rose-500': isEnglishIncorrect(english),
                    'bg-emerald-500 text-white': english.id === store.selectedEnglishTerm.id,
                    'opacity-30 bg-emerald-500 text-white': english.state === AnswerState.Correct,
                }"  
                    :disabled='english.state === AnswerState.Correct'
                    @click='handleItemClick(english, Language.English)'>
                    <template #title>
                        <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>{{ english.phrase }}</h1>
                    </template>
                </PrimeCard>
            </div>

            <div class='w-2/4 flex-col flex justify-between ml-4'>
                <PrimeCard 
                role='irish-terms' v-for='irish in store.activeVocabGroup.irishTerms' :key='irish.id'
                :class="{
                    'mt-2 mb-2 p-2 h-28 basis-1/4 flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150 sm:w-36 md:w-48 LG:p-6 lg:w-60 xl:w-60': true,
                    'bg-transparent border-rose-500 text-rose-500': isIrishIncorrect(irish),
                    'bg-emerald-500 text-white': irish.id === store.selectedIrishTerm.id,
                    'opacity-30 bg-emerald-500 text-white': irish.state === AnswerState.Correct,
                }"  
                    :disabled='irish.state === AnswerState.Correct'
                    @click='handleItemClick(irish, Language.Irish)'>
                    <template #title>
                        <h1 class='text-xl font-bold text-center lg:text-4xl lg:p-4'>{{ irish.phrase }}</h1>
                    </template>
                </PrimeCard>
            </div>
        </div>

        <div class='flex justify-center flex-wrap text-xl'>
            <button v-if='store.activeVocabGroup.englishTerms?.every(el => el.state === AnswerState.Correct)' 
                @click='handleNext()'
                class='flex self-center transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md p-2 lg:text-2xl lg:p-4 hover:border-orange-200 hover:bg-orange-500 hover:text-white'>
                Next
            </button>
        </div>

        <div class='flex items-end'>
            <progress id='vocab-progress transition ease-in-out delay-1000' :value='parseInt(store.activeGroupNumber)*10' max='100'></progress>
        </div>

    </div>

</template>

<style lang='scss'>
    progress {
        border: none;
        width: 100%;
        height: 20px;
        border-radius: 25px;
        background: var(--emerald-500);
        margin: 0;
        padding: 0
    }

    progress::-moz-progress-bar {
        border-radius: 25px;
    }

    progress::-webkit-progress-value {
        background: var(--emerald-500);
        transition: 1000ms;
        border-radius: 25px;
    }

    progress::-webkit-progress-bar {
        border-radius: 25px;
    }

</style>