# Spelling Practice App

A web application for practicing and testing spelling skills with text-to-speech.

## Features

- Add words to your personal practice list
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

## How to Use

1. Add words to your practice list
2. Click "Start Exam" to begin
3. Listen to each word and type the correct spelling
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
