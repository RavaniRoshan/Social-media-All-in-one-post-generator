import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from './Icon';

declare const gsap: any;
declare const ScrollTrigger: any;

interface LandingPageProps {
  onGetStarted: (prompt: string) => void;
}

// --- Navbar Component ---
const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/70 backdrop-blur-lg shadow-lg mt-2 mx-auto max-w-5xl rounded-full border border-gray-700' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <a href="#" className="text-white font-bold text-xl">PostAI</a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4 nav-links">
                            <a href="#home" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Home</a>
                            <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Features</a>
                            <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Pricing</a>
                            <a href="#faq" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">FAQ</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};


// --- Hero Section Component ---
const Hero: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [prompt, setPrompt] = useState('');
    const heroImageRef = useRef(null);

    useEffect(() => {
        gsap.to(heroImageRef.current, {
            backgroundPosition: '55% 50%',
            ease: 'none',
            scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGetStarted(prompt);
    };

    return (
    <section id="home" className="relative text-white text-center py-32 lg:py-48 flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-gray-900 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 opacity-50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="hero-title text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                Generate Viral Social Media Posts in Seconds
            </h1>
            <p className="hero-p mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                Stop guessing. Start growing. Leverage AI to create engaging content tailored for LinkedIn, Instagram, and X, complete with stunning visuals.
            </p>
            <form onSubmit={handleSubmit} className="hero-form mt-8 max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter an idea, e.g., 'Launch a new line of eco-friendly sneakers'"
                        className="w-full py-4 pl-6 pr-20 text-white bg-gray-800/50 border border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-sm"
                    />
                    <button type="submit" className="absolute inset-y-0 right-2 my-2 flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:scale-110 transform transition-transform duration-300 ease-in-out shadow-lg hover:shadow-blue-500/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </form>
            <div ref={heroImageRef} className="hero-image mt-16 mx-auto max-w-4xl h-[450px] bg-cover bg-no-repeat bg-center rounded-xl shadow-2xl border-2 border-gray-700" style={{ backgroundImage: 'url(https://picsum.photos/1200/600)' }}>
            </div>
        </div>
    </section>
)};

// --- Features Section ---
const Features: React.FC = () => {
    const features = [
        { title: "Multi-Platform Optimization", description: "Generates content perfectly sized and toned for LinkedIn, Instagram, and X.", icon: <Icon icon="linkedin" className="w-6 h-6 text-blue-400" /> },
        { title: "Single & Carousel Posts", description: "Choose between a single impactful image or an engaging multi-slide carousel.", icon: <Icon icon="instagram" className="w-6 h-6 text-pink-400" /> },
        { title: "Context-Aware AI", description: "Upload an image to give the AI visual context for even more relevant content.", icon: <Icon icon="upload" className="w-6 h-6 text-green-400" /> },
        { title: "Instant Review & Edit", description: "Tweak captions and review images on-the-fly before you download or post.", icon: <Icon icon="edit" className="w-6 h-6 text-yellow-400" /> },
    ];
    return (
        <section id="features" className="py-20 bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="section-title text-3xl font-extrabold text-white mb-12">Why Choose PostAI?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card bg-gray-800 p-6 rounded-lg border border-gray-700 transition-all duration-300">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-700 mb-4 mx-auto">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Pricing Section ---
const Pricing: React.FC = () => (
    <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="section-title text-3xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 mb-12">Choose the plan that's right for you.</p>
            <div className="grid md:grid-cols-3 gap-8">
                {['Free', 'Pro', 'Enterprise'].map((tier, index) => (
                    <div key={tier} className={`pricing-card bg-gray-800 p-8 rounded-lg border border-gray-700 transition-all duration-300 ${index === 1 ? 'border-blue-500' : ''}`}>
                        <h3 className="text-2xl font-bold text-white">{tier}</h3>
                        <p className="text-4xl font-extrabold text-white my-4">${index === 0 ? '0' : index === 1 ? '19' : '99'}<span className="text-base font-medium text-gray-400">/mo</span></p>
                        <ul className="space-y-2 text-gray-400">
                            <li>{index*10 + 10} Posts/mo</li>
                            <li>AI Image Generation</li>
                            <li>Multi-platform</li>
                            <li>{tier !== 'Free' ? 'Priority Support' : 'Community Support'}</li>
                        </ul>
                        <button className={`mt-8 w-full py-2 rounded-full font-bold transition-transform transform hover:scale-105 ${index === 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {index === 0 ? 'Current Plan' : 'Choose Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Testimonials Section ---
const testimonials = [
    { avatar: 'https://picsum.photos/100/100?random=1', name: 'Sarah L.', review: 'This tool is a game-changer! I save hours every week on content creation.' },
    { avatar: 'https://picsum.photos/100/100?random=2', name: 'Mike R.', review: 'The quality of the generated images and captions is outstanding. Highly recommend.' },
    { avatar: 'https://picsum.photos/100/100?random=3', name: 'Jessica T.', review: 'Finally, an AI tool that understands brand voice. My engagement has skyrocketed.' },
    { avatar: 'https://picsum.photos/100/100?random=4', name: 'David Chen', review: 'The carousel feature is brilliant for LinkedIn. It helps me create value-packed posts effortlessly.' },
    { avatar: 'https://picsum.photos/100/100?random=5', name: 'Emily White', review: 'As a solo founder, this is like having a dedicated social media manager on my team.' },
    { avatar: 'https://picsum.photos/100/100?random=6', name: 'Chris Green', review: 'Simple to use, powerful results. PostAI is now an essential part of my workflow.' }
];

const Testimonials: React.FC = () => {
    const scrollerRef1 = useRef(null);
    const scrollerRef2 = useRef(null);

    useEffect(() => {
        const createScroller = (ref: React.RefObject<HTMLDivElement>, isReverse: boolean) => {
            const scroller = ref.current;
            if (!scroller) return;

            const items = Array.from(scroller.children);
            const duplicatedItems = items.map(item => item.cloneNode(true));
            duplicatedItems.forEach(item => scroller.appendChild(item));

            let xPercent = isReverse ? -100 : 0;
            gsap.set(scroller, { xPercent });
            
            const tl = gsap.timeline({ repeat: -1, ease: 'none' });
            tl.to(scroller, { 
                duration: 40,
                xPercent: isReverse ? 0 : -100,
            });
            
            scroller.addEventListener('mouseenter', () => tl.timeScale(0.2));
            scroller.addEventListener('mouseleave', () => tl.timeScale(1));
        };

        createScroller(scrollerRef1, false);
        createScroller(scrollerRef2, true);
    }, []);

    return (
        <section className="py-20 overflow-hidden testimonials-section">
            <h2 className="section-title text-3xl font-extrabold text-white text-center mb-12">Loved by Creators Worldwide</h2>
            <div className="relative space-y-4">
                 <div className="flex w-max" ref={scrollerRef1}>
                    {testimonials.map((t, i) => (
                        <div key={`fwd-${i}`} className="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg mx-4 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                <p className="font-bold text-white">{t.name}</p>
                            </div>
                            <p className="text-gray-400">{t.review}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex w-max" ref={scrollerRef2}>
                    {testimonials.slice().reverse().map((t, i) => (
                        <div key={`rev-${i}`} className="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg mx-4 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                <p className="font-bold text-white">{t.name}</p>
                            </div>
                            <p className="text-gray-400">{t.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- FAQ Section ---
const FAQItem: React.FC<{ faq: { q: string, a: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.to(contentRef.current, {
            height: isOpen ? 'auto' : 0,
            paddingTop: isOpen ? 0 : 0,
            paddingBottom: isOpen ? '1.5rem' : 0,
            duration: 0.5,
            ease: 'power3.out',
        });
    }, [isOpen]);

    return (
        <div className="faq-item bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <button onClick={onClick} className="w-full flex justify-between items-center p-6 text-left">
                <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                <Icon icon="chevron-down" className={`w-6 h-6 text-gray-400 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div ref={contentRef} style={{ height: 0 }}>
                <p className="px-6 text-gray-400">{faq.a}</p>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const faqs = [
        { q: 'How does the AI work?', a: 'We use Google\'s advanced Gemini API to understand your prompt and generate human-like text and stunning images tailored to your needs.' },
        { q: 'Can I use my own images?', a: 'Yes! You can upload an image to provide visual context to the AI, which helps it create more accurate and relevant content.' },
        { q: 'Is there a free trial?', a: 'We offer a free plan that allows you to generate a limited number of posts per month so you can experience the power of PostAI firsthand.' },
        { q: 'What happens to my data?', a: 'We respect your privacy. Your data is used solely for the purpose of generating content and is not shared with third parties. Please see our Privacy Policy for more details.' }
    ];
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="section-title text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Footer Component ---
const Footer: React.FC = () => (
    <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-x-6 footer-links">
                <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            </div>
            <p className="mt-8 text-gray-500 footer-copy">&copy; 2024 PostAI. All rights reserved.</p>
        </div>
    </footer>
);

// --- Main Landing Page ---
const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const mainRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
            
        const ctx = gsap.context(() => {
            // --- Initial Load Animations ---
            const tl = gsap.timeline({ delay: 0.3 });
            tl.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power3.out" })
              .from(".hero-p", { opacity: 0, y: 50, duration: 1, ease: "power3.out" }, "-=0.8")
              .from(".hero-form", { opacity: 0, y: 50, duration: 1, ease: "power3.out" }, "-=0.8")
              .from(".hero-image", { opacity: 0, scale: 0.9, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=0.8")
              .from(".nav-links > a", { opacity: 0, y: -30, duration: 0.8, stagger: 0.1, ease: 'power3.out'}, "-=1.5");
            
            // Section Titles
            gsap.utils.toArray('.section-title').forEach((title: any) => {
                gsap.from(title, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });

            // Feature Cards
            gsap.from(".feature-card", {
                opacity: 0,
                y: 100,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#features",
                    start: "top 80%",
                }
            });

            // Card hover effects
            // FIX: Cast the result of `gsap.utils.toArray` as it is untyped and does not support type arguments directly.
            (gsap.utils.toArray('.feature-card, .pricing-card') as HTMLElement[]).forEach(card => {
                const hoverTween = gsap.to(card, {
                    y: -10,
                    scale: 1.03,
                    boxShadow: '0 25px 50px -12px rgba(30, 144, 255, 0.25)',
                    duration: 0.3,
                    ease: 'power2.out',
                    paused: true
                });
                card.addEventListener('mouseenter', () => hoverTween.play());
                card.addEventListener('mouseleave', () => hoverTween.reverse());
            });

            gsap.from(".pricing-card", {
                opacity: 0,
                y: 100,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: "#pricing",
                    start: "top 80%",
                }
            });
            
            gsap.from('.testimonials-section', {
                opacity: 0,
                y: 100,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.testimonials-section',
                    start: 'top 80%'
                }
            });
            
            gsap.from(".faq-item", {
                opacity: 0,
                x: -50,
                stagger: 0.1,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: "#faq",
                    start: "top 80%",
                }
            });

             gsap.from([".footer-links a", ".footer-copy"], {
                opacity: 0,
                y: 30,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: "footer",
                    start: "top 95%",
                }
            });

        }, mainRef);
            
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="bg-gray-900 text-white">
            <Navbar />
            <main>
                <Hero onGetStarted={onGetStarted} />
                <Features />
                <Pricing />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
