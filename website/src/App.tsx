import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Features } from "./components/Features";
import { Playground } from "./components/Playground";
import { Gallery } from "./components/Gallery";
import { Setup } from "./components/Setup";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <About />
      <Features />
      <Playground />
      <Gallery />
      <Setup />
      <Footer />
    </div>
  );
}
