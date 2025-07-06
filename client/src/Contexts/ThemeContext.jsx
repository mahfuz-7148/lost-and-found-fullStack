import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
const ThemeContext = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-xl"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
    );
};

export default ThemeContext;