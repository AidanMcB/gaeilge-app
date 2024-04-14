<script setup lang='ts'>
import { type AnswerStateType } from "../ts/matching.interfaces"
import { AnswerState } from '../ts/enums';

    defineProps<{
        message: string;
        variant: AnswerStateType;
    }>();

</script>

<template>
    <div :class="{
        'text-emerald-500': variant === AnswerState.Correct
    }">
        {{ message }}
    </div>
</template>

