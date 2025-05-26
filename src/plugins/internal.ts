import NavBar from "../components/navBar/NavBar.vue";
import FlipCard from "../components/flipCard/FlipCard.vue";
import BannerMessage from "../components/bannerMessage/BannerMessage.vue";
import QuizQuestionResult from "../components/quiz/QuizQuestionResult.vue";
import VocabCard from "../components/vocabCard/VocabCard.vue";
import NoteCard from "../components/noteCard/NoteCard.vue";
import NoteCardActions from "../components/noteCard/NoteCardActions.vue";
import NoteCardCarousel from "../components/noteCard/NoteCardCarousel.vue";
import NoteCardForm from "../components/noteCard/NoteCardForm.vue";
import MultipleChoiceOptions from "../components/quiz/MultipleChoiceOptions.vue";
import ModalSection from "../components/noteCard/ModalSection.vue";
import NoteCardFormActions from "../components/noteCard/NoteCardFormActions.vue";
import QuizResultsHeader from "../components/quiz/QuizResultsHeader.vue";
import AddCategory from "../components/noteCard/AddCategory.vue";
import CategorySelect from "../components/categorySelect/CategorySelect.vue";
import type { App } from "vue";
import MatchingGrid from "@/components/matching/MatchingGrid.vue";

export default {
    install: (app: App): void => {

        app.component("AddCategory", AddCategory);
        app.component("CategorySelect", CategorySelect);
        app.component("NavBar", NavBar);
        app.component("MultipleChoiceOptions", MultipleChoiceOptions);
        app.component("FlipCard", FlipCard);
        app.component("BannerMessage", BannerMessage);
        app.component("QuizQuestionResult", QuizQuestionResult);
        app.component("VocabCard", VocabCard);
        app.component("MatchingGrid", MatchingGrid);
        app.component("NoteCard", NoteCard);
        app.component("NoteCardForm", NoteCardForm);
        app.component("NoteCardCarousel", NoteCardCarousel);
        app.component("NoteCardActions", NoteCardActions);
        app.component("ModalSection", ModalSection);
        app.component("NoteCardFormActions", NoteCardFormActions);
        app.component("QuizResultsHeader", QuizResultsHeader);
    }
}