import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <ul className="flex gap-14 mt-16 ml-30 text-lg font-semibold text-cyan-300 tracking-wider">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `relative pb-1 transition-all duration-300 
             hover:text-cyan-400 after:absolute after:left-0 after:bottom-0 
             after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 
             after:transition-all after:duration-300 hover:after:w-full 
             ${isActive ? "text-cyan-400 after:w-full" : ""}`
                    }
                >
                    HOME
                </NavLink>

                <NavLink
                    to="/how-it-works"
                    className={({ isActive }) =>
                        `relative pb-1 transition-all duration-300 
             hover:text-cyan-400 after:absolute after:left-0 after:bottom-0 
             after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-500 
             after:transition-all after:duration-300 hover:after:w-full 
             ${isActive ? "text-cyan-400 after:w-full" : ""}`
                    }
                >
                    HOW IT WORKS
                </NavLink>
            </ul>
        </>
    );
}
