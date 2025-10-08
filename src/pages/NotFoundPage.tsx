import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center">
                    <div className="mb-6">
                        <h1 className="text-9xl md:text-[200px] font-bold text-white leading-none">
                            404
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                        Page not found
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        The page you're looking for doesn't exist or was moved.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-8 py-4 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transform hover:scale-105"
                        >
                            Go home
                        </Link>
                        <Link
                            to="/upload"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold rounded-full hover:border-cyan-300 hover:text-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30 transform hover:scale-105"
                        >
                            Upload Your Document
                        </Link>
                    </div>
                </div>

                <div className="mt-16 flex justify-center items-center gap-4 opacity-30">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-cyan-300 rounded-full animate-bounce delay-150"></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce delay-300"></div>
                </div>
            </div>
        </div>
    );
}
