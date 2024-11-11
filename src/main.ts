import './assets/main.css';
import './index.css';
import './assets/base.css';
import './styles/index.scss';
import { StylePreset } from './styles/presets';

//Vue
import { createApp } from 'vue';

// PrimeVue
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Button from 'primevue/button';
import Card from 'primevue/card';
import MultiSelect from 'primevue/multiselect';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Carousel from 'primevue/carousel';
import Tag from 'primevue/tag';
import ConfirmPopup from 'primevue/confirmpopup';
import ToggleButton from 'primevue/togglebutton';
import Toast from 'primevue/toast';
import DataView from 'primevue/dataview';

// Pinia
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import NavBar from './components/NavBar.vue';
import TimerClock from './components/TimerClock.vue';
import FlipCard from './components/FlipCard.vue';
import BannerMessage from './components/BannerMessage.vue';
import QuizQuestionResult from './components/QuizQuestionResult.vue';
import VocabCard from './components/VocabCard.vue';
import NoteCard from './components/NoteCard/NoteCard.vue';
import NoteCardForm from './components/NoteCard/NoteCardForm.vue';
import MultiSelectDropdown from './components/MultiSelectDropdown.vue';
import NoteCardCarousel from './components/NoteCard/NoteCardCarousel.vue';
import NoteCardActions from './components/NoteCard/NoteCardActions.vue';
import DeleteNoteCardForm from './components/NoteCard/DeleteNoteCardForm.vue';
import MultipleChoiceOptions from './components/MultipleChoiceOptions.vue';

const app = createApp(App);
const pinia = createPinia();

// Pinia
app.use(pinia);
// PrimeVue
app.use(PrimeVue, {
	theme: {
		preset: StylePreset,
		options: {
            darkModeSelector: '.my-app-dark',
            cssLayer: {
                name: 'primevue',
                order: 'index.css, base.css, tailwind-base, primevue, tailwind-utilities'
            }
		},
	},
	ptOptions: { mergeSections: true, mergeProps: true },
});
app.use(ToastService);
app.use(ConfirmationService);
app.component('PrimeButton', Button);
app.component('PrimeCard', Card);
app.component('PrimeCarousel', Carousel);
app.component('PrimeTag', Tag);
app.component('MultiSelect', MultiSelect);
app.component('PrimeDialog', Dialog);
app.component('InputText', InputText);
app.component('PrimeConfirmPopup', ConfirmPopup);
app.component('PrimeToggleButton', ToggleButton);
app.component('PrimeToast', Toast);
app.component('DataView', DataView);
app.component('NavBar', NavBar);
app.component('TimerClock', TimerClock);
app.component('MultipleChoiceOptions', MultipleChoiceOptions);
app.component('FlipCard', FlipCard);
app.component('BannerMessage', BannerMessage);
app.component('QuizQuestionResult', QuizQuestionResult);
app.component('VocabCard', VocabCard);
app.component('NoteCard', NoteCard);
app.component('NoteCardForm', NoteCardForm);
app.component('MultiSelectDropdown', MultiSelectDropdown);
app.component('NoteCardCarousel', NoteCardCarousel);
app.component('NoteCardActions', NoteCardActions);
app.component('DeleteNoteCardForm', DeleteNoteCardForm);

app.use(router);

app.mount('#app');
