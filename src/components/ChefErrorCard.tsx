import { ChefHat, RotateCcw, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ChefErrorCardProps {
  errorMessage: string;
  onRetry: () => void;
  onLoadSample?: () => void;
}

export const ChefErrorCard = ({
  errorMessage,
  onRetry,
  onLoadSample,
}: ChefErrorCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Check if error is 503 high demand or quota
  const isHighDemand = errorMessage.toLowerCase().includes('high demand') || errorMessage.includes('503');
  const isQuota = errorMessage.toLowerCase().includes('quota') || errorMessage.includes('429');

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/60 border-2 border-amber-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-black/10">
            <ChefHat className="w-9 h-9 stroke-[2.2] animate-bounce" style={{ animationDuration: '2s' }} />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-xs font-bold text-amber-100">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Gian Bếp Đang Tạm Thời Quá Tải</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
              Bếp Trưởng AI Đang Bận Chưa Thể Chọn Món Cho Bạn!
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              {isHighDemand
                ? 'Máy chủ Google AI đang có lượng người dùng truy cập quá lớn vào lúc này (High Demand). Bếp trưởng chưa thể hoàn thành công thức ngay tức thì.'
                : isQuota
                ? 'Hạn mức lượt hỏi trong phút của bạn tạm thời hết. Vui lòng nghỉ ngơi vài chục giây rồi bấm thử lại nhé!'
                : 'Đã có gián đoạn kết nối tạm thời trong lúc gửi yêu cầu đến Bếp trưởng AI. Rất xin lỗi bạn vì sự bất tiện này!'}
            </p>
          </div>
        </div>
      </div>

      {/* Body Actions & Details */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bếp Trưởng Thử Lại Ngay!</span>
          </button>

          {onLoadSample && (
            <button
              type="button"
              onClick={onLoadSample}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Xem Món Mẫu Tuyển Chọn Ngay</span>
            </button>
          )}
        </div>

        {/* Technical Error Accordion */}
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>{showDetails ? 'Ẩn thông tin lỗi kỹ thuật' : 'Xem chi tiết lỗi từ Google API'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left font-mono text-[11px] text-gray-600 break-all">
              <span className="font-bold text-rose-600 block mb-1">Mã lỗi phản hồi:</span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
