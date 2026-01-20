import { useState, useRef, useEffect } from "react";

export default function ContentForm({ onGenerate, loading }) {
    const [form, setForm] = useState({
        businessName: "",
        idea: "",
        industry: "",
        targetAudience: "",
        tone: "formal",
        docType: "business_plan",
        extraNotes: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(form);
    };

    // Custom Idea listbox component
    function IdeaListbox({ value, onChange }) {
        const options = [
            "AI-powered automation platform",
            "AI agents for business workflows",
            "AI SaaS product",
            "AI marketplace",
            "Custom AI solutions for enterprises",
        ];

        const [open, setOpen] = useState(false);
        const [focusIndex, setFocusIndex] = useState(-1);
        const containerRef = useRef(null);
        const optionRefs = useRef([]);

        useEffect(() => {
            function onClickOutside(e) {
                if (containerRef.current && !containerRef.current.contains(e.target)) {
                    setOpen(false);
                    setFocusIndex(-1);
                }
            }
            document.addEventListener("mousedown", onClickOutside);
            return () => document.removeEventListener("mousedown", onClickOutside);
        }, []);

        useEffect(() => {
            if (open) {
                const idx = options.findIndex((o) => o === value);
                setFocusIndex(idx >= 0 ? idx : 0);
            } else {
                setFocusIndex(-1);
            }
        }, [open]);

        useEffect(() => {
            if (focusIndex >= 0 && optionRefs.current[focusIndex]) {
                optionRefs.current[focusIndex].scrollIntoView({ block: "nearest" });
            }
        }, [focusIndex]);

        function toggleOpen() {
            setOpen((s) => !s);
        }

        function handleKeyDown(e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!open) {
                    setOpen(true);
                    return;
                }
                setFocusIndex((i) => (i + 1) % options.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusIndex((i) => (i - 1 + options.length) % options.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (open && focusIndex >= 0) {
                    onChange(options[focusIndex]);
                    setOpen(false);
                } else {
                    setOpen(true);
                }
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        }

        const selectedLabel = value || "Select an idea";

        return (
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-labelledby="idea-label"
                    onClick={toggleOpen}
                    onKeyDown={handleKeyDown}
                    className="w-full text-left px-4 h-12 pr-10 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 bg-white"
                >
                    <span className={`inline-block truncate ${value ? "" : "text-gray-400"}`}>{selectedLabel}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className={`h-5 w-5 text-gray-500 transform transition-transform duration-150 ${open ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </span>
                </button>

                {open && (
                    <ul
                        role="listbox"
                        tabIndex={-1}
                        className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto py-1 text-gray-700"
                    >
                        {options.map((opt, i) => (
                            <li
                                key={opt}
                                role="option"
                                aria-selected={value === opt}
                                ref={(el) => (optionRefs.current[i] = el)}
                                onMouseEnter={() => setFocusIndex(i)}
                                onMouseLeave={() => setFocusIndex(-1)}
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                className={`px-4 py-2 cursor-pointer ${focusIndex === i ? "bg-blue-600 text-white" : "hover:bg-gray-100"} ${value === opt && !(focusIndex === i) ? "font-semibold" : ""}`}
                            >
                                {opt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 divide-y divide-gray-100"
        >
            {/* Header */}
            <div className="pb-6">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    Create Business Document
                </h1>
                <p className="text-gray-600 text-sm">
                    Fill in the details to generate a polished, customized business document
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 items-start">
                {/* Business Name */}
                <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="businessName"
                        className="w-full px-4 h-12 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 placeholder-gray-400"
                        name="businessName"
                        placeholder="e.g., A-Series"
                        value={form.businessName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Idea / Concept */}
                <div>
                    <label id="idea-label" htmlFor="idea" className="block text-sm font-semibold text-gray-700 mb-2">
                        Idea / Concept <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <IdeaListbox value={form.idea} onChange={(val) => setForm({ ...form, idea: val })} />
                    </div>
                    <p id="ideaHelp" className="mt-1 text-xs text-gray-500">Choose a concept from the list.</p>
                </div>

                {/* Industry */}
                <div>
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                        Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="industry"
                            aria-describedby="industryHelp"
                            className="w-full px-4 h-12 pr-10 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all appearance-none bg-white cursor-pointer"
                            name="industry"
                            value={form.industry}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled hidden>Select an industry</option>
                            <option value="SaaS">SaaS</option>
                            <option value="FinTech">FinTech</option>
                            <option value="HealthTech">HealthTech</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="EdTech">EdTech</option>
                            <option value="AI / ML">AI / ML</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                    <p id="industryHelp" className="mt-1 text-xs text-gray-500">Select the primary industry that best fits your business.</p>
                </div>

                {/* Target Audience */}
                <div>
                    <label htmlFor="targetAudience" className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Audience <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="targetAudience"
                            aria-describedby="audienceHelp"
                            className="w-full px-4 h-12 pr-10 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all appearance-none bg-white cursor-pointer"
                            name="targetAudience"
                            value={form.targetAudience}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled hidden>Select target audience</option>
                            <option value="Startups">Startups</option>
                            <option value="SMEs">SMEs</option>
                            <option value="Enterprises">Enterprises</option>
                            <option value="Investors">Investors</option>
                            <option value="Consumers">Consumers</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                    <p id="audienceHelp" className="mt-1 text-xs text-gray-500">Who is your product or service for?</p>
                </div>

                {/* Tone */}
                <div>
                    <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Tone
                    </label>
                    <div className="relative">
                        <select
                            id="tone"
                            className="w-full px-4 h-12 pr-10 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all appearance-none bg-white cursor-pointer"
                            name="tone"
                            value={form.tone}
                            onChange={handleChange}
                        >
                            <option value="formal">Formal</option>
                            <option value="neutral">Neutral</option>
                            <option value="casual">Casual</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Document Type */}
                <div>
                    <label htmlFor="docType" className="block text-sm font-semibold text-gray-700 mb-2">
                        Document Type
                    </label>
                    <div className="relative">
                        <select
                            id="docType"
                            className="w-full px-4 h-12 pr-10 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all appearance-none bg-white cursor-pointer"
                            name="docType"
                            value={form.docType}
                            onChange={handleChange}
                        >
                            <option value="business_plan">Business Plan</option>
                            <option value="pitch_deck">Pitch Deck</option>
                            <option value="strategy">Strategy Document</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Extra Notes */}
                <div className="md:col-span-2">
                    <label htmlFor="extraNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Extra Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="extraNotes"
                        aria-describedby="extraHelp"
                        className="w-full px-4 min-h-[110px] border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all placeholder-gray-400 resize-vertical"
                        name="extraNotes"
                        placeholder="Fundraising stage, metrics, constraints..."
                        value={form.extraNotes}
                        onChange={handleChange}
                        rows="4"
                    />
                    <p id="extraHelp" className="mt-1 text-xs text-gray-500">Tell us anything else that helps shape the document (optional).</p>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                "Generate Document"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
