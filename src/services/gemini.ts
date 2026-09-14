import type { SuggestedDish, UserPreferences, DietPreferences } from '../types/meal';
import { SAMPLE_DISHES } from '../data/sampleDishes';
import { getStoredConfig } from './storage';

/**
 * Robust text extractor that safely handles thinking models (where parts[0] is thought and parts[1] is text)
 */
export function extractTextFromResponse(data: any): string {
  const candidate = data?.candidates?.[0];
  if (!candidate) return '';

  const parts = candidate?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    return '';
  }

  // Filter out parts that contain text (ignoring thought / reasoning parts)
  const textSegments: string[] = [];
  for (const part of parts) {
    if (part && typeof part.text === 'string') {
      textSegments.push(part.text);
    }
  }

  if (textSegments.length > 0) {
    return textSegments.join('').trim();
  }

  // Fallback: if there are thoughts but no text field yet
  const thoughtSegments = parts
    .filter((p: any) => p && typeof p.thought === 'string')
    .map((p: any) => p.thought);
  if (thoughtSegments.length > 0) {
    return thoughtSegments.join('').trim();
  }

  return '';
}

/**
 * Fetch available models for an API key directly from Google
 */
export async function fetchAvailableGeminiModels(
  apiKey: string
): Promise<{ success: boolean; models: string[]; message?: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { success: false, models: [], message: 'API Key không hợp lệ.' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, models: [], message: err?.error?.message || `Lỗi HTTP ${res.status}` };
    }
    const data = await res.json();
    const modelsList: string[] = (data.models || [])
      .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map((m: any) => m.name.replace(/^models\//, ''));
    return { success: true, models: modelsList };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể kết nối';
    return { success: false, models: [], message: msg };
  }
}

/**
 * Validate and test a Google Gemini API Key
 */
export async function testGeminiApiKey(
  apiKey: string,
  model: string = 'gemini-3.6-flash'
): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { success: false, message: 'API Key không hợp lệ hoặc quá ngắn.' };
  }

  const cleanKey = apiKey.trim();
  const cleanModel = model.trim().replace(/^models\//, '');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${cleanKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Trả lời đúng từ: OK' }],
          },
        ],
        // Set higher limit so models with reasoning / thinking tokens don't run out before answering
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData?.error?.message || `Lỗi HTTP ${response.status} (${response.statusText})`;
      return { success: false, message: `Kết nối thất bại: ${errorMsg}` };
    }

    const data = await response.json();
    const reply = extractTextFromResponse(data);
    const candidate = data?.candidates?.[0];

    // If candidate exists, the API Key and model are authenticated and functional
    if (reply || candidate) {
      const preview = reply ? ` (Phản hồi: "${reply.slice(0, 40)}")` : '';
      return {
        success: true,
        message: `Kết nối Google Gemini thành công với model "${cleanModel}"! API Key hoạt động hoàn hảo.${preview}`,
      };
    } else {
      return {
        success: false,
        message: `Google API trả về cấu trúc rỗng: ${JSON.stringify(data).slice(0, 150)}...`,
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi mạng hoặc kết nối không xác định';
    return { success: false, message: `Không thể kết nối đến máy chủ Google: ${message}` };
  }
}

/**
 * Helper to clean and parse JSON from Gemini's response
 */
function parseJsonFromGemini(text: string): any {
  let cleaned = text.trim();
  // Strip ```json and ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  // Try to find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse JSON from Gemini:', text);
    throw new Error('Đầu bếp AI đã tạo công thức nhưng định dạng dữ liệu bị lỗi. Vui lòng bấm thử lại!');
  }
}

/**
 * Map UserPreferences into human-readable Vietnamese descriptions
 */
function formatPreferencesPrompt(pref: UserPreferences): string {
  const mealMap: Record<string, string> = {
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    breakfast: 'Bữa sáng',
  };

  const categoryMap: Record<string, string> = {
    family_rice: 'Mâm cơm gia đình chuẩn Việt (Combo hài hòa: Món Mặn đưa cơm + Canh thanh mát + Món Xào/Rau)',
    noodle_soup: 'Đổi vị món nước (Bún, Phở, Mì, Bánh canh, Hủ tiếu, Miến... đậm đà)',
    quick_single: '1 món nhanh gọn siêu tốc (< 20 phút: Cơm chiên, Bún xào, Mì xào, Bò né...)',
    healthy_clean: 'Eat Clean / Healthy / Thanh đạm (Ít dầu mỡ, luộc/hấp, nhiều rau xanh, tốt cho vóc dáng)',
    party_gathering: 'Cuối tuần lai rai / Món cuốn / Lẩu / Nướng quây quần gia đình bạn bè',
  };

  const proteinMap: Record<string, string> = {
    any: 'Tùy biến tự do (Đầu bếp AI tự chọn nguyên liệu đạm ngon và hợp thời tiết nhất)',
    pork: 'Thịt heo / Sườn non',
    chicken: 'Thịt gà / Vịt',
    beef: 'Thịt bò',
    seafood: 'Cá / Tôm / Nghêu sò hải sản',
    egg_tofu: 'Trứng / Đậu phụ (Tiết kiệm, thanh nhẹ, nhanh)',
  };

  const budgetMap: Record<string, string> = {
    budget: 'Tiết kiệm sinh viên (< 60.000đ cho cả bữa ăn)',
    medium: 'Bình dân gia đình (80.000đ - 150.000đ, đầy đặn cân đối thịt rau)',
    premium: 'Tươm tất thả ga (180.000đ - 300.000đ+, nguyên liệu tươi ngon cao cấp)',
  };

  const speedMap: Record<string, string> = {
    fast_20m: 'Nấu siêu tốc dưới 20 phút (nhanh gọn lẹ, ít dọn rửa)',
    normal_35m: 'Vừa phải khoảng 30 - 35 phút',
    relaxed_50m: 'Thoải mái khoảng 45 - 60 phút (có thể kho kĩ, ninh hầm đậm đà)',
  };

  const regionMap: Record<string, string> = {
    all: 'Phong vị Việt Nam đại chúng (dễ ăn, vừa khẩu vị mọi người)',
    north: 'Đặc trưng chuẩn vị Miền Bắc (thanh tao, thơm mùi tiêu gừng)',
    central: 'Đặc trưng chuẩn vị Miền Trung (đậm đà, cay thơm nồng ấm)',
    south: 'Đặc trưng chuẩn vị Miền Nam / Miền Tây (đậm đà, hơi ngọt thanh, thơm béo nhẹ)',
  };

  return `
- Bữa ăn: ${mealMap[pref.mealTime] || pref.mealTime}
- Thể loại món muốn ăn: ${categoryMap[pref.foodCategory] || pref.foodCategory}
- Khẩu phần ăn: ${pref.peopleCount} người (BẮT BUỘC: Phải định lượng chính xác nguyên liệu cho đúng ${pref.peopleCount} người ăn)
- Nguyên liệu đạm chủ đạo: ${proteinMap[pref.mainProtein] || pref.mainProtein}
- Mức ngân sách đi chợ: ${budgetMap[pref.budgetRange] || pref.budgetRange}
- Thời gian nấu sẵn có: ${speedMap[pref.cookingSpeed] || pref.cookingSpeed}
- Phong vị vùng miền: ${regionMap[pref.regionalFlavor] || pref.regionalFlavor}
- Cảm giác thèm ăn & Thời tiết hôm nay: ${pref.weatherVibe || 'Dễ ăn, đưa cơm'}
- Ghi chú thêm từ người dùng: ${pref.notes || 'Không có'}
  `.trim();
}

/**
 * Execute a Gemini generateContent call with automatic fallback models
 * Uses official active models (gemini-3.6-flash, gemini-3.7-flash, gemini-3.8-flash)
 */
export async function callGeminiWithModelFallback(
  prompt: string,
  initialModel: string,
  apiKey: string,
  maxOutputTokens: number = 3500
): Promise<string> {
  const cleanInitial = initialModel.trim().replace(/^models\//, '');
  
  // Supported models on Google's v1beta API
  const candidateModels = [cleanInitial, 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];
  
  // Filter out sunsetted/non-existent models (1.5, 2.0, 2.5) and deduplicate
  const modelsToTry = candidateModels
    .filter((m) => !['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'].includes(m))
    .filter((m, idx, arr) => arr.indexOf(m) === idx);

  if (modelsToTry.length === 0) {
    modelsToTry.push('gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash');
  }

  let lastError: Error = new Error('Không thể kết nối đến máy chủ Google AI');

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens,
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message || `Lỗi HTTP ${response.status} (${response.statusText})`;

        const isQuotaOrNotFound =
          response.status === 429 ||
          response.status === 404 ||
          msg.toLowerCase().includes('quota') ||
          msg.toLowerCase().includes('rate limit') ||
          msg.toLowerCase().includes('resource_exhausted') ||
          msg.includes('limit:') ||
          msg.includes('not found') ||
          msg.includes('no longer available') ||
          msg.includes('is not supported for generateContent');

        if (isQuotaOrNotFound && i < modelsToTry.length - 1) {
          console.warn(
            `Model "${currentModel}" gặp sự cố (${msg}). Đang tự động chuyển sang "${modelsToTry[i + 1]}"...`
          );
          lastError = new Error(msg);
          continue;
        }

        throw new Error(msg);
      }

      const data = await response.json();
      const text = extractTextFromResponse(data);
      if (!text) {
        if (i < modelsToTry.length - 1) {
          continue;
        }
        throw new Error('Máy chủ Google AI không trả về nội dung hợp lệ.');
      }

      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message;
      const isQuotaOrNotFound =
        msg.toLowerCase().includes('quota') ||
        msg.toLowerCase().includes('rate limit') ||
        msg.toLowerCase().includes('resource_exhausted') ||
        msg.includes('limit:') ||
        msg.includes('not found') ||
        msg.includes('no longer available') ||
        msg.includes('is not supported for generateContent');

      if (isQuotaOrNotFound && i < modelsToTry.length - 1) {
        console.warn(
          `Model "${currentModel}" gặp sự cố (${msg}). Tự động thử model dự phòng "${modelsToTry[i + 1]}"...`
        );
        continue;
      }

      if (i === modelsToTry.length - 1) {
        throw lastError;
      }
    }
  }

  throw lastError;
}

/**
 * Generate food suggestion based on user preferences using Gemini API
 */
export async function suggestMealFromGemini(pref: UserPreferences): Promise<SuggestedDish> {
  const config = getStoredConfig();

  if (!config.isConfigured || !config.apiKey) {
    throw new Error('Chưa cấu hình API Key Google Gemini. Vui lòng thêm VITE_GEMINI_API_KEY trong file .env hoặc cấu hình trên Vercel.');
  }

  const prompt = `
Bạn là Siêu Trợ Lý Đầu Bếp AI & Chuyên gia Văn Hóa Ẩm Thực Việt Nam "Hôm Nay Ăn Gì".
Người dùng đang rất phân vân không biết nấu gì, ăn gì và cần bạn quyết định thay cho họ một thực đơn hoàn hảo!

Dưới đây là thông tin chi tiết về mong muốn của người dùng:
${formatPreferencesPrompt(pref)}

NHIỆM VỤ CỦA BẠN:
Đưa ra 1 gợi ý món ăn (hoặc mâm cơm) tối ưu nhất, giải quyết hoàn hảo bài toán "Hôm nay ăn gì" cho họ.
Định lượng nguyên liệu và ước tính chi phí PHẢI phù hợp thực tế đi chợ tại Việt Nam cho ${pref.peopleCount} người ăn.

BẠN PHẢI TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON CHUẨN (KHÔNG CHỨA BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI KHỐI JSON) VỚI CẤU TRÚC SAU:
{
  "name": "Tên món ăn hoặc mâm cơm (Ví dụ: Sườn Xào Chua Ngọt + Canh Cải Thịt Bằm)",
  "tagline": "Một câu khẩu hiệu ngắn gọn hấp dẫn đánh trúng tâm lý thèm ăn",
  "mealType": "${pref.mealTime}",
  "peopleCount": ${pref.peopleCount},
  "estimatedTotalCost": "Ước tính tổng chi phí (Ví dụ: 120.000đ - 140.000đ)",
  "estimatedCookingTime": "Thời gian nấu (Ví dụ: 30 phút)",
  "difficulty": "Dễ" | "Trung bình" | "Cầu kỳ",
  "nutritionOverview": {
    "caloriesApprox": "~500 kcal / người",
    "highlights": ["Giàu protein", "Nhiều chất xơ thanh mát", "Ít dầu mỡ"]
  },
  "whyThisDish": "Lời giải thích vì sao bạn chọn món này giải quyết đúng nhu cầu số người, ngân sách và sở thích của họ",
  "ingredients": [
    {
      "name": "Tên nguyên liệu",
      "amount": "Số lượng cụ thể cho ${pref.peopleCount} người (Ví dụ: 500g, 1 bó, 2 quả)",
      "estimatedPrice": "Ước lượng giá tiền (Ví dụ: 50.000đ)",
      "category": "meat_fish" | "veggie" | "spice_seasoning" | "staple"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Tên bước",
      "instruction": "Hướng dẫn chi tiết, ngắn gọn, dễ làm",
      "durationMinutes": 5,
      "chefTip": "Mẹo nhỏ bí quyết của đầu bếp (nếu có)"
    }
  ],
  "sideDishes": ["Món ăn kèm 1", "Món ăn kèm 2"],
  "chefAdvice": "Lời khuyên tổng kết của đầu bếp để bữa ăn ngon trọn vẹn"
}
`.trim();

  try {
    const candidateText = await callGeminiWithModelFallback(prompt, config.model, config.apiKey, 3500);
    const parsed = parseJsonFromGemini(candidateText);
    return {
      ...parsed,
      id: 'dish-' + Date.now(),
    };
  } catch (error) {
    console.error('Gemini fetch failure:', error);
    throw error;
  }
}

/**
 * Generate dish based on available ingredients in fridge
 */
export async function suggestMealFromFridge(
  ingredients: string[],
  peopleCount: number = 2
): Promise<SuggestedDish> {
  const config = getStoredConfig();

  if (!config.isConfigured || !config.apiKey) {
    throw new Error('Chưa cấu hình API Key Google Gemini. Vui lòng thêm VITE_GEMINI_API_KEY trong file .env hoặc cấu hình trên Vercel.');
  }

  const prompt = `
Bạn là Siêu Trợ Lý Bếp Trưởng AI "Hôm Nay Ăn Gì".
Người dùng muốn dọn tủ lạnh và đang có sẵn các nguyên liệu sau: ${ingredients.join(', ')}.
Số người ăn: ${peopleCount} người.

NHIỆM VỤ:
Gợi ý 1 món ăn ngon nhất, dễ nấu nhất kết hợp các nguyên liệu trên để người dùng KHÔNG CẦN phải chạy ra chợ mua thêm (hoặc chỉ cần gia vị cơ bản như mắm, muối, tỏi, ớt).

TRẢ VỀ JSON DUY NHẤT VỚI CẤU TRÚC:
{
  "name": "Tên món ăn",
  "tagline": "Khẩu hiệu ngắn gọn",
  "mealType": "Bữa cơm dọn tủ lạnh",
  "peopleCount": ${peopleCount},
  "estimatedTotalCost": "Tận dụng đồ tủ lạnh (< 20.000đ gia vị)",
  "estimatedCookingTime": "Thời gian nấu (phút)",
  "difficulty": "Dễ",
  "nutritionOverview": {
    "caloriesApprox": "~450 kcal / người",
    "highlights": ["Tiết kiệm", "Nhanh gọn", "Cân bằng"]
  },
  "whyThisDish": "Lý do kết hợp các nguyên liệu trên",
  "ingredients": [
    {
      "name": "Tên nguyên liệu",
      "amount": "Định lượng",
      "estimatedPrice": "Có sẵn / 5.000đ",
      "category": "meat_fish" | "veggie" | "spice_seasoning" | "staple"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Tên bước",
      "instruction": "Nội dung",
      "durationMinutes": 5,
      "chefTip": "Mẹo vặt"
    }
  ],
  "sideDishes": ["Ăn kèm..."],
  "chefAdvice": "Mẹo hữu ích khi dọn tủ"
}
`.trim();

  try {
    const text = await callGeminiWithModelFallback(prompt, config.model, config.apiKey, 3000);
    return { ...parseJsonFromGemini(text), id: 'fridge-' + Date.now() };
  } catch (err) {
    console.error('Gemini Fridge error:', err);
    throw err;
  }
}

/**
 * Generate recipe when user spins the Lucky Wheel or clicks a preset
 */
export async function suggestRecipeForSpecificDish(
  dishName: string,
  peopleCount: number = 4
): Promise<SuggestedDish> {
  const config = getStoredConfig();

  if (!config.isConfigured || !config.apiKey) {
    throw new Error('Chưa cấu hình API Key Google Gemini. Vui lòng thêm VITE_GEMINI_API_KEY trong file .env hoặc cấu hình trên Vercel.');
  }

  const prompt = `
Bạn là Đầu Bếp AI chuyên nghiệp.
Người dùng vừa chọn món: "${dishName}" cho ${peopleCount} người ăn.

YÊU CẦU:
Lên thực đơn chi tiết gồm nguyên liệu chuẩn xác (định lượng cho ${peopleCount} người, giá tiền chợ Việt Nam) và các bước nấu siêu ngon.

TRẢ VỀ JSON DUY NHẤT CÓ CẤU TRÚC:
{
  "name": "${dishName}",
  "tagline": "Khẩu hiệu ngắn gọn",
  "mealType": "Bữa cơm gia đình",
  "peopleCount": ${peopleCount},
  "estimatedTotalCost": "Ước tính giá",
  "estimatedCookingTime": "Thời gian nấu",
  "difficulty": "Dễ" | "Trung bình" | "Cầu kỳ",
  "nutritionOverview": {
    "caloriesApprox": "~500 kcal / người",
    "highlights": ["Dinh dưỡng", "Hấp dẫn", "Đưa cơm"]
  },
  "whyThisDish": "Lý do món này siêu ngon hôm nay",
  "ingredients": [
    {
      "name": "Tên",
      "amount": "Số lượng",
      "estimatedPrice": "Giá",
      "category": "meat_fish" | "veggie" | "spice_seasoning" | "staple"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Tiêu đề",
      "instruction": "Chi tiết",
      "durationMinutes": 5,
      "chefTip": "Mẹo"
    }
  ],
  "sideDishes": ["Ăn kèm..."],
  "chefAdvice": "Lời khuyên"
}
`.trim();

  try {
    const text = await callGeminiWithModelFallback(prompt, config.model, config.apiKey, 3000);
    return { ...parseJsonFromGemini(text), id: 'dish-' + Date.now() };
  } catch (err) {
    console.error('Gemini dish error:', err);
    throw err;
  }
}

/**
 * Intelligent fallback generator when Gemini API is not yet configured
 */
export function generateFallbackSuggestion(pref: UserPreferences, extraNote?: string): SuggestedDish {
  let chosen = SAMPLE_DISHES[0];

  if (pref.cookingSpeed === 'fast_20m' || pref.foodCategory === 'quick_single') {
    chosen = SAMPLE_DISHES[2]; // Gà chiên mắm nhanh gọn
  } else if (pref.regionalFlavor === 'south' || pref.mainProtein === 'seafood') {
    chosen = SAMPLE_DISHES[1]; // Cá lóc kho tộ miền Tây
  }

  const multiplier = Math.max(1, pref.peopleCount / chosen.peopleCount);
  const adjustedIngredients = chosen.ingredients.map((ing) => {
    return {
      ...ing,
      amount: ing.amount.replace(/\d+/g, (num) => String(Math.round(Number(num) * multiplier))),
    };
  });

  return {
    ...chosen,
    id: 'dish-' + Date.now(),
    peopleCount: pref.peopleCount,
    whyThisDish: `${chosen.whyThisDish} ${extraNote || ''}`.trim(),
    ingredients: adjustedIngredients,
  };
}

/**
 * Generate customized diet / weight loss meal plan with exact macros
 */
export async function suggestMealForDiet(pref: DietPreferences): Promise<SuggestedDish> {
  const config = getStoredConfig();

  const goalMap: Record<string, string> = {
    deficit: 'Thâm hụt calo giảm mỡ cấp tốc (tập trung no lâu, ít calo, nhiều chất xơ)',
    clean: 'Eat Clean chuẩn Việt (thực phẩm tự nhiên nguyên bản, ít gia vị nhân tạo, thải độc)',
    fitness: 'Tăng cơ giảm mỡ Gymer (Hàm lượng Protein cực cao > 35g - 45g/bữa, nạc sạch)',
    keto: 'Low-Carb / KETO (Cắt giảm tối đa tinh bột, tăng chất béo tốt và đạm sạch)',
  };

  if (!config.isConfigured || !config.apiKey) {
    throw new Error('Chưa cấu hình API Key Google Gemini. Vui lòng thêm VITE_GEMINI_API_KEY trong file .env hoặc cấu hình trên Vercel.');
  }

  const prompt = `
Bạn là Chuyên Gia Dinh Dưỡng & Đầu Bếp Eat Clean Chuyên Sâu.
Người dùng đang trong chế độ ĂN KIÊNG / GIẢM CÂN / GIỮ DÁNG và cần bạn lên 1 bữa ăn khoa học:
- Mục tiêu vóc dáng: ${goalMap[pref.targetGoal] || pref.targetGoal}
- Mức calo mục tiêu: ${pref.calorieTarget} cho ${pref.peopleCount} người ăn
- Nguồn tinh bột ưu tiên: ${pref.carbSource}
- Nguồn đạm ưu tiên: ${pref.proteinChoice}
- Cách chế biến: ${pref.cookingMethod}
- Ghi chú: ${pref.notes || 'Không có'}

NHIỆM VỤ:
Lên thực đơn 1 bữa ăn giảm cân cực kỳ ngon miệng, dễ nấu theo phong cách ẩm thực Việt Nam (không nhàm chán như ức gà luộc nhạt toẹt).
BẮT BUỘC tính toán chi tiết: Lượng Calo, Protein (g), Carbs (g), Fat (g), Fiber (g).

TRẢ VỀ JSON DUY NHẤT VỚI CẤU TRÚC:
{
  "name": "Tên món ăn (Ví dụ: Cá Hồi Áp Chảo Sốt Chanh Leo + Khoai Lang Mật)",
  "tagline": "Khẩu hiệu ngắn gọn về dinh dưỡng và đốt mỡ",
  "mealType": "Bữa ăn giảm cân lành mạnh",
  "peopleCount": ${pref.peopleCount},
  "estimatedTotalCost": "Ước tính giá tiền",
  "estimatedCookingTime": "Thời gian nấu (phút)",
  "difficulty": "Dễ" | "Trung bình",
  "nutritionOverview": {
    "caloriesApprox": "~... kcal / khẩu phần",
    "protein": "...g",
    "carbs": "...g",
    "fat": "...g",
    "fiber": "...g",
    "highlights": ["Giàu đạm nạc", "Tinh bột GI thấp", "Chất béo tốt"]
  },
  "whyThisDish": "Giải thích vì sao món này giúp đạt mục tiêu thâm hụt calo và no lâu",
  "ingredients": [
    {
      "name": "Tên nguyên liệu",
      "amount": "Định lượng rõ ràng (Ví dụ: 200g, 1 quả)",
      "estimatedPrice": "Ước tính giá",
      "category": "meat_fish" | "veggie" | "spice_seasoning" | "staple"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Tên bước",
      "instruction": "Hướng dẫn chi tiết, lưu ý cách giảm dầu mỡ",
      "durationMinutes": 5,
      "chefTip": "Mẹo dinh dưỡng hoặc giữ độ mềm mọng"
    }
  ],
  "sideDishes": ["Ăn kèm..."],
  "chefAdvice": "Lời khuyên giảm cân của chuyên gia dinh dưỡng"
}
`.trim();

  try {
    const text = await callGeminiWithModelFallback(prompt, config.model, config.apiKey, 3000);
    return { ...parseJsonFromGemini(text), id: 'diet-' + Date.now() };
  } catch (err) {
    console.error('Gemini Diet error:', err);
    throw err;
  }
}
