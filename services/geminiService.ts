
import { GoogleGenAI, Type, GenerateContentResponse, Part } from "@google/genai";
import { GenerationRequest, GeneratedPost, Platform } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder for a real-world scenario.
    // In a real app, this key would be securely managed.
    console.warn("API_KEY environment variable not set. Using a placeholder. This will fail.");
    process.env.API_KEY = "YOUR_API_KEY_HERE";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAspectRatioForPlatform = (platform: Platform): '1:1' | '16:9' | '3:4' => {
  switch (platform) {
    case Platform.Instagram:
      return '1:1';
    case Platform.X:
      return '16:9';
    case Platform.LinkedIn:
      return '3:4';
    default:
      return '1:1';
  }
};

const generateCaption = async (request: GenerationRequest, platform: Platform, slideNumber?: number): Promise<{ caption: string, hashtags: string[] }> => {
    const slidePrompt = slideNumber ? ` for slide ${slideNumber} of a ${request.numCarouselSlides}-slide carousel` : '';
    
    const parts: Part[] = [];
    
    let systemPrompt = `You are a world-class social media content strategist. Your task is to generate a post for ${platform}.`;
    
    let userPrompt = `The core idea for the post is: "${request.prompt}".`;
    userPrompt += ` The post type is a ${request.postType}${slidePrompt}.`;
    userPrompt += ` Generate a compelling, platform-appropriate caption and a list of 3-5 relevant hashtags.`;
    
    if (request.contextImage) {
        userPrompt += " The user has provided an image for context. Analyze the image and incorporate its themes into your response.";
        parts.push({
            inlineData: {
                mimeType: request.contextImage.mimeType,
                data: request.contextImage.base64,
            },
        });
    }

    parts.push({ text: userPrompt });

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        caption: {
                            type: Type.STRING,
                            description: `The social media caption for ${platform}.`,
                        },
                        hashtags: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: `An array of 3-5 relevant hashtags.`
                        },
                    },
                    required: ["caption", "hashtags"],
                },
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return {
            caption: parsed.caption || '',
            hashtags: parsed.hashtags || [],
        };

    } catch (error) {
        console.error(`Error generating caption for ${platform}:`, error);
        throw new Error(`Failed to generate caption for ${platform}. Please check your API key and prompt.`);
    }
};


const generateImages = async (prompt: string, platform: Platform, count: number): Promise<string[]> => {
    const visualPrompt = `A visually stunning, high-resolution, photorealistic image representing the concept: "${prompt}". Style it appropriately for a professional ${platform} post.`;
    const aspectRatio = getAspectRatioForPlatform(platform);

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: visualPrompt,
            config: {
                numberOfImages: count,
                outputMimeType: 'image/jpeg',
                aspectRatio,
            },
        });
        
        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error(`Error generating images for ${platform}:`, error);
        throw new Error(`Failed to generate images for ${platform}.`);
    }
};

export const generateSocialPosts = async (request: GenerationRequest): Promise<GeneratedPost[]> => {
    const results: GeneratedPost[] = [];

    for (const platform of request.platforms) {
        const numImages = request.postType === 'Carousel' ? request.numCarouselSlides : 1;
        
        try {
            const images = await generateImages(request.prompt, platform, numImages);

            if (request.postType === 'Carousel') {
                const carouselPost: GeneratedPost = {
                    platform,
                    caption: '', // Main caption can be aggregated or set to first slide's
                    hashtags: [],
                    images: images,
                };
                
                const captionsPromises = [];
                for(let i = 0; i < numImages; i++) {
                    captionsPromises.push(generateCaption(request, platform, i + 1));
                }
                const captionsAndHashtags = await Promise.all(captionsPromises);

                // For simplicity, we'll combine captions and unique hashtags
                carouselPost.caption = captionsAndHashtags.map((c, i) => `Slide ${i+1}: ${c.caption}`).join('\n\n');
                const allHashtags = new Set(captionsAndHashtags.flatMap(c => c.hashtags));
                carouselPost.hashtags = Array.from(allHashtags);

                results.push(carouselPost);

            } else {
                 const { caption, hashtags } = await generateCaption(request, platform);
                 results.push({
                    platform,
                    caption,
                    hashtags,
                    images,
                });
            }
        } catch(error) {
            console.error(`Failed to generate post for ${platform}`, error);
            // Propagate a partial result with an error message
            results.push({
                platform,
                caption: `Error: Could not generate content. ${error instanceof Error ? error.message : 'Unknown error'}`,
                hashtags: [],
                images: [],
            });
        }
    }
    return results;
};
