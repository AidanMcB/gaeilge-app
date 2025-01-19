import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import * as categoryService from "@/services/category.service";

export const useCategoryStore = defineStore("useCategoryStore", () => {
    const categories = ref<any[]>([]);

    onMounted(() => {
        getCategories();
    });

    async function getCategories(): Promise<any> {
        try {
            const resp = await categoryService._getAllCategories();
            categories.value = resp;
        } catch (err) {
            console.error("Failed to retrieve categories.");
        }
    }

    async function addNewCategory(newCategory: string): Promise<void> {
        try {
            const resp = await categoryService._addNewCategory(newCategory);
            categories.value = [...categories.value, resp];
        } catch (err) {
            console.error("Failed to add a new category. Error: ", err);
            throw err;
        }
    }

    return {
        categories,
        getCategories,
        addNewCategory,
    };
});
