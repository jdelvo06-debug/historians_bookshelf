export type EducationLevel = 'general' | 'undergraduate' | 'graduate';

export interface BookRecommendation {
  title: string;
  author: string;
  summary: string;
  purchaseLink: string;
  coverImageURL: string;
}

export interface GeminiResponse {
  recommendations: BookRecommendation[];
  relatedTopics: string[];
}

export interface ReadingList {
  id: string;
  name: string;
  books: BookRecommendation[];
  createdAt: number;
}
