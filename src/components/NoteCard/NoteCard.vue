<script setup lang='ts'>
import type { INoteCard } from '../../ts/notecard.interfaces';
import { computed, ref } from 'vue';
import { useNoteCardStore } from '../../stores/notecardStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    notecard: INoteCard;
    variant?: string;
}>();

const flipped = ref(false);
const notecardStore = useNoteCardStore();
const { gridView } = storeToRefs(notecardStore)


function handleClick() {
    flipped.value = !flipped.value;
}

function openCardModal(e: Event): void {
    e.stopPropagation()
    notecardStore.openViewCardModal(props.notecard)
}

async function handleEdit(event: Event): Promise<void> {
    event.stopPropagation();
    notecardStore.openAddEditModal('edit', props.notecard);
}

const irishLabel = computed(() => {
    return gridView.value ? 'GA' : 'Gaeilge';
})

const englishLabel = computed(() => {
    return gridView.value ? 'EN' : 'Béarla';
})

const showEditIcon = computed(() => {
    return notecardStore.isEditAllMode && gridView.value == true;
})
</script>

<template>
    <div @click='handleClick' 
        class='h-[125px] w-full md:h-full p-0 m-0 relative hover:cursor-pointer box-border'
        :class="['card-container', flipped ? 'flipped' : '', variant]">
        <!--  Front -->
        <div class='front bg-mute-standard border border-emerald-500 flex justify-center items-center relative'>
            <slot name='front'>
                <i v-if="!gridView" @click.prevent="openCardModal" class='pi pi-arrow-up-right-and-arrow-down-left-from-center text-xs absolute top-2 right-2'></i>
                <span class='text-xs absolute top-1 left-1'><i>{{ irishLabel }}</i></span>

                <p class='text-center line-clamp-2 px-2'>
                    {{ notecard.irishPhrase }}
                </p>

                <PrimeButton v-if='showEditIcon' @click='handleEdit($event)' class='w-6 h-6 absolute right-1 bottom-1' :class="{'right-2 bottom-2': !gridView}">
                    <i class='pi pi-pencil text-green-500 text-sm md:text-xl' :class="{'text-xl': !gridView}"></i>
                </PrimeButton>
            </slot>
        </div>

        <!-- Back -->
        <div class='back bg-mute-standard border border-emerald-500 flex justify-center items-center relative'>
            <slot name='back'>
                <i v-if="!gridView" @click="openCardModal" class='pi pi-arrow-up-right-and-arrow-down-left-from-center text-xs absolute top-2 right-2'></i>
                <span class='text-xs absolute top-1 left-1'><i>{{ englishLabel }}</i></span>

                <p class='text-center line-clamp-2 px-2'>
                    {{ props.notecard.englishPhrase }}
                </p>

                <PrimeButton v-if='showEditIcon' @click='handleEdit($event)' class='w-6 h-6 absolute right-1 bottom-1' :class="{'right-2 bottom-2': !gridView}">
                    <i class='pi pi-pencil text-green-500 text-sm md:text-xl' :class="{'text-xl': !gridView}"></i>
                </PrimeButton>
            </slot>
        </div>
    </div>
    
</template>

<style scoped lang='scss'>
    .card-container {
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
            height: 100%;
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