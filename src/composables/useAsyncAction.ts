import { ref, type Ref } from 'vue';

/**
 * Wraps an async call with loading + error state for UI feedback.
 */
export function useAsyncAction() {
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);

    async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
        loading.value = true;
        error.value = null;
        try {
            return await fn();
        } catch (e) {
            error.value = e instanceof Error ? e.message : String(e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return { loading, error, run };
}
