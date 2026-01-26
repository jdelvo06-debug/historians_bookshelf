import React, { useState } from 'react';
import { BookRecommendation, ReadingList } from '../types';

interface BookRecommendationCardProps {
  recommendation: BookRecommendation;
  isFavorite: boolean;
  onToggleFavorite: (recommendation: BookRecommendation) => void;
  readingLists?: ReadingList[];
  onAddToList?: (listId: string, book: BookRecommendation) => void;
  onCreateList?: (name: string) => string;
}

const BookRecommendationCard: React.FC<BookRecommendationCardProps> = ({
  recommendation,
  isFavorite,
  onToggleFavorite,
  readingLists = [],
  onAddToList,
  onCreateList,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToList = (listId: string) => {
    if (onAddToList) {
      onAddToList(listId, recommendation);
    }
    setShowListMenu(false);
  };

  const handleCreateAndAdd = () => {
    if (onCreateList && newListName.trim()) {
      const newListId = onCreateList(newListName.trim());
      if (onAddToList) {
        onAddToList(newListId, recommendation);
      }
      setNewListName('');
      setShowListMenu(false);
    }
  };

  const isInList = (listId: string) => {
    const list = readingLists.find(l => l.id === listId);
    return list?.books.some(b => b.title === recommendation.title) ?? false;
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in flex flex-col sm:flex-row gap-6 sm:gap-8 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onToggleFavorite(recommendation)}
          className="p-2 rounded-full bg-white/50 dark:bg-stone-700/50 backdrop-blur-sm text-stone-500 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800 transition-all duration-200"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 18.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
        {onAddToList && (
          <div className="relative">
            <button
              onClick={() => setShowListMenu(!showListMenu)}
              className="p-2 rounded-full bg-white/50 dark:bg-stone-700/50 backdrop-blur-sm text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800 transition-all duration-200"
              aria-label="Add to reading list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {showListMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-600 z-10">
                <div className="p-2">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase px-2 py-1">Add to list</p>
                  {readingLists.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto">
                      {readingLists.map(list => (
                        <button
                          key={list.id}
                          onClick={() => handleAddToList(list.id)}
                          disabled={isInList(list.id)}
                          className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                            isInList(list.id)
                              ? 'text-stone-400 dark:text-stone-500 cursor-not-allowed'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-700'
                          }`}
                        >
                          {list.name} {isInList(list.id) && '✓'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500 dark:text-stone-400 px-2 py-1">No lists yet</p>
                  )}
                  <div className="border-t border-stone-200 dark:border-stone-600 mt-2 pt-2">
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="New list name"
                        className="flex-1 px-2 py-1 text-sm border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
                      />
                      <button
                        onClick={handleCreateAndAdd}
                        disabled={!newListName.trim()}
                        className="px-2 py-1 text-sm bg-amber-800 dark:bg-amber-700 text-white rounded hover:bg-amber-900 dark:hover:bg-amber-600 disabled:bg-stone-300 dark:disabled:bg-stone-600 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!imageError && recommendation.coverImageURL && (
        <div className="sm:w-1/3 flex-shrink-0 mx-auto sm:mx-0 max-w-xs sm:max-w-none">
            <img
                src={recommendation.coverImageURL}
                alt={`Cover of ${recommendation.title}`}
                className="w-full h-auto object-cover rounded-lg shadow-md aspect-[2/3]"
                aria-hidden="true"
                onError={handleImageError}
            />
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <div className="flex-grow">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-400 font-serif pr-10">{recommendation.title}</h2>
          <p className="mt-2 text-lg text-stone-600 dark:text-stone-400 italic">by {recommendation.author}</p>
          <div className="w-24 h-1 bg-amber-200 dark:bg-amber-700 my-6 rounded"></div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base sm:text-lg">
            {recommendation.summary}
          </p>
        </div>
        <div className="mt-6 text-right">
          <a
            href={recommendation.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-amber-800 dark:bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-900 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 focus:ring-amber-700 transition-colors duration-200 text-sm"
            aria-label={`Find ${recommendation.title} online`}
          >
            Find Online
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if not possible.
// For simplicity, we'll assume a global css or style tag is not preferred.
// So we can create a simple style element here.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default BookRecommendationCard;
