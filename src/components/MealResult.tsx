import { useState } from 'react';
import {
  Clock,
  Coins,
  Users,
  ChefHat,
  Copy,
  Check,
  RotateCw,
  Lightbulb,
  Heart,
  Flame,
  Scale,
} from 'lucide-react';
import type { SuggestedDish } from '../types/meal';

interface MealResultProps {
  dish: SuggestedDish;
  isSaved: boolean;
  onToggleSave: () => void;
  onReroll: () => void;
  isLoading: boolean;
}

export const MealResult: React.FC<MealResultProps> = ({
  dish,
  isSaved,
  onToggleSave,
  onReroll,
  isLoading,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleCopyShoppingList = () => {
    const lines = [
      `🛒 DANH SÁCH ĐI CHỢ: ${dish.name}`,
      `👥 Khẩu phần: ${dish.peopleCount} người | 💰 Dự tính: ${dish.estimatedTotalCost}`,
      '--------------------------------',
      ...dish.ingredients.map(
        (item, idx) => `${idx + 1}. ${item.name} (${item.amount}) ~ ${item.estimatedPrice}`
      ),
      '--------------------------------',
      `💡 Gợi ý bởi: Hôm Nay Ăn Gì? - AI Gemini Assistant`,
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-6 sm:p-8 text-white relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-orange-100">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Đầu Bếp AI Đề Xuất Cho Bạn</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
              {dish.name}
            </h2>
            <p className="text-orange-100 text-sm sm:text-base italic">"{dish.tagline}"</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSave}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 text-sm font-bold shadow-md ${
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={isSaved ? 'Đã lưu vào sổ tay' : 'Lưu món này'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã Lưu' : 'Lưu Món'}</span>
            </button>

            <button
              onClick={onReroll}
              disabled={isLoading}
              className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50"
              title="Đổi gợi ý khác"
            >
              <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Đổi Món Khác</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-200 text-xs font-medium mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Khẩu Phần</span>
            </div>
            <p className="font-extrabold text-base sm:text-lg">{dish.peopleCount} người ăn</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-200 text-xs font-medium mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời Gian Nấu</span>
            </div>
            <p className="font-extrabold text-base sm:text-lg">{dish.estimatedCookingTime}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-200 text-xs font-medium mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Dự Tính Chi Phí</span>
            </div>
            <p className="font-extrabold text-base sm:text-lg">{dish.estimatedTotalCost}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-200 text-xs font-medium mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Độ Khó / Calo</span>
            </div>
            <p className="font-extrabold text-base sm:text-lg">
              {dish.difficulty} · {dish.nutritionOverview?.caloriesApprox || 'Vừa đủ'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Why this dish? */}
        {dish.whyThisDish && (
          <div className="p-4 sm:p-5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3.5">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">Tại sao AI chọn món này cho bạn?</h4>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">{dish.whyThisDish}</p>
            </div>
          </div>
        )}

        {/* Nutrition Highlights */}
        {dish.nutritionOverview?.highlights && dish.nutritionOverview.highlights.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1 text-orange-600">
              <Scale className="w-3.5 h-3.5" />
              <span>Đặc điểm dinh dưỡng:</span>
            </span>
            {dish.nutritionOverview.highlights.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Macro Nutrients Breakdown Card (For Diet & Healthy Meals) */}
        {(dish.nutritionOverview?.protein || dish.nutritionOverview?.carbs) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Bảng Chỉ Số Macro &amp; Calo Kiểm Soát Cân Nặng:</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Chuẩn Thâm Hụt Calo
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center shadow-xs">
                <span className="text-[11px] text-gray-500 font-medium block">Năng Lượng</span>
                <span className="font-extrabold text-sm sm:text-base text-emerald-700 font-mono">
                  {dish.nutritionOverview.caloriesApprox}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center shadow-xs">
                <span className="text-[11px] text-gray-500 font-medium block">Đạm (Protein)</span>
                <span className="font-extrabold text-sm sm:text-base text-blue-600 font-mono">
                  {dish.nutritionOverview.protein || '35g'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center shadow-xs">
                <span className="text-[11px] text-gray-500 font-medium block">Tinh Bột Tốt (Carbs)</span>
                <span className="font-extrabold text-sm sm:text-base text-amber-600 font-mono">
                  {dish.nutritionOverview.carbs || '35g'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center shadow-xs">
                <span className="text-[11px] text-gray-500 font-medium block">Chất Béo Tốt (Fat)</span>
                <span className="font-extrabold text-sm sm:text-base text-rose-600 font-mono">
                  {dish.nutritionOverview.fat || '9g'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grid 2 Cols: Ingredients & Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Shopping List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-heading">
                  Nguyên Liệu Đi Chợ
                </h3>
                <p className="text-xs text-gray-500">Định lượng vừa đủ cho {dish.peopleCount} người</p>
              </div>
              <button
                onClick={handleCopyShoppingList}
                className="px-3 py-1.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="Sao chép để gửi Zalo hoặc ghi chú"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Chép gửi Zalo</span>
                  </>
                )}
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              {dish.ingredients.map((item, idx) => {
                const isChecked = checkedIngredients[item.name] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(item.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-gray-50 border-gray-200 opacity-60 line-through text-gray-400'
                        : 'bg-white border-orange-100 hover:border-orange-300 hover:bg-orange-50/20 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">{item.name}</p>
                        <p className="text-[11px] text-gray-500">{item.amount}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                      {item.estimatedPrice}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Side dishes */}
            {dish.sideDishes && dish.sideDishes.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-700 mb-2">Ăn kèm chuẩn bài:</p>
                <div className="flex flex-wrap gap-1.5">
                  {dish.sideDishes.map((side, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-orange-100/70 text-orange-900 text-xs font-medium"
                    >
                      + {side}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Step-by-Step Cooking Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-heading">
                Các Bước Chế Biến Chi Tiết
              </h3>
              <p className="text-xs text-gray-500">Hướng dẫn nhanh gọn, ai cũng có thể nấu ngon</p>
            </div>

            <div className="space-y-4">
              {dish.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-orange-50/20 shadow-sm space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {step.stepNumber}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
                    </div>
                    {step.durationMinutes && (
                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{step.durationMinutes} phút</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-9">
                    {step.instruction}
                  </p>

                  {step.chefTip && (
                    <div className="ml-9 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <span className="font-bold text-amber-700">Mẹo nhỏ:</span>
                      <span>{step.chefTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chef's Advice */}
            {dish.chefAdvice && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-xs sm:text-sm text-orange-950 flex items-start gap-3">
                <ChefHat className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-orange-900">Lời khuyên của Bếp trưởng: </span>
                  <span>{dish.chefAdvice}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
