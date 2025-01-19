<script setup lang='ts'>
    import { useMatchingStore } from '../../stores/matchingStore';
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { type LanguageType, type Term } from '../../ts/matching';
    import { Language, AnswerState } from '../../ts/enums';

    const store = useMatchingStore();
    const route = useRoute();
    const router = useRouter();

    onMounted( async () => {
        await store.initMatchingView();
    });

    function handleItemClick( term: Term, language: LanguageType): void {
        if ((term.state === AnswerState.Unanswered || !term.state) && !store.isDisabled) {
            store.handleSelectTerm(term, language);
        }
    }

    function handleNext(): void {
        if (store.isComplete()) {
            router.push(`/matching/section/${route.params.section_id as string}/results`);
        } else {
           store.nextBatchOfVocabQuestions();
        }
    }

</script>

<template>
    <div class='w-full h-full p-2 grid grid-rows-[1fr,8fr,1fr,1fr]'>

        <div class='flex justify-center flex-wrap text-xl'>
            <span v-if='!store.isLoading && store.isComplete()' class='w-full text-center self-center text-emerald-500'>Complete!</span>
        </div>

        <div data-testid='active-matching-section'
            v-if='!store.isLoading'
            :class="{
                'grid grid-cols-2 gap-4 transition-all duration-200': true,
                'opacity-100': store.activeVocab?.englishTerms?.length,
                'opacity-0': !store.activeVocab?.englishTerms?.length,
            }">
                <div class='grid grid-rows-4 md:place-content-center lg:place-content-center xl:place-content-center' data-testid='english-col'>
                    <VocabCard v-for='term in store.activeVocab.englishTerms' :key='term.id' :term='term' :isDisabled='store.isDisabled' :lang='Language.English' :handleClick='handleItemClick'></VocabCard>
                </div>
                <div class='grid grid-rows-4 md:place-content-center lg:place-content-center xl:place-content-center' data-testid='irish-col'>
                    <VocabCard v-for='term in store.activeVocab.irishTerms' :key='term.id' :term='term' :isDisabled='store.isDisabled' :lang='Language.Irish' :handleClick='handleItemClick'></VocabCard>
                </div>
        </div>

        <div class='flex justify-center self-end flex-wrap text-xl'>
            <button v-if='store.activeVocab.englishTerms?.every(el => el.state === AnswerState.Correct)' 
                @click='handleNext()'
                class='flex self-center transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md p-2 lg:text-2xl lg:p-2 hover:border-orange-200 hover:bg-orange-500 hover:text-white'>
               <span v-if='store.isComplete()'>See Results</span>
               <span v-else>Next</span>
            </button>
        </div>

        <div class='flex items-end'>
            <span v-if='store.isLoading && !store.isComplete()' class='text-emerald-500 lg:text-2xl w-full text-center'> 
                <i class='pi pi-spinner animate-spin lg:text-2xl'></i>
                loading ...
            </span>
            <progress v-if='store.activeVocab?.englishTerms?.length && !store.isLoading' id='vocab-progress transition ease-in-out delay-1000' :value='store.getPercentageAnswered()' max='100'></progress>
        </div>

    </div>

</template>

<style lang='scss'>
    .default-text {
        color: rgba(235, 235, 235, 0.64);
    }
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