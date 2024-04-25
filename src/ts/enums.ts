export enum Practice {
    Quiz = 'quiz',
    Matching = 'matching'
}

export enum Language {
    English = 'english',
    Irish = 'irish'
}

export enum AnswerState { 
    Correct = 'correct',
    Incorrect = 'incorrect',
    Unanswered = 'unanswered'
}

export enum MultipleChoiceDataKeys {
    StoredQuizData = 'stored_quiz_data',
    AnsweredQuestions = 'answered_questions',
    QuestionNumber = 'question_number',
    AvailableSections = 'available_sections'
}

export enum MatchingDataKeys {
    StoredMatchingData = 'stored_matching_data',
    ErrorCount = 'vocab_err_count',
    TermsToPractice = 'terms_to_practice',
    AvailableSections = 'available_sections'
}
