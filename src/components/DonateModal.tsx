import { useState, useEffect } from 'react';
import {
  Heart,
  Coffee,
  Copy,
  Check,
  X,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDecline: () => void;
}

const BANK_INFO = {
  bankName: 'Techcombank',
  bankFullName: 'Ngân hàng TMCP Kỹ thương Việt Nam',
  acqId: '970407', // BIN Techcombank
  accountNo: '5457397979',
  accountName: 'TRAN NGUYEN KHOI',
  defaultContent: 'Donate Hom Nay An Gi',
};

const DONATE_PRESETS = [
  { label: 'Tùy tâm', amount: '' },
  { label: '10.000đ', amount: '10000' },
  { label: '20.000đ ☕', amount: '20000' },
  { label: '50.000đ 🍜', amount: '50000' },
  { label: '100.000đ 🍲', amount: '100000' },
];

export const DonateModal = ({
  isOpen,
  onClose,
  onConfirm,
  onDecline,
}: DonateModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<string>('20000');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Fetch VietQR code via POST https://api.vietqr.io/v2/generate
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const generateVietQr = async () => {
      setIsLoadingQr(true);

      const clientId = import.meta.env.VITE_VIETQR_CLIENT_ID || '';
      const apiKey = import.meta.env.VITE_VIETQR_API_KEY || '';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (clientId) headers['x-client-id'] = clientId;
      if (apiKey) headers['x-api-key'] = apiKey;

      const bodyData: Record<string, string> = {
        accountNo: BANK_INFO.accountNo,
        accountName: BANK_INFO.accountName,
        acqId: BANK_INFO.acqId,
        addInfo: BANK_INFO.defaultContent,
        template: 'compact',
      };

      if (selectedAmount && selectedAmount !== '0') {
        bodyData.amount = selectedAmount;
      }

      try {
        const response = await fetch('https://api.vietqr.io/v2/generate', {
          method: 'POST',
          headers,
          body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        if (data && data.code === '00' && data.data?.qrDataURL) {
          if (isMounted) {
            setQrImageUrl(data.data.qrDataURL);
          }
        } else {
          // Fallback direct image URL
          const fallbackUrl = `https://img.vietqr.io/image/${BANK_INFO.acqId}-${BANK_INFO.accountNo}-compact.png?accountName=${encodeURIComponent(
            BANK_INFO.accountName
          )}&addInfo=${encodeURIComponent(BANK_INFO.defaultContent)}${
            selectedAmount ? `&amount=${selectedAmount}` : ''
          }`;
          if (isMounted) {
            setQrImageUrl(fallbackUrl);
          }
        }
      } catch (err) {
        console.warn('VietQR API call failed, using fallback img url:', err);
        const fallbackUrl = `https://img.vietqr.io/image/${BANK_INFO.acqId}-${BANK_INFO.accountNo}-compact.png?accountName=${encodeURIComponent(
          BANK_INFO.accountName
        )}&addInfo=${encodeURIComponent(BANK_INFO.defaultContent)}${
          selectedAmount ? `&amount=${selectedAmount}` : ''
        }`;
        if (isMounted) {
          setQrImageUrl(fallbackUrl);
        }
      } finally {
        if (isMounted) {
          setIsLoadingQr(false);
        }
      }
    };

    generateVietQr();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedAmount]);

  if (!isOpen) return null;

  const handleCopyAccountNo = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.accountNo);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden animate-scale-up">
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Coffee className="w-6 h-6 text-amber-100 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-amber-100 mb-1">
                <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                <span>Ủng Hộ Dự Án</span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                © 2026 Copyright Trần Nguyên Khôi
              </h3>
            </div>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-orange-50 leading-relaxed">
            Ứng dụng <strong>Hôm Nay Ăn Gì?</strong> hoàn toàn miễn phí. Để ủng hộ chi phí duy trì API AI và máy chủ, bạn có thể gửi tặng tác giả 1 ly cà phê nhỏ nhé!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Amount Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">
              Chọn mức ủng hộ nhanh (tuỳ tâm):
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {DONATE_PRESETS.map((preset) => (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => setSelectedAmount(preset.amount)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center border ${
                    selectedAmount === preset.amount
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-orange-50/50 text-gray-700 border-orange-100 hover:bg-orange-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code & Banking Info */}
          <div className="bg-gradient-to-b from-amber-50/60 to-orange-50/40 p-4 rounded-2xl border border-orange-100 flex flex-col sm:flex-row items-center gap-5">
            {/* QR Code Canvas */}
            <div className="relative w-44 h-44 bg-white rounded-2xl p-2 shadow-md border border-orange-200 flex-shrink-0 flex items-center justify-center">
              {isLoadingQr ? (
                <div className="flex flex-col items-center gap-2 text-orange-600">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[11px] font-semibold text-gray-500">
                    Đang tạo mã QR...
                  </span>
                </div>
              ) : qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="VietQR Techcombank Trần Nguyên Khôi"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-2 text-gray-400">
                  <QrCode className="w-10 h-10 mx-auto text-gray-300" />
                  <span className="text-[10px]">Chưa tải được mã QR</span>
                </div>
              )}
            </div>

            {/* Bank Details */}
            <div className="flex-1 space-y-2.5 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Ngân hàng:</span>
                <span className="text-xs font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                  {BANK_INFO.bankName}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-medium block">Số tài khoản:</span>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-orange-200 mt-0.5 shadow-xs">
                  <span className="font-mono font-extrabold text-base text-gray-900 tracking-wide">
                    {BANK_INFO.accountNo}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccountNo}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-orange-700" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
                <span className="font-bold text-gray-900 font-heading">
                  {BANK_INFO.accountName}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Nội dung CK:</span>
                <span className="font-mono font-semibold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded text-[11px]">
                  {BANK_INFO.defaultContent}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 text-center italic">
            *Bạn có thể quét mã trên bất kỳ app ngân hàng hoặc ví điện tử (MoMo, ZaloPay, Viettel Money...)
          </div>

          {/* Action Choice Buttons: Decline or Confirm */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onDecline}
              className="w-full sm:w-1/2 py-3 px-4 rounded-2xl border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-all text-center"
            >
              Để lần sau (Từ chối)
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>OK, Xem Gợi Ý Món!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
