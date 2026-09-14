import { useState } from 'react';
import {
  Sparkles,
  Users,
  Clock,
  Coins,
  Utensils,
  Flame,
  RotateCcw,
  Zap,
  Compass,
  Smile,
  Plus,
  Minus,
} from 'lucide-react';
import type {
  UserPreferences,
  MealTime,
  FoodCategory,
  MainProtein,
  BudgetRange,
  CookingSpeed,
  RegionalFlavor,
} from '../types/meal';

interface WizardFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

export const WizardForm = ({ onSubmit, isLoading }: WizardFormProps) => {
  const [mealTime, setMealTime] = useState<MealTime>('lunch');
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('family_rice');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [mainProtein, setMainProtein] = useState<MainProtein>('any');
  const [budgetRange, setBudgetRange] = useState<BudgetRange>('medium');
  const [cookingSpeed, setCookingSpeed] = useState<CookingSpeed>('normal_35m');
  const [regionalFlavor, setRegionalFlavor] = useState<RegionalFlavor>('all');
  const [weatherVibe, setWeatherVibe] = useState<string>('Đậm đà đưa cơm');
  const [notes, setNotes] = useState<string>('');

  // 1-Click Presets
  const applyPreset = (preset: 'fast' | 'student' | 'family') => {
    if (preset === 'fast') {
      setMealTime('dinner');
      setFoodCategory('quick_single');
      setPeopleCount(2);
      setMainProtein('any');
      setBudgetRange('medium');
      setCookingSpeed('fast_20m');
      setRegionalFlavor('all');
      setWeatherVibe('Nấu siêu tốc, ít rửa chén');
      setNotes('');
    } else if (preset === 'student') {
      setMealTime('lunch');
      setFoodCategory('family_rice');
      setPeopleCount(1);
      setMainProtein('egg_tofu');
      setBudgetRange('budget');
      setCookingSpeed('fast_20m');
      setRegionalFlavor('all');
      setWeatherVibe('Tiết kiệm dưới 50k');
      setNotes('Dễ nấu với nồi cơm điện hoặc chảo');
    } else if (preset === 'family') {
      setMealTime('dinner');
      setFoodCategory('family_rice');
      setPeopleCount(4);
      setMainProtein('pork');
      setBudgetRange('medium');
      setCookingSpeed('normal_35m');
      setRegionalFlavor('all');
      setWeatherVibe('Mâm cơm 3 món chuẩn Việt');
      setNotes('Có cả trẻ nhỏ và người lớn ăn');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mealTime,
      foodCategory,
      peopleCount,
      mainProtein,
      budgetRange,
      cookingSpeed,
      regionalFlavor,
      weatherVibe,
      notes,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 overflow-hidden">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Đưa Ra Quyết Định Thông Minh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Hôm Nay Ăn Gì? Hãy Để AI Quyết Định Giúp Bạn
          </h2>
          <p className="text-xs sm:text-sm text-orange-100">
            5 câu hỏi thực tế giúp Gemini nắm bắt ngay bạn đang thèm gì, nấu cho ai và chi phí bao nhiêu!
          </p>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="mt-6 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-orange-200 font-semibold">Gợi ý nhanh:</span>
          <button
            type="button"
            onClick={() => applyPreset('fast')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Đi Làm Về Mệt (Nấu &lt; 20p)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('student')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-300" />
            <span>Sinh Viên Tiết Kiệm (&lt; 50k)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('family')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-orange-200" />
            <span>Cơm Gia Đình 4 Người Ấm Cúng</span>
          </button>
        </div>
      </div>

      {/* Main Questions Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* =========================================================================
            CÂU 1: THỂ LOẠI MÓN MUỐN ĂN
        ========================================================================== */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Utensils className="w-4 h-4 text-orange-500" />
            <span>1. Hôm nay bạn muốn ăn kiểu món gì?</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {[
              {
                id: 'family_rice',
                icon: '🍚',
                title: 'Mâm Cơm Gia Đình',
                desc: '1 Mặn + 1 Canh + 1 Xào đưa cơm',
              },
              {
                id: 'noodle_soup',
                icon: '🍜',
                title: 'Đổi Vị Món Nước',
                desc: 'Bún, Phở, Mì, Bánh canh, Miến...',
              },
              {
                id: 'quick_single',
                icon: '⚡',
                title: '1 Món Nhanh Gọn',
                desc: 'Cơm chiên, mì xào, ít rửa bát (< 20p)',
              },
              {
                id: 'healthy_clean',
                icon: '🥗',
                title: 'Healthy / Eat Clean',
                desc: 'Luộc, hấp, ít dầu mỡ, nhiều rau',
              },
              {
                id: 'party_gathering',
                icon: '🥘',
                title: 'Lẩu / Nướng / Cuốn',
                desc: 'Cuối tuần lai rai quây quần',
              },
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setFoodCategory(cat.id as FoodCategory)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  foodCategory === cat.id
                    ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-sm ring-1 ring-orange-500'
                    : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 text-gray-700'
                }`}
              >
                <div>
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <span className="font-bold text-xs sm:text-sm block">{cat.title}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CÂU 2: KHẨU PHẦN & KHUNG GIỜ ĂN
        ========================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Khung giờ */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>2. Khung giờ chuẩn bị:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lunch', label: 'Bữa Trưa', icon: '🍲' },
                { id: 'dinner', label: 'Bữa Tối', icon: '🌙' },
                { id: 'breakfast', label: 'Bữa Sáng', icon: '☕' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setMealTime(item.id as MealTime)}
                  className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                    mealTime === item.id
                      ? 'border-orange-500 bg-orange-500 text-white font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Số người ăn */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm font-bold text-gray-900">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Số người ăn hôm nay:</span>
              </span>
              <span className="px-3 py-0.5 bg-orange-100 text-orange-800 rounded-full font-extrabold text-sm">
                {peopleCount} người
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 flex gap-1.5">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setPeopleCount(num)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      peopleCount === num
                        ? 'border-orange-500 bg-orange-100 text-orange-800 font-extrabold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {num === 1 ? '1 mình' : `${num} ng`}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.min(15, p + 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CÂU 3: NGUYÊN LIỆU ĐẠM CHỦ ĐẠO
        ========================================================================== */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="flex items-center justify-between text-sm font-bold text-gray-900">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>3. Hôm nay bạn thích ăn loại thịt / đạm nào?</span>
            </span>
            <span className="text-xs text-gray-400 font-normal hidden sm:inline">
              Giúp Gemini không gợi ý lệch món bạn thèm
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'any', label: 'Tùy AI chọn', icon: '🎲', desc: 'Món gì ngon là được' },
              { id: 'pork', label: 'Thịt heo / Sườn', icon: '🍖', desc: 'Ba chỉ, sườn, nạc...' },
              { id: 'chicken', label: 'Thịt gà / Vịt', icon: '🍗', desc: 'Đùi gà, ức, kho sả...' },
              { id: 'beef', label: 'Thịt bò', icon: '🥩', desc: 'Bò xào, sốt vang...' },
              { id: 'seafood', label: 'Cá & Hải sản', icon: '🐟', desc: 'Cá kho, canh chua...' },
              { id: 'egg_tofu', label: 'Trứng & Đậu phụ', icon: '🍳', desc: 'Nhanh, tiết kiệm' },
            ].map((prot) => (
              <button
                type="button"
                key={prot.id}
                onClick={() => setMainProtein(prot.id as MainProtein)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  mainProtein === prot.id
                    ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold shadow-sm ring-1 ring-orange-500'
                    : 'border-gray-200 hover:border-orange-200 text-gray-700'
                }`}
              >
                <span className="text-xl">{prot.icon}</span>
                <span className="text-xs font-bold">{prot.label}</span>
                <span className="text-[10px] text-gray-400 line-clamp-1">{prot.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CÂU 4: NGÂN SÁCH & VÙNG MIỀN
        ========================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Mức ngân sách */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Coins className="w-4 h-4 text-orange-500" />
              <span>4. Mức chi phí dự kiến cho cả bữa:</span>
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'budget',
                  title: 'Tiết Kiệm Sinh Viên / Cuối Tháng',
                  price: '< 60.000đ',
                  desc: 'Món ăn giản dị, đậu phụ, trứng, rau luộc, thịt bằm',
                },
                {
                  id: 'medium',
                  title: 'Bình Dân Hợp Lý',
                  price: '80.000đ - 150.000đ',
                  desc: 'Chuẩn cơm gia đình, cân đối thịt thà và rau củ tươi',
                },
                {
                  id: 'premium',
                  title: 'Thịnh Soạn / Tươm Tất',
                  price: '180.000đ - 300.000đ+',
                  desc: 'Nhiều đạm tươi ngon, sườn non, bò, tôm mực loại 1',
                },
              ].map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBudgetRange(b.id as BudgetRange)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    budgetRange === b.id
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">{b.title}</span>
                    <span className="text-[11px] text-gray-500">{b.desc}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-lg flex-shrink-0 ml-2">
                    {b.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Vùng miền & Thời gian nấu */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Compass className="w-4 h-4 text-orange-500" />
                <span>Khẩu vị vùng miền:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Toàn Quốc (Dễ ăn)', icon: '🇻🇳' },
                  { id: 'north', label: 'Chuẩn Vị Bắc (Thanh tao)', icon: '🥢' },
                  { id: 'central', label: 'Vị Miền Trung (Đậm đà, cay)', icon: '🌶️' },
                  { id: 'south', label: 'Vị Miền Nam/Tây (Ngọt thanh)', icon: '🥥' },
                ].map((reg) => (
                  <button
                    type="button"
                    key={reg.id}
                    onClick={() => setRegionalFlavor(reg.id as RegionalFlavor)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                      regionalFlavor === reg.id
                        ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>{reg.icon}</span>
                    <span>{reg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Thời gian bạn có thể đứng bếp:</span>
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'fast_20m', label: 'Nhanh (< 20p)' },
                  { id: 'normal_35m', label: 'Vừa (30 - 40p)' },
                  { id: 'relaxed_50m', label: 'Rảnh rỗi (> 50p)' },
                ].map((spd) => (
                  <button
                    type="button"
                    key={spd.id}
                    onClick={() => setCookingSpeed(spd.id as CookingSpeed)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      cookingSpeed === spd.id
                        ? 'border-orange-500 bg-orange-600 text-white font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CÂU 5: THỜI TIẾT & CẢM GIÁC THÈM ĂN HÔM NAY
        ========================================================================== */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Smile className="w-4 h-4 text-orange-500" />
            <span>5. Thời tiết hoặc cảm giác vị giác hôm nay bạn muốn:</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              'Đậm đà đưa cơm',
              'Trời nóng thèm canh chua thanh mát',
              'Trời mưa lạnh thèm món kho tiêu',
              'Chua chua ngọt ngọt kích thích',
              'Thanh đạm ít dầu mỡ',
              'Cay nồng nực mũi',
            ].map((vibe) => (
              <button
                type="button"
                key={vibe}
                onClick={() => setWeatherVibe(vibe)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                  weatherVibe === vibe
                    ? 'bg-orange-600 text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú thêm nếu có: Tủ lạnh có sẵn trứng, nhà không ăn cay, không ăn hành lá..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Submit Action Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 text-center sm:text-left flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>AI sẽ tự động tính toán nguyên liệu và lên thực đơn hoàn hảo cho bạn.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => applyPreset('family')}
              className="px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Đặt lại form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt Lại</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-base shadow-lg shadow-orange-300 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI Đang Tính Toán Món Ngon...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>AI Quyết Định Giúp Tôi Ngay!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
