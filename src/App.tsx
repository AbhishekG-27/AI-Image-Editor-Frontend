import InpaintEditor from "./pages/ImageUploadModal";
import Pricing from "./pages/Pricing";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import "./App.css";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="w-full">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-editor" element={<InpaintEditor />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
        {/* <ResultsShowcase /> */}
      </main>
    </div>
  );
}
