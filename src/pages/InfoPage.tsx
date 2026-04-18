export default function InfoPage({ text }: { text: string }) {
  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-8 overflow-hidden">
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/blue-bandana-bg.png" />
        <source media="(min-width: 768px)" srcSet="/images/blue-bandana-bg.jpg" />
        <img src="/images/blue-bandana-bg.jpg" className="w-full h-full object-cover" alt="" />
      </picture>

      <div className="relative z-10 max-w-4xl w-full p-8 rounded-xl">
        <p className="font-sans font-bold italic text-white text-center text-xl md:text-4xl leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}
