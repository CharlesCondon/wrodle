import React from "react";

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    isWinner: boolean;
    correctWord: string;
    isDarkMode: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
    isOpen,
    onClose,
    isWinner,
    correctWord,
    isDarkMode,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 text-center">
            <div
                className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-xs w-full ${
                    isDarkMode ? "text-white" : "text-black"
                }`}
            >
                <h2 className="text-2xl font-bold mb-4">
                    {isWinner ? "Congratulations!" : "Better luck next time!"}
                </h2>
                <p className="mb-4">
                    {isWinner
                        ? `You guessed the word correctly!`
                        : `The answer was: ${correctWord}`}
                </p>
                <button
                    onClick={onClose}
                    className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default ResultModal;
