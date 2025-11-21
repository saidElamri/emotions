import { useEffect, useState } from "react";

export default function Alert({ type = "error", message, onClose, duration = 0 }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration * 1000);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400); // Match animation duration
    };

    if (!isVisible) return null;

    const types = {
        error: {
            bg: "bg-red-50/90",
            border: "border-red-200",
            text: "text-red-800",
            icon: (
                <div className="bg-red-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            ),
            progress: "bg-red-500"
        },
        success: {
            bg: "bg-green-50/90",
            border: "border-green-200",
            text: "text-green-800",
            icon: (
                <div className="bg-green-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            ),
            progress: "bg-green-500"
        },
        warning: {
            bg: "bg-yellow-50/90",
            border: "border-yellow-200",
            text: "text-yellow-800",
            icon: (
                <div className="bg-yellow-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            ),
            progress: "bg-yellow-500"
        },
        info: {
            bg: "bg-blue-50/90",
            border: "border-blue-200",
            text: "text-blue-800",
            icon: (
                <div className="bg-blue-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            ),
            progress: "bg-blue-500"
        }
    };

    const style = types[type] || types.info;

    return (
        <div className={`fixed top-5 right-5 z-50 max-w-sm w-full ${isLeaving ? 'animate-slide-out' : 'animate-slide-in'}`}>
            <div className={`${style.bg} backdrop-blur-md border ${style.border} rounded-xl shadow-2xl overflow-hidden`}>
                <div className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0">{style.icon}</div>
                    <div className="flex-1 pt-1">
                        <p className={`font-medium ${style.text}`}>{message}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-black/5"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                {duration > 0 && (
                    <div className="h-1 w-full bg-gray-200/50">
                        <div
                            className={`h-full ${style.progress}`}
                            style={{
                                width: '100%',
                                animation: `shrink ${duration}s linear forwards`
                            }}
                        />
                    </div>
                )}
            </div>
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}
