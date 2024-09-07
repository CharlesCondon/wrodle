"use client";

import React from "react";

type LetterStatus = "unused" | "absent" | "present" | "correct";

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    letterStatuses: Record<string, LetterStatus>;
    isDarkMode: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
    onKeyPress,
    letterStatuses,
    isDarkMode,
}) => {
    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "←"],
    ];

    const getKeyClass = (key: string) => {
        const baseClass = "p-2 m-1 rounded-md font-bold min-w-6";
        const darkModeClass = isDarkMode ? "dark:text-white" : "";
        switch (letterStatuses[key]) {
            case "correct":
                return `${baseClass} ${darkModeClass} bg-green-500`;
            case "present":
                return `${baseClass} ${darkModeClass} bg-yellow-500`;
            case "absent":
                return `${baseClass} ${darkModeClass} ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-500"
                }`;
            default:
                return `${baseClass} ${darkModeClass} ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                }`;
        }
    };

    const handleKeyClick = (key: string) => {
        if (key === "Enter") {
            onKeyPress("ENTER");
        } else if (key === "←") {
            onKeyPress("BACKSPACE");
        } else {
            onKeyPress(key);
        }
    };

    return (
        <div className="mt-8">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center">
                    {row.map((key) => (
                        <button
                            key={key}
                            className={getKeyClass(key)}
                            onClick={() => handleKeyClick(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
