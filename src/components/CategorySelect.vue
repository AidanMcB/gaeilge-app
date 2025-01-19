<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import type { Category } from "@/ts/category";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const props = defineProps<{
    id: string;
    preSelectedCategories: Category[];
}>();

const emit = defineEmits(["update-categories"]);

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const selectedCategories = ref<Category[]>([...props.preSelectedCategories]);

watch(selectedCategories, (newValue) => {
    emit("update-categories", newValue);
});
</script>

<template>
    <div class="card w-2/3">
        <PrimeMultiSelect
            v-model="selectedCategories"
            :options="categories"
            display="chip"
            optionLabel="name"
            placeholder="Select categories"
            :maxSelectedLabels="1"
            selectedItemsLabel="{0} Items Selected"
            :pt="{
                root: {
                    class: [
                        'box-border border rounded border-emerald-500 bg-mute-standard text-neutral-300 relative w-full h-10 text-sm hover:border-emerald-700 active:border-emerald-700'
                    ]
                },
                chipitem: { class: ['text-sm'] },
                pcchip: { class: ['!p-0'] },
                panel: { class: ['bg-mute-standard'] },
                token: {
                    class: ['border rounded border-emerald-500 bg-mute-standard text-neutral-300']
                },
                removeTokenIcon: { class: ['text-rose-500'] },
                header: {
                    class: ['border border-emerald-500 bg-mute-standard p-2 hover:']
                },
                list: { class: ['border rounded-b-lg border-emerald-500 border-t-0'] },
                listContainer: { class: ['bg-mute-standard'] },
                label: { class: ['text-neutral-300 h-full'] },
                closeIcon: { class: ['text-neutral-300'] }
            }"
        >
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div class="text-neutral-300">{{ slotProps.option.name }}</div>
                </div>
            </template>
        </PrimeMultiSelect>
    </div>
</template>

<style lang="scss">
@import "../styles/variables.scss";

.p-multiselect-panel
    .p-multiselect-items
    .p-multiselect-item:not(.p-highlight):not(.p-disabled).p-focus {
    background: var(--color-background);
    border-radius: 0.5rem;
}

.p-multiselect-option .p-focus > [data-p-focused="false"] > [data-p-selected="true"] {
    background: var(--color-background);
}

.p-chip.p-component.p-multiselect-chip {
    background: var(--color-background-soft);
    border: 1px solid #d4d4d4;
    color: #d4d4d4;
}

.p-icon.p-chip-remove-icon {
    fill: #d4d4d4;
    color: #d4d4d4;
}

.p-multiselect-header:hover {
    background: var(--color-background-soft);
}

.p-inputtext.p-component.p-multiselect-filter {
    background: var(--color-background);
    color: #d4d4d4;
}
</style>
