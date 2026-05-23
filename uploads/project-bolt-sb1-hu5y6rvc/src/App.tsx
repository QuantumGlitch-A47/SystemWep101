import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TechnicalCompetencies } from './components/TechnicalCompetencies';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="bg-space-950 text-space-100 antialiased selection:bg-accent-500/30 selection:text-accent-500 relative">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-space-950 via-transparent to-space-950 pointer-events-none z-0" />

      <Header />
      <main className="relative z-10 pt-32 pb-20">
        <Hero />
        <TechnicalCompetencies />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
