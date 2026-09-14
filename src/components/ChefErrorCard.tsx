import { ChefHat, RotateCcw, AlertTriangle, Sparkles, ChevronDown, ChevronUp, Zap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveStoredConfig } from '../services/storage';

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
  const isQuota = errorMessage.toLowerCase().includes('quota') || errorMessage.includes('429') || errorMessage.toLowerCase().includes('resource_exhausted');
  const is20Limit = errorMessage.includes('limit: 20') || errorMessage.includes('gemini-3.6-flash') || errorMessage.includes('free_tier_requests');

  // Extract retry seconds if present, e.g. "Please retry in 17.268857384s"
  const retryMatch = errorMessage.match(/retry in\s+([0-9]+(?:\.[0-9]+)?)\s*s/i);
  const initialSeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
  const [countdown, setCountdown] = useState<number | null>(initialSeconds);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSwitchToStableModel = () => {
    saveStoredConfig({ model: 'gemini-2.0-flash' });
    setCountdown(null);
    onRetry();
  };

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
                ? 'Hạn mức lượt gọi API tạm thời chạm ngưỡng giới hạn của gói miễn phí từ Google.'
                : 'Đã có gián đoạn kết nối tạm thời trong lúc gửi yêu cầu đến Bếp trưởng AI. Rất xin lỗi bạn vì sự bất tiện này!'}
            </p>
          </div>
        </div>
      </div>

      {/* Body Actions & Details */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Quota Limit 20 Warning Box */}
        {is20Limit && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Mô hình thử nghiệm bị Google giới hạn chỉ 20 câu hỏi/ngày</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Mô hình <code className="px-1.5 py-0.5 bg-amber-200/60 rounded font-semibold text-amber-900">gemini-3.6-flash</code> có quota rất thấp (20 lượt). Hãy chuyển sang <code className="px-1.5 py-0.5 bg-green-200/60 rounded font-semibold text-green-900">gemini-2.0-flash</code> để được <strong>1.500 lượt hỏi/ngày hoàn toàn miễn phí</strong>!
              </p>
            </div>
            <button
              type="button"
              onClick={handleSwitchToStableModel}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Đổi sang Gemini 2.0 Flash &amp; Thử lại</span>
            </button>
          </div>
        )}

        {/* Live Countdown Notice */}
        {countdown !== null && countdown > 0 && (
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold animate-pulse">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>Bếp trưởng đang hạ nhiệt API: có thể gửi lại sau <strong>{countdown} giây</strong>...</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            disabled={countdown !== null && countdown > 0}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              countdown !== null && countdown > 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-orange-300 active:scale-95'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${countdown !== null && countdown > 0 ? '' : 'animate-spin'}`} style={{ animationDuration: '3s' }} />
            <span>
              {countdown !== null && countdown > 0
                ? `Chờ thử lại (${countdown}s)`
                : 'Bếp Trưởng Thử Lại Ngay!'}
            </span>
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

