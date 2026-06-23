import { useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "pink"
    );

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(prev =>
            prev === "pink"
                ? "dark"
                : "pink"
        );
    }

    return {
        theme,
        toggleTheme
    };
}