<script lang='ts' setup>

defineProps<{
    isViewMode: boolean;
    isEditMode: boolean;
    isCreateMode: boolean;
}>();

const emits = defineEmits(['changeToEditMode', 'confirmDelete', 'changeToViewMode', 'saveChanges', 'closeCardModal', 'submitCreateCardForm']);

</script>
<template>

<div class='flex justify-around gap-4'>
    <template v-if='isCreateMode'>
        <PrimeButton @click="emits('closeCardModal')" class='h-10 w-32 text-neutral-300 border border-neutral-300 px-2'>
            <i class='pi pi-times'></i> Cancel
        </PrimeButton>
        <PrimeButton @click="emits('submitCreateCardForm')" class='h-10 w-32 text-emerald-500 border border-emerald-500 px-2'>
            <i class='pi pi-save'></i> Create
        </PrimeButton>
    </template>
    <template v-else>
        <PrimeButton class='h-10 w-32 text-rose-500 border border-rose-500 px-2 !sm:bg-red-400' @click="emits('confirmDelete', $event)">
            <i class='pi pi-trash'></i> Delete
        </PrimeButton>
        <template v-if='isEditMode'>
            <PrimeButton @click="emits('saveChanges')" class='h-10 w-32 text-emerald-500 border border-emerald-500 px-2'>
                <i class='pi pi-save'></i> Save
            </PrimeButton>
        </template>
        <template v-else-if='isViewMode'>
            <PrimeButton class='h-10 w-32 text-orange-400 border border-orange-400 px-2 !sm:bg-red-400' @click="emits('changeToEditMode')">
                <i class='pi pi-pencil'></i> Edit
            </PrimeButton>
        </template>

    </template>
</div>

</template>
