import { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { AppConfig } from '../types/meal';
import { saveStoredConfig, clearStoredConfig } from '../services/storage';
import { testGeminiApiKey } from '../services/gemini';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigUpdated: (newConfig: AppConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey || '');
  const [modelInput, setModelInput] = useState(config.model || 'gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);

  // Test connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(config.apiKey || '');
      setModelInput(config.model || 'gemini-2.5-flash');
      setTestResult(null);
      setSaveSuccessMsg(false);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '2202') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Mật khẩu không chính xác! Vui lòng nhập mật khẩu hợp lệ (2202).');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKeyInput.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập API Key trước khi kiểm tra!' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKeyInput.trim(), modelInput);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const updated = saveStoredConfig({
      apiKey: apiKeyInput.trim(),
      model: modelInput,
    });
    onConfigUpdated(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa API Key này không?')) {
      clearStoredConfig();
      setApiKeyInput('');
      onConfigUpdated({ apiKey: '', model: modelInput, isConfigured: false });
      setTestResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-orange-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-heading">Cấu Hình API Google Gemini</h3>
              <p className="text-xs text-orange-100">Đường dẫn quản trị: /config</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PASSWORD LOCK SCREEN */}
        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-gray-800">Xác Thực Quản Trị Viên</h4>
              <p className="text-sm text-gray-500">
                Để bảo vệ API Key của bạn, vui lòng nhập mã bảo mật cấu hình (mật khẩu: <span className="font-mono font-bold text-orange-600">2202</span>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Mật Khẩu Truy Cập
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Nhập mật khẩu..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-mono text-lg tracking-widest"
              />
              {passwordError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-300 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Mở Khóa</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: CONFIGURATION PANEL */
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Guide Banner */}
            <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-orange-950 space-y-1">
                <p className="font-semibold text-orange-900">Cách nhận Google Gemini API Key miễn phí:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-orange-800">
                  <li>Truy cập <span className="font-medium">aistudio.google.com</span></li>
                  <li>Đăng nhập tài khoản Google &amp; bấm <strong>"Get API key"</strong></li>
                  <li>Tạo key mới và dán vào ô bên dưới</li>
                </ol>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-900 font-bold underline mt-1"
                >
                  Mở Google AI Studio ngay <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Khóa bí mật được lưu trữ an toàn trong LocalStorage trên trình duyệt của bạn.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Mô hình AI (Model)
              </label>
              <select
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Khuyên dùng - Nhanh &amp; Mới nhất)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ổn định, phản hồi cực nhanh)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Chi tiết, sáng tạo chuyên sâu)</option>
              </select>
            </div>

            {/* Test Connection Button & Result */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKeyInput.trim()}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang kiểm tra kết nối với Google...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>Kiểm Tra Kết Nối API</span>
                  </>
                )}
              </button>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 font-medium">{testResult.message}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 py-2 px-2.5 rounded-lg hover:bg-rose-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa Key</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-300 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccessMsg ? 'Đã Lưu!' : 'Lưu Cấu Hình'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
