import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Platform, PostType, GenerationRequest, GeneratedPost } from '../types';
import { generateSocialPosts } from '../services/geminiService';
import { Icon } from './Icon';
import Loader from './Loader';

declare const gsap: any;

const platformOptions = [Platform.LinkedIn, Platform.Instagram, Platform.X];
const postTypeOptions = [PostType.Single, PostType.Carousel];

const contentTemplates = [
  {
    category: 'General',
    templates: [
      { name: 'No Template', value: 'none', content: '{{prompt}}' },
      { name: 'Engaging Question', value: 'question', content: 'Based on the idea "{{prompt}}", formulate an engaging question for the audience to spark discussion.' },
      { name: 'Behind the Scenes', value: 'bts', content: 'Provide a "behind-the-scenes" look related to "{{prompt}}". The tone should be authentic and give a sense of exclusivity.' },
      { name: 'Holiday Greeting', value: 'holiday', content: 'Craft a warm holiday greeting related to "{{prompt}}". Mention the specific holiday if relevant, otherwise keep it general.' },
    ]
  },
  {
    category: 'Marketing & Sales',
    templates: [
      { name: 'Product Launch', value: 'product-launch', content: 'Announce the launch of a new product: "{{prompt}}". Focus on the main benefits, the problem it solves, and include a clear call-to-action.' },
      { name: 'Special Promotion', value: 'promo', content: 'Create a post for a special promotion about "{{prompt}}". Emphasize the value, scarcity, and a clear expiration date to create urgency.' },
      { name: 'Customer Testimonial', value: 'testimonial', content: 'Write a post highlighting a customer testimonial. The core message of the testimonial is: "{{prompt}}". Frame it to build social proof and trust.' },
    ]
  },
  {
      category: 'Community & Engagement',
      templates: [
          { name: 'Tip or Trick', value: 'tip', content: 'Share a helpful tip or trick about "{{prompt}}". The content should be valuable, actionable, and easy to understand.' },
          { name: 'Myth Busting', value: 'myth', content: 'Bust a common myth related to "{{prompt}}". Present the myth first, then reveal the truth with a clear explanation.' },
      ]
  }
];

interface GeneratorProps {
  initialPrompt?: string;
}

const Generator: React.FC<GeneratorProps> = ({ initialPrompt = '' }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('none');
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.LinkedIn]);
    const [postType, setPostType] = useState<PostType>(PostType.Single);
    const [numCarouselSlides, setNumCarouselSlides] = useState(3);
    const [contextImage, setContextImage] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);

    const [activeTab, setActiveTab] = useState<Platform | null>(null);
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [activeCarouselSlides, setActiveCarouselSlides] = useState<Record<string, number>>({});

    const captionRef = useRef<HTMLParagraphElement>(null);
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const resultsContentRef = useRef<HTMLDivElement>(null);
    const [hasGenerated, setHasGenerated] = useState(false);


    // Initial load animations
    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.from(leftPanelRef.current, { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' })
          .from(rightPanelRef.current, { x: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
          .from(gsap.utils.toArray('.form-section'), { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.5');
    }, []);

     // Animation for new content appearing
    useEffect(() => {
        if (hasGenerated && resultsContentRef.current) {
            gsap.from(resultsContentRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power3.out'
            });
        }
    }, [hasGenerated]);

    // Animate tab change
    useEffect(() => {
        if(resultsContentRef.current && hasGenerated){
             gsap.from(resultsContentRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            });
        }
    }, [activeTab]);


    useEffect(() => {
        if (activeTab && activeCarouselSlides[activeTab] === undefined) {
            setActiveCarouselSlides(prev => ({...prev, [activeTab]: 0}));
        }
    }, [activeTab, generatedPosts, activeCarouselSlides]);

    const handleCarouselNav = (platform: Platform, direction: 'next' | 'prev') => {
        const post = generatedPosts.find(p => p.platform === platform);
        if (!post) return;

        setActiveCarouselSlides(prev => {
            const currentIndex = prev[platform] || 0;
            const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            if (newIndex >= 0 && newIndex < post.images.length) {
                return { ...prev, [platform]: newIndex };
            }
            return prev;
        });
    };

    const handlePlatformToggle = (platform: Platform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
        );
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setContextImage({
                    base64: base64String,
                    mimeType: file.type,
                    name: file.name,
                });
            };
            reader.readAsDataURL(file);
        } else {
            setContextImage(null);
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || selectedPlatforms.length === 0) {
            setError('Please provide a prompt and select at least one platform.');
            gsap.fromTo('.error-message', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            return;
        }
        setIsLoading(true);
        setHasGenerated(true);
        setError(null);
        
        const placeholderPosts: GeneratedPost[] = selectedPlatforms.map(platform => ({
          platform,
          caption: 'Generating caption...',
          hashtags: ['generating...'],
          images: Array(postType === PostType.Carousel ? numCarouselSlides : 1).fill('loading')
        }));
        setGeneratedPosts(placeholderPosts);
        if (selectedPlatforms.length > 0) {
          setActiveTab(selectedPlatforms[0]);
        }
        setActiveCarouselSlides({});

        let finalPrompt = prompt;
        if (selectedTemplate !== 'none') {
            const allTemplates = contentTemplates.flatMap(g => g.templates);
            const template = allTemplates.find(t => t.value === selectedTemplate);
            if (template) {
                finalPrompt = template.content.replace('{{prompt}}', prompt);
            }
        }

        const request: GenerationRequest = {
            prompt: finalPrompt,
            platforms: selectedPlatforms,
            postType,
            numCarouselSlides: postType === PostType.Carousel ? numCarouselSlides : 1,
            contextImage: contextImage || undefined,
        };

        try {
            const results = await generateSocialPosts(request);
            setGeneratedPosts(results);
            if (results.length > 0 && !results.find(p => p.platform === activeTab)) {
                setActiveTab(results[0].platform);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            const errorPosts = selectedPlatforms.map(platform => ({
                platform,
                caption: `Error: Could not generate content for ${platform}.`,
                hashtags: [],
                images: [],
            }));
            setGeneratedPosts(errorPosts);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, selectedPlatforms, postType, numCarouselSlides, contextImage, activeTab, selectedTemplate]);

    const handleCaptionChange = (platform: Platform, newCaption: string) => {
        setGeneratedPosts(posts =>
            posts.map(p => (p.platform === platform ? { ...p, caption: newCaption } : p))
        );
    };

    const copyToClipboard = (text: string, id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [id]: true }));

        const button = event.currentTarget;
        const icon = button.querySelector('.copy-icon');
        const check = button.querySelector('.check-icon');
        const textEl = button.querySelector('span');

        const tl = gsap.timeline();
        tl.to(icon, { scale: 0, duration: 0.2, ease: 'power2.in' })
          .to(check, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }, "-=0.1")
          .to(textEl, { y: -2, opacity: 0, duration: 0.2, onComplete: () => textEl.textContent = 'Copied!' }, 0)
          .to(textEl, { y: 0, opacity: 1, duration: 0.2 });

        setTimeout(() => {
             const reverseTl = gsap.timeline();
             reverseTl.to(check, { scale: 0, duration: 0.2, ease: 'power2.in' })
                .to(icon, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }, "-=0.1")
                .to(textEl, { y: -2, opacity: 0, duration: 0.2, onComplete: () => textEl.textContent = 'Copy Caption' }, 0)
                .to(textEl, { y: 0, opacity: 1, duration: 0.2 });
            setCopiedStates(prev => ({ ...prev, [id]: false }))
        }, 2000);
    };

    const downloadImage = (base64Image: string, filename: string) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${base64Image}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const currentPost = generatedPosts.find(p => p.platform === activeTab);
    const isCurrentPostContentLoading = currentPost ? currentPost.caption.includes('Generating') || currentPost.images.includes('loading') : false;

    const isCarousel = currentPost && postType === PostType.Carousel && currentPost.images.length > 0;
    const currentSlideIndex = (activeTab && activeCarouselSlides[activeTab]) || 0;
    
    const slideCaptions = (isCarousel && !isCurrentPostContentLoading)
        ? currentPost.caption.split('\n\n').map(c => c.replace(/Slide \d+:\s?/, ''))
        : [];
    const currentSlideCaption = slideCaptions[currentSlideIndex] || '';

    useEffect(() => {
        if (captionRef.current) {
            gsap.fromTo(captionRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
    }, [currentSlideIndex, currentSlideCaption]);

    return (
        <div ref={mainContainerRef} className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
            {/* Left Panel: Inputs */}
            <div ref={leftPanelRef} className="lg:w-1/3 xl:w-1/4 space-y-6">
                <h1 className="text-3xl font-bold text-blue-400">Create Social Posts</h1>
                <p className="text-gray-400">Fill in the details below to generate posts with AI.</p>
                
                <div className="space-y-2 form-section">
                    <label htmlFor="prompt" className="font-semibold text-gray-300">Your Idea / Prompt</label>
                    <textarea 
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'Launch a new line of eco-friendly sneakers'"
                        className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                <div className="space-y-2 form-section">
                    <label htmlFor="template" className="font-semibold text-gray-300">Content Template</label>
                    <div className="relative">
                        <select
                            id="template"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full appearance-none p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                        >
                            {contentTemplates.map(group => (
                                <optgroup key={group.category} label={group.category} className="bg-gray-900 text-gray-400 font-bold">
                                    {group.templates.map(template => (
                                        <option key={template.value} value={template.value} className="bg-gray-800 text-white font-normal p-2">
                                            {template.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <Icon icon="chevron-down" className="w-5 h-5"/>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3 form-section">
                    <label className="font-semibold text-gray-300">Target Platforms</label>
                    <div className="flex gap-2">
                        {platformOptions.map(p => (
                            <button key={p} onClick={() => handlePlatformToggle(p)} className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-300 ease-out flex items-center justify-center gap-2 transform hover:-translate-y-1 ${selectedPlatforms.includes(p) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <Icon icon={p.toLowerCase() as 'linkedin' | 'instagram' | 'x'} className="w-5 h-5"/>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 form-section">
                    <label className="font-semibold text-gray-300">Post Format</label>
                    <div className="flex bg-gray-800 rounded-lg p-1">
                        {postTypeOptions.map(t => (
                             <button key={t} onClick={() => setPostType(t)} className={`flex-1 py-2 px-3 rounded-md text-sm transition-all duration-200 ${postType === t ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {postType === PostType.Carousel && (
                        <div className="flex items-center gap-4 pt-2">
                            <label htmlFor="slides" className="text-sm text-gray-400">Slides:</label>
                            <input
                                type="range"
                                id="slides"
                                min="2" max="4"
                                value={numCarouselSlides}
                                onChange={e => setNumCarouselSlides(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm font-mono bg-gray-700 text-white rounded-md px-2 py-1">{numCarouselSlides}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2 form-section">
                    <label className="font-semibold text-gray-300">Context (Optional)</label>
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 w-full flex flex-col items-center justify-center hover:border-blue-500 transition transform hover:-translate-y-1 duration-300 ease-out">
                        <Icon icon="upload" className="w-8 h-8 text-gray-500 mb-2"/>
                        <span className="text-sm text-gray-400">{contextImage ? contextImage.name : "Upload an image"}</span>
                        <span className="text-xs text-gray-500">{contextImage ? 'Click to replace' : 'Provides visual context for AI'}</span>
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                
                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105">
                    {isLoading ? 'Generating...' : 'Generate Posts'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2 error-message">{error}</p>}
            </div>

            {/* Right Panel: Results */}
            <div ref={rightPanelRef} className="lg:w-2/3 xl:w-3/4 bg-gray-800/50 rounded-lg p-6 flex items-center justify-center">
                {hasGenerated ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex border-b border-gray-700">
                            {generatedPosts.map(post => (
                                <button
                                    key={post.platform}
                                    onClick={() => setActiveTab(post.platform)}
                                    className={`py-3 px-6 font-semibold text-sm flex items-center gap-2 transition transform hover:-translate-y-0.5 ${activeTab === post.platform ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Icon icon={post.platform.toLowerCase() as 'linkedin' | 'instagram' | 'x'} className="w-5 h-5"/>
                                    <span>{post.platform}</span>
                                </button>
                            ))}
                        </div>
                        {currentPost && (
                            <div ref={resultsContentRef} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 py-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 150px)'}}>
                                {/* Image Viewer */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-gray-200">Generated Image{currentPost.images.length !== 1 ? 's' : ''}</h3>
                                    
                                    {isCarousel ? (
                                        <div className="flex flex-col">
                                            <div className="relative group aspect-square">
                                                {currentPost.images[currentSlideIndex] === 'loading' ? (
                                                    <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img src={`data:image/jpeg;base64,${currentPost.images[currentSlideIndex]}`} alt={`Generated for ${currentPost.platform} - Slide ${currentSlideIndex + 1}`} className="rounded-lg object-cover w-full h-full"/>
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                                            <button onClick={() => downloadImage(currentPost.images[currentSlideIndex], `${currentPost.platform}_post_slide_${currentSlideIndex + 1}.jpg`)} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transform transition-transform hover:scale-110">
                                                                <Icon icon="download" className="w-6 h-6"/>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {currentPost.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCarouselNav(currentPost.platform, 'prev')}
                                                            disabled={currentSlideIndex === 0}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition transform hover:scale-110"
                                                            aria-label="Previous image"
                                                        >
                                                          <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                        </button>
                                                         <button
                                                            onClick={() => handleCarouselNav(currentPost.platform, 'next')}
                                                            disabled={currentSlideIndex >= currentPost.images.length - 1 || currentPost.images[currentSlideIndex + 1] === 'loading'}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition transform hover:scale-110"
                                                            aria-label="Next image"
                                                        >
                                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p ref={captionRef} className="text-sm text-gray-300 min-h-[40px] px-4">{currentSlideCaption}</p>
                                                <div className="flex justify-center items-center gap-2 mt-2">
                                                    {currentPost.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setActiveCarouselSlides(prev => ({ ...prev, [currentPost.platform]: index }))}
                                                            className={`w-2 h-2 rounded-full transition transform hover:scale-125 ${index === currentSlideIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}
                                                            aria-label={`Go to slide ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {currentPost.images.map((img, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    {img === 'loading' ? (
                                                        <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                                                            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <img src={`data:image/jpeg;base64,${img}`} alt={`Generated for ${currentPost.platform} - ${index + 1}`} className="rounded-lg object-cover w-full h-full"/>
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                                                <button onClick={() => downloadImage(img, `${currentPost.platform}_post_${index + 1}.jpg`)} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transform transition-transform hover:scale-110">
                                                                    <Icon icon="download" className="w-6 h-6"/>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {currentPost.images.length === 0 && !isLoading && (
                                        <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-center p-4">
                                            Image generation failed or was not requested.
                                        </div>
                                    )}
                                </div>
                                {/* Caption Editor */}
                                <div className="space-y-4 flex flex-col">
                                    <h3 className="font-semibold text-lg text-gray-200">Generated Caption</h3>
                                    <textarea
                                        value={currentPost.caption}
                                        disabled={isCurrentPostContentLoading}
                                        onChange={(e) => handleCaptionChange(currentPost.platform, e.target.value)}
                                        className="w-full flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-300 disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                                    />
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={(e) => copyToClipboard(currentPost.caption, `${currentPost.platform}_caption`, e)} 
                                            disabled={isCurrentPostContentLoading}
                                            className="flex items-center gap-2 bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                        >
                                            <Icon icon="copy" className="w-5 h-5 copy-icon" style={{ transform: 'scale(1)' }}/>
                                            <Icon icon="check" className="w-5 h-5 text-green-400 absolute check-icon" style={{ transform: 'scale(0)' }}/>
                                            <span className="ml-1">Copy Caption</span>
                                        </button>
                                        <div className="text-gray-400 text-sm">|</div>
                                        <div className="flex-grow text-blue-400 text-sm font-mono overflow-x-auto whitespace-nowrap">
                                            {currentPost.hashtags.join(' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="text-xl">Your generated posts will appear here.</p>
                        <p>Fill out the form and click "Generate Posts" to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Generator;