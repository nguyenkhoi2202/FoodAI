import { useState, useEffect } from 'react';
import {
  ShieldCheck,
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
  ArrowLeft,
  Cpu,
  Activity,
  LogOut,
  Info,
  Search,
} from 'lucide-react';
import type { AppConfig } from '../types/meal';
import { saveStoredConfig, clearStoredConfig } from '../services/storage';
import { testGeminiApiKey, fetchAvailableGeminiModels } from '../services/gemini';

interface AdminPageProps {
  config: AppConfig;
  onConfigUpdated: (newConfig: AppConfig) => void;
  onNavigateToUser: () => void;
}

const PRESET_MODELS = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash (Khuyên dùng)',
    description: 'Thế hệ mới nhất của Google, cực nhanh, thông minh & dồi dào hạn mức',
    tag: 'Mới nhất',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash (Rất ổn định)',
    description: 'Mô hình tiêu chuẩn toàn cầu của Google, nhẹ và phản hồi ngay lập tức',
    tag: 'Ổn định',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro (Nâng cao)',
    description: 'Suy luận ẩm thực chuyên sâu, công thức cầu kỳ chi tiết',
    tag: 'Chuyên sâu',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    description: 'Mô hình thế hệ 3.x với khả năng suy nghĩ reasoning chuyên sâu',
    tag: 'Next Gen',
  },
];

export const AdminPage = ({
  config,
  onConfigUpdated,
  onNavigateToUser,
}: AdminPageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hnag_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey || '');
  const [selectedModel, setSelectedModel] = useState<string>(config.model || 'gemini-2.0-flash');
  const [customModelInput, setCustomModelInput] = useState<string>('');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Test connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Fetched models from Google
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableGoogleModels, setAvailableGoogleModels] = useState<string[]>([]);
  const [fetchModelsError, setFetchModelsError] = useState<string | null>(null);

  useEffect(() => {
    setApiKeyInput(config.apiKey || '');
    const isPreset = PRESET_MODELS.some((m) => m.id === config.model);
    if (isPreset) {
      setSelectedModel(config.model);
      setIsCustomModel(false);
    } else {
      setSelectedModel('custom');
      setIsCustomModel(true);
      setCustomModelInput(config.model || '');
    }
  }, [config]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '2202') {
      setIsAuthenticated(true);
      sessionStorage.setItem('hnag_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Mật khẩu quản trị không chính xác! (Mật khẩu mặc định: 2202)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hnag_admin_auth');
    setPasswordInput('');
  };

  const effectiveModel = isCustomModel ? customModelInput.trim() : selectedModel;

  const handleTestConnection = async () => {
    if (!apiKeyInput.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập API Key trước khi kiểm tra!' });
      return;
    }
    if (!effectiveModel) {
      setTestResult({ success: false, message: 'Vui lòng chọn hoặc nhập mã Model AI!' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKeyInput.trim(), effectiveModel);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleFetchGoogleModels = async () => {
    if (!apiKeyInput.trim()) {
      setFetchModelsError('Vui lòng nhập API Key trước để lấy danh sách!');
      return;
    }
    setIsFetchingModels(true);
    setFetchModelsError(null);
    try {
      const res = await fetchAvailableGeminiModels(apiKeyInput.trim());
      if (res.success) {
        setAvailableGoogleModels(res.models);
      } else {
        setFetchModelsError(res.message || 'Không thể lấy danh sách model.');
      }
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleSelectFetchedModel = (modelName: string) => {
    setSelectedModel('custom');
    setIsCustomModel(true);
    setCustomModelInput(modelName);
    setTestResult(null);
  };

  const handleSave = () => {
    if (!effectiveModel) {
      alert('Vui lòng chọn hoặc nhập mã Model!');
      return;
    }
    const updated = saveStoredConfig({
      apiKey: apiKeyInput.trim(),
      model: effectiveModel,
    });
    onConfigUpdated(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 2500);
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ cấu hình API Key này?')) {
      clearStoredConfig();
      setApiKeyInput('');
      onConfigUpdated({ apiKey: '', model: 'gemini-2.0-flash', isConfigured: false });
      setTestResult(null);
      setAvailableGoogleModels([]);
    }
  };

  // 1. LOGIN SCREEN (PORTAL LOCK)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/90 border border-gray-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 text-white">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Cổng Quản Trị Hệ Thống
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Khu vực dành riêng cho Quản trị viên (/config) để cấu hình Google AI
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Mật khẩu Quản Trị
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Nhập mã bảo vệ..."
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-800 border border-gray-700 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {passwordError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          <div className="pt-2 border-t border-gray-800 text-center">
            <button
              type="button"
              onClick={onNavigateToUser}
              className="text-xs text-gray-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay về trang người dùng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. DEDICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">Quản Trị Hệ Thống AI</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-gray-400">Đường dẫn riêng tư: /config</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToUser}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-all flex items-center gap-2 border border-gray-700"
              title="Quay lại giao diện người dùng"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Giao Diện Người Dùng</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Đăng xuất khỏi Admin"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Status Card Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/70 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-bold text-white">Trạng Thái Kết Nối Google Gemini</h3>
            </div>
            <p className="text-xs text-gray-400">
              API Key được cấu hình tại đây sẽ tự động cung cấp năng lực thông minh cho toàn bộ người dùng trang web mà không để lộ khóa bí mật.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs">
              <span className="text-gray-400">Trạng thái: </span>
              {config.isConfigured ? (
                <span className="text-emerald-400 font-bold">✓ Đang hoạt động</span>
              ) : (
                <span className="text-amber-400 font-bold">Chưa kích hoạt</span>
              )}
            </div>

            <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs font-mono text-orange-400">
              Model: {config.model}
            </div>
          </div>
        </div>

        {/* 2 Columns: Settings Form & Quick Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: API & Model Settings (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Box 1: API Key */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Google Gemini API Key</h4>
                    <p className="text-xs text-gray-400">Khóa bí mật dự án</p>
                  </div>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center gap-1 underline"
                >
                  Lấy API key tại Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Dán mã API Key của bạn (AIzaSy...)"
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Box 2: Model Selection */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Lựa Chọn Mô Hình AI (Model)</h4>
                    <p className="text-xs text-gray-400">Hỗ trợ Gemini 2.0 Flash, 1.5 Flash, 3.8 Flash...</p>
                  </div>
                </div>

                {/* Live Model Fetcher Button */}
                <button
                  type="button"
                  onClick={handleFetchGoogleModels}
                  disabled={isFetchingModels || !apiKeyInput.trim()}
                  className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-orange-400 border border-gray-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  title="Truy vấn Google để lấy danh sách model tài khoản bạn được cấp"
                >
                  {isFetchingModels ? (
                    <>
                      <div className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang quét...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3 h-3" />
                      <span>Quét Model Từ Tài Khoản Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* Display fetched models if available */}
              {availableGoogleModels.length > 0 && (
                <div className="p-4 rounded-2xl bg-gray-950 border border-orange-500/30 space-y-2">
                  <span className="text-xs font-bold text-orange-400">
                    Google AI Studio cung cấp các Model sau cho API Key của bạn (Nhấp vào để chọn):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pt-1">
                    {availableGoogleModels.map((mName) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => handleSelectFetchedModel(mName)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                          effectiveModel === mName
                            ? 'bg-orange-600 text-white font-bold shadow'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {mName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {fetchModelsError && (
                <p className="text-xs text-rose-400">{fetchModelsError}</p>
              )}

              {/* Preset Models Grid */}
              <div className="space-y-3">
                {PRESET_MODELS.map((m) => {
                  const isSelected = !isCustomModel && selectedModel === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m.id);
                        setIsCustomModel(false);
                        setTestResult(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-950/20 text-white shadow-md shadow-orange-950/30'
                          : 'border-gray-800 bg-gray-950/60 hover:border-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span>{m.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-mono">
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{m.description}</p>
                        <p className="text-[11px] font-mono text-orange-400">{m.id}</p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-600'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  );
                })}

                {/* Option: Custom Model Input */}
                <div
                  onClick={() => setIsCustomModel(true)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isCustomModel
                      ? 'border-orange-500 bg-orange-950/20 text-white'
                      : 'border-gray-800 bg-gray-950/60 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm block">Tùy Chỉnh Nhập Tên Model</span>
                      <span className="text-xs text-gray-400">
                        Nhập thủ công mã model mới nếu cần (Ví dụ: gemini-3.8-flash, gemini-2.0-flash...)
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isCustomModel
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-600'
                      }`}
                    >
                      {isCustomModel && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>

                  {isCustomModel && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={customModelInput}
                        onChange={(e) => {
                          setCustomModelInput(e.target.value);
                          setTestResult(null);
                        }}
                        placeholder="Ví dụ: gemini-3.8-flash hoặc gemini-2.0-flash..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 3: Test Connection & Save */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !apiKeyInput.trim()}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-700 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang kiểm tra kết nối với Google...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span>Kiểm Tra Kết Nối Model</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-3 text-xs text-rose-400 hover:text-rose-300 font-semibold hover:bg-rose-950/30 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Xóa Cấu Hình</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveSuccessMsg ? 'Đã Lưu Thành Công!' : 'Lưu Thay Đổi'}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-start gap-3 mt-4 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {testResult.success ? 'Kiểm tra thành công!' : 'Kiểm tra thất bại:'}
                    </p>
                    <p className="leading-relaxed">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Help & Instructions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-orange-400">
                <Info className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Mẹo Cho Quản Trị Viên</h4>
              </div>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <p>
                  💡 <strong>Vì sao trước đó báo "API phản hồi rỗng"?</strong>
                </p>
                <p className="text-gray-400">
                  Các model thế hệ mới (như Gemini 2.0 / 3.x Flash) có tính năng suy luận ngầm (Thinking / Reasoning). Khi test kết nối nếu giới hạn token quá ngắn, model dùng hết token để "suy nghĩ" nên chưa kịp in ra chữ. Mình đã tăng hạn mức token và tối ưu bộ bóc tách nội dung đa phần, giờ đây bạn có thể kiểm tra mọi model mượt mà!
                </p>

                <p className="pt-2">
                  🔍 <strong>Nút "Quét Model Từ Tài Khoản Google"</strong>:
                </p>
                <p className="text-gray-400">
                  Bạn có thể bấm nút quét ở trên để Google liệt kê chính xác 100% các model đang mở cho API Key của bạn. Bạn chỉ việc bấm vào model mong muốn là xong!
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onNavigateToUser}
                  className="w-full py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 text-orange-400" />
                  <span>Chuyển Sang Giao Diện Người Dùng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
