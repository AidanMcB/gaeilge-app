<script setup lang='ts'>
import type { INoteCard } from '../../ts/notecard.interfaces';
import { ref } from 'vue';
import { useNoteCardStore } from '../../stores/notecardStore';

const props = defineProps<{
    notecard: INoteCard;
    variant?: string;
}>();

const flipped = ref(false);
const notecardStore = useNoteCardStore();

const flip = () => {
    flipped.value = !flipped.value;
};

async function handleEdit(event: Event): Promise<void> {
    event.stopPropagation();
    notecardStore.openAddEditModal('edit', props.notecard);
}

async function handleDelete(event: Event): Promise<void> {
    event.stopPropagation();
    notecardStore.openDeleteModal(props.notecard);
}

</script>

<template>
    <div @click='flip' 
        :class="['card-container hover:cursor-pointer h-[125px] md:h-full w-full relative', flipped ? 'flipped' : '', variant]">
        <div class='front bg-mute-standard border border-emerald-500 flex justify-center items-center relative'>
            <slot name='front'>
                <p class='md:text-2xl lg:text-3xl'>{{ props.notecard.irishPhrase }}</p>
                <PrimeButton v-if='notecardStore.isEditAllMode' @click='handleDelete($event)' class='w-6 h-6 absolute left-1 bottom-1' :class="{'left-2 bottom-2': !notecardStore.gridView}">
                    <i class='pi pi-trash text-rose-500 text-sm md:text-xl' :class="{'text-xl': !notecardStore.gridView}"></i>
                </PrimeButton>
                <PrimeButton v-if='notecardStore.isEditAllMode' @click='handleEdit($event)' class='w-6 h-6 absolute right-1 bottom-1' :class="{'right-2 bottom-2': !notecardStore.gridView}">
                    <i class='pi pi-pencil text-green-500 text-sm md:text-xl' :class="{'text-xl': !notecardStore.gridView}"></i>
                </PrimeButton>
            </slot>
        </div>
        <div class='back bg-mute-standard border border-emerald-500 flex justify-center items-center'>
            <slot name='back'>
                <p class='md:text-2xl lg:text-3xl'>{{ props.notecard.englishPhrase }}</p>
                <PrimeButton v-if='notecardStore.isEditAllMode' @click='handleDelete($event)' class='w-6 h-6 absolute left-1 bottom-1' :class="{'left-2 bottom-2': !notecardStore.gridView}">
                    <i class='pi pi-trash text-rose-500 text-sm md:text-xl' :class="{'text-xl': !notecardStore.gridView}"></i>
                </PrimeButton>
                <PrimeButton v-if='notecardStore.isEditAllMode' @click='handleEdit($event)' class='w-6 h-6 absolute right-1 bottom-1' :class="{'right-2 bottom-2': !notecardStore.gridView}">
                    <i class='pi pi-pencil text-green-500 text-sm md:text-xl' :class="{'text-xl': !notecardStore.gridView}"></i>
                </PrimeButton>
            </slot>
        </div>
    </div>
    
</template>

<style scoped lang='scss'>
    .card-container {
        margin: 0;
        padding: 0;
        position: relative;
        box-sizing: border-box;
        width: 100%;

        .front,
        .back {
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            position: absolute;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            transition: -webkit-transform ease 500ms;
            transition: transform ease 500ms;
        }
        .front {
            z-index: 2;
            transform: rotateY(0deg);
        }
        .back {
            transform: rotateY(-180deg);
        }

        &.flipped {
            .front {
                transform: rotateY(180deg);
            }
            .back {
                transform: rotateY(0deg);
            }
        }
    }

</style>