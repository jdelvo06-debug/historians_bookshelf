
import React from 'react';
import { EducationLevel } from '../types';

interface SearchBarProps {
  topic: string;
  setTopic: (topic: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
}

const educationLevelLabels: Record<EducationLevel, string> = {
  general: 'General Reader',
  undergraduate: 'Undergraduate',
  graduate: 'Graduate / Academic',
};

const SearchBar: React.FC<SearchBarProps> = ({ topic, setTopic, onSearch, isLoading, educationLevel, setEducationLevel }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E.g., Ancient Rome, Napoleon, The American West..."
          className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200 text-base"
          disabled={isLoading}
        />
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-amber-800 dark:bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-900 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 focus:ring-amber-700 transition-colors duration-200 disabled:bg-stone-400 dark:disabled:bg-stone-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            'Recommend Book'
          )}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="education-level" className="text-sm text-stone-600 dark:text-stone-400">
          Reading level:
        </label>
        <select
          id="education-level"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 disabled:bg-stone-100 dark:disabled:bg-stone-700 disabled:cursor-not-allowed"
        >
          {(Object.keys(educationLevelLabels) as EducationLevel[]).map((level) => (
            <option key={level} value={level}>
              {educationLevelLabels[level]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
