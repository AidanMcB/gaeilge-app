<script lang='ts' setup>
import { computed, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
    allowEdit: boolean;
    isViewMode: boolean;
    isSubmitted: boolean;
    label: string;
    text: string;
}>();

const emits = defineEmits(['updateValue']);

const inputText = ref<string>(props.text || '');

const updateInputChange = useDebounceFn((value: string) => {
    emits('updateValue', value);
}, 500);

function onInputChange(event: any): void {
    updateInputChange(event.target.value);
}

const containerRef = ref();
const isOverflowHidden = ref<boolean>(true);

function toggleExpand(): void {
    isOverflowHidden.value = !isOverflowHidden.value;
}

const showExpandButton = computed(() => {
    return props.text.length > 26;
})

</script>

<template>
    <label for='irish' class='font-semibold w-full mb-2 self-end'>{{ label }}</label>
    <PrimeTextarea v-if="allowEdit" autoResize rows='5' cols='30'
        required     
        id='irish' 
        class='border rounded border-emerald-500 bg-mute-standard p-2 w-full h-32 focus:border-emerald-700 focus:outline-emerald-700 text-lg' 
        autocomplete='off' 
        v-model='inputText'
        @input='onInputChange'
        :class="{ 'border-rose-500': isSubmitted && inputText.length < 1 }"
    />
    <div v-else-if='isViewMode' class='relative w-full'>
        <div
            class="overflow-y-auto w-full text-lg border rounded border-emerald-500 bg-mute-standard p-2 w-full h-32 focus:border-emerald-700 focus:outline-emerald-700"
            :class="{'h-36 line-clamp-4': isOverflowHidden, 'h-auto': !isOverflowHidden}"
            :ref="containerRef"
            >
                {{ text }}
        </div>
        <div class='absolute bottom-2 right-2' v-if="showExpandButton">
            <button
               @click="toggleExpand"
               class='ml-auto p-2 w-6 h-6 shadow-md rounded-full border border-standard-300 bg-mute-standard z-30 flex items-center justify-center'
            >
               <span v-if="isOverflowHidden" class='pi pi-plus text-xs'></span>
               <span v-else class='pi pi-minus text-xs'></span>
           </button>
        </div>
    </div>
</template>