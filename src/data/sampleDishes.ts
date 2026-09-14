import type { SuggestedDish } from '../types/meal';

export const SAMPLE_DISHES: SuggestedDish[] = [
  {
    id: 'sample-suon-xao-chua-ngot',
    name: 'Sườn Xào Chua Ngọt Đậm Đà + Canh Cải Thịt Bằm',
    tagline: 'Món ăn quốc dân đưa cơm, màu sắc cánh gián bắt mắt, sốt sệt sánh quyện',
    mealType: 'Bữa trưa gia đình',
    peopleCount: 4,
    estimatedTotalCost: '140.000đ - 160.000đ',
    estimatedCookingTime: '35 phút',
    difficulty: 'Trung bình',
    nutritionOverview: {
      caloriesApprox: '~550 kcal / khẩu phần',
      highlights: ['Giàu đạm động vật', 'Nhiều vitamin từ rau cải', 'Kích thích ngon miệng'],
    },
    whyThisDish: 'Phù hợp hoàn hảo cho bữa trưa gia đình 4 người tại thành phố với chi phí vừa phải (~150k), dễ mua nguyên liệu ở bất kỳ chợ hay siêu thị nào.',
    ingredients: [
      { name: 'Sườn non heo', amount: '500g', estimatedPrice: '75.000đ', category: 'meat_fish' },
      { name: 'Thịt heo xay (nấu canh)', amount: '100g', estimatedPrice: '15.000đ', category: 'meat_fish' },
      { name: 'Cải ngọt tươi', amount: '1 bó (300g)', estimatedPrice: '10.000đ', category: 'veggie' },
      { name: 'Cà chua chín & dứa (thơm)', amount: '2 quả cà chua + 1/4 quả dứa', estimatedPrice: '12.000đ', category: 'veggie' },
      { name: 'Hành khô, tỏi, ớt, hành lá', amount: '1 bó nhỏ', estimatedPrice: '8.000đ', category: 'spice_seasoning' },
      { name: 'Gia vị: Nước mắm, giấm gạo, đường, tương cà', amount: 'Có sẵn trong bếp', estimatedPrice: '10.000đ', category: 'spice_seasoning' },
      { name: 'Gạo tẻ thơm ST25', amount: '3 bát gạo', estimatedPrice: '15.000đ', category: 'staple' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sơ chế sườn và nguyên liệu',
        instruction: 'Sườn non chặt miếng vừa ăn, chần qua nước sôi cùng 1 thìa muối và vài lát gừng để khử mùi hôi, sau đó rửa sạch để ráo.',
        durationMinutes: 8,
        chefTip: 'Chần sườn giúp nước sốt sau này trong và thịt không bị ngái mùi.'
      },
      {
        stepNumber: 2,
        title: 'Pha nước sốt chua ngọt chuẩn tỉ lệ vàng',
        instruction: 'Khuấy đều: 2 thìa nước mắm ngon + 2 thìa đường + 2 thìa giấm gạo (hoặc nước cốt chanh) + 2 thìa tương cà + 4 thìa nước lọc.',
        durationMinutes: 3,
        chefTip: 'Tương cà giúp sốt có màu đỏ cam tự nhiên và độ sánh bóng quyến rũ.'
      },
      {
        stepNumber: 3,
        title: 'Rán xém cạnh sườn',
        instruction: 'Cho chút dầu vào chảo, rán sườn ở lửa vừa đến khi hai mặt sườn xém vàng nhẹ, vớt ra đĩa.',
        durationMinutes: 7,
      },
      {
        stepNumber: 4,
        title: 'Đảo sốt và om sườn',
        instruction: 'Phi thơm tỏi hành băm, trút bát sốt vào đun sôi sủi bọt, trút sườn và dứa/cà chua vào đảo đều. Hạ lửa nhỏ om trong 12 phút đến khi sốt keo lại bám đều quanh từng miếng sườn.',
        durationMinutes: 12,
        chefTip: 'Lửa nhỏ là bí quyết giúp thịt sườn ngấm sâu gia vị mà không bị cháy đường.'
      },
      {
        stepNumber: 5,
        title: 'Nấu nhanh canh cải thịt bằm',
        instruction: 'Bắc nồi nhỏ, phi chút hành, xào săn thịt bằm, thêm 800ml nước đun sôi hớt bọt. Thả rau cải cắt khúc vào, nêm hạt nêm và nước mắm, sôi bùng 2 phút tắt bếp rắc hành tiêu.',
        durationMinutes: 5,
      }
    ],
    sideDishes: ['Dưa leo thái lát chấm sốt sườn', 'Cơm trắng dẻo nóng hổi'],
    chefAdvice: 'Món này ăn kèm cơm nóng là chuẩn bài! Nếu nhà có trẻ nhỏ, bạn có thể giảm bớt tiêu ớt và tăng nhẹ chút ngọt của dứa chín.'
  },
  {
    id: 'sample-ca-kho-to-canh-chua',
    name: 'Cá Lóc Kho Tộ Miền Tây + Canh Chua Bạc Hà Bông Điên Điển',
    tagline: 'Mâm cơm sông nước dân dã, cá kho đậm đà thơm mùi tiêu sọ quyện cùng canh chua giải nhiệt',
    mealType: 'Bữa trưa / Bữa tối đậm vị quê',
    peopleCount: 4,
    estimatedTotalCost: '130.000đ - 150.000đ',
    estimatedCookingTime: '40 phút',
    difficulty: 'Trung bình',
    nutritionOverview: {
      caloriesApprox: '~480 kcal / khẩu phần',
      highlights: ['Giàu Omega-3', 'Thanh nhiệt cơ thể', 'Đậm chất miền Tây'],
    },
    whyThisDish: 'Lựa chọn số 1 khi muốn thưởng thức phong vị quê nhà dân dã với cá đồng tươi ngon và rau vườn tươi xanh.',
    ingredients: [
      { name: 'Cá lóc đồng (hoặc cá basa/cá hú)', amount: '600g (cắt khúc)', estimatedPrice: '65.000đ', category: 'meat_fish' },
      { name: 'Thịt ba chỉ rút sườn', amount: '150g', estimatedPrice: '25.000đ', category: 'meat_fish' },
      { name: 'Nguyên liệu canh chua (Bạc hà, đậu bắp, cà chua, giá, me chua)', amount: '1 vỉ thập cẩm', estimatedPrice: '20.000đ', category: 'veggie' },
      { name: 'Ngò gai, rau ngổ (ngò om), ớt sừng', amount: '1 mớ', estimatedPrice: '5.000đ', category: 'veggie' },
      { name: 'Nước màu dừa, tiêu sọ đập dập, tỏi, hành tím', amount: 'Gia vị nhà bếp', estimatedPrice: '10.000đ', category: 'spice_seasoning' },
      { name: 'Gạo tẻ thơm', amount: '3 bát', estimatedPrice: '15.000đ', category: 'staple' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Ướp cá lóc ngấm vị',
        instruction: 'Cá rửa sạch với muối và chanh để sạch nhớt. Ướp cùng 2 thìa nước mắm ngon, 1 thìa đường, 1 thìa hạt nêm, 1 thìa nước màu dừa, tỏi ớt băm trong 20 phút.',
        durationMinutes: 15,
        chefTip: 'Nước màu dừa Bến Tre cho màu nâu đỏ cánh gián bóng loáng tự nhiên.'
      },
      {
        stepNumber: 2,
        title: 'Kho cá trong tộ đất',
        instruction: 'Xào thơm thịt ba chỉ cho ra bớt mỡ, xếp cá vào tộ đất, đổ nước ướp cá vào đun sôi lửa lớn 5 phút cho thịt cá săn lại. Thêm 1/2 chén nước ấm, hạ lửa riu riu kho 25 phút.',
        durationMinutes: 25,
        chefTip: 'Không đậy nắp kín khi kho cá để miếng cá chắc thịt và nước sốt keo sánh.'
      },
      {
        stepNumber: 3,
        title: 'Nấu canh chua thơm lừng',
        instruction: 'Dầm me lấy nước cốt. Phi tỏi thơm, xào sơ cà chua và thơm (dứa), trút nước me và nước lọc vào đun sôi. Thả đầu/đuôi cá vào nấu chín, sau đó cho đậu bắp, bạc hà, giá đỗ. Nêm nước mắm, đường, tắt bếp rắc ngò gai và rau ngổ.',
        durationMinutes: 12,
      }
    ],
    sideDishes: ['Rau sống chấm nước cá kho', 'Ớt hiểm dầm nước mắm'],
    chefAdvice: 'Nước cá kho tộ chan vào cơm cháy đáy nồi hoặc chấm rau luộc dĩa thì ngon "nhức nách"!'
  },
  {
    id: 'sample-ga-chien-mam-noi-chien',
    name: 'Cánh Gà Chiên Nước Mắm (Nồi Chiên Không Dầu) + Canh Mồng Tơi Nấu Ngao',
    tagline: 'Nấu nhanh gọn 25 phút, da gà giòn rụm không ngấy dầu mỡ, canh ngao ngọt thanh',
    mealType: 'Bữa tối bận rộn',
    peopleCount: 3,
    estimatedTotalCost: '110.000đ - 130.000đ',
    estimatedCookingTime: '25 phút',
    difficulty: 'Dễ',
    nutritionOverview: {
      caloriesApprox: '~520 kcal / khẩu phần',
      highlights: ['Ít dầu mỡ', 'Nhiều kẽm từ ngao', 'Rau mát ruột'],
    },
    whyThisDish: 'Tối ưu cho người bận rộn có nồi chiên không dầu: chỉ mất 25 phút chuẩn bị mà vẫn có mâm cơm thịnh soạn vừa miệng cả nhà.',
    ingredients: [
      { name: 'Cánh gà hoặc đùi gà tỏi', amount: '500g', estimatedPrice: '50.000đ', category: 'meat_fish' },
      { name: 'Ngao hoa / nghêu tươi', amount: '500g', estimatedPrice: '25.000đ', category: 'meat_fish' },
      { name: 'Rau mồng tơi và mướp hương', amount: '1 bó + 1 quả', estimatedPrice: '15.000đ', category: 'veggie' },
      { name: 'Tỏi băm, ớt băm, bơ lạt', amount: 'Vừa đủ', estimatedPrice: '8.000đ', category: 'spice_seasoning' },
      { name: 'Nước mắm Phú Quốc, mật ong, tiêu', amount: 'Gia vị bếp', estimatedPrice: '8.000đ', category: 'spice_seasoning' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Chiên vàng cánh gà bằng NCKD',
        instruction: 'Khía nhẹ cánh gà, ướp chút muối tiêu. Cho vào nồi chiên không dầu nướng 180°C trong 15 phút, sau đó lật mặt nướng 200°C thêm 5 phút cho da vàng giòn rụm.',
        durationMinutes: 20,
        chefTip: 'Thấm thật khô da gà trước khi nướng sẽ giúp da phồng giòn rụm.'
      },
      {
        stepNumber: 2,
        title: 'Làm sốt mắm tỏi mật ong kẹo sệt',
        instruction: 'Phi thơm nhiều tỏi băm với chút bơ lạt, cho 2 thìa nước mắm + 1.5 thìa mật ong + 1 thìa tương ớt + 1 thìa nước lọc. Đun sôi sệt lại rồi trút cánh gà nướng vào đảo đều 1 phút cho ngấm đều quanh cánh.',
        durationMinutes: 4,
      },
      {
        stepNumber: 3,
        title: 'Nấu canh ngao mồng tơi ngọt mát',
        instruction: 'Luộc ngao mở miệng vớt ra lấy thịt, gạn lấy nước luộc trong. Đun sôi lại nước ngao, thả mướp thái vát và rau mồng tơi vào, nêm xíu muối hạt nêm. Canh sôi 1 phút tắt bếp ngay để rau xanh mướt.',
        durationMinutes: 8,
      }
    ],
    chefAdvice: 'Món gà dùng mật ong thay đường sẽ có màu óng ả và vị ngọt hậu thanh, không bị cháy khét.'
  }
];

export const LUCKY_WHEEL_ITEMS = [
  { name: 'Sườn Xào Chua Ngọt', category: 'Món mặn đưa cơm', icon: '🍖', color: '#F97316' },
  { name: 'Phở Bò Tái Lăn', category: 'Món nước đặc sản', icon: '🍜', color: '#EF4444' },
  { name: 'Thịt Kho Tộ + Canh Rau', category: 'Mâm cơm gia đình', icon: '🍲', color: '#EAB308' },
  { name: 'Cơm Tấm Sườn Bì Chả', category: 'Đậm đà Sài Gòn', icon: '🍛', color: '#84CC16' },
  { name: 'Bún Chả Hà Nội', category: 'Thơm nức than hoa', icon: '🥢', color: '#10B981' },
  { name: 'Cá Diêu Hồng Hấp Xì Dầu', category: 'Thanh đạm ngọt thịt', icon: '🐟', color: '#06B6D4' },
  { name: 'Gà Nướng Nồi Chiên + Salad', category: 'Nhanh gọn Healthy', icon: '🍗', color: '#3B82F6' },
  { name: 'Bò Xào Hành Tây + Canh Ngao', category: 'Dễ nấu giàu kẽm', icon: '🥩', color: '#8B5CF6' },
  { name: 'Bún Bò Huế Cay Nồng', category: 'Hương vị Cố Đô', icon: '🌶️', color: '#EC4899' },
  { name: 'Đậu Hũ Sốt Cà Chua + Trứng Chiên', category: 'Sinh viên tiết kiệm', icon: '🍳', color: '#F59E0B' },
];

export const FRIDGE_COMMON_ITEMS = [
  { name: 'Trứng gà/vịt', category: 'Đạm' },
  { name: 'Thịt heo (ba chỉ/nạc)', category: 'Đạm' },
  { name: 'Thịt bò', category: 'Đạm' },
  { name: 'Ức gà / Đùi gà', category: 'Đạm' },
  { name: 'Tôm tươi / Tôm khô', category: 'Đạm' },
  { name: 'Đậu phụ', category: 'Đạm' },
  { name: 'Cà chua', category: 'Rau củ' },
  { name: 'Rau muống / Mồng tơi', category: 'Rau củ' },
  { name: 'Bắp cải / Cải ngọt', category: 'Rau củ' },
  { name: 'Khoai tây / Cà rốt', category: 'Rau củ' },
  { name: 'Nấm các loại', category: 'Rau củ' },
  { name: 'Hành tây / Hành lá', category: 'Gia vị' },
  { name: 'Kim chi', category: 'Khác' },
  { name: 'Xúc xích / Lạp xưởng', category: 'Đạm' },
];

export const TRIO_MENU_PRESETS = [
  {
    title: 'Mâm Cơm Thanh Mát Ngày Hè',
    tagline: 'Giải nhiệt cơ thể, ngọt nước, dễ nuốt',
    budget: '~120.000đ',
    time: '30 phút',
    items: ['Thịt ba chỉ luộc chấm mắm tôm/mắm tỏi', 'Rau muống luộc dầm sấu/chanh', 'Đậu phụ rán vàng giòn'],
  },
  {
    title: 'Mâm Cơm Đưa Cơm Ngày Mưa',
    tagline: 'Vị đậm đà ấm áp, thơm lừng mùi gừng tiêu',
    budget: '~150.000đ',
    time: '35 phút',
    items: ['Gà kho gừng sả đậm vị', 'Canh bí xanh nấu tôm nõn', 'Bắp cải xào cà chua'],
  },
  {
    title: 'Mâm Cơm Tiết Kiệm Nhanh Gọn',
    tagline: 'Dành cho sinh viên hoặc ngày bận rộn',
    budget: '~65.000đ',
    time: '20 phút',
    items: ['Trứng cuộn thịt bằm hành hoa', 'Canh cà chua trứng đậu phụ', 'Rau bắp cải luộc chấm trứng'],
  },
  {
    title: 'Mâm Cơm Cuối Tuần Thịnh Soạn',
    tagline: 'Thết đãi gia đình, bổ dưỡng đầy đủ',
    budget: '~220.000đ',
    time: '45 phút',
    items: ['Sườn non rim dừa béo bùi', 'Canh sườn hầm củ quả', 'Mực xào cần tây tỏi tây'],
  },
];
