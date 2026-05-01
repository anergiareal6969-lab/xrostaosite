import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import InfoPage from './pages/InfoPage';
import TShirt from './pages/TShirt';
import Product from './pages/Product';
import Menu from './components/Menu';
import FooterLinks from './components/FooterLinks';
import Preloader from './components/Preloader';

const INFO_PAGES = {
  who: {
    text: "Κάποιοι άνεργοι σχεδιαστές που έπρεπε να κάνουν κάτι γιατί η ανεργία έχει βαρέσει κόκκινο. Επίσης το xrostao δεν θα έχει μόνο ρούχα με θέμα την ανεργία, απλά αυτό είναι το πρώτο drop του xrostao και απλά λέγεται anergia season, ναι οκ καταλάβατε.",
  },
  idea: {
    text: "Κοίτα, η ιδέα που σκεφτήκαμε ήταν να βγάλουμε ρούχα. Ρούχα είναι, εγώ θα σου πρότεινα να μην πάρεις καν.",
  },
  how: {
    text: "Οκ, αυτό είναι σοβαρό. Επειδή δεν θέλαμε να είμαστε ίδιοι με όλους τους lousers, δεν βάλαμε στο site κάποιος να μπορεί να αγοράσει κάτι. Τα ρούχα αυτά δεν πολούνται!! Αλλά άμα κάνεις αίτημα, δηλώνεις το ενδιαφέρον σου, έτσι θα μαζευτούν πολλά αιτήματα και μια λαμπρή μέρα τα ρούχα θα κυκλοφορήσουν.",
  },
  unemployed: {
    text: "Οκ, τώρα αυτό θα έλεγα είναι ίσως ένα από τα μεγαλύτερα ερωτήματα του Σωκράτη. Άμα εσύ, ναι συγκεκριμένα εσύ, ΕΙΣΑΙ ΑΝΕΡΓΟΣ/Η!!! Άμα είσαι άνεργος/η θα πρέπει σίγουρα να φοράς τις μπλούζες αυτές εδώ αλλιώς ξέρεις... ναι... δεν είσαι σίγουρα άνεργος (αυτό σίγουρα δεν το είπα για να πάρεις τα ρούχα) χαχαχαχαχα giiiiiirl πλακίζω, μην πάρεις τίποτα από εδώ, στα παπάρια μου! Καλά, όχι στα παπάρια μου, αααΑΑααα.",
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const criticalImages = [
      // Main backgrounds
      '/images/main-bg-1.jpg',
      '/images/main-bg-2.jpg',
      '/images/main-bg-3.jpg',
      '/images/mobile/main-bg-1.png',
      '/images/mobile/main-bg-2.png',
      '/images/mobile/main-bg-3.png',
      '/images/mobile/main-bg-4.png',
      '/images/mobile/main-bg-5.png',
      '/images/mobile/main-bg-6.png',
      '/images/mobile/main-bg-7.png',
      
      // Menu and UI elements
      '/images/menu-bg.jpg',
      '/images/mobile/menu-bg.png',
      '/images/blue-bandana-bg.jpg',
      '/images/mobile/blue-bandana-bg.png',
      '/images/footer-bg.png',
      '/images/mobile/footer-bg.png',

      // Home page t-shirt thumbnails
      '/images/tshirts/1/main.png',
      '/images/tshirts/1/main.jpg',
      '/images/tshirts/1/main.jpeg',
      '/images/tshirts/1/main.webp',
      '/images/tshirts/2/main.png',
      '/images/tshirts/2/main.jpg',
      '/images/tshirts/2/main.jpeg',
      '/images/tshirts/2/main.webp',
      '/images/tshirts/3/main.png',
      '/images/tshirts/3/main.jpg',
      '/images/tshirts/3/main.jpeg',
      '/images/tshirts/3/main.webp',
      '/images/tshirts/4/main.png',
      '/images/tshirts/4/main.jpg',
      '/images/tshirts/4/main.jpeg',
      '/images/tshirts/4/main.webp',
      '/images/tshirts/5/main.png',
      '/images/tshirts/5/main.jpg',
      '/images/tshirts/5/main.jpeg',
      '/images/tshirts/5/main.webp',
      '/images/tshirts/6/main.png',
      '/images/tshirts/6/main.jpg',
      '/images/tshirts/6/main.jpeg',
      '/images/tshirts/6/main.webp',
      '/images/tshirts/7/page-1.png',
      '/images/tshirts/8/page-1.png',
      '/images/tshirts/9/page-1.png',
      '/images/tshirts/10/page-1.png',
    ];

    const preloadImage = (src: string) => {
            return new Promise((resolve) => {
              const img = new Image();
              // Add a cache buster to the preloading too
              img.src = `${src}?v=${Date.now()}`;
              img.onload = resolve;
              img.onerror = resolve; // Don't block if an image fails
            });
          };

    const startTime = Date.now();
    const minLoadingTime = 2500; // Slightly increased for better feel

    Promise.all(criticalImages.map(preloadImage)).then(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full font-sans bg-black">
        <Preloader isLoading={isLoading} />
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/who-we-are"
            element={
              <InfoPage
                title="Ποιοι είμαστε | xrostao clothing"
                description="Μάθε ποιοι στον πούτσο είμαστε (aka η ομάδα του xrostao)."
                canonicalPath="/who-we-are"
                text={INFO_PAGES.who.text}
              />
            }
          />
          <Route
            path="/idea"
            element={
              <InfoPage
                title="Ιδέα | xrostao clothing"
                description="Η ιδέα πίσω από το xrostao clothing και το drop anergia season."
                canonicalPath="/idea"
                text={INFO_PAGES.idea.text}
              />
            }
          />
          <Route
            path="/how-it-works"
            element={
              <InfoPage
                title="Πώς λειτουργεί το αίτημα | xrostao clothing"
                description="Δες πώς λειτουργεί το αίτημα ενδιαφέροντος για τα t-shirts του xrostao."
                canonicalPath="/how-it-works"
                text={INFO_PAGES.how.text}
              />
            }
          />
          <Route
            path="/are-you-unemployed"
            element={
              <InfoPage
                title="Είσαι άνεργος; | xrostao clothing"
                description="Είσαι άνεργος/η; Μια απολύτως σοβαρή ερώτηση από το xrostao clothing."
                canonicalPath="/are-you-unemployed"
                text={INFO_PAGES.unemployed.text}
              />
            }
          />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/tshirt/:id" element={<TShirt />} />
        </Routes>
        <FooterLinks />
      </div>
    </BrowserRouter>
  );
}
