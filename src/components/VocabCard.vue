<script setup lang="ts">
import type { LanguageType, Term } from "../ts/matching";
import { AnswerState } from "../ts/enums";

const props = defineProps<{
    term: Term;
    isDisabled: boolean;
    lang: LanguageType;
    handleClick: (term: Term, lang: LanguageType) => void;
}>();
</script>

<template>
    <PrimeCard
        unstyled
        data-testid="term-card"
        :data-termid="term.id"
        :role="`${lang}-terms`"
        :class="{
            'p-2 min-h-24 md:w-2/3 md:self-center lg:self-center xl:self-center flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150': true,
            'hover:bg-transparent hover:pointer-events-disabled hover:cursor-default hover:text-gray-400':
                props.isDisabled,
            'bg-emerald-500 text-white': props.term.isSelected,
            'bg-transparent border-rose-500 hover:bg-transparent':
                props.term.state === AnswerState.Incorrect && props.term.isSelected,
            'opacity-30 bg-emerald-500 text-white pointer-events-none':
                props.term.state === AnswerState.Correct
        }"
        :disabled="
            props.term.state === AnswerState.Correct ||
            (props.term.state === AnswerState.Incorrect && props.term.isSelected)
        "
        @click="handleClick(props.term, lang)"
    >
        <template #title>
            <h1 class="text-xl font-bold text-center lg:text-3xl lg:p-4">
                {{ props.term.phrase }}
            </h1>
        </template>
    </PrimeCard>
</template>
