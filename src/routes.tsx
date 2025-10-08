import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import UploadPage from "./pages/UploadPage";
import SummaryPage from "./pages/SummaryPage";
import DetailsPage from "./pages/DetailsPage";
import AskPage from "./pages/AskPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/how-it-works", element: <HowItWorksPage /> },
            { path: "/upload", element: <UploadPage /> },
            { path: "/summary", element: <SummaryPage /> },
            { path: "/details", element: <DetailsPage /> },
            { path: "/ask", element: <AskPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
