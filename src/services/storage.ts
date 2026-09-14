import type { AppConfig, SavedDish } from '../types/meal';

const STORAGE_KEYS = {
  CONFIG: 'hnag_gemini_config',
  SAVED_DISHES: 'hnag_saved_dishes',
  CHECKLIST_CHECKED: 'hnag_checklist_items',
};

const ENV_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
const ENV_MODEL = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash').trim();

export const DEFAULT_CONFIG: AppConfig = {
  apiKey: ENV_KEY,
  model: ENV_MODEL || 'gemini-3.6-flash',
  isConfigured: Boolean(ENV_KEY && ENV_KEY.length > 10),
};

export const getStoredConfig = (): AppConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    const apiKey = parsed.apiKey || DEFAULT_CONFIG.apiKey || '';
    let model = parsed.model || DEFAULT_CONFIG.model || 'gemini-3.6-flash';
    // Auto-migrate models that Google discontinued for this API version
    if (
      model === 'gemini-1.5-flash' ||
      model === 'gemini-1.5-pro' ||
      model === 'gemini-2.0-flash' ||
      model === 'gemini-2.5-flash'
    ) {
      model = 'gemini-3.6-flash';
    }
    return {
      apiKey,
      model,
      isConfigured: Boolean(apiKey && apiKey.length > 10),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveStoredConfig = (config: Partial<AppConfig>): AppConfig => {
  const current = getStoredConfig();
  const updated: AppConfig = {
    ...current,
    ...config,
    isConfigured: Boolean(config.apiKey && config.apiKey.trim().length > 10),
  };
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
  return updated;
};

export const clearStoredConfig = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
};

export const getSavedDishes = (): SavedDish[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_DISHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleSaveDish = (dish: SavedDish): boolean => {
  try {
    const dishes = getSavedDishes();
    const existsIndex = dishes.findIndex((d) => d.id === dish.id || d.name === dish.name);
    let isSaved = false;

    if (existsIndex >= 0) {
      dishes.splice(existsIndex, 1);
      isSaved = false;
    } else {
      dishes.unshift({ ...dish, savedAt: new Date().toISOString() });
      isSaved = true;
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_DISHES, JSON.stringify(dishes));
    return isSaved;
  } catch {
    return false;
  }
};

export const isDishSaved = (dishIdOrName: string): boolean => {
  const dishes = getSavedDishes();
  return dishes.some((d) => d.id === dishIdOrName || d.name === dishIdOrName);
};
