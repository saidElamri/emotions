"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Button from "@/components/Button";
import Alert from "@/components/Alert";

export default function SentimentPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [history, setHistory] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
        const savedHistory = localStorage.getItem("sentimentHistory");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, [router]);

    const analyzeSentiment = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setError("");
        setSuccess("");
        setResult(null);

        try {
            const response = await api.post("/predict", { text });
            const newResult = response.data;
            setResult(newResult);
            setSuccess("Analysis completed successfully!");

            const newHistoryItem = {
                text: text,
                sentiment: newResult.sentiment,
                score: newResult.score,
                timestamp: new Date().toISOString(),
            };
            const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
            setHistory(updatedHistory);
            localStorage.setItem("sentimentHistory", JSON.stringify(updatedHistory));
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setError("Failed to analyze sentiment. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getSentimentBadge = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case "positive":
                return <span className="badge-positive">✓ Positive</span>;
            case "negative":
                return <span className="badge-negative">✗ Negative</span>;
            default:
                return <span className="badge-neutral">− Neutral</span>;
        }
    };

    const getProgressClass = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case "positive": return "progress-fill-positive";
            case "negative": return "progress-fill-negative";
            default: return "progress-fill-neutral";
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                            Sentiment Analysis
                        </h1>
                        <p className="text-purple-100 text-lg">AI-powered text analysis</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        }
                        iconPosition="right"
                    >
                        Sign Out
                    </Button>
                </header>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Enter Text
                            </h2>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="input-field h-48 resize-none"
                                placeholder="Type or paste your text here to analyze its sentiment..."
                            />
                            <div className="mt-5">
                                <Button
                                    onClick={analyzeSentiment}
                                    loading={loading}
                                    disabled={!text.trim()}
                                    className="w-full"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    }
                                    iconPosition="left"
                                >
                                    {loading ? "Analyzing..." : "Analyze Sentiment"}
                                </Button>
                            </div>
                            {error && (
                                <div className="mt-4">
                                    <Alert type="error" message={error} onClose={() => setError("")} duration={5} />
                                </div>
                            )}
                            {success && (
                                <div className="mt-4">
                                    <Alert type="success" message={success} onClose={() => setSuccess("")} duration={3} />
                                </div>
                            )}
                        </div>

                        {/* Result Section */}
                        {result && (
                            <div className="card animate-fade-in">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Analysis Result
                                </h3>

                                <div className="flex items-center justify-between mb-6">
                                    {getSentimentBadge(result.sentiment)}
                                    <div className="text-right">
                                        <div className="text-5xl font-bold text-gray-900">
                                            {(result.score * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">Confidence Score</div>
                                    </div>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${getProgressClass(result.sentiment)}`}
                                        style={{ width: `${result.score * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* History Section */}
                    <div className="card">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent History
                        </h3>

                        {history.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-3xl mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg">No recent analyses</p>
                                <p className="text-gray-400 text-sm mt-2">Your analysis history will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                                    >
                                        <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                                            "{item.text}"
                                        </p>
                                        <div className="flex justify-between items-center">
                                            {getSentimentBadge(item.sentiment)}
                                            <span className="text-xs text-gray-500">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
