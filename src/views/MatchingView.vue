<script setup lang='ts'>
    import { useMatchingStore } from '../stores/matchingStore';
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { type LanguageType, type Term } from '../ts/matching.interfaces';
    import { Language, AnswerState } from '../ts/enums';

    const store = useMatchingStore();
    const route = useRoute();
    const router = useRouter();

    onMounted( async () => {
        await store.initVocabMatchingView(parseInt(route.params.section_id as string));
    })

    function handleItemClick( term: Term, language: LanguageType ): void {
        if ((term.state === AnswerState.Unanswered || !term.state) && !store.isDisabled) {
            store.handleSelectTerm(term, language);
        }
    }

    function handleNext(): void {
        if (store.isComplete()) {
            router.push(`/matching/section/${store.sectionId}/results`);
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

        <div :class="{
                'grid grid-cols-2 gap-4 transition-all duration-200': true,
                'opacity-100': store.activeVocab?.englishTerms?.length,
                'opacity-0': !store.activeVocab?.englishTerms?.length,
            }">
            <div class='grid grid-rows-4 md:place-content-center lg:place-content-center xl:place-content-center'>
                <PrimeCard v-for='english in store.activeVocab.englishTerms' :key='english.id'
                    role='english-terms' 
                    :class="{
                        'p-2 h-28 flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150 md:w-72 lg:w-80': true,
                        'hover:bg-transparent hover:pointer-events-disabled hover:cursor-default hover:text-gray-400': store.isDisabled,
                        'bg-emerald-500 text-white': english.isSelected,
                        'bg-transparent border-rose-500 hover:bg-transparent': english.state === AnswerState.Incorrect && english.isSelected,
                        'opacity-30 bg-emerald-500 text-white pointer-events-none': english.state === AnswerState.Correct,
                    }"  
                    :disabled='(english.state === AnswerState.Correct) || (english.state === AnswerState.Incorrect && english.isSelected)'
                    @click='handleItemClick(english, Language.English)'>
                    <template #title>
                        <h1 class='text-xl font-bold text-center lg:text-3xl lg:p-4'>{{ english.phrase }}</h1>
                    </template>
                </PrimeCard>
            </div>

            <div class='grid grid-rows-4 md:place-content-center lg:place-content-center xl:place-content-center'>
                <PrimeCard v-for='irish in store.activeVocab.irishTerms' :key='irish.id'
                    role='irish-terms'
                    :class="{
                        'p-2 h-28 flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150 md:w-72 lg:w-80': true,
                        'hover:bg-transparent hover:pointer-events-disabled hover:cursor-default hover:text-gray-400': store.isDisabled,
                        'bg-emerald-500 text-white': irish.isSelected,
                        'bg-transparent border-rose-500 hover:bg-transparent': irish.state === AnswerState.Incorrect && irish.isSelected,
                        'opacity-30 bg-emerald-500 text-white': irish.state === AnswerState.Correct,
                    }"  
                    :disabled='irish.state === AnswerState.Correct'
                    @click='handleItemClick(irish, Language.Irish)'>
                    <template #title>
                        <h1 class='text-xl font-bold text-center lg:text-3xl lg:p-4'>{{ irish.phrase }}</h1>
                    </template>
                </PrimeCard>
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
            <span v-if='store.isLoading && !store.isComplete()' class='text-emerald-500 lg:text-2xl w-full'> 
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