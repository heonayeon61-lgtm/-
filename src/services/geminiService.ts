import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ReadingLevel, Book } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRecommendedBooks(profile: UserProfile): Promise<Book[]> {
  const prompt = `
    사용자 프로필:
    - 관심 카테고리: ${profile.categories.join(', ')}
    - 독서 레벨: ${profile.level}
    - 선호 문체: ${profile.preferredStyle}
    - 완독한 책: ${profile.completedBooks.join(', ')}

    위 정보를 바탕으로 사용자에게 딱 맞는 책 5권을 추천해줘.
    한국어로 답변해주고, 각 책은 다음 정보를 포함해야 해: 제목, 작가, 카테고리, 수준(Level 1~3), 설명(짧게), 책의 분위기에 어울리는 이모지 하나.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              level: { type: Type.STRING },
              description: { type: Type.STRING },
              emoji: { type: Type.STRING },
            },
            required: ["title", "author", "category", "level", "description", "emoji"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((b: any, index: number) => ({
      ...b,
      id: `book-${index}`,
      status: 'wish',
      priceInfo: {
        kyobo: `https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(b.title)}`,
        yes24: `https://www.yes24.com/Product/Search?query=${encodeURIComponent(b.title)}`,
        aladin: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${encodeURIComponent(b.title)}`,
      }
    }));
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return [];
  }
}

export async function getBooksByCategory(category: string, level: ReadingLevel): Promise<Book[]> {
  const prompt = `
    카테고리: ${category}
    사용자 레벨: ${level}
    
    이 카테고리와 레벨에 맞는 흥미로운 책 3권을 추천해줘.
    한국어로 답변해주고, 각 책은 다음 정보를 포함해야 해: 제목, 작가, 카테고리, 수준(Level 1~3), 설명(짧게), 책의 분위기에 어울리는 이모지 하나.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              level: { type: Type.STRING },
              description: { type: Type.STRING },
              emoji: { type: Type.STRING },
            },
            required: ["title", "author", "category", "level", "description", "emoji"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((b: any, index: number) => ({
      ...b,
      id: `cat-${category}-${index}-${Date.now()}`,
      status: 'wish',
      priceInfo: {
        kyobo: `https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(b.title)}`,
        yes24: `https://www.yes24.com/Product/Search?query=${encodeURIComponent(b.title)}`,
        aladin: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${encodeURIComponent(b.title)}`,
      }
    }));
  } catch (error) {
    console.error("Gemini category recommendation error:", error);
    return [];
  }
}

export async function searchBooks(query: string, level: ReadingLevel): Promise<Book[]> {
  const prompt = `
    검색어: ${query}
    사용자 독서 레벨: ${level}
    
    사용자의 검색어와 독서 레벨에 맞는 책 3권을 추천해줘.
    한국어로 답변해주고, 각 책은 다음 정보를 포함해야 해: 제목, 작가, 카테고리, 수준(Level 1~3), 설명(짧게), 책의 분위기에 어울리는 이모지 하나.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              level: { type: Type.STRING },
              description: { type: Type.STRING },
              emoji: { type: Type.STRING },
            },
            required: ["title", "author", "category", "level", "description", "emoji"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((b: any, index: number) => ({
      ...b,
      id: `search-${Date.now()}-${index}`,
      status: 'wish',
      priceInfo: {
        kyobo: `https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(b.title)}`,
        yes24: `https://www.yes24.com/Product/Search?query=${encodeURIComponent(b.title)}`,
        aladin: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${encodeURIComponent(b.title)}`,
      }
    }));
  } catch (error) {
    console.error("Gemini search error:", error);
    return [];
  }
}

export async function getBooksByTag(tag: string, level: ReadingLevel): Promise<Book[]> {
  const prompt = `
    태그: ${tag}
    사용자 레벨: ${level}
    
    이 태그와 독서 레벨에 딱 어울리는 책 3권을 추천해줘.
    한국어로 답변해주고, 각 책은 다음 정보를 포함해야 해: 제목, 작가, 카테고리, 수준(Level 1~3), 설명(짧게), 책의 분위기에 어울리는 이모지 하나.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              level: { type: Type.STRING },
              description: { type: Type.STRING },
              emoji: { type: Type.STRING },
            },
            required: ["title", "author", "category", "level", "description", "emoji"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((b: any, index: number) => ({
      ...b,
      id: `tag-${tag}-${Date.now()}-${index}`,
      status: 'wish',
      priceInfo: {
        kyobo: `https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(b.title)}`,
        yes24: `https://www.yes24.com/Product/Search?query=${encodeURIComponent(b.title)}`,
        aladin: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${encodeURIComponent(b.title)}`,
      }
    }));
  } catch (error) {
    console.error("Gemini tag recommendation error:", error);
    return [];
  }
}
