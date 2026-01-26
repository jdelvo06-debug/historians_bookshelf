import React from 'react';

interface RelatedTopicsProps {
    topics: string[];
    onTopicSelect: (topic: string) => void;
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({ topics, onTopicSelect }) => {
    return (
        <div className="mt-12 p-6 bg-stone-100/50 dark:bg-stone-800/50 rounded-lg animate-fade-in">
            <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 font-serif text-center">Explore Related Topics</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => onTopicSelect(topic)}
                        className="px-4 py-2 bg-white dark:bg-stone-700 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-full hover:bg-amber-50 dark:hover:bg-stone-600 hover:border-amber-400 dark:hover:border-amber-600 transition-colors shadow-sm"
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RelatedTopics;
