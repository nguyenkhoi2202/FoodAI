import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { WizardForm } from './components/WizardForm';
import { DietChef } from './components/DietChef';
import { MealResult } from './components/MealResult';
import { LuckyWheel } from './components/LuckyWheel';
import { FridgeChef } from './components/FridgeChef';
import { TrioCombos } from './components/TrioCombos';
import { AdminPage } from './components/AdminPage';
import { FavoritesModal } from './components/FavoritesModal';
import { ChefThinkingModal } from './components/ChefThinkingModal';
import type {
  SuggestedDish,
  UserPreferences,
  DietPreferences,
  AppConfig,
  SavedDish,
} from './types/meal';
import {
  getStoredConfig,
  getSavedDishes,
  toggleSaveDish,
  isDishSaved,
} from './services/storage';
import {
  suggestMealFromGemini,
  suggestMealFromFridge,
  suggestRecipeForSpecificDish,
  suggestMealForDiet,
} from './services/gemini';
import { SAMPLE_DISHES } from './data/sampleDishes';

export function App() {
  // ROUTING: Separate Admin (/config) vs User (/)
  const [currentRoute, setCurrentRoute] = useState<'user' | 'admin'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/config' || path === '/admin' || hash === '#/config' ? 'admin' : 'user';
  });

  const [activeTab, setActiveTab] = useState<'wizard' | 'diet' | 'wheel' | 'fridge' | 'trio'>('wizard');
  const [config, setConfig] = useState<AppConfig>(getStoredConfig());
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [savedDishes, setSavedDishes] = useState<SavedDish[]>(getSavedDishes());

  const [currentDish, setCurrentDish] = useState<SuggestedDish | null>(SAMPLE_DISHES[0]);
  const [lastPreferences, setLastPreferences] = useState<UserPreferences | null>(null);
  const [lastDietPreferences, setLastDietPreferences] = useState<DietPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Synchronize route with browser URL
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/config' || path === '/admin' || hash === '#/config') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('user');
      }
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToUser = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('user');
  };

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handler for Wizard form submission
  const handleWizardSubmit = async (prefs: UserPreferences) => {
    setLastPreferences(prefs);
    setLastDietPreferences(null);
    setIsLoading(true);
    try {
      const result = await suggestMealFromGemini(prefs);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Diet / Weight loss form submission
  const handleDietSubmit = async (dietPrefs: DietPreferences) => {
    setLastDietPreferences(dietPrefs);
    setLastPreferences(null);
    setIsLoading(true);
    try {
      const result = await suggestMealForDiet(dietPrefs);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Reroll button
  const handleReroll = async () => {
    if (lastDietPreferences) {
      handleDietSubmit(lastDietPreferences);
    } else if (lastPreferences) {
      handleWizardSubmit(lastPreferences);
    } else {
      setIsLoading(true);
      try {
        const randomIndex = Math.floor(Math.random() * SAMPLE_DISHES.length);
        setCurrentDish(SAMPLE_DISHES[randomIndex]);
        scrollToResult();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handler for Lucky Wheel dish selection
  const handleSelectWheelDish = async (dishName: string) => {
    setIsLoading(true);
    try {
      const result = await suggestRecipeForSpecificDish(dishName, 4);
      setCurrentDish(result);
      scrollToResult();
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Fridge Chef submission
  const handleFridgeSubmit = async (ingredients: string[], peopleCount: number) => {
    setIsLoading(true);
    try {
      const result = await suggestMealFromFridge(ingredients, peopleCount);
      setCurrentDish(result);
      scrollToResult();
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Trio Combos preset selection
  const handleTrioSelect = async (comboTitle: string) => {
    setIsLoading(true);
    try {
      const result = await suggestRecipeForSpecificDish(comboTitle, 4);
      setCurrentDish(result);
      scrollToResult();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Favorites toggle
  const handleToggleSave = () => {
    if (!currentDish) return;
    toggleSaveDish(currentDish as SavedDish);
    setSavedDishes(getSavedDishes());
  };

  const handleRemoveFavorite = (dishId: string) => {
    const updated = savedDishes.filter((d) => d.id !== dishId);
    localStorage.setItem('hnag_saved_dishes', JSON.stringify(updated));
    setSavedDishes(updated);
  };

  const isCurrentSaved = currentDish ? isDishSaved(currentDish.id) || isDishSaved(currentDish.name) : false;

  // ==========================================
  // ROLE 1: ADMIN VIEW (/config)
  // ==========================================
  if (currentRoute === 'admin') {
    return (
      <AdminPage
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
        onNavigateToUser={navigateToUser}
      />
    );
  }

  // ==========================================
  // ROLE 2: USER VIEW (/)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-800 flex flex-col">
      {/* App Header (Purely user focused) */}
      <Header
        savedCount={savedDishes.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-10">
        {/* Tab View Contents */}
        <div>
          {activeTab === 'wizard' && (
            <WizardForm
              onSubmit={handleWizardSubmit}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'diet' && (
            <DietChef
              onGenerateDiet={handleDietSubmit}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'wheel' && (
            <LuckyWheel
              onSelectDish={handleSelectWheelDish}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'fridge' && (
            <FridgeChef
              onGenerate={handleFridgeSubmit}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'trio' && (
            <TrioCombos
              onSelectCombo={handleTrioSelect}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Suggested Result Section */}
        <div ref={resultRef} className="pt-4 scroll-mt-24">
          {currentDish && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 bg-orange-600 rounded-full"></div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 font-heading">
                    Món Ngon Đề Xuất Cho Bạn
                  </h3>
                </div>
                <span className="text-xs text-gray-500 italic">
                  Đã tính toán theo khẩu vị &amp; số người
                </span>
              </div>

              <MealResult
                dish={currentDish}
                isSaved={isCurrentSaved}
                onToggleSave={handleToggleSave}
                onReroll={handleReroll}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </main>

      {/* Clean User Footer */}
      <footer className="mt-auto border-t border-orange-100 bg-white/70 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
            <span>Hôm Nay Ăn Gì?</span>
            <span>·</span>
            <span className="text-orange-600">Trợ Lý Ẩm Thực Thông Minh Gia Đình</span>
          </p>
          <p className="text-xs text-gray-400">
            Giải cứu các gia đình và bạn trẻ khỏi câu hỏi nan giải "Trưa nay ăn gì? Tối nay nấu gì?".
          </p>
        </div>
      </footer>

      {/* User Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedDishes={savedDishes}
        onSelectDish={(dish) => {
          setCurrentDish(dish);
          scrollToResult();
        }}
        onRemoveDish={handleRemoveFavorite}
      />

      {/* Global Animated Chef Thinking Modal */}
      <ChefThinkingModal isOpen={isLoading} />
    </div>
  );
}

export default App;
