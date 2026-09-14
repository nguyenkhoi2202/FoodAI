import { ChefHat, Bookmark, Sparkles, Dices, Refrigerator, UtensilsCrossed, Salad } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  activeTab: 'wizard' | 'diet' | 'wheel' | 'fridge' | 'trio';
  setActiveTab: (tab: 'wizard' | 'diet' | 'wheel' | 'fridge' | 'trio') => void;
  onOpenFavorites: () => void;
}

export const Header = ({
  savedCount,
  activeTab,
  setActiveTab,
  onOpenFavorites,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('wizard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-heading">
                  Hôm Nay <span className="text-orange-600">Ăn Gì?</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                  AI Gemini Assistant
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Trợ lý ẩm thực gia đình · Chọn món ngon, vừa túi tiền &amp; không còn phân vân
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Saved recipes button */}
            <button
              onClick={onOpenFavorites}
              className="relative px-3.5 py-2 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/60 transition-all flex items-center gap-2 text-gray-700 text-sm font-semibold shadow-sm"
              title="Sổ tay món ngon đã lưu"
            >
              <Bookmark className="w-4 h-4 text-orange-500" />
              <span>Sổ Tay Món Ngon</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold ml-1">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 pb-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'wizard'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-300'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gợi Ý Theo Sở Thích</span>
          </button>

          {/* New Tab: Giảm Cân / Eat Clean */}
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'diet'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-300'
                : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-bold'
            }`}
          >
            <Salad className="w-4 h-4 text-emerald-500" />
            <span>Giảm Cân / Eat Clean 🥗</span>
          </button>

          <button
            onClick={() => setActiveTab('wheel')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'wheel'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-300'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Vòng Quay May Mắn</span>
          </button>

          <button
            onClick={() => setActiveTab('fridge')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'fridge'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-300'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            <span>Dọn Sạch Tủ Lạnh</span>
          </button>

          <button
            onClick={() => setActiveTab('trio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'trio'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-300'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Mâm Cơm 3 Món Chuẩn Việt</span>
          </button>
        </div>
      </div>
    </header>
  );
};
