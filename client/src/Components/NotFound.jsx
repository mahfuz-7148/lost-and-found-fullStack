import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-yellow-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-block relative">
                    <svg className="w-32 h-32 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                        <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                </div>
                <h1 className="text-4xl font-bold mt-4 text-gray-800 dark:text-gray-100">404 - Recipe Not Found!</h1>
                <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">Oops! It seems this dish got lost in the kitchen.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block px-4 py-2 rounded-full bg-blue-500 dark:bg-blue-400 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    );
};

export default NotFound;