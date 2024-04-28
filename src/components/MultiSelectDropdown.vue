<script setup>
    import { ref } from 'vue';
    
    const selectedCategories = ref();
    const categories = ref([
        { name: 'ainmhithe', code: 'animals' },
        { name: 'bia', code: 'food' },
        { name: 'taisteal', code: 'travel' },
    ]);
</script>

<template>
    <div class="card flex justify-content-center">
        <MultiSelect v-model="selectedCategories" :options="categories" optionLabel="name" placeholder="Select categories" display="chip" class="w-full md:w-20rem">
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <img :alt="slotProps.option.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" style="width: 18px" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
            <template #footer>
                <div class="py-2 px-3">
                    <b>{{ selectedCategories ? selectedCategories.length : 0 }}</b> item{{ (selectedCategories ? selectedCategories.length : 0) > 1 ? 's' : '' }} selected.
                </div>
            </template>
        </MultiSelect>
    </div>
</template>

<style lang='scss'>
@import '../styles/variables.scss';

.p-multiselect, .p-multiselect-header {
    background: var(--color-background-mute);
    border: 1px solid var(--emerald-500);
}

.p-multiselect-items {
    background: var(--color-background-mute);
}
.p-multiselect-item {
    color: var(--orange-500);
}
.p-multiselect-label-container {
    color: blue;
}
.p-multiselect-panel {
    background: var(--color-background-soft);
    border: 1px solid var(--emerald-500);
}
div.py-2.px-3 {
    color: var(--orange-500);
}

// p-multiselect	Container element.
// p-multiselect-label-container	Container of the label to display selected items.
// p-multiselect-label-container	Label to display selected items.
// p-multiselect-trigger	Dropdown button.
// p-multiselect-filter-container	Container of filter input.
// p-multiselect-panel	Overlay panel for items.
// p-multiselect-items	List container of items.
// p-multiselect-item	An item in the list.
// p-overlay-open	Container element when overlay is visible.
</style>

