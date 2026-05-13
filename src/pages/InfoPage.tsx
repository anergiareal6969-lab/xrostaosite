import Seo from '../components/Seo';

export default function InfoPage({ title, description, canonicalPath, text }: { title: string; description: string; canonicalPath: string; text: string }) {
  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-8 overflow-hidden">
      <Seo title={title} description={description} canonicalPath={canonicalPath} image="/images/main-bg-1.png" />

      <div className="relative z-10 max-w-4xl w-full p-8 rounded-xl">
        <p className="font-sans font-bold italic text-white text-center text-xl md:text-4xl leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}
