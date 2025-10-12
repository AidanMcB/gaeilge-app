import Button from "primevue/button";
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import Chip from "primevue/chip";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import DataView from "primevue/dataview";
import Dialog from "primevue/dialog";
import { Form } from '@primevue/forms';
import Fieldset from 'primevue/fieldset';
import MultiSelect from "primevue/multiselect";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import ToggleButton from "primevue/togglebutton";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import Password from "primevue/password";
import Tooltip from 'primevue/tooltip';
import { StylePreset } from "../styles/presets";

import PrimeVue from "primevue/config";
import type { App } from "vue";

export default {
    install: (app: App): void => {
        app.use(PrimeVue, {
            theme: {
                preset: StylePreset,
                options: {
                    darkModeSelector: ".my-app-dark",
                    cssLayer: {
                        name: "primevue",
                        order: "index.css, base.css, tailwind-base, primevue, tailwind-utilities"
                    }
                }
            },
            ptOptions: { mergeSections: true, mergeProps: true }
        })

        app.use(ToastService);
        app.use(ConfirmationService);
        
        app.component("PrimeButton", Button);
        app.component("PrimeCard", Card);
        app.component("PrimeCarousel", Carousel);
        app.component("PrimeChip", Chip);
        app.component("PrimeFloatLabel", FloatLabel);
        app.component("PrimeForm", Form);
        app.component("PrimeFieldset", Fieldset);
        app.component("PrimeTag", Tag);
        app.component("PrimeMultiSelect", MultiSelect);
        app.component("PrimeDialog", Dialog);
        app.component("PrimeInputGroup", InputGroup);
        app.component("PrimeInputGroupAddon", InputGroupAddon);
        app.component("PrimeInputText", InputText);
        app.component("PrimeConfirmPopup", ConfirmPopup);
        app.component("PrimeToggleButton", ToggleButton);
        app.component("PrimeToast", Toast);
        app.component("PrimeDataView", DataView);
        app.component("PrimeTextarea", Textarea);
        app.component("PrimeMessage", Message);
        app.component("PrimePassword", Password);
        app.component("PrimeConfirmDialog", ConfirmDialog);

        // Directives
        app.directive('tooltip', Tooltip);
    }
}