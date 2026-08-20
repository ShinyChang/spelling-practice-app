# Spelling Practice App

A web application for practicing and testing spelling skills with text-to-speech.

## Features

- Add words to your personal practice list
- Quiz yourself on the built-in Cambridge YLE Starters / Movers word lists (100 words at a time by default)
- Practice spelling through audio quizzes with text-to-speech
- Adjust speech speed (normal/slow) during exams
- Choose between US and UK English accents
- Words are shuffled for better learning
- Automatic re-testing until all words are correct
- Focus detection to prevent cheating
- Word lists can be shared via URL
- Data is saved in local storage

## URL Parameter Functionality

The app supports URL parameters for sharing word lists:

- Add words to the URL using the `words` parameter: `?words=apple,banana,orange`
- The URL updates automatically when the word list changes
- Word lists are always saved to both URL and localStorage

## Built-in Word Lists

Under **Quiz from a Word List** you can test yourself on the official Cambridge
Young Learners English word lists without adding anything by hand:

| List | Quizzed words |
|------|---------------|
| YLE Starters | 473 |
| YLE Movers | 367 |

Pick one or both lists and a quiz size (20 / 50 / 100 / All), then click
**Start Quiz**. **Browse these words** opens the whole selection, searchable,
with any word clickable to hear it. The words are drawn at random, and your own word list, its URL
parameter and its local storage entry are left untouched.

A quiz re-tests only the words you missed in each following round, so a
100-word quiz converges instead of restarting from scratch on the first slip.

The data files hold the complete lists (502 and 400 entries). The multi-word
entries ("in front of", "take a photo") are kept there but excluded from
quizzes, since answers are typed from dictation.

Word lists are extracted from the published PDFs
([Starters](https://www.yle.tw/download/wordlist/Starters.pdf),
[Movers](https://www.yle.tw/download/wordlist/Movers.pdf)) and verified
entry-for-entry against the official Cambridge
[combined wordlist](https://www.cambridgeenglish.org/Images/wordlists-pre-a1-starters-a1-movers-and-a2-flyers.pdf).

## How to Use

1. Add words to your practice list
2. Click "Start Exam" to begin
3. Listen to each word and type the correct spelling (capitalisation is ignored)
4. Submit your answer or press Enter
5. If you make any mistakes, you'll retry all words again
6. The exam is complete when you spell all words correctly in a single round

## Technical Details

- Built with React
- Uses Web Speech API for text-to-speech
- Implements localStorage for data persistence
- URL parameter functionality for sharing
- Document visibility API for focus monitoring

## Development

To run the project locally:

1. Clone the repository
```bash
git clone https://github.com/ShinyChang/spelling-practice-app.git
cd spelling-practice-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to GitHub Pages

This app is configured for GitHub Pages deployment:

1. Make your changes and commit them
2. Deploy to GitHub Pages
```bash
npm run deploy
```

3. Visit your app at [https://shinychang.github.io/spelling-practice-app](https://shinychang.github.io/spelling-practice-app)

## Building for Production

To build the app for production without deploying:

```bash
npm run build
```

This creates a production-ready build in the `build` folder.
