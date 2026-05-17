import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { getProductBySlug, getProductMainImageScale } from '../data/products';

export default function Product() {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');

  if (!product) return <Navigate to="/" />;

  const imageScale = getProductMainImageScale(product.id);
  const title = `${product.name} | xrostao clothing`;
  const description = product.description.replace(/\s+/g, ' ').trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.primaryImage],
    brand: {
      '@type': 'Brand',
      name: 'xrostao',
    },
    category: 'T-Shirts',
    sku: `xrostao-tshirt-${product.id}`,
    url: `/products/${product.slug}`,
  };

  return (
    <div className="relative w-full bg-black flex flex-col">
      <Seo
        title={title}
        description={description}
        canonicalPath={`/products/${product.slug}`}
        image={product.primaryImage}
        imageAlt={product.name}
        ogType="product"
        jsonLd={jsonLd}
      />

      <div className="w-full max-w-5xl mx-auto px-4 pt-28 pb-10">
        <h1 className="text-white font-bold italic text-3xl md:text-5xl leading-tight">
          {product.name}
        </h1>
        <p className="text-white/80 font-sans font-medium text-base md:text-lg mt-6 whitespace-pre-wrap leading-relaxed">
          {product.description}
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-full md:w-[420px] rounded-xl border border-white/10 bg-white/5"
            loading="eager"
            style={imageScale === 1 ? undefined : { transform: `scale(${imageScale})`, transformOrigin: 'center' }}
          />

          <div className="flex flex-col gap-4">
            <Link
              to={`/tshirt/${product.id}`}
              className="inline-flex items-center justify-center bg-white text-black font-bold italic py-3 px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95"
            >
              Δες το t-shirt
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-white/10 text-white font-bold italic py-3 px-6 rounded-xl hover:bg-white/15 transition-all active:scale-95"
            >
              Πίσω στα ρούχα
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
