import { Link } from 'react-router-dom';

export default function FooterLinks() {
  return (
    <div className="relative w-full bg-black py-20 px-4 flex flex-col items-center gap-6 mt-auto">
      {/* 
        This is the footer area corresponding to the 12th image.
        The user wants the links exactly here in white, bold, italic.
      */}
      <picture className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/footer-bg.png" />
        <source media="(min-width: 768px)" srcSet="/images/footer-bg.png" />
        <img src="/images/footer-bg.png" className="w-full h-full object-cover" alt="" />
      </picture>
      
      <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-12">
        <Link to="/" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80">
          ρούχα
        </Link>
        <Link to="/who-we-are" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80">
          ποιοι στον πούτσο είμαστε
        </Link>
        <Link to="/idea" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80">
          ιδέα
        </Link>
        <Link to="/how-it-works" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80">
          πώς λειτουργεί το αίτημα
        </Link>
        <Link to="/are-you-unemployed" className="text-white font-bold italic text-base md:text-2xl hover:opacity-80">
          είσαι άνεργος;
        </Link>
      </div>

      <div className="relative z-10 mt-12 text-white font-sans font-bold italic text-sm text-center">
        © 2026 xrostao clothing
      </div>
    </div>
  );
}
