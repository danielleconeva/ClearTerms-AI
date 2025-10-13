import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <ul className="flex flex-row items-center justify-center md:justify-start gap-6 sm:gap-10 md:gap-14 xl:gap-16 2xl:gap-20 mt-14 sm:mt-12 md:mt-16 xl:mt-20 ml-0 md:ml-30 xl:ml-36 2xl:ml-40 text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold text-cyan-300 tracking-wider">
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
