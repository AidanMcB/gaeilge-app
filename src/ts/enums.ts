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
    AnsweredQuestions = 'answered_questions',
    QuestionNumber = 'question_number',
}

export enum MatchingDataKeys {
    ErrorCount = 'vocab_err_count',
    AnsweredQuestions = 'answered_vocab_questions',
    GroupNumber = 'vocab_group_number',
    TermsToPractice = 'terms_to_practice'
}
