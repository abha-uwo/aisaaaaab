import React, { useState } from 'react';
import { Search } from 'lucide-react';
import LiveDemoCard from '../Components/LiveDemo/LiveDemoCard';
import LiveDemoModal from '../Components/LiveDemo/LiveDemoModal';
import SubscriptionForm from '../Components/SubscriptionForm/SubscriptionForm';
import { useRecoilValue } from 'recoil';
import { toggleState } from '../userStore/userData';
import { AnimatePresence } from 'motion/react';

const MOCK_DEMOS = [
    {
        _id: '1',
        agentName: 'AIBIZ – AI Business Operating System',
        description: 'The central control room for your entire company. AIBIZ integrates sales, finance, HR, and operations into a single intelligent dashboard.',
        avatar: '/AIBIZ.jpeg',
        thumbnail: '/demo/scene1.png',
        category: 'Business OS',
        duration: '1:00',
        videoUrl: 'https://res.cloudinary.com/dfmqbofsl/video/upload/v1766734462/ai-bizzzzz-videooo_xkt1ei.mp4',
        scenes: [
            {
                image: '/demo/scene1.png',
                caption: "Meet AIBIZ — the AI Business Operating System that runs your entire company from one place."
            },
            {
                image: '/demo/scene2.png',
                caption: "AIBIZ works as a central control room, bringing sales, finance, HR, and operations together."
            },
            {
                image: '/demo/scene3.png',
                caption: "AIBIZ instantly analyzes performance, detects risks, and highlights important business signals."
            },
            {
                image: '/demo/scene4.png',
                caption: "AIBIZ gives warnings, insights, and smart recommendations to help you make better decisions faster."
            },
            {
                image: '/demo/scene5.png',
                caption: "Perfect for founders, managers, and growing businesses who want full control without complexity."
            }
        ],
        features: [
            "Unified control room for Sales, Finance, HR, and Ops",
            "Automated performance analysis and risk detection",
            "Real-time alerts and intelligent business signals",
            "Smart recommendations for faster decision making"
        ],
        tags: ["Founders", "Management", "Business Operations", "Growth"]
    },
    {
        _id: '2',
        agentName: 'Content Writer Pro',
        description: 'AI Content Writer helps you instantly generate professional marketing content for social media, blogs, ads, and scripts.',
        avatar: 'https://picsum.photos/200/200?random=2',
        thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop',
        category: 'Sales & Marketing',
        duration: '1:15',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        features: [
            "Multi-platform content generation",
            "Tone and style customization",
            "SEO-optimized blog posts",
            "Ad copy that converts"
        ],
        tags: ["Marketing", "Copywriting", "Creative"]
    },
    {
        _id: '3',
        agentName: 'AISA – Smart Assistant',
        description: 'AISA is your intelligent AI assistant that helps you generate answers, ideas, summaries, and explanations instantly.',
        avatar: 'https://picsum.photos/200/200?random=3',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
        category: 'Data & Intelligence',
        duration: '0:50',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        features: [
            "Real-time question answering",
            "Document summarization",
            "Idea brainstorming partner",
            "Complex concept explanations"
        ],
        tags: ["Productivity", "Knowledge", "Smart"]
    },
    {
        _id: '4',
        agentName: 'GrowthHack AI',
        description: 'Identify growth opportunities and automate your marketing funnel with advanced AI algorithms.',
        avatar: 'https://picsum.photos/200/200?random=4',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=2070&auto=format&fit=crop',
        category: 'Sales & Marketing',
        duration: '1:30',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        features: [
            "Funnel optimization",
            "Lead generation automation",
            "Conversion rate analysis",
            "Automated A/B testing"
        ],
        tags: ["Growth", "Scaling", "Automation"]
    },
    {
        _id: '5',
        agentName: 'DesignGenius',
        description: 'AI-powered design assistant for creating stunning visuals, logos, and UI components in seconds.',
        avatar: 'https://picsum.photos/200/200?random=5',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop',
        category: 'Design & Creative',
        duration: '0:55',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        features: [
            "Logo and branding generation",
            "UI component prototyping",
            "Visual asset creation",
            "Design systems management"
        ],
        tags: ["Design", "Creative", "UI/UX"]
    }
];

const LiveDemoPage = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [agentId, setAgentId] = useState("");
    const subToggle = useRecoilValue(toggleState);

    const categories = [
        'all',
        "Business OS",
        "Data & Intelligence",
        "Sales & Marketing",
        "HR & Finance",
        "Design & Creative",
        "Medical & Health AI"
    ];

    const handleSubscribe = (id) => {
        setAgentId(id);
    };

    const filteredDemos = MOCK_DEMOS.filter(demo => {
        const matchesFilter = filter === 'all' || demo.category === filter;
        const matchesSearch = demo.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            demo.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-secondary">
            <AnimatePresence>
                {subToggle.subscripPgTgl && <SubscriptionForm id={agentId} />}
            </AnimatePresence>
            <LiveDemoModal onSubscribe={handleSubscribe} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-maintext mb-2">
                        Live Agent Demos
                    </h1>
                    <p className="text-sm md:text-base text-subtext">
                        Explore AI agents through short demo videos before subscribing.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-subtext" />
                    <input
                        type="text"
                        placeholder="Search demos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-maintext focus:outline-none focus:border-primary transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all border ${filter === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-card text-subtext border-border hover:bg-surface'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Demos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDemos.length > 0 ? (
                    filteredDemos.map(demo => (
                        <LiveDemoCard
                            key={demo._id}
                            agent={demo}
                            onSubscribe={handleSubscribe}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-subtext text-lg">No demos found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveDemoPage;
