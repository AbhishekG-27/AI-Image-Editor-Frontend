import InpaintEditor from "../components/ImageUploadModal";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import "./App.css";

export default function App() {
  return (
    <div className="w-full">
      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <InpaintEditor />
      </main>
    </div>
  );
}
