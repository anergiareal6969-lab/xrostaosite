import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { PRODUCTS } from '../data/products';

export default function AnergiaDrop() {
  return (
    <main className="min-h-screen w-full bg-black relative flex flex-col items-center pt-24 pb-16 px-4 md:px-8">
      <Seo
        title="ανεργια drop | xrostao"
        description="Το ανεργία drop του xrostao."
        canonicalPath="/anergia-drop"
        image="/images/anergia-drop-bg.png"
      />
      
      {/* Background Image */}
      <picture className="fixed inset-0 z-0 pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/anergia-drop-bg.png" />
        <img 
          src="/images/anergia-drop-bg.png" 
          alt="Anergia Drop Background" 
          className="w-full h-full object-cover opacity-70"
        />
      </picture>

      <div className="relative z-10 w-full max-w-[140px] md:max-w-[210px] mx-auto flex flex-col items-center">
        {/* The grid of 11 items */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-8">
          {PRODUCTS.slice(0, 24).map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.slug}`}
              className="aspect-square bg-black/50 hover:scale-[1.02] transition-transform overflow-hidden flex items-center justify-center"
            >
              <img 
                src={`/images/anergia-drop/${product.id}/grid.png`} 
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}