import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, BookRecommendation, EducationLevel } from '../types';

const educationLevelDescriptions: Record<EducationLevel, string> = {
  general: "general readers with no prior background knowledge. Recommend accessible, engaging popular histories that explain concepts clearly without assuming expertise.",
  undergraduate: "undergraduate students with some foundational knowledge. Recommend well-researched books that balance accessibility with academic rigor, including some scholarly works.",
  graduate: "graduate students and academics seeking advanced scholarship. Recommend authoritative academic works, primary sources, and historiographical texts that engage with scholarly debates."
};

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        recommendations: {
            type: Type.ARRAY,
            description: "A list of up to 5 book recommendations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The full title of the recommended book."
                    },
                    author: {
                        type: Type.STRING,
                        description: "The full name of the book's author."
                    },
                    summary: {
                        type: Type.STRING,
                        description: "A short, one-paragraph summary of the book's contents, explaining why it is a good recommendation for the topic. The summary should be engaging and informative, highlighting the book's key themes or unique perspective."
                    },
                    purchaseLink: {
                        type: Type.STRING,
                        description: "A URL to a major online bookstore (like Amazon) where the book can be purchased."
                    },
                    coverImageURL: {
                        type: Type.STRING,
                        description: "A publicly accessible, direct URL to the book's cover image, suitable for use in an <img src> tag. For example, a URL ending in .jpg, .png, or .webp."
                    },
                },
                required: ['title', 'author', 'summary', 'purchaseLink', 'coverImageURL'],
            }
        },
        relatedTopics: {
            type: Type.ARRAY,
            description: "An array of 3-4 related historical topics the user might also be interested in.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['recommendations', 'relatedTopics']
};


export async function getBookRecommendation(topic: string, educationLevel: EducationLevel = 'general'): Promise<GeminiResponse> {
  const audienceDescription = educationLevelDescriptions[educationLevel];

  const prompt = `
    Role: You are a specialized AI assistant named "Historian's Bookshelf." Your purpose is to act as an expert librarian, recommending history books to users.

    Target Audience: Your recommendations should be appropriate for ${audienceDescription}

    Task:
    1. Based on the user's input topic, recommend up to 5 specific, well-regarded history books. The user's topic is: "${topic}".
    2. For each book, provide its full title and author.
    3. For each book, write a short, one-paragraph summary of its contents, explaining why it is a good recommendation for their topic. The summary should be engaging and informative, highlighting the book's key themes or unique perspective.
    4. For each book, provide a direct URL link to a major online bookstore (like Amazon) where it can be purchased.
    5. For each book, provide a publicly accessible, direct URL to its cover image (e.g., a URL ending in .jpg or .png from a source like Goodreads, Wikipedia, or an online bookstore). This URL will be used directly in an <img src="..."> tag.
    6. After providing the book recommendations, suggest 3-4 related historical topics that the user might also be interested in. These topics should be different from the original query but thematically connected.
    7. The output must be formatted as a single JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json. If you can't find any relevant books, return an empty array for 'recommendations'.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: recommendationSchema,
          temperature: 0.7,
        },
    });

    const responseText = response.text.trim();
    const parsedJson = JSON.parse(responseText);

    const validationFilter = (item: any): item is BookRecommendation => 
        item.title && item.author && item.summary && item.purchaseLink && item.coverImageURL;
    
    const recommendations = (parsedJson.recommendations || []).filter(validationFilter);
    const relatedTopics = parsedJson.relatedTopics || [];

    return { recommendations, relatedTopics };

  } catch (error) {
    console.error("Error fetching or parsing book recommendation:", error);
    throw new Error("Could not retrieve a valid book recommendation from the AI model.");
  }
}
