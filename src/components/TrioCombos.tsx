import { UtensilsCrossed, Clock, Coins, Sparkles, ChevronRight } from 'lucide-react';
import { TRIO_MENU_PRESETS } from '../data/sampleDishes';

interface TrioCombosProps {
  onSelectCombo: (comboTitle: string) => void;
  isLoading: boolean;
}

export const TrioCombos: React.FC<TrioCombosProps> = ({ onSelectCombo, isLoading }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Văn Hóa Ẩm Thực Cơm Nhà</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">
          Mâm Cơm 3 Món Chuẩn Vị Việt
        </h2>
        <p className="text-sm text-gray-500">
          Quy tắc vàng của mâm cơm Việt: <strong>1 Món Mặn</strong> đậm đà đưa cơm +{' '}
          <strong>1 Món Canh</strong> thanh mát ngọt nước + <strong>1 Món Xào/Rau</strong> giòn rụm!
        </p>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TRIO_MENU_PRESETS.map((preset, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/30 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 bg-orange-100/80 px-2.5 py-1 rounded-lg">
                  Combo #{idx + 1}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {preset.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-orange-500" />
                    {preset.budget}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 font-heading group-hover:text-orange-600 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-gray-500 italic mt-0.5">{preset.tagline}</p>
              </div>

              {/* Trio 3 items list */}
              <div className="space-y-2 pt-1">
                {preset.items.map((dishItem, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-2.5 rounded-xl bg-white border border-gray-100 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-2xl shadow-orange-50/20"
                  >
                    <span className="w-5 h-5 rounded-lg bg-orange-100 text-orange-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {dIdx === 0 ? 'Mặn' : dIdx === 1 ? 'Canh' : 'Xào'}
                    </span>
                    <span className="flex-1 truncate">{dishItem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectCombo(preset.title + ': ' + preset.items.join(' + '))}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-orange-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Xem Công Thức &amp; Đi Chợ Combo Này</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
