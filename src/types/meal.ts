export type MealTime = 'lunch' | 'dinner' | 'breakfast';

export type FoodCategory =
  | 'family_rice'       // Mâm cơm gia đình chuẩn Việt (Mặn + Canh + Xào)
  | 'noodle_soup'       // Đổi vị món nước (Bún, Phở, Mì, Bánh canh...)
  | 'quick_single'      // 1 món siêu tốc dưới 15p (Cơm chiên, bún xào, mì bò...)
  | 'healthy_clean'     // Healthy / Eat Clean (Luộc hấp, ít dầu, nhiều rau)
  | 'party_gathering';  // Lai rai / Lẩu / Nướng / Món cuốn cuối tuần

export type MainProtein =
  | 'any'         // Tùy AI chọn miễn ngon
  | 'pork'        // Thịt heo / Sườn
  | 'chicken'     // Thịt gà / Vịt
  | 'beef'        // Thịt bò
  | 'seafood'     // Cá / Tôm / Nghêu sò
  | 'egg_tofu';   // Trứng / Đậu phụ (Tiết kiệm, thanh đạm)

export type BudgetRange =
  | 'budget'      // Tiết kiệm sinh viên (< 60.000đ)
  | 'medium'      // Bình dân gia đình (80.000đ - 150.000đ)
  | 'premium';    // Tươm tất thả ga (180.000đ - 300.000đ+)

export type CookingSpeed = 'fast_20m' | 'normal_35m' | 'relaxed_50m';

export type RegionalFlavor = 'all' | 'north' | 'central' | 'south';

export interface UserPreferences {
  mealTime: MealTime;
  foodCategory: FoodCategory;
  peopleCount: number;
  mainProtein: MainProtein;
  budgetRange: BudgetRange;
  cookingSpeed: CookingSpeed;
  regionalFlavor: RegionalFlavor;
  weatherVibe: string;
  notes: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  estimatedPrice: string; // e.g. "35.000đ"
  category: 'meat_fish' | 'veggie' | 'spice_seasoning' | 'staple';
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  chefTip?: string;
}

export interface SuggestedDish {
  id: string;
  name: string;
  tagline: string;
  mealType: string;
  peopleCount: number;
  estimatedTotalCost: string;
  estimatedCookingTime: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Cầu kỳ';
  nutritionOverview: {
    caloriesApprox: string;
    protein?: string; // e.g. "32g"
    carbs?: string;   // e.g. "45g"
    fat?: string;     // e.g. "12g"
    fiber?: string;   // e.g. "8g"
    highlights: string[]; // e.g. ["Giàu protein", "Nhiều chất xơ", "Ít dầu mỡ"]
  };
  whyThisDish: string; // Lý do AI gợi ý món này dựa trên câu trả lời
  ingredients: Ingredient[];
  steps: CookingStep[];
  sideDishes?: string[]; // Món ăn kèm / canh ăn cùng
  chefAdvice: string; // Lời khuyên của đầu bếp AI
}

export interface DietPreferences {
  targetGoal: 'deficit' | 'clean' | 'fitness' | 'keto';
  calorieTarget: string;
  peopleCount: number;
  carbSource: string;
  proteinChoice: string;
  cookingMethod: string;
  notes: string;
}

export interface AppConfig {
  apiKey: string;
  model: string;
  isConfigured: boolean;
}

export interface SavedDish extends SuggestedDish {
  savedAt: string;
}
