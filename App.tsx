import React, { useState, useCallback, useEffect } from 'react';
import { BookRecommendation, EducationLevel, ReadingList } from './types';
import { getBookRecommendation } from './services/geminiService';
import SearchBar from './components/SearchBar';
import BookRecommendationCard from './components/BookRecommendationCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import InitialState from './components/InitialState';
import RelatedTopics from './components/RelatedTopics';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, cycleTheme } = useTheme();
  const [topic, setTopic] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<BookRecommendation[] | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<BookRecommendation[]>([]);
  const [view, setView] = useState<'search' | 'favorites' | 'lists'>('search');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('general');
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('historianFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      const savedLists = localStorage.getItem('historianReadingLists');
      if (savedLists) {
        setReadingLists(JSON.parse(savedLists));
      }
    } catch (err) {
      console.error("Failed to load data from local storage:", err);
    }
  }, []);

  const toggleFavorite = useCallback((book: BookRecommendation) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.title === book.title);
      const updatedFavorites = isFavorited
        ? prevFavorites.filter(fav => fav.title !== book.title)
        : [...prevFavorites, book];
      
      try {
        localStorage.setItem('historianFavorites', JSON.stringify(updatedFavorites));
      } catch (err) {
        console.error("Failed to save favorites to local storage:", err);
      }
      
      return updatedFavorites;
    });
  }, []);

  const createReadingList = useCallback((name: string) => {
    const newList: ReadingList = {
      id: Date.now().toString(),
      name,
      books: [],
      createdAt: Date.now(),
    };
    setReadingLists(prev => {
      const updated = [...prev, newList];
      try {
        localStorage.setItem('historianReadingLists', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save reading lists:", err);
      }
      return updated;
    });
    return newList.id;
  }, []);

  const deleteReadingList = useCallback((listId: string) => {
    setReadingLists(prev => {
      const updated = prev.filter(list => list.id !== listId);
      try {
        localStorage.setItem('historianReadingLists', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save reading lists:", err);
      }
      return updated;
    });
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  }, [selectedListId]);

  const addBookToList = useCallback((listId: string, book: BookRecommendation) => {
    setReadingLists(prev => {
      const updated = prev.map(list => {
        if (list.id === listId && !list.books.some(b => b.title === book.title)) {
          return { ...list, books: [...list.books, book] };
        }
        return list;
      });
      try {
        localStorage.setItem('historianReadingLists', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save reading lists:", err);
      }
      return updated;
    });
  }, []);

  const removeBookFromList = useCallback((listId: string, bookTitle: string) => {
    setReadingLists(prev => {
      const updated = prev.map(list => {
        if (list.id === listId) {
          return { ...list, books: list.books.filter(b => b.title !== bookTitle) };
        }
        return list;
      });
      try {
        localStorage.setItem('historianReadingLists', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save reading lists:", err);
      }
      return updated;
    });
  }, []);

  const handleSearch = () => {
    if (!topic.trim()) {
      setError('Please enter a historical topic.');
      return;
    }
    setSearchQuery(topic);
  };

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setSearchQuery(selectedTopic);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const performSearch = async () => {
      setView('search');
      setIsLoading(true);
      setError(null);
      setRecommendations(null);
      setRelatedTopics([]);

      try {
        const results = await getBookRecommendation(searchQuery, educationLevel);
        setRecommendations(results.recommendations);
        setRelatedTopics(results.relatedTopics);
      } catch (err) {
        console.error(err);
        setError('Failed to get recommendations. Please check your connection or API key and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [searchQuery, educationLevel]);


  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <header className="text-center my-8 relative w-full">
          <div className="absolute right-0 top-0">
            <ThemeToggle theme={theme} onCycle={cycleTheme} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 dark:text-amber-400 font-serif">Historian's Bookshelf</h1>
          <p className="mt-2 text-lg text-stone-600 dark:text-stone-400">Your personal AI librarian for historical literature.</p>
        </header>

        <div className="w-full p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg">
          <SearchBar
            topic={topic}
            setTopic={setTopic}
            onSearch={handleSearch}
            isLoading={isLoading}
            educationLevel={educationLevel}
            setEducationLevel={setEducationLevel}
          />
        </div>

        <div className="w-full my-6">
          <div className="flex border-b border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setView('search')}
              className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 ${view === 'search' ? 'border-b-2 border-amber-800 dark:border-amber-500 text-amber-800 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500'}`}
              aria-current={view === 'search'}
            >
              Search Results
            </button>
            <button
              onClick={() => setView('favorites')}
              className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${view === 'favorites' ? 'border-b-2 border-amber-800 dark:border-amber-500 text-amber-800 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500'}`}
              aria-current={view === 'favorites'}
            >
              Favorites <span className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">{favorites.length}</span>
            </button>
            <button
              onClick={() => setView('lists')}
              className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${view === 'lists' ? 'border-b-2 border-amber-800 dark:border-amber-500 text-amber-800 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500'}`}
              aria-current={view === 'lists'}
            >
              Lists <span className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">{readingLists.length}</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          {view === 'search' && (
            <>
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}

              {recommendations && recommendations.length > 0 && (
                <div className="space-y-8">
                  {recommendations.map((rec, index) => (
                    <BookRecommendationCard
                      key={index}
                      recommendation={rec}
                      isFavorite={favorites.some(fav => fav.title === rec.title)}
                      onToggleFavorite={toggleFavorite}
                      readingLists={readingLists}
                      onAddToList={addBookToList}
                      onCreateList={createReadingList}
                    />
                  ))}
                </div>
              )}
              
              {!isLoading && recommendations && recommendations.length > 0 && relatedTopics.length > 0 && (
                <RelatedTopics topics={relatedTopics} onTopicSelect={handleTopicSelect} />
              )}

              {recommendations && recommendations.length === 0 && (
                 <div className="text-center p-6 bg-stone-100/50 dark:bg-stone-800/50 rounded-lg">
                    <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 font-serif">No Results</h3>
                    <p className="mt-2 text-stone-600 dark:text-stone-400">We couldn't find any book recommendations for that topic. Please try a different search term.</p>
                </div>
              )}

              {!isLoading && !error && !recommendations && <InitialState onTopicSelect={handleTopicSelect} />}
            </>
          )}

          {view === 'favorites' && (
            <div className="space-y-8">
              {favorites.length > 0 ? (
                favorites.map((rec, index) => (
                  <BookRecommendationCard
                    key={index}
                    recommendation={rec}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    readingLists={readingLists}
                    onAddToList={addBookToList}
                    onCreateList={createReadingList}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-stone-100/50 dark:bg-stone-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 font-serif">No Saved Books</h3>
                  <p className="mt-2 text-stone-600 dark:text-stone-400">You haven't added any books to your favorites yet. Use the heart icon on a recommendation to save it here.</p>
                </div>
              )}
            </div>
          )}

          {view === 'lists' && (
            <div className="space-y-6">
              {!selectedListId ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="New list name..."
                      className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          createReadingList(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input.value.trim()) {
                          createReadingList(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-amber-800 dark:bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-900 dark:hover:bg-amber-600 transition-colors"
                    >
                      Create List
                    </button>
                  </div>
                  {readingLists.length > 0 ? (
                    <div className="grid gap-4">
                      {readingLists.map(list => (
                        <div
                          key={list.id}
                          className="bg-white dark:bg-stone-800 rounded-lg shadow p-4 flex items-center justify-between"
                        >
                          <button
                            onClick={() => setSelectedListId(list.id)}
                            className="flex-1 text-left"
                          >
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400 font-serif">{list.name}</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">{list.books.length} book{list.books.length !== 1 ? 's' : ''}</p>
                          </button>
                          <button
                            onClick={() => deleteReadingList(list.id)}
                            className="p-2 text-stone-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            aria-label={`Delete ${list.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-stone-100/50 dark:bg-stone-800/50 rounded-lg">
                      <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 font-serif">No Reading Lists</h3>
                      <p className="mt-2 text-stone-600 dark:text-stone-400">Create a reading list to organize your book recommendations by theme or project.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedListId(null)}
                    className="flex items-center gap-2 text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-semibold mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Lists
                  </button>
                  {(() => {
                    const selectedList = readingLists.find(l => l.id === selectedListId);
                    if (!selectedList) return null;
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-400 font-serif mb-4">{selectedList.name}</h2>
                        {selectedList.books.length > 0 ? (
                          <div className="space-y-8">
                            {selectedList.books.map((book, index) => (
                              <div key={index} className="relative">
                                <BookRecommendationCard
                                  recommendation={book}
                                  isFavorite={favorites.some(fav => fav.title === book.title)}
                                  onToggleFavorite={toggleFavorite}
                                />
                                <button
                                  onClick={() => removeBookFromList(selectedListId, book.title)}
                                  className="absolute top-4 left-4 p-2 rounded-full bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm text-stone-500 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                  aria-label="Remove from list"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-stone-100/50 dark:bg-stone-800/50 rounded-lg">
                            <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 font-serif">Empty List</h3>
                            <p className="mt-2 text-stone-600 dark:text-stone-400">Search for books and use the + button to add them to this list.</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-stone-500 dark:text-stone-400 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
