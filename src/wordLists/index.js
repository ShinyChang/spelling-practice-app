import { YLE_STARTERS } from "./yleStarters";
import { YLE_MOVERS } from "./yleMovers";

// Answers are typed from dictation, so the lists' multi-word entries are not drilled.
const isSingleWord = (word) => !word.includes(" ");

export const WORD_LISTS = [
  {
    id: "yle-starters",
    name: "YLE Starters",
    words: YLE_STARTERS.filter(isSingleWord),
  },
  {
    id: "yle-movers",
    name: "YLE Movers",
    words: YLE_MOVERS.filter(isSingleWord),
  },
];

export const getWordListById = (id) =>
  WORD_LISTS.find((list) => list.id === id);

// A word may sit in more than one list, so a merged pool is de-duplicated case-insensitively.
export const collectWords = (listIds) => {
  const seen = new Set();
  const words = [];
  listIds.forEach((id) => {
    const list = getWordListById(id);
    if (!list) return;
    list.words.forEach((word) => {
      const key = word.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      words.push(word);
    });
  });
  return words;
};
