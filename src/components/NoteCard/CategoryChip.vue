<script lang="ts" setup>
import { useNoteCardStore } from "@/stores/notecardStore";
import type { Category } from "@/ts/category";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
    noteCardId: number;
    categories: Category[];
}>();

const noteCardStore = useNoteCardStore();
const toast = useToast();

const handleRemoveCategory = async (event: Event, categoryId: number) => {
    try {
        await noteCardStore.removeCategoryFromNoteCard(props.noteCardId, categoryId);
        toast.add({
            severity: "success",
            summary: "Rath!",
            detail: "Baineadh an chatagóir.",
            life: 3000
        });
    } catch (err) {
        console.error("Failed to remove category from note card. Error: ", err);
        toast.add({
            severity: "error",
            summary: "Úps!",
            detail: "Chuaigh rud eigin mícheart.",
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex flex-wrap w-full">
        <PrimeChip
            v-for="cat in categories"
            :key="cat.id"
            removable
            class="border border-emerald-400 bg-mute-standard text-neutral-300 text-sm p-2 m-1"
            @remove="handleRemoveCategory($event, cat.id)"
            :pt="{
                removeIcon: { class: ['!text-red-500'] }
            }"
        >
            <span>{{ cat.name }}</span>
        </PrimeChip>
    </div>
</template>
