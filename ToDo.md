ToDo 

- init tialwind
- start game with matching words - plan further when you get there
    - Duolingo clone style, nbd
    - display terms on each side, match them 

Stretch Goals
- split up logic and  code
- custom tailwind css styling
- add  timer to matching-words



// look into
- reusable class combinations for tailiwnd to prevent really long class names


// matching
    left english
    right irish
    - need to find a way to keep track of mistakes
    
    - data restructure idea
- make a huge list of terms, instead of grouping them.
- term: english, irish, id
- randomly get 4
// matchingData: {
    sections: vocabSection: []
}
    // section: {
        id: number;
        terms: []Term;
    }
        // Term: {
            id: number;
            english: string;
            irish: string;
        }

OR 
- one long list of irish, one long list of english
- the match via ID


// notecards

today
matching logic
results matching view (how many errors)
start testing!

// Bugs
restarts quiz with only one term for english and irish after completing?? hitting home button


<!-- module.exports = {
  theme: {
    screens: {
      'sm': {'min': '640px', 'max': '767px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '1024px', 'max': '1279px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': {'min': '1536px'},
      // => @media (min-width: 1536px) { ... }
    },
  }
} -->