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
import { ChefErrorCard } from './components/ChefErrorCard';
import { DonateModal } from './components/DonateModal';
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
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [currentDish, setCurrentDish] = useState<SuggestedDish | null>(SAMPLE_DISHES[0]);
  const [apiError, setApiError] = useState<string | null>(null);
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

  const handleApiError = (error: unknown) => {
    console.error('API Error:', error);
    const msg = error instanceof Error ? error.message : 'Bếp trưởng AI đang bận rộn chưa thể chọn món cho bạn lúc này. Vui lòng thử lại!';
    setApiError(msg);
    setCurrentDish(null);
    scrollToResult();
  };

  // Core execution of Wizard meal suggestion
  const executeWizardSubmit = async (prefs: UserPreferences) => {
    setLastPreferences(prefs);
    setLastDietPreferences(null);
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await suggestMealFromGemini(prefs);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Wizard form submission (opens Donate popup first)
  const handleWizardSubmit = (prefs: UserPreferences) => {
    setPendingAction(() => () => executeWizardSubmit(prefs));
    setIsDonateOpen(true);
  };

  // Donate popup actions: User can accept or decline, both continue to meal decision
  const handleDonateConfirm = () => {
    setIsDonateOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleDonateDecline = () => {
    setIsDonateOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleDonateClose = () => {
    setIsDonateOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Handler for Diet / Weight loss form submission
  const handleDietSubmit = async (dietPrefs: DietPreferences) => {
    setLastDietPreferences(dietPrefs);
    setLastPreferences(null);
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await suggestMealForDiet(dietPrefs);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Reroll button
  const handleReroll = async () => {
    setApiError(null);
    if (lastDietPreferences) {
      handleDietSubmit(lastDietPreferences);
    } else if (lastPreferences) {
      executeWizardSubmit(lastPreferences);
    } else {
      executeWizardSubmit({
        mealTime: 'dinner',
        foodCategory: 'family_rice',
        peopleCount: 4,
        mainProtein: 'any',
        budgetRange: 'medium',
        cookingSpeed: 'normal_35m',
        regionalFlavor: 'all',
        weatherVibe: 'Đậm đà, đưa cơm',
        notes: '',
      });
    }
  };

  // Handler for Lucky Wheel dish selection
  const handleSelectWheelDish = async (dishName: string) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await suggestRecipeForSpecificDish(dishName, 4);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Fridge Chef submission
  const handleFridgeSubmit = async (ingredients: string[], peopleCount: number) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await suggestMealFromFridge(ingredients, peopleCount);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Trio Combos preset selection
  const handleTrioSelect = async (comboTitle: string) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await suggestRecipeForSpecificDish(comboTitle, 4);
      setCurrentDish(result);
      scrollToResult();
    } catch (error) {
      handleApiError(error);
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
        onOpenDonate={() => {
          setPendingAction(null);
          setIsDonateOpen(true);
        }}
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

        {/* Suggested Result Section or Error State */}
        <div ref={resultRef} className="pt-4 scroll-mt-24">
          {apiError && (
            <div className="space-y-4">
              <ChefErrorCard
                errorMessage={apiError}
                onRetry={handleReroll}
                onLoadSample={() => {
                  setCurrentDish(SAMPLE_DISHES[0]);
                  setApiError(null);
                  scrollToResult();
                }}
              />
            </div>
          )}

          {currentDish && !apiError && (
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

      {/* Clean User Footer with Author Signature */}
      <footer className="mt-auto border-t border-orange-100 bg-white/80 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-gray-800">
            <span>Hôm Nay Ăn Gì?</span>
            <span className="text-gray-300">·</span>
            <span className="text-orange-600 font-heading">Trợ Lý Ẩm Thực Thông Minh Gia Đình</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-extrabold border border-orange-200">
              © 2026 Copyright Trần Nguyên Khôi
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-xl mx-auto">
            Bản quyền © {new Date().getFullYear()} sáng tạo bởi <strong>Trần Nguyên Khôi</strong>. Giải cứu các gia đình và bạn trẻ khỏi câu hỏi nan giải "Trưa nay ăn gì? Tối nay nấu gì?".
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                setPendingAction(null);
                setIsDonateOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 text-xs font-bold border border-orange-200 transition-all shadow-xs cursor-pointer"
            >
              ☕ Mời tác giả Trần Nguyên Khôi 1 ly cà phê
            </button>
          </div>
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

      {/* Donate Modal for Author Tran Nguyen Khoi */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={handleDonateClose}
        onConfirm={handleDonateConfirm}
        onDecline={handleDonateDecline}
      />
    </div>
  );
}

export default App;
