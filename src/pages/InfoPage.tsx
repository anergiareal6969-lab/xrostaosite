import Seo from '../components/Seo';

export default function InfoPage({ title, description, canonicalPath, text }: { title: string; description: string; canonicalPath: string; text: string }) {
  const pageTitle = `${title} | xrostao clothing`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description,
    url: canonicalPath,
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-8 overflow-hidden">
      <Seo title={pageTitle} description={description} canonicalPath={canonicalPath} image="/images/main-bg-1.png" jsonLd={jsonLd} />

      <div className="relative z-10 max-w-4xl w-full p-8 rounded-xl">
        <h1 className="sr-only">{pageTitle}</h1>
        <p className="font-sans font-bold italic text-white text-center text-xl md:text-4xl leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}
