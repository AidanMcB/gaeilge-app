<script setup lang='ts'>
    import { ref } from 'vue';
    const props = defineProps<{
        id: string;
    }>();

    const selectedCategories = ref();
    const categories = ref([
        { name: 'ainmhithe', code: 'animals' },
        { name: 'bia', code: 'food' },
        { name: 'taisteal', code: 'travel' },
    ]);

</script>

<template>
    <div class='card w-full'>
        <MultiSelect v-model="selectedCategories" :options="categories" optionLabel="name" placeholder="Select categories" class="w-full md:w-20rem"
            :maxSelectedLabels="1" selectedItemsLabel='{0} Items Selected'
            :pt="{ 
                root: { class: ['border rounded border-emerald-500 bg-mute-standard relative'] },
                panel: { class: ['bg-mute-standard'] },
                token: { class: ['border rounded border-emerald-500 m-1 bg-mute-standard text-neutral-300'] },
                removeTokenIcon: { class: ['ml-2 text-rose-500'] },
                header: { class: ['border border-emerald-500 bg-mute-standard p-2'] }, 
                list: { class: ['border rounded-b-lg border-emerald-500 border-t-0'] },
                closeIcon: { class: ['text-neutral-300'] },
            }">
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div class='text-neutral-300 ml-2'>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </MultiSelect>
    </div>
</template>

<style lang='scss'>
@import '../styles/variables.scss';

.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled).p-focus {
    background: var(--color-background);
    border-radius: 0.5rem;
}
</style>

