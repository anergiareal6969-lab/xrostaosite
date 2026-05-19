import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const INFO_PAGE_DESKTOP_BG = '/images/info-page-bg.png';
const INFO_PAGE_MOBILE_BG = '/images/mobile/info-page-bg.png';

export default function InfoPage({ title, description, canonicalPath, text }: { title: string; description: string; canonicalPath: string; text: string }) {
  const pageTitle = `${title} | xrostao`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description,
      url: canonicalPath,
      mainEntityOfPage: canonicalPath,
      inLanguage: 'el-GR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ρούχα',
          item: '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: canonicalPath,
        },
      ],
    },
  ];

  return (
    <main className="relative min-h-screen w-full bg-black flex items-center justify-center p-8 overflow-hidden">
      <Seo
        title={pageTitle}
        description={description}
        canonicalPath={canonicalPath}
        image={INFO_PAGE_DESKTOP_BG}
        keywords={[title, 'xrostao', 'χροσταω', 'ρούχα', 'anergia season']}
        jsonLd={jsonLd}
      />

      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source media="(max-width: 767px)" srcSet={INFO_PAGE_MOBILE_BG} />
        <source media="(min-width: 768px)" srcSet={INFO_PAGE_DESKTOP_BG} />
        <img
          src={INFO_PAGE_DESKTOP_BG}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 bg-black/35 z-0" aria-hidden="true" />

      <article className="relative z-10 max-w-4xl w-full p-8 md:p-10 rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
        <nav className="sr-only" aria-label="Breadcrumb">
          <Link to="/">ρούχα</Link>
          <span>{title}</span>
        </nav>
        <h1 className="sr-only">{pageTitle}</h1>
        <p className="font-sans font-bold italic text-white text-center text-xl md:text-4xl leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </article>
    </main>
  );
}
