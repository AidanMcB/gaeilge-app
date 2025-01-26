<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const initialValues = ref({
    email: ""
});

const resolver = ({ values }: { values: any }) => {
    const errors: any = { email: [] };

    if (!values.email) {
        errors.email.push({ type: "required", message: "Email is required." });
    }

    if (values.email?.length < 3) {
        errors.email.push({
            type: "minimum",
            message: "Email must be at least 3 characters long."
        });
    }

    return {
        errors
    };
};

const onFormSubmit = ({ valid }: { valid: any }) => {
    if (valid) {
        toast.add({ severity: "success", summary: "Form is submitted.", life: 3000 });
    }
};
</script>

<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="card flex justify-center self-center">
            <PrimeForm
                v-slot="$form"
                :initialValues
                :resolver
                @submit="onFormSubmit"
                class="grid lg:grid-cols-2 gap-4 w-full"
            >
                <div class="flex flex-col justify-center items-center gap-4">
                    <PrimeInputText
                        name="email"
                        type="text"
                        placeholder="Email"
                        class="w-full p-1 min-w-72"
                    />
                    <PrimeInputText
                        name="password"
                        type="text"
                        placeholder="Password"
                        class="w-full p-1 min-w-72"
                    />
                    <PrimeButton
                        type="submit"
                        severity="secondary"
                        label="Login"
                        class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                    />
                    <span>  - or - </span>
                    <PrimeButton
                        type="button"
                        severity="secondary"
                        label="Sign Up"
                        class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                    />
                </div>
                <!-- <PrimeFieldset legend="Form States" class="h-80 overflow-auto"> -->
                    <!-- <pre class="whitespace-pre-wrap">{{ $form }}</pre> -->
                <!-- </PrimeFieldset> -->
            </PrimeForm>
        </div>
    </div>
</template>
