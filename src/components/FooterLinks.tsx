import { Link } from 'react-router-dom';
import { INFO_PAGES, INFO_PAGE_KEYS } from '../data/infoPages';

export default function FooterLinks() {
  return (
    <footer className="relative w-full bg-black py-20 px-4 flex flex-col items-center gap-6 mt-auto overflow-hidden">
      <picture className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/footer-bg.png" />
        <source media="(min-width: 768px)" srcSet="/images/pc-footer-bg.png" />
        <img src="/images/pc-footer-bg.png" className="w-full h-full object-cover" alt="" />
      </picture>
      
      <nav className="relative z-10 flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-12" aria-label="Footer navigation">
        <Link to="/" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          ρούχα
        </Link>
        {INFO_PAGE_KEYS.map((key) => (
          <Link key={key} to={INFO_PAGES[key].path} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
            {INFO_PAGES[key].title}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 mt-12 text-white font-sans font-bold italic text-sm text-center">
        © 2026 xrostao clothing
      </div>
    </footer>
  );
}
