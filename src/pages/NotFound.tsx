import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex items-center justify-center px-6">
      <Seo
        title="404 | xrostao clothing"
        description="Η σελίδα που ψάχνεις δεν βρέθηκε στο xrostao clothing."
        canonicalPath="/404"
        robots="noindex,follow"
        image="/images/main-bg-1.png"
      />

      <section className="w-full max-w-3xl bg-white/10 border border-white/15 rounded-[2rem] backdrop-blur-xl p-8 md:p-12 text-center shadow-2xl">
        <p className="text-white/50 uppercase tracking-[0.35em] text-xs md:text-sm">404</p>
        <h1 className="mt-4 font-black italic text-4xl md:text-6xl leading-none">
          Αυτή η σελίδα
          <br />
          δεν υπάρχει
        </h1>
        <p className="mt-6 text-white/75 font-medium text-base md:text-lg leading-relaxed">
          Πήγαινε ξανά στα ρούχα, στα προϊόντα ή στις info σελίδες του xrostao clothing.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center justify-center bg-white text-black font-bold italic py-3 px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95">
            Πίσω στο site
          </Link>
          <Link to="/how-it-works" className="inline-flex items-center justify-center bg-white/10 text-white font-bold italic py-3 px-6 rounded-xl hover:bg-white/15 transition-all active:scale-95">
            Πώς λειτουργεί
          </Link>
        </div>
      </section>
    </main>
  );
}
