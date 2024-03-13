<script setup lang='ts'>
import { onMounted } from "vue";

declare const window: any;

onMounted( () => {
   

});

const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral" /* … */,
];
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
  " | ",
)};`;

const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    const SpeechGrammarList = window?.SpeechGrammarList || window?.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window?.SpeechRecognitionEvent || window?.webkitSpeechRecognitionEvent;

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);




</script>

<template>
    <div>
        <h2>Speech</h2>
    </div>
</template>

<style lang='scss'>
</style>