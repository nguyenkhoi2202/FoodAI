import { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Flame, Scale, Clock } from 'lucide-react';

interface ChefThinkingModalProps {
  isOpen: boolean;
}

const THINKING_STEPS = [
  {
    icon: '👨‍🍳',
    title: 'Bếp trưởng đang nghiên cứu thực đơn...',
    subtitle: 'Tham khảo kho tàng ẩm thực Việt Nam và phân tích sở thích của bạn.',
  },
  {
    icon: '⚖️',
    title: 'Đang cân đối dinh dưỡng & Calo...',
    subtitle: 'Tính toán định lượng thịt rau vừa vặn theo đúng số người ăn.',
  },
  {
    icon: '🛒',
    title: 'Đang khảo giá chợ dân sinh & siêu thị...',
    subtitle: 'Tối ưu danh sách nguyên liệu để vừa khít với túi tiền của bạn.',
  },
  {
    icon: '🍳',
    title: 'Đang canh chỉnh nhiệt độ & tỷ lệ gia vị...',
    subtitle: 'Pha chế công thức nước sốt, gia giảm mặn ngọt chua cay hài hòa.',
  },
  {
    icon: '✨',
    title: 'Mâm cơm thơm nức mũi sắp hoàn thành!',
    subtitle: 'Đang đóng gói công thức từng bước và checklist đi chợ gửi đến bạn.',
  },
];

export const ChefThinkingModal = ({ isOpen }: ChefThinkingModalProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setProgress(15);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 92 : prev + Math.floor(Math.random() * 8) + 4));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = THINKING_STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden border border-orange-200">
        {/* Animated Background Aura */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        {/* Floating culinary emojis */}
        <div className="absolute top-4 left-6 text-xl animate-bounce" style={{ animationDuration: '2.5s' }}>
          🥦
        </div>
        <div className="absolute top-8 right-6 text-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
          🥩
        </div>
        <div className="absolute bottom-6 left-8 text-xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.8s' }}>
          🍤
        </div>
        <div className="absolute bottom-8 right-8 text-xl animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1.2s' }}>
          🌶️
        </div>

        {/* Chef Mascot Avatar with glowing ring */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-orange-400/60 animate-spin" style={{ animationDuration: '10s' }}></div>

          {/* Pulsing colored glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 animate-pulse opacity-90 shadow-xl shadow-orange-300"></div>

          {/* Central Chef Icon */}
          <div className="relative z-10 text-white flex flex-col items-center justify-center">
            <ChefHat className="w-12 h-12 stroke-[2.2] animate-float drop-shadow-md" />
            <span className="text-xl -mt-2 drop-shadow-sm">{currentStep.icon}</span>
          </div>

          {/* Orbiting sparkles */}
          <div className="absolute -top-1 right-2 text-amber-300 animate-spin" style={{ animationDuration: '4s' }}>
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Dynamic Thinking Status */}
        <div className="space-y-2 mb-6 min-h-[75px] transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            <span>Chuyên Gia Ẩm Thực Đang Suy Nghĩ</span>
          </span>

          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 font-heading leading-snug">
            {currentStep.title}
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-500 animate-spin" />
              <span>Đang tính toán...</span>
            </span>
            <span className="font-bold text-orange-600">{progress}%</span>
          </div>
        </div>

        {/* Mini Badges Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cân bằng dinh dưỡng</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Chuẩn vị gia đình</span>
          </span>
        </div>
      </div>
    </div>
  );
};
