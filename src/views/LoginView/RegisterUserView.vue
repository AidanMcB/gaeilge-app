<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();

const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const errorMessage = ref<string>("");

const logIn = async (): Promise<void> => {
    errorMessage.value = "";
    if (email.value.length > 0 && password.value.length > 0) {
        try {
            const resp = await authStore.logIn(email.value, password.value)
            console.log('resp in comp', resp)
            toast.add({ severity: "success", summary: `Welcome new user, ${email.value}!`, life: 3000 });
            // router.push("/");
        } catch (err) {
            toast.add({ severity: "error", summary: `Failed to sign up.`, life: 3000 });
            errorMessage.value = err as string;
        }
    } else {
        errorMessage.value = "Enter your email address and password.";
    }
};

const togglePasswordVis = () => {
    showPassword.value = !showPassword.value;
};

const hasError = computed(() => {
    return errorMessage.value.length > 0 ? true : false;
});

</script>

<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <div class="w-full">
                <label for="email">Email</label>
                <input
                    class="w-full bg-mute-standard text-xl rounded p-2 border border-emerald-600 active:border-emerald-400 focus:border-emerald-400 focus:ring-0 focus:outline-emerald-400"
                    :class="{
                        '!border-red-500': hasError
                    }"
                    id="email"
                    v-model="email"
                    aria-describedby="email-help"
                />
            </div>

            <div class="w-full">
                <label for="password">Password</label>
                <div class="relative">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        class="w-full bg-mute-standard text-xl rounded p-2 border border-emerald-600 active:border-emerald-400 focus:border-emerald-400 focus:ring-0 focus:outline-emerald-400"
                        :class="{
                            '!border-red-500': hasError
                        }"
                        id="password"
                        v-model="password"
                        aria-describedby="password-help"
                    />
                    <button
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2"
                        @click="togglePasswordVis"
                    >
                        <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </button>
                </div>
            </div>

            <PrimeMessage size="small" severity="error" variant="simple">
                {{ errorMessage }}
            </PrimeMessage>

            <div class="w-full flex flex-wrap flex-col items-center gap-2">
                <PrimeButton
                    type="submit"
                    severity="secondary"
                    label="Login"
                    class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                    @click="logIn"
                />
                <span> - or - </span>
                <PrimeButton
                    type="button"
                    severity="secondary"
                    label="Sign Up"
                    class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                />
            </div>
        </div>
    </div>
</template>
