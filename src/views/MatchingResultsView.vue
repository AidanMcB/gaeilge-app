<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMatchingStore } from '../stores/matchingStore';
import { type TermCard } from '../ts/interfaces';
import { clearAllStoredData } from '../utils/helper';

    const store = useMatchingStore();
    const route = useRoute();
    const router = useRouter();
    const state = ref({
        translated: [] as TermCard[],
        isLoading: true
    });

    onMounted( async () => {
        await store.initMatchingView();
        for (let i = 0; i < store.termsToPractice.length; i++) {
            const term = store.termsToPractice[i];
            let translation = store.getTranslatedTerm(term);
            state.value.translated.push({
                id: term.id,
                englishPhrase: term.phrase,
                irishPhrase: translation.phrase,
            });
        }
        state.value.isLoading = false;
    });

    function returnHome() {
        clearAllStoredData();
        router.push('/');
    }

    function tryAnotherQuiz() {
        clearAllStoredData();
        router.push('/section-select');
    }

</script>

<template>
    <div class='justify-center h-full w-full p-2 grid grid-rows-[1fr,1fr,40vh,1fr] text-center'>

        <h1 class='text-3xl text-center content-center font-bold lg:text-6xl'>Section {{ route.params.section_id }} <br/>Matching Results</h1>

        <!-- how many answers incorrect -->
        <div :class="{
                'text-lg content-start sm:text-lg lg:text-2xl transition-all duration-200 w-full flex flex-wrap justify-center': true,
                'opacity-100': !store.isLoading,
                'opacity-0': store.isLoading,
            }">You got 
            <span :class="{
                'text-red-500': store.errorCount > 15,
                'text-orange-500': store.errorCount < 15 && store.errorCount > 6,
                'text-emerald-500': store.errorCount <= 5 
            }">&nbsp;{{ store.errorCount }}&nbsp;</span>
            terms incorrect. Click on the terms to see the correct translation.
        </div>

        <!-- answers that you got wrong --> 
        <div v-if='state.translated && state.translated.length > 0' class='flex justify-around flex-wrap overflow-y-auto answer-grid p-4'>
            <FlipCard v-for='(term) in state.translated' :key='term.id' class='h-12'>
                <template v-slot:front>
                    <span class='inline-flex items-center bg-transparent text-base font-bold text-lg lg:text-2xl text-rose-500'>
                        {{ term.englishPhrase }}
                    </span>
                </template>
                <template v-slot:back>
                    <span class='inline-flex items-center bg-transparent text-base font-bold text-emerald-500 text-lg lg:text-2xl'>
                        {{ term.irishPhrase }}
                    </span>
                </template>
            </FlipCard>
        </div>

        <!-- CTA -->
        <div  v-if='!state.isLoading' class='flex justify-evenly self-end'>
            <PrimeButton 
                class='transition ease-in-out duration-300 text-lg border border-emerald-500 rounded-md bg-emerald-600 p-2 text-white lg:text-2xl lg:p-4 hover:bg-emerald-500 hover:text-white' 
                @click='tryAnotherQuiz' severity='secondary'>
                Try another section
            </PrimeButton>
            <PrimeButton 
                class='transition ease-in-out duration-300 text-lg border border-orange-500 rounded-md bg-orange-600 p-2 text-white lg:text-2xl lg:p-4 hover:bg-orange-500 hover:text-white' 
                @click='returnHome' severity='info'>
                Home
            </PrimeButton>
        </div>

         <span v-if='state.isLoading' class='flex flex-col justify-center items-center h-5/6'>
            <i class='pi pi-spinner animate-spin text-emerald-500 text-8xl'></i>
        </span>
            
    </div>

</template>

<style scoped lang='scss'>
@import '../styles/variables.scss';
@media (min-width: 768px) and (max-width: 1023px) { 
    .answer-grid {
        width: 60vw;
    }
}

@media (min-width: 1024px) and (max-width: 1535px) { 
    .answer-grid {
        width: 80vw;
    }
}

@media (min-width: 1536px) { 
    .answer-grid {
        width: 70vw;
    }
}
.answer-gird {
    height: 30vh;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
}

::-webkit-scrollbar:vertical {
    width: 8px;
}

::-webkit-scrollbar:horizontal {
    height: 12px;
}

::-webkit-scrollbar-thumb {
    background-color: var(--emerald-500);
    border-radius: 10px;
}

::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: black;
}
</style>