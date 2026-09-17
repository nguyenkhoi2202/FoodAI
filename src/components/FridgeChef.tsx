import { useState } from 'react';
import { Refrigerator, Plus, X, Sparkles, Users, Trash2 } from 'lucide-react';
import { FRIDGE_COMMON_ITEMS } from '../data/sampleDishes';

interface FridgeChefProps {
  onGenerate: (ingredients: string[], peopleCount: number) => void;
  isLoading: boolean;
}

export const FridgeChef: React.FC<FridgeChefProps> = ({ onGenerate, isLoading }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Trứng gà/vịt',
    'Cà chua',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [peopleCount, setPeopleCount] = useState<number>(2);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      setSelectedIngredients((prev) => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const removeIngredient = (name: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
  };

  const handleSubmit = () => {
    if (selectedIngredients.length === 0) return;
    onGenerate(selectedIngredients, peopleCount);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Refrigerator className="w-3.5 h-3.5" />
          <span>Dọn Tủ Lạnh Thông Minh - Zero Waste</span>
          <span className="text-emerald-500">·</span>
          <span>© 2026 Copyright Trần Nguyên Khôi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">
          Tủ Lạnh Còn Gì Nấu Nấy
        </h2>
        <p className="text-sm text-gray-500">
          Chỉ cần chọn hoặc gõ những thứ bạn đang có sẵn trong nhà. AI Gemini sẽ ghép thành món ăn ngon nhất mà không cần phải đi chợ!
        </p>
      </div>

      {/* People Count selector */}
      <div className="max-w-md mx-auto bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-600" />
          <span className="text-xs sm:text-sm font-bold text-gray-800">Khẩu phần nấu cho:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 4, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPeopleCount(num)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                peopleCount === num
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {num} người
            </button>
          ))}
        </div>
      </div>

      {/* Selected Items Box */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
          <span>Nguyên liệu bạn đã chọn ({selectedIngredients.length}):</span>
          {selectedIngredients.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa hết</span>
            </button>
          )}
        </div>

        <div className="min-h-[60px] p-3 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-wrap gap-2 items-center">
          {selectedIngredients.length === 0 ? (
            <p className="text-xs text-gray-400 italic mx-auto">
              Chưa chọn nguyên liệu nào. Nhấp vào các gợi ý bên dưới hoặc tự gõ vào nhé!
            </p>
          ) : (
            selectedIngredients.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-orange-900 font-semibold text-xs shadow-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(item)}
                  className="hover:text-rose-600 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Tự thêm nguyên liệu khác trong tủ lạnh (VD: cá hộp, nấm hương...)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </form>
      </div>

      {/* Suggested Common Ingredients to click */}
      <div className="max-w-2xl mx-auto space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Gợi ý các nguyên liệu thường có trong tủ lạnh gia đình:
        </label>
        <div className="flex flex-wrap gap-2">
          {FRIDGE_COMMON_ITEMS.map((item) => {
            const isSelected = selectedIngredients.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggleIngredient(item.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="max-w-md mx-auto pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedIngredients.length === 0 || isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI Đang Phối Món Tối Ưu Cho Bạn...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>AI Hãy Nấu Món Gì Với Đống Này Đi!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
