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
        const baseClass =
            "p-2 m-1 rounded-md font-bold min-w-6 transition-colors duration-150 ease-in-out";
        const darkModeClass = isDarkMode ? "dark:text-white" : "";
        const hoverFocusClass =
            "hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:outline-none";

        let statusClass;
        switch (letterStatuses[key]) {
            case "correct":
                statusClass =
                    "bg-green-500 hover:bg-green-600 focus:ring-green-400";
                break;
            case "present":
                statusClass =
                    "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400";
                break;
            case "absent":
                statusClass = isDarkMode
                    ? "bg-gray-900 hover:bg-gray-800 focus:ring-gray-700"
                    : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-400";
                break;
            default:
                statusClass = isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 focus:ring-gray-400"
                    : "bg-gray-200 hover:bg-gray-300 focus:ring-gray-100";
        }

        return `${baseClass} ${darkModeClass} ${statusClass} ${hoverFocusClass}`;
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
