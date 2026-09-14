import { Bookmark, X, Trash2, ArrowRight, Clock, Users, Coins } from 'lucide-react';
import type { SavedDish, SuggestedDish } from '../types/meal';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDishes: SavedDish[];
  onSelectDish: (dish: SuggestedDish) => void;
  onRemoveDish: (dishIdOrName: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  savedDishes,
  onSelectDish,
  onRemoveDish,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-orange-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-heading">
                Sổ Tay Món Ngon Đã Lưu ({savedDishes.length})
              </h3>
              <p className="text-xs text-orange-100">Lưu trữ các công thức bạn yêu thích</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {savedDishes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-700">Chưa có món nào được lưu</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Khi AI gợi ý một món ăn bạn thích, hãy nhấn nút "Lưu Món" hình trái tim để xem lại bất cứ lúc nào!
              </p>
            </div>
          ) : (
            savedDishes.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-2xl border border-orange-100 hover:border-orange-300 hover:bg-orange-50/20 transition-all flex items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => {
                    onSelectDish(dish);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-orange-600 transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{dish.tagline}</p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-orange-500" />
                      {dish.peopleCount} người
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {dish.estimatedCookingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-orange-500" />
                      {dish.estimatedTotalCost}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectDish(dish);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors"
                    title="Xem chi tiết"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveDish(dish.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa món này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
