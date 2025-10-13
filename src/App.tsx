import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen px-6 py-8">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
