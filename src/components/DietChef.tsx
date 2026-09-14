import { useState } from 'react';
import {
  Salad,
  Sparkles,
  Flame,
  Scale,
  Dumbbell,
  Apple,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  Users,
} from 'lucide-react';
import type { DietPreferences } from '../types/meal';

interface DietChefProps {
  onGenerateDiet: (prefs: DietPreferences) => void;
  isLoading: boolean;
}

export const DietChef = ({ onGenerateDiet, isLoading }: DietChefProps) => {
  const [targetGoal, setTargetGoal] = useState<'deficit' | 'clean' | 'fitness' | 'keto'>('deficit');
  const [calorieTarget, setCalorieTarget] = useState<string>('380 - 450 kcal');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [carbSource, setCarbSource] = useState<string>('Gạo lứt');
  const [proteinChoice, setProteinChoice] = useState<string>('Ức gà phi lê');
  const [cookingMethod, setCookingMethod] = useState<string>('Áp chảo ít dầu / Nồi chiên không dầu');
  const [notes, setNotes] = useState<string>('');

  const applyPreset = (preset: 'gymer' | 'detox' | 'fast_burn') => {
    if (preset === 'gymer') {
      setTargetGoal('fitness');
      setCalorieTarget('500 - 600 kcal');
      setPeopleCount(1);
      setCarbSource('Khoai lang luộc / Gạo lứt');
      setProteinChoice('Ức gà hoặc Thịt bò nạc');
      setCookingMethod('Áp chảo với dầu oliu');
      setNotes('Ưu tiên > 40g Protein cho buổi tập');
    } else if (preset === 'detox') {
      setTargetGoal('clean');
      setCalorieTarget('380 - 450 kcal');
      setPeopleCount(1);
      setCarbSource('Yến mạch hoặc Khoai lang');
      setProteinChoice('Cá hồi hoặc Tôm tươi');
      setCookingMethod('Hấp giữ trọn vitamin');
      setNotes('Nhiều rau xanh, thanh lọc cơ thể');
    } else if (preset === 'fast_burn') {
      setTargetGoal('deficit');
      setCalorieTarget('Dưới 350 kcal');
      setPeopleCount(1);
      setCarbSource('Bún nưa (0 calo) hoặc Không tinh bột');
      setProteinChoice('Ức gà phi lê');
      setCookingMethod('Luộc hoặc Hấp');
      setNotes('Bữa tối giảm mỡ, tạo cảm giác no lâu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateDiet({
      targetGoal,
      calorieTarget,
      peopleCount,
      carbSource,
      proteinChoice,
      cookingMethod,
      notes,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100/40 border border-emerald-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <Salad className="w-3.5 h-3.5" />
            <span>Chuyên Mục Ăn Kiêng &amp; Giảm Cân Khoa Học</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Thực Đơn Giảm Cân &amp; Eat Clean Chuẩn Vị Việt
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            Ăn ngon miệng, đủ đạm, không nhịn đói! AI tính toán chi tiết Calo, Protein, Carbs, Fat để bạn kiểm soát vóc dáng hoàn hảo.
          </p>
        </div>

        {/* 1-Click Quick Presets for Diet */}
        <div className="mt-6 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-emerald-200 font-semibold">Thực đơn mẫu:</span>
          <button
            type="button"
            onClick={() => applyPreset('fast_burn')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Đốt Mỡ Tối Đa (&lt; 350 kcal)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('gymer')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Dumbbell className="w-3.5 h-3.5 text-cyan-300" />
            <span>Gymer Tăng Cơ (&gt; 40g Protein)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('detox')}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Apple className="w-3.5 h-3.5 text-emerald-300" />
            <span>Eat Clean Thanh Lọc Nhẹ Bụng</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* 1. MỤC TIÊU VÓC DÁNG */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>1. Mục tiêu vóc dáng của bạn hôm nay:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'deficit',
                icon: '📉',
                title: 'Thâm Hụt Calo Giảm Mỡ',
                desc: 'Khống chế calo, tạo cảm giác no lâu, không lo tích mỡ thừa',
                badge: 'Phổ biến nhất',
              },
              {
                id: 'clean',
                icon: '🥑',
                title: 'Eat Clean Chuẩn Việt',
                desc: 'Thực phẩm nguyên bản tự nhiên, ít gia vị hóa học, thải độc',
                badge: 'Lành mạnh',
              },
              {
                id: 'fitness',
                icon: '💪',
                title: 'Tăng Cơ Giảm Mỡ (Gymer)',
                desc: 'Hàm lượng Protein cực cao > 35g - 45g phục hồi cơ bắp săn chắc',
                badge: 'Giàu đạm',
              },
              {
                id: 'keto',
                icon: '🥩',
                title: 'Low-Carb / KETO',
                desc: 'Cắt giảm tối đa tinh bột, sử dụng đạm sạch và chất béo tốt',
                badge: 'Ít tinh bột',
              },
            ].map((goal) => (
              <button
                type="button"
                key={goal.id}
                onClick={() => setTargetGoal(goal.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  targetGoal === goal.id
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                    : 'border-gray-200 hover:border-emerald-200 text-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {goal.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">{goal.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{goal.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. CALO MỤC TIÊU & SỐ NGƯỜI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Calo */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>2. Mức Calo mục tiêu cho bữa ăn:</span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'Dưới 350 kcal', title: '< 350 kcal', desc: 'Đốt mỡ nhanh, nhẹ bụng cho bữa tối' },
                { id: '380 - 450 kcal', title: '380 - 450 kcal', desc: 'Mức chuẩn thâm hụt calo lý tưởng cho bữa trưa/tối' },
                { id: '500 - 600 kcal', title: '500 - 600 kcal', desc: 'Phù hợp người vận động nhiều, tập gym, chạy bộ' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCalorieTarget(c.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    calorieTarget === c.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold">{c.title}</span>
                  <span className="text-[11px] text-gray-500">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Số người ăn */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm font-bold text-gray-900">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Khẩu phần nấu cho:</span>
              </span>
              <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-extrabold text-sm">
                {peopleCount} người
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                className="w-12 h-12 rounded-2xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex-1 text-center py-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 font-extrabold text-emerald-900 text-base">
                {peopleCount === 1 ? '1 người (Ăn kiêng cá nhân)' : `${peopleCount} người (Gia đình cùng ăn)`}
              </div>

              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.min(8, p + 1))}
                className="w-12 h-12 rounded-2xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. NGUỒN ĐẠM NẠC & TINH BỘT TỐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Nguồn đạm */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>3. Nguồn đạm nạc ưu tiên:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Ức gà phi lê', icon: '🍗' },
                { name: 'Thịt bò nạc / Bắp bò', icon: '🥩' },
                { name: 'Tôm tươi / Hải sản', icon: '🍤' },
                { name: 'Cá hồi / Cá nạc', icon: '🐟' },
                { name: 'Trứng gà lòng đào', icon: '🥚' },
                { name: 'Đậu hũ non', icon: '🧈' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setProteinChoice(item.name)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    proteinChoice === item.name
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tinh bột tốt */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Apple className="w-4 h-4 text-emerald-600" />
              <span>4. Tinh bột hấp thụ chậm (Carb tốt):</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Gạo lứt', icon: '🍚' },
                { name: 'Khoai lang luộc', icon: '🍠' },
                { name: 'Yến mạch', icon: '🥣' },
                { name: 'Bún nưa (0 calo)', icon: '🍜' },
                { name: 'Bắp ngọt luộc', icon: '🌽' },
                { name: 'Không tinh bột (Zero Carb)', icon: '🚫' },
              ].map((carb) => (
                <button
                  type="button"
                  key={carb.name}
                  onClick={() => setCarbSource(carb.name)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    carbSource === carb.name
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{carb.icon}</span>
                  <span>{carb.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. CÁCH CHẾ BIẾN & GHI CHÚ */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>5. Cách chế biến ít dầu mỡ ưu tiên:</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              'Áp chảo ít dầu / Nồi chiên không dầu',
              'Luộc / Hấp thanh đạm',
              'Salad trộn sốt mè rang',
              'Canh thanh mát ít muối',
            ].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setCookingMethod(m)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                  cookingMethod === m
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú thêm: Không ăn cay, dị ứng hải sản, thích ăn nhiều rau súp lơ..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 text-center sm:text-left flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>AI sẽ tự động tính toán Calories, Protein, Carbs, Fat và các bước nấu chuẩn vị.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => applyPreset('fast_burn')}
              className="px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Đặt lại form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt Lại</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI Đang Tính Calo &amp; Lên Thực Đơn...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>AI Lên Thực Đơn Giảm Cân Ngay!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
