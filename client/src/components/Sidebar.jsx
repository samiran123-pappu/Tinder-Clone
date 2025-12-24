import { useEffect, useState } from "react";
import { Heart, X, Loader, MessageCircle } from "lucide-react"; // Fixed: Import Loader2
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore()

    // const loading = false;
    // const matches = [
    //     // Example data for preview (remove in production)
    //     // { _id: "1", name: "Alex", image: "https://example.com/alex.jpg" },
    //     { _id: "2", name: "Jordan", image: null },
    // ];

    useEffect(() => {
        getMyMatches()
    }, [getMyMatches])

    return (
        <>
            {/* Optional: Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div
                className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-1/4 lg:shadow-none
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 pb-[27px] border-b border-pink-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-pink-600">Matches</h2>
                        <button
                            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={toggleSidebar}
                            aria-label="Close sidebar"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Matches List */}
                    <div className="flex-grow overflow-y-auto p-4">
                        {isLoadingMyMatches ? (
                            <LoadingState />
                        ) : matches.length === 0 ? (
                            <NoMatchesFound />
                        ) : (
                            matches.map((match) => (
                                <Link
                                    key={match._id}
                                    to={`/chat/${match._id}`}
                                    className="block"
                                >
                                    <div className="flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-3 rounded-lg transition-colors duration-200">
                                        <img
                                            src={match.image || "/avatar.png"}
                                            alt={`${match.name}'s avatar`}
                                            className="size-12 object-cover rounded-full mr-3 border-2 border-pink-300"
                                        />
                                        <h3 className="font-semibold text-gray-800">{match.name}</h3>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <button
                className='lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-50'
                onClick={toggleSidebar}
            >
                <MessageCircle size={24} />
            </button>
        </>
    );
};

export default Sidebar;

const NoMatchesFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <Heart className="text-pink-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Yet</h3>
        <p className="text-gray-500 max-w-xs">
            Don't worry! Your perfect match is just around the corner. Keep swiping!
        </p>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <Loader className="text-pink-500 mb-4 animate-spin" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Matches</h3>
        <p className="text-gray-500 max-w-xs">
            We're finding your perfect matches. This might take a moment...
        </p>
    </div>
);