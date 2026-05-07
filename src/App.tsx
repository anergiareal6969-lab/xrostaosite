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
    const startTime = Date.now();
    
    // Minimum 3 seconds for the beautiful preloader
    const MIN_LOAD_TIME = 3000;

    const loadAssets = async () => {
      // Preload critical images only initially to speed up
      const criticalImages = [
        '/images/main-bg-1.jpg',
        '/images/mobile/main-bg-1.png',
        '/images/footer-bg.png'
      ];

      const promises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(promises);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
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
    </AuthProvider>
  );
}
