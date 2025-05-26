<script setup lang="ts">
import type { LanguageType, Term } from '@/ts/Matching';
import { AnswerState } from '@/ts/Constants';

const props = defineProps<{
    term: Term;
    isDisabled: boolean;
    lang: LanguageType;
    handleClick: (term: Term, lang: LanguageType) => void;
}>();
</script>

<template>
    <div
        data-testid="term-card"
        :data-termid="term.id"
        :role="`${lang}-terms`"
        class="w-full h-24 md:h-28 lg:h-30 flex justify-center items-center border border-emerald-500 rounded-2xl hover:cursor-pointer hover:bg-emerald-500 focus:bg-emerald-500 hover:text-white focus:text-white transition ease-in-out duration-150 text-ellipsis overflow-hidden"
        :class="{
            'pointer-events-none text-gray-400': props.isDisabled,
            'bg-emerald-500 text-white': props.term.isSelected,
            'bg-transparent border-rose-500 hover:bg-transparent': props.term.state === AnswerState.Incorrect && props.term.isSelected,
            'opacity-30 bg-emerald-500 text-white pointer-events-none':
                props.term.state === AnswerState.Correct
        }"
        :disabled="
            props.term.state === AnswerState.Correct ||
            (props.term.state === AnswerState.Incorrect && props.term.isSelected)
        "
        @click="handleClick(props.term, lang)"
    >
        <h1
            class="text-xl font-bold text-center break-words px-2 lg:text-2xl overflow-hidden leading-tight text-balance"
            :class="{
                'text-base lg:text-xl': props.term.phrase.length > 15,
                'text-sm lg:text-lg': props.term.phrase.length > 25
            }"
        >
            {{ props.term.phrase }}
        </h1>
    </div>
</template>
