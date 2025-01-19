<script lang="ts" setup>
import { useCategoryStore } from "@/stores/categoryStore";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

const newCategory = ref<string>("");
const isLoading = ref<boolean>(false);
const valid = ref<boolean>(true);

const categoryStore = useCategoryStore();

const toast = useToast();

async function submitNewCategory(): Promise<void> {
    if (newCategory.value.length > 0) {
        isLoading.value = true;
        valid.value = true;
        try {
            await categoryStore.addNewCategory(newCategory.value);
            toast.add({
                severity: "success",
                summary: "Rath!",
                detail: "Cuireadh catagóir nua leis.",
                life: 3000
            });
            isLoading.value = false;
            newCategory.value = "";
        } catch (err) {
            console.error("Failed to add new category. Error: ", err);
            toast.add({
                severity: "error",
                summary: "Úps!",
                detail: "Chuaigh rud eigin mícheart.",
                life: 3000
            });
            isLoading.value = false;
        }
    } else {
        valid.value = false;
    }
}
</script>

<template>
    <PrimeFloatLabel class="w-full flex">
        <PrimeInputText
            id="new_category"
            v-model="newCategory"
            variant="filled"
            class="border rounded border-emerald-500 bg-mute-standard p-2 w-4/6"
            autocomplete="off"
            :invalid="!valid"
        />
        <label for="new_category" class="font-semibold w-6rem">Catagóir nua</label>
        <PrimeButton
            type="button"
            label="Add"
            icon="pi pi-plus"
            class="ml-auto p-2 border border-emerald-400 active:bg-emerald-400 active:text-mute-standard"
            :loading="isLoading"
            @click="submitNewCategory"
        />
    </PrimeFloatLabel>
</template>
