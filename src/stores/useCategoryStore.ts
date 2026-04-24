import { defineStore } from "pinia";
import { ref } from "vue";
import * as categoryService from "@/services/category.service";
import type { Category } from "@/ts/Category";

export const useCategoryStore = defineStore("useCategoryStore", () => {
    const categories = ref<Category[]>([]);

    async function getCategories(): Promise<void> {
        try {
            const resp = await categoryService._getAllCategories();
            categories.value = resp;
        } catch (err) {
            console.error("Failed to retrieve categories.");
        }
    }

    async function addNewCategory(newCategory: string): Promise<void> {
        try {
            const resp: Category = await categoryService._addNewCategory(newCategory);
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
