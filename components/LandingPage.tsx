import React, { useState, useEffect } from 'react';
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
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="#home" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="#features" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                            <a href="#pricing" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                            <a href="#faq" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">FAQ</a>
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGetStarted(prompt);
    };

    return (
    <section id="home" className="relative text-white text-center py-32 lg:py-48 flex items-center justify-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
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
                    <button type="submit" className="absolute inset-y-0 right-2 my-2 flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:scale-105 transform transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </form>
            <div className="hero-image mt-16 mx-auto max-w-3xl">
                <img src="https://picsum.photos/1200/600" alt="App Screenshot" className="rounded-xl shadow-2xl border-2 border-gray-700"/>
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
                <h2 className="text-3xl font-extrabold text-white mb-12">Why Choose PostAI?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card bg-gray-800 p-6 rounded-lg border border-gray-700">
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
            <h2 className="text-3xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 mb-12">Choose the plan that's right for you.</p>
            <div className="grid md:grid-cols-3 gap-8">
                {['Free', 'Pro', 'Enterprise'].map((tier, index) => (
                    <div key={tier} className={`pricing-card bg-gray-800 p-8 rounded-lg border border-gray-700 ${index === 1 ? 'border-blue-500 scale-105' : ''}`}>
                        <h3 className="text-2xl font-bold text-white">{tier}</h3>
                        <p className="text-4xl font-extrabold text-white my-4">${index === 0 ? '0' : index === 1 ? '19' : '99'}<span className="text-base font-medium text-gray-400">/mo</span></p>
                        <ul className="space-y-2 text-gray-400">
                            <li>{index*10 + 10} Posts/mo</li>
                            <li>AI Image Generation</li>
                            <li>Multi-platform</li>
                            <li>{tier !== 'Free' ? 'Priority Support' : 'Community Support'}</li>
                        </ul>
                        <button className={`mt-8 w-full py-2 rounded-full font-bold ${index === 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
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
    // Duplicate for seamless loop
    const extendedTestimonials1 = [...testimonials, ...testimonials];
    const extendedTestimonials2 = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

    const styles = `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
        }
    `;

    return (
        <section className="py-20 overflow-hidden">
            <style>{styles}</style>
            <h2 className="text-3xl font-extrabold text-white text-center mb-12">Loved by Creators Worldwide</h2>
            <div className="relative space-y-4">
                 <div className="flex w-max animate-scroll">
                    {extendedTestimonials1.map((t, i) => (
                        <div key={`fwd-${i}`} className="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg mx-4 border border-gray-700">
                            <div className="flex items-center mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                <p className="font-bold text-white">{t.name}</p>
                            </div>
                            <p className="text-gray-400">{t.review}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex w-max animate-scroll-reverse">
                    {extendedTestimonials2.map((t, i) => (
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
const FAQ: React.FC = () => {
  const faqs = [
    { q: 'How does the AI work?', a: 'We use Google\'s advanced Gemini API to understand your prompt and generate human-like text and stunning images tailored to your needs.' },
    { q: 'Can I use my own images?', a: 'Yes! You can upload an image to provide visual context to the AI, which helps it create more accurate and relevant content.' },
    { q: 'Is there a free trial?', a: 'We offer a free plan that allows you to generate a limited number of posts per month so you can experience the power of PostAI firsthand.' },
    { q: 'What happens to my data?', a: 'We respect your privacy. Your data is used solely for the purpose of generating content and is not shared with third parties. Please see our Privacy Policy for more details.' }
  ];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
              <button onClick={() => setOpen(open === index ? null : index)} className="w-full flex justify-between items-center p-6 text-left">
                <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                <Icon icon="chevron-down" className={`w-6 h-6 text-gray-400 transition-transform ${open === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${open === index ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-6 pt-0 text-gray-400">{faq.a}</p>
              </div>
            </div>
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
            <div className="space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            </div>
            <p className="mt-8 text-gray-500">&copy; 2024 PostAI. All rights reserved.</p>
        </div>
    </footer>
);

// --- Main Landing Page ---
const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero animations
            gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power3.out" });
            gsap.from(".hero-p", { opacity: 0, y: 50, duration: 1, delay: 0.2, ease: "power3.out" });
            gsap.from(".hero-form", { opacity: 0, y: 50, duration: 1, delay: 0.4, ease: "power3.out" });
            gsap.from(".hero-image", { opacity: 0, scale: 0.9, duration: 1.5, delay: 0.6, ease: "elastic.out(1, 0.5)" });

            // Feature card animations
            gsap.from(".feature-card", {
                opacity: 0,
                y: 100,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#features",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            // Pricing card animations
            gsap.from(".pricing-card", {
                opacity: 0,
                y: 100,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#pricing",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        }
    }, []);

    return (
        <div className="bg-gray-900 text-white">
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