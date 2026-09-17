import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Dices, CheckCircle2 } from 'lucide-react';
import { LUCKY_WHEEL_ITEMS } from '../data/sampleDishes';

interface LuckyWheelProps {
  onSelectDish: (dishName: string) => void;
  isLoading: boolean;
}

export const LuckyWheel: React.FC<LuckyWheelProps> = ({ onSelectDish, isLoading }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<(typeof LUCKY_WHEEL_ITEMS)[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const numSlices = LUCKY_WHEEL_ITEMS.length;
  const sliceAngle = 360 / numSlices;

  // Draw the wheel onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw slices
    LUCKY_WHEEL_ITEMS.forEach((item, index) => {
      const startAngle = (index * sliceAngle * Math.PI) / 180;
      const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (sliceAngle * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Quicksand, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${item.icon} ${item.name}`, radius - 20, 5);
      ctx.restore();
    });

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ea580c';
    ctx.stroke();

    // Draw center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ea580c';
    ctx.stroke();

    // Center icon
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍲', centerX, centerY);
  }, [sliceAngle]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedItem(null);

    // Pick random slice
    const randomIndex = Math.floor(Math.random() * numSlices);
    // Extra full spins (5 to 8 turns) + landing slice offset
    // Pointer is at the top (270 degrees in standard canvas coords, or 90 offset)
    const extraTurns = 360 * 6;
    // Calculate angle so that randomIndex aligns under the top pointer
    const sliceCenterAngle = randomIndex * sliceAngle + sliceAngle / 2;
    // Top pointer is at 270 deg (or -90 deg). We want rotation + sliceCenterAngle to stop at 270 deg mod 360.
    const targetAngle = extraTurns + (270 - sliceCenterAngle);

    const totalRotation = rotation + targetAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = LUCKY_WHEEL_ITEMS[randomIndex];
      setSelectedItem(chosen);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f97316', '#eab308', '#10b981', '#3b82f6'],
      });
    }, 4000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-6 sm:p-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
          <Dices className="w-3.5 h-3.5" />
          <span>Cứu Tinh Khi Quá Lười Nghĩ</span>
          <span className="text-orange-400">·</span>
          <span>© 2026 Copyright Trần Nguyên Khôi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">
          Vòng Quay Định Mệnh: Hôm Nay Ăn Gì?
        </h2>
        <p className="text-sm text-gray-500">
          Nếu bạn và gia đình/người yêu đang tranh cãi mãi không biết ăn gì, hãy để vòng quay may mắn quyết định giùm bạn!
        </p>
      </div>

      {/* Wheel Area */}
      <div className="flex flex-col items-center justify-center relative py-4">
        {/* Top Pointer Indicator */}
        <div className="z-20 -mb-5 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-600 drop-shadow-md animate-bounce"></div>
        </div>

        {/* The rotating Canvas */}
        <div className="relative p-2 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>

        {/* Spin Action Button */}
        <div className="mt-8">
          <button
            onClick={handleSpin}
            disabled={isSpinning || isLoading}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-orange-300 hover:shadow-orange-400 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Đang Quay May Mắn...' : 'Quay Ngay Không Cần Nghĩ!'}</span>
          </button>
        </div>
      </div>

      {/* Winning Announcement Card */}
      {selectedItem && (
        <div className="max-w-lg mx-auto p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              🎉 Định mệnh đã chọn món hôm nay:
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 font-heading">
              {selectedItem.icon} {selectedItem.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedItem.category}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectDish(selectedItem.name)}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-300 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI Đang Soạn Công Thức &amp; Nguyên Liệu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Lên Ngay Công Thức &amp; Danh Sách Đi Chợ Cho Món Này</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
