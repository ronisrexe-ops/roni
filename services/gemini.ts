
import { GoogleGenAI, Type } from "@google/genai";
import { Product, BreedInfo } from "../types";
import { APP_CONFIG } from "../config";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDogAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: APP_CONFIG.SYSTEM_PROMPT,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "זכרו: טיול ארוך בערב עוזר לכלב לישון טוב יותר ומונע חרדות בבית.";
  }
};

export const fetchBreedData = async (breedName: string): Promise<BreedInfo | null> => {
  const query = `Provide detailed information for the dog breed: ${breedName}. Return a JSON with: name (Hebrew), englishName, intelligence (1-5), shedding (1-5), energy (1-5), origin, description (Hebrew), pros (Array of 3 in Hebrew), cons (Array of 2 in Hebrew). Use Google Search for accurate facts.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            englishName: { type: Type.STRING },
            intelligence: { type: Type.NUMBER },
            shedding: { type: Type.NUMBER },
            energy: { type: Type.NUMBER },
            origin: { type: Type.STRING },
            description: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      image: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800&sig=${data.englishName}`
    };
  } catch (error) {
    console.error("Breed Fetch Error:", error);
    return null;
  }
};

export const fetchAliExpressProducts = async (category: string): Promise<Product[]> => {
  const query = `Find 5 popular and high-rated dog products on AliExpress for the category: ${category}. Return JSON details in Hebrew.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text);
  } catch (error) { return []; }
};

export const generateDogPortrait = async (breed: string, name: string) => {
  try {
    const prompt = `A beautiful professional artistic portrait of a happy ${breed} dog named ${name}. High quality, detailed fur.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { return null; }
};

export const getLatestAdoptionEvents = async () => {
  const query = `מצא ימי אימוץ כלבים קרובים ועתידיים בישראל.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, source: sources[0]?.web?.uri || "https://www.sospets.co.il/" };
  } catch (error) { return { text: "יום שישי הקרוב | SOS חיות", source: "" }; }
};

export const findNearbyStores = async (lat?: number, lng?: number, city?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 pet stores in ${city || 'Israel'}.`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat || 32.0853,
              longitude: lng || 34.7818
            }
          }
        }
      },
    });
    const stores = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      name: chunk.maps?.title || "חנות חיות",
      address: chunk.maps?.uri || "כתובת זמינה במפות",
      phone: "050-0000000"
    })) || [];
    return { text: response.text, stores };
  } catch (error) { return { text: "", stores: [] }; }
};

export const findNearbyVets = async (lat?: number, lng?: number, city?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 vet clinics in ${city || 'Israel'}.`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat || 32.0853,
              longitude: lng || 34.7818
            }
          }
        }
      },
    });
    const vets = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      name: chunk.maps?.title || "מרפאה",
      address: chunk.maps?.uri || "בדיקת כתובת",
      phone: "050-0000000"
    })) || [];
    return { text: response.text, vets };
  } catch (error) { return { text: "", vets: [] }; }
};

export const findNearbyTrainers = async (lat?: number, lng?: number, city?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 dog trainers in ${city || 'Israel'}.`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat || 32.0853,
              longitude: lng || 34.7818
            }
          }
        }
      },
    });
    return { text: response.text, trainers: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => ({ 
      name: c.maps?.title || "מאלף", 
      address: c.maps?.uri || "בדיקה", 
      phone: "050-0000000" 
    })) || [] };
  } catch (error) { return { text: "", trainers: [] }; }
};

export const findNearbyGroomers = async (lat?: number, lng?: number, city?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 groomers in ${city || 'Israel'}.`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat || 32.0853,
              longitude: lng || 34.7818
            }
          }
        }
      },
    });
    return { text: response.text, groomers: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => ({ 
      name: c.maps?.title || "מספרה", 
      address: c.maps?.uri || "בדיקה", 
      phone: "050-0000000" 
    })) || [] };
  } catch (error) { return { text: "", groomers: [] }; }
};

export const findAdoptionCenters = async (lat?: number, lng?: number, city?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 adoption centers in ${city || 'Israel'}.`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat || 32.0853,
              longitude: lng || 34.7818
            }
          }
        }
      },
    });
    return { text: response.text, centers: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => ({ 
      name: c.maps?.title || "עמותה", 
      address: c.maps?.uri || "בדיקה", 
      phone: "050-0000000" 
    })) || [] };
  } catch (error) { return { text: "", centers: [] }; }
};

export const getInsuranceComparison = async (breed: string, age: number) => {
  const query = `Analyze the typical pet insurance costs and coverage considerations in Israel for a ${breed} dog, aged ${age}. Provide a helpful summary in Hebrew. Return JSON with 'analysis' field.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Insurance Comparison Error:", error);
    return { analysis: "חלה שגיאה בניתוח הנתונים. מומלץ ליצור קשר ישיר עם חברות הביטוח." };
  }
};
