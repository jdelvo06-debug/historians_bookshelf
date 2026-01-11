
import React from 'react';

interface InitialStateProps {
    onTopicSelect: (topic: string) => void;
}

const exampleTopics = [
    "The Fall of the Roman Empire",
    "Life of Cleopatra",
    "The Industrial Revolution",
    "The Silk Road",
    "The American Civil War",
    "Joan of Arc"
];

const InitialState: React.FC<InitialStateProps> = ({ onTopicSelect }) => {
    return (
        <div className="text-center p-6 bg-stone-100/50 rounded-lg">
            <h3 className="text-xl font-semibold text-stone-700 font-serif">Welcome!</h3>
            <p className="mt-2 text-stone-600">Enter a historical topic, era, or figure above to get a book recommendation.</p>
            <p className="mt-4 text-sm text-stone-500">Or try one of these examples:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {exampleTopics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => onTopicSelect(topic)}
                        className="px-3 py-1 bg-white text-amber-800 border border-amber-300 rounded-full text-sm hover:bg-amber-50 hover:border-amber-400 transition-colors"
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InitialState;
