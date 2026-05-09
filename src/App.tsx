import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import InfoPage from './pages/InfoPage';
import TShirt from './pages/TShirt';
import Product from './pages/Product';
import Menu from './components/Menu';
import FooterLinks from './components/FooterLinks';
import Preloader from './components/Preloader';
import { AuthProvider } from './contexts/AuthContext';

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
    const loadAssets = async () => {
      const allImages = [
        // Main Backgrounds
        '/images/main-bg.png',
        '/images/tshirt-bg.png',
        
        // Mobile Backgrounds
        '/images/mobile/main-bg-1.png',
        '/images/mobile/main-bg-2.png',
        '/images/mobile/main-bg-3.png',
        '/images/mobile/main-bg-4.png',
        '/images/mobile/main-bg-5.png',
        '/images/mobile/main-bg-6.png',
        '/images/mobile/main-bg-7.png',
        
        // UI & Common
        '/images/mobile/footer-bg.png',
        '/images/mobile/tshirt-bg-1.png',
        '/images/mobile/tshirt-bg-mid-2.png',
        '/images/mobile/tshirt-bg-mid-3.png',
        '/images/mobile/tshirt-bg-mid-4.png',
        '/images/mobile/tshirt-bg-last.png',

        // T-shirts
        ...Array.from({ length: 10 }, (_, i) => [
          `/images/tshirts/${i + 1}/main.png`,
          `/images/tshirts/${i + 1}/main.jpg`,
          `/images/tshirts/${i + 1}/main.jpeg`,
          `/images/tshirts/${i + 1}/main.webp`,
        ]).flat()
      ];

      // Use a Set to remove duplicates
      const uniqueImages = [...new Set(allImages)];

      const promises = uniqueImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      });

      // Wait for ALL images to be in browser cache
      await Promise.all(promises);
      
      // Minimum safety delay for transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    loadAssets();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen w-full font-sans bg-black">
          <Preloader isLoading={isLoading} />
          <Menu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:slug" element={<Product />} />
            <Route path="/tshirt/:id" element={<TShirt />} />
          </Routes>
          <div className="md:hidden">
            <FooterLinks />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
