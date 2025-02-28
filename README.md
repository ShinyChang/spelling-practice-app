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
- When a URL parameter is present, the app uses those words instead of local storage
- The URL updates automatically when the word list changes (when using URL parameters)

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
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build

To build for production:

```
npm run build
```

This creates a production-ready build in the `build` folder.