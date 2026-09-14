import type { AppConfig, SavedDish } from '../types/meal';

const STORAGE_KEYS = {
  CONFIG: 'hnag_gemini_config',
  SAVED_DISHES: 'hnag_saved_dishes',
  CHECKLIST_CHECKED: 'hnag_checklist_items',
};

const DEFAULT_CONFIG: AppConfig = {
  apiKey: '',
  model: 'gemini-2.0-flash',
  isConfigured: false,
};

export const getStoredConfig = (): AppConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    let model = parsed.model || 'gemini-2.0-flash';
    if (model === 'gemini-2.5-flash') {
      model = 'gemini-2.0-flash';
    }
    return {
      apiKey: parsed.apiKey || '',
      model,
      isConfigured: Boolean(parsed.apiKey && parsed.apiKey.trim().length > 10),
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
