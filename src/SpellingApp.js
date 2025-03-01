import React, { useState, useEffect, useRef } from "react";

const SpellingApp = () => {
  const [words, setWords] = useState([]);
  const [examWords, setExamWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [isExamComplete, setIsExamComplete] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [speechSpeed, setSpeechSpeed] = useState("normal"); // 'normal' or 'slow'
  const [speechAccent, setSpeechAccent] = useState("us"); // 'us' or 'uk'
  const [availableVoices, setAvailableVoices] = useState([]);

  const inputRef = useRef(null);
  const examInputRef = useRef(null);

  // Check for URL parameters and load word list on initial render
  useEffect(() => {
    // Parse word list from URL parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    const wordListParam = urlParams.get("words");

    if (wordListParam) {
      try {
        // Decode and parse the word list
        const decodedWords = decodeURIComponent(wordListParam);
        const parsedWords = decodedWords.split(",").map((word) => word.trim());

        // Filter out empty words
        const validWords = parsedWords.filter((word) => word.length > 0);

        if (validWords.length > 0) {
          setWords(validWords);
          return; // Skip loading from localStorage
        }
      } catch (error) {
        console.error("Error parsing word list from URL:", error);
      }
    }

    // If no valid URL parameters, load from localStorage
    const savedWords = localStorage.getItem("spellingAppWords");
    if (savedWords) {
      try {
        const parsedWords = JSON.parse(savedWords);
        if (Array.isArray(parsedWords)) {
          setWords(parsedWords);
        }
      } catch (error) {
        console.error("Error parsing saved words:", error);
      }
    }
  }, []);

  // Update URL parameters when word list changes
  useEffect(() => {
    try {
      // Only update URL after initial render (when words.length > 0)
      if (words.length > 0) {
        const wordListParam = encodeURIComponent(words.join(","));
        const url = new URL(window.location.href);
        url.searchParams.set("words", wordListParam);
        // Using only search part to maintain path compatibility with GitHub Pages
        window.history.replaceState({}, "", url.search);
      } else if (words.length === 0) {
        // If word list is empty, remove the parameter from URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch (error) {
      console.error("Error updating URL:", error);
    }
  }, [words]);

  // Always save word list to localStorage
  useEffect(() => {
    localStorage.setItem("spellingAppWords", JSON.stringify(words));
  }, [words]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices on init
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Get the appropriate voice based on selected accent
  const getVoice = React.useCallback(() => {
    let langCode;

    switch (speechAccent) {
      case "us":
        langCode = "en-US";
        break;
      case "uk":
        langCode = "en-GB";
        break;
      case "zh-TW":
        langCode = "zh-TW";
        break;
      default:
        langCode = "en-US";
    }

    // First try to find a voice that matches the exact language code
    let voice = availableVoices.find((v) => v.lang === langCode);

    // If no exact match, look for voices containing the right country code
    if (!voice) {
      const countryCode =
        speechAccent === "us" ? "US" : speechAccent === "uk" ? "GB" : "TW";
      voice = availableVoices.find((v) => v.lang.includes(countryCode));
    }

    // Fallback to any English voice if specific accent not available
    if (!voice) {
      voice = availableVoices.find((v) => v.lang.includes("en"));
    }

    return voice;
  }, [speechAccent, availableVoices]);

  // Speak a word using TTS - moved up to prevent "used before defined" errors
  const speakWord = React.useCallback(
    (specificWord = null) => {
      // Don't speak in exam mode if the exam is complete
      if (isExamMode && isExamComplete) return;

      // Determine which word to speak
      let wordToSpeak;

      if (specificWord) {
        // Use the provided word if one is passed
        wordToSpeak = specificWord;
      } else if (isExamMode && examWords.length > 0) {
        // In exam mode, use the current exam word
        wordToSpeak = examWords[currentWordIndex];
      }

      if (!wordToSpeak) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);

      // Set speech rate based on user preference
      utterance.rate = speechSpeed === "normal" ? 1 : 0.7;
      utterance.pitch = 1;

      // Set voice based on user preference
      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Speak the word
      window.speechSynthesis.speak(utterance);
    },
    [
      isExamMode,
      isExamComplete,
      examWords,
      currentWordIndex,
      speechSpeed,
      getVoice,
    ],
  );

  // Focus detection for exam mode
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        isExamMode &&
        !isExamComplete &&
        document.visibilityState === "hidden"
      ) {
        // User switched tabs or minimized window during exam
        const currentWord = examWords[currentWordIndex];
        setFeedback(`Focus lost! The word was "${currentWord}".`);
        setFeedbackColor("text-red-600");

        if (!incorrectWords.includes(currentWord)) {
          setIncorrectWords([...incorrectWords, currentWord]);
        }

        // Wait a moment before moving to the next word
        setTimeout(() => {
          setFeedback("");
          setUserAnswer("");

          if (currentWordIndex === examWords.length - 1) {
            // Restart exam with ALL words if any were incorrect
            setFeedback(
              "Some words were incorrect. Let's try again with all words.",
            );
            setFeedbackColor("text-blue-600");
            setTimeout(() => {
              // Clear feedback and user answer
              setFeedback("");
              setUserAnswer("");

              // Reset exam state with shuffled words
              const shuffledWords = shuffleArray(words);
              setExamWords(shuffledWords);
              setIncorrectWords([]);
              setCurrentWordIndex(0);

              // Force TTS to speak the first word after a short delay
              setTimeout(() => {
                if (examInputRef.current) {
                  examInputRef.current.focus();
                }
                speakWord();
              }, 200);
            }, 2000);
          } else {
            // Move to the next word
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
          }
        }, 2000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isExamMode,
    isExamComplete,
    currentWordIndex,
    examWords,
    incorrectWords,
    words,
    speakWord,
  ]);
  useEffect(() => {
    // When starting or restarting an exam, speak the first word after a short delay
    if (isExamMode && !isExamComplete && examWords.length > 0) {
      const timer = setTimeout(() => {
        speakWord();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [examWords, isExamMode, isExamComplete, speakWord]);

  // Shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const addWord = () => {
    if (newWord.trim()) {
      const normalizedWord = newWord.trim();
      if (!words.includes(normalizedWord)) {
        setWords([...words, normalizedWord]);
        setNewWord("");
        setFeedback("Word added successfully!");
        setFeedbackColor("text-green-600");
      } else {
        setFeedback("This word is already in your list.");
        setFeedbackColor("text-yellow-600");
      }
      setTimeout(() => setFeedback(""), 2000);
    }
    inputRef.current.focus();
  };

  const removeWord = (indexToRemove) => {
    setWords(words.filter((_, index) => index !== indexToRemove));
  };

  const startExam = () => {
    if (words.length === 0) {
      setFeedback("Please add some words first.");
      setFeedbackColor("text-yellow-600");
      setTimeout(() => setFeedback(""), 2000);
      return;
    }

    // Shuffle the words for the exam
    const shuffledWords = shuffleArray(words);

    // Set exam state
    setExamWords(shuffledWords);
    setIsExamMode(true);
    setCurrentWordIndex(0);
    setUserAnswer("");
    setFeedback("");
    setIsExamComplete(false);
    setIncorrectWords([]);

    // Force focus and TTS after a short delay to ensure DOM is updated
    setTimeout(() => {
      if (examInputRef.current) {
        examInputRef.current.focus();
      }
    }, 100);
  };

  const checkAnswer = () => {
    const currentWord = examWords[currentWordIndex];
    const isCorrect = userAnswer.trim() === currentWord;

    if (isCorrect) {
      setFeedback("Correct!");
      setFeedbackColor("text-green-600");

      setTimeout(() => {
        setFeedback("");
        setUserAnswer("");

        if (currentWordIndex === examWords.length - 1) {
          if (incorrectWords.length === 0) {
            // Only complete the exam if all words were correct in this round
            setIsExamComplete(true);
          } else {
            // Restart exam with ALL words if any were incorrect
            setFeedback(
              "Some words were incorrect. Let's try again with all words.",
            );
            setFeedbackColor("text-blue-600");
            setTimeout(() => {
              setFeedback("");
              // Shuffle all original words again
              setExamWords(shuffleArray(words));
              setIncorrectWords([]);
              setCurrentWordIndex(0);
            }, 2000);
          }
        } else {
          setCurrentWordIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    } else {
      setFeedback(`Incorrect! The word was "${currentWord}".`);
      setFeedbackColor("text-red-600");

      if (!incorrectWords.includes(currentWord)) {
        setIncorrectWords([...incorrectWords, currentWord]);
      }

      setTimeout(() => {
        setFeedback("");
        setUserAnswer("");

        if (currentWordIndex === examWords.length - 1) {
          // Restart exam with ALL words if any were incorrect
          setFeedback(
            "Some words were incorrect. Let's try again with all words.",
          );
          setFeedbackColor("text-blue-600");
          setTimeout(() => {
            setFeedback("");
            // Shuffle all original words again
            setExamWords(shuffleArray(words));
            setIncorrectWords([]);
            setCurrentWordIndex(0);
          }, 2000);
        } else {
          setCurrentWordIndex((prevIndex) => prevIndex + 1);
        }
      }, 2000);
    }
  };

  const exitExam = () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setIsExamMode(false);
    setFeedback("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isExamMode) {
        checkAnswer();
      } else {
        addWord();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Spelling Practice App
        </h1>

        {!isExamMode ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Add Words to Practice
              </h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a word"
                />
                <button
                  onClick={addWord}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </div>

            {feedback && (
              <p className={`${feedbackColor} text-center`}>{feedback}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Speech Speed:
                </p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="speechSpeed"
                      value="normal"
                      checked={speechSpeed === "normal"}
                      onChange={() => setSpeechSpeed("normal")}
                      className="mr-2"
                    />
                    <span className="text-gray-800">Normal</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="speechSpeed"
                      value="slow"
                      checked={speechSpeed === "slow"}
                      onChange={() => setSpeechSpeed("slow")}
                      className="mr-2"
                    />
                    <span className="text-gray-800">Slow</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Accent:
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="speechAccent"
                      value="us"
                      checked={speechAccent === "us"}
                      onChange={() => setSpeechAccent("us")}
                      className="mr-2"
                    />
                    <span className="text-gray-800">US</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="speechAccent"
                      value="uk"
                      checked={speechAccent === "uk"}
                      onChange={() => setSpeechAccent("uk")}
                      className="mr-2"
                    />
                    <span className="text-gray-800">UK</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="speechAccent"
                      value="zh-TW"
                      checked={speechAccent === "zh-TW"}
                      onChange={() => setSpeechAccent("zh-TW")}
                      className="mr-2"
                    />
                    <span className="text-gray-800">繁體中文</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Your Word List ({words.length})
              </h2>
              <p className="text-gray-500 text-sm mb-3">
                Click 🔊 to hear the pronunciation of any word
              </p>
              {words.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {words.map((word, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-200"
                      onClick={() => speakWord(word)}
                    >
                      <span>{word}</span>
                      <div className="flex space-x-4">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="Listen to pronunciation"
                        >
                          🔊
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeWord(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Remove word"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No words added yet.</p>
              )}
            </div>

            <button
              onClick={startExam}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Exam
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {isExamComplete ? (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Congratulations! 🎉</h2>
                <p className="text-green-600">
                  You've correctly spelled all words!
                </p>
                <button
                  onClick={exitExam}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Return to Word List
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-1">Spelling Exam</h2>
                  <p className="text-gray-600">
                    Word {currentWordIndex + 1} of {examWords.length}
                    {incorrectWords.length > 0 &&
                      ` (${incorrectWords.length} incorrect)`}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Speech Speed:
                        </p>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="speechSpeed"
                              value="normal"
                              checked={speechSpeed === "normal"}
                              onChange={() => setSpeechSpeed("normal")}
                              className="mr-2"
                            />
                            <span className="text-gray-800">Normal</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="speechSpeed"
                              value="slow"
                              checked={speechSpeed === "slow"}
                              onChange={() => setSpeechSpeed("slow")}
                              className="mr-2"
                            />
                            <span className="text-gray-800">Slow</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Accent:
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="speechAccent"
                              value="us"
                              checked={speechAccent === "us"}
                              onChange={() => setSpeechAccent("us")}
                              className="mr-2"
                            />
                            <span className="text-gray-800">US</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="speechAccent"
                              value="uk"
                              checked={speechAccent === "uk"}
                              onChange={() => setSpeechAccent("uk")}
                              className="mr-2"
                            />
                            <span className="text-gray-800">UK</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="speechAccent"
                              value="zh-TW"
                              checked={speechAccent === "zh-TW"}
                              onChange={() => setSpeechAccent("zh-TW")}
                              className="mr-2"
                            />
                            <span className="text-gray-800">繁體中文</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => speakWord()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center shadow-sm"
                      >
                        <span className="mr-2">🔊</span> Listen Again
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label
                      htmlFor="answer"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Type the word you hear:
                    </label>
                    <input
                      id="answer"
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      ref={examInputRef}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Type your answer here"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                </div>

                {feedback && (
                  <div
                    className={`my-4 py-3 px-4 rounded-md ${feedbackColor === "text-green-600" ? "bg-green-50" : feedbackColor === "text-red-600" ? "bg-red-50" : "bg-blue-50"}`}
                  >
                    <p className={`${feedbackColor} text-center font-medium`}>
                      {feedback}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={exitExam}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  >
                    Exit Exam
                  </button>
                  <button
                    onClick={checkAnswer}
                    className="flex-1 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium shadow-sm"
                  >
                    Submit Answer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellingApp;
