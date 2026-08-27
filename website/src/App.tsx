import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Features } from "./components/Features";
import { Playground } from "./components/Playground";
import { Setup } from "./components/Setup";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <About />
      <Features />
      <Playground />
      <Setup />
      <Footer />
    </div>
  );
}
