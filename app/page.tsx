"use client";

import { useState, useEffect, useCallback } from "react";
import WordGrid from "@/components/WordGrid/WordGrid";
import Keyboard from "@/components/Keyboard/Keyboard";
import ResultModal from "@/components/ResultsModal/ResultsModal";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons

type LetterStatus = "correct" | "present" | "absent" | "unused";

export default function Home() {
    const [word, setWord] = useState<string>("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [original, setOriginal] = useState<string>("");
    const [showHint, setShowHint] = useState<boolean>(false);
    const [letterStatus, setLetterStatus] = useState<
        Record<string, LetterStatus>
    >({});
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    const fetchWord = useCallback(async () => {
        try {
            const response = await fetch(
                "https://random-word-api.herokuapp.com/word?length=5&lang=en"
            );
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                let word = data[0].toUpperCase();
                setOriginal(word);
                const letters = word.split("");
                const index1 = Math.floor(Math.random() * 5);
                let index2 = Math.floor(Math.random() * 5);
                while (index1 === index2) {
                    index2 = Math.floor(Math.random() * 5);
                }
                [letters[index1], letters[index2]] = [
                    letters[index2],
                    letters[index1],
                ];
                word = letters.join("");
                setWord(word);
            } else {
                console.error("No word found in the response");
            }
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    }, []);

    const updateLetterStatus = useCallback(
        (guess: string) => {
            const newStatuses = { ...letterStatus };
            const wordLetters = word.split("");

            guess.split("").forEach((letter, index) => {
                if (!wordLetters.includes(letter)) {
                    newStatuses[letter] = "absent";
                } else if (letter === wordLetters[index]) {
                    newStatuses[letter] = "correct";
                } else {
                    newStatuses[letter] = "present";
                }
            });
            setLetterStatus(newStatuses);
        },
        [word, letterStatus]
    );

    const submitGuess = useCallback(() => {
        if (currentGuess.length === 5 && !gameOver) {
            setGuesses((prevGuesses) => [...prevGuesses, currentGuess]);
            updateLetterStatus(currentGuess);
            setCurrentGuess("");
            if (currentGuess === word) {
                setIsWinner(true);
                setGameOver(true);
                setIsModalOpen(true);
            } else if (guesses.length === 5) {
                setGameOver(true);
                setIsModalOpen(true);
            }
        }
    }, [currentGuess, guesses.length, updateLetterStatus, word, gameOver]);

    const resetGame = useCallback(() => {
        setGuesses([]);
        setCurrentGuess("");
        setGameOver(false);
        setIsWinner(false);
        setIsModalOpen(false);
        setLetterStatus({});
        setShowHint(false); // Add this line to reset the hint state
        fetchWord();
    }, [fetchWord]);

    const handleKeyPress = useCallback(
        (key: string) => {
            if (key === "ENTER") {
                submitGuess();
            } else if (key === "BACKSPACE") {
                setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
            } else if (
                key.length === 1 &&
                key >= "A" &&
                key <= "Z" &&
                currentGuess.length < 5
            ) {
                setCurrentGuess((prevGuess) => prevGuess + key);
            }
        },
        [submitGuess, currentGuess]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const key = event.key.toUpperCase();
            if (
                key === "ENTER" ||
                key === "BACKSPACE" ||
                (key.length === 1 && key >= "A" && key <= "Z")
            ) {
                event.preventDefault();
                handleKeyPress(key);
            }
        },
        [handleKeyPress]
    );

    const toggleHint = () => {
        setShowHint(!showHint);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        fetchWord();
    }, [fetchWord]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <main className={isDarkMode ? "dark" : ""}>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen flex flex-col">
                <header className="grid grid-cols-3 items-center p-4 border-b-2 mb-4 dark:border-gray-600">
                    <div className="flex items-center">
                        <div className="relative inline-block w-8 sm:w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle"
                                className="toggle-checkbox absolute block w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                checked={isDarkMode}
                                onChange={toggleDarkMode}
                            />
                            <label
                                htmlFor="toggle"
                                className="toggle-label block overflow-hidden h-5 sm:h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                        </div>
                        <label
                            htmlFor="toggle"
                            className="text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                        >
                            {isDarkMode ? (
                                <FaMoon className="inline-block" />
                            ) : (
                                <FaSun className="inline-block" />
                            )}
                        </label>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-center text-black dark:text-white">
                        Wrodle
                    </h1>
                    <div className="flex justify-end">
                        <button
                            onClick={toggleHint}
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-1 px-2 rounded text-xs sm:text-sm"
                        >
                            Hint
                        </button>
                    </div>
                </header>
                <div className="flex-grow pb-12 pt-4">
                    {showHint && (
                        <p className="text-center mb-8">
                            Original word: {original}
                        </p>
                    )}
                    <WordGrid
                        guesses={guesses}
                        word={word}
                        currentGuess={currentGuess}
                        isDarkMode={isDarkMode}
                    />
                    <Keyboard
                        onKeyPress={handleKeyPress}
                        letterStatuses={letterStatus}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <div className="text-center p-4 text-gray-500">
                    <span>by: </span>
                    <a className="underline" href="https://charlescon.com">
                        Charles
                    </a>
                </div>
                <ResultModal
                    isOpen={isModalOpen}
                    onClose={resetGame}
                    isWinner={isWinner}
                    correctWord={word}
                    isDarkMode={isDarkMode}
                />
            </div>
        </main>
    );
}
