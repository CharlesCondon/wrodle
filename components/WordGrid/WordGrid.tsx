import React from "react";

interface WordGridProps {
    guesses: string[];
    word: string;
    currentGuess: string;
    isDarkMode: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({
    guesses,
    word,
    currentGuess,
    isDarkMode,
}) => {
    const rows = 6;
    const columns = 5;

    const getLetterStatus = (
        guess: string,
        index: number,
        rowIndex: number
    ) => {
        if (rowIndex >= guesses.length) return "";
        if (guess[index] === word[index]) return "correct";
        if (word.includes(guess[index])) return "present";
        return "absent";
    };

    return (
        <div className="grid grid-rows-6 gap-1 m-auto max-w-fit mx-auto">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-1">
                    {Array.from({ length: columns }).map((_, colIndex) => {
                        const letter =
                            guesses[rowIndex]?.[colIndex] ||
                            (rowIndex === guesses.length
                                ? currentGuess[colIndex]
                                : "") ||
                            "";
                        const status = getLetterStatus(
                            guesses[rowIndex] || "",
                            colIndex,
                            rowIndex
                        );
                        return (
                            <div
                                key={colIndex}
                                className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold transition-all duration-100 ease-in-out ${
                                    letter ? "scale-90" : "scale-100"
                                } ${
                                    status === "correct"
                                        ? "bg-green-500"
                                        : status === "present"
                                        ? "bg-yellow-500"
                                        : status === "absent"
                                        ? "bg-gray-500"
                                        : isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-black"
                                } ${isDarkMode ? "text-white" : "text-black"}`}
                            >
                                {letter ? letter.toUpperCase() : ""}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default WordGrid;
