import type { ResultContent, DrinkType } from "../types";

export const resultsKo: Record<DrinkType, ResultContent> = {
  WINE: {
    type: "WINE",
    displayName: "WINE",
    personalityTitle: "말없이 분위기를 압도하는 사람",
    aboutYou:
      "굳이 애쓰지 않아도 자연스럽게 시선이 모이는 타입. 화려하게 튀기보다는 편안하면서도 세련된 존재감으로 공간의 분위기를 은은하게 리드합니다. 사람들과의 거리는 적당히 유지하면서도, 대화가 시작되면 깊이 있게 몰입하는 편.",
    notes: ["Berry", "Black Cherry", "Amber", "Woody"],
    scentDescription:
      "진하고 깊은 베리와 체리향이 우디 앰버와 만나 묵직하게 가라앉는 향. 화려하진 않지만 잔향이 오래 남아, 스쳐 지나간 후에도 존재감을 남기는 타입.",
    whyItFits:
      "애써 드러내지 않아도 자연스럽게 기억에 남는 당신처럼, 이 향도 처음엔 은은하지만 시간이 지날수록 깊어지며 존재감을 드러냅니다.",
    recommendedFor: "시끄럽게 말하지 않아도 자리를 장악하는, 조용한 카리스마를 가진 사람에게.",
  },
  FRUIT_PUNCH: {
    type: "FRUIT_PUNCH",
    displayName: "FRUIT PUNCH",
    personalityTitle: "공간에 활기를 채우는 사람",
    aboutYou:
      "어디에 있든 그 자리의 텐션을 끌어올리는 타입. 밝고 스스럼없는 에너지로 사람들을 자연스럽게 불러 모으고, 처음 보는 사람과도 금방 친해집니다. 파티가 끝날 때까지 에너지가 잘 안 꺼지는 편.",
    notes: ["Lychee", "Peach", "Honey", "Lime"],
    scentDescription:
      "리치와 복숭아의 달콤한 과즙감에 라임의 상큼함이 더해져 톡톡 튀는 향. 허니 노트가 은은한 달콤함으로 잔향을 부드럽게 마무리합니다.",
    whyItFits:
      "당신이 있는 곳엔 늘 활기가 돌듯, 이 향도 산뜻하고 발랄해서 스치기만 해도 주변 공기를 밝게 만듭니다.",
    recommendedFor: "가만히 있어도 주변이 시끌벅적해지는, 에너지 넘치는 분위기 메이커에게.",
  },
  RUM: {
    type: "RUM",
    displayName: "RUM",
    personalityTitle: "망설임 없이 다가가는 사람",
    aboutYou:
      "마음에 드는 사람이나 재미있어 보이는 상황이 있으면 망설이지 않고 먼저 다가가는 타입. 바 앞에서 편하게 대화를 트고, 장난기 있는 매력으로 순식간에 분위기를 편하게 만듭니다. 솔직하고 직진하는 스타일이라 오히려 신뢰가 갑니다.",
    notes: ["Vanilla", "Sweet", "Woody", "Spice"],
    scentDescription:
      "바닐라의 달콤함과 스파이스의 자극이 우디 베이스 위에서 균형을 이루는, 따뜻하면서도 은근히 대담한 향.",
    whyItFits:
      "망설임 없이 다가가는 당신처럼, 이 향도 처음부터 확실하게 존재감을 드러내면서도 바닐라의 다정함으로 편안한 인상을 남깁니다.",
    recommendedFor: "좋아하는 것 앞에서 솔직하고, 망설이기보다 먼저 움직이는 사람에게.",
  },
  CHAMPAGNE: {
    type: "CHAMPAGNE",
    displayName: "CHAMPAGNE",
    personalityTitle: "사진 속에서 유독 빛나는 사람",
    aboutYou:
      "살짝 반짝이는 디테일 하나로 분위기를 화사하게 만드는 타입. 포토존 앞에서 자연스럽게 예쁜 순간을 만들고, 마음에 드는 사람에게는 말보다 눈빛으로 은근하게 신호를 보냅니다. 파티가 끝난 뒤에도 오늘 찍은 사진을 다시 들여다보는 걸 좋아하는 편.",
    notes: ["Grapefruit", "Blackcurrant", "Pear", "Floral"],
    scentDescription:
      "자몽과 블랙커런트의 상큼한 탄산감이 배와 플로럴 노트로 부드럽게 이어지는, 샴페인 거품처럼 가볍고 화사한 향.",
    whyItFits:
      "은은하게 반짝이는 당신처럼, 이 향도 화려하게 튀기보다 스치는 순간마다 산뜻한 인상을 남깁니다.",
    recommendedFor: "요란하지 않아도 사진과 분위기 속에서 자연스럽게 빛나는 사람에게.",
  },
  MOJITO: {
    type: "MOJITO",
    displayName: "MOJITO",
    personalityTitle: "재미있는 걸 귀신같이 찾아내는 사람",
    aboutYou:
      "격식보다 편안함을 좋아하고, 어디에 재미있는 일이 있는지 기가 막히게 잘 찾아내는 타입. 장난스러운 농담으로 분위기를 가볍게 풀어주고, 한 곳에 오래 머물기보다 이곳저곳 자유롭게 돌아다니는 걸 즐깁니다.",
    notes: ["Mint", "Citrus", "Green Mandarin"],
    scentDescription:
      "민트의 청량함과 시트러스, 그린 만다린이 어우러진 상쾌하고 가벼운 향. 답답함 없이 산뜻하게 퍼지는 캐주얼한 무드.",
    whyItFits:
      "어디로 튈지 모르는 자유로운 당신처럼, 이 향도 무겁지 않고 경쾌하게 움직이며 산뜻한 에너지를 남깁니다.",
    recommendedFor: "규칙보다 재미를 따라가는, 가볍고 자유로운 매력을 가진 사람에게.",
  },
  COGNAC: {
    type: "COGNAC",
    displayName: "COGNAC",
    personalityTitle: "쉽게 읽히지 않는 깊이를 가진 사람",
    aboutYou:
      "화려하게 나서기보다 한 발짝 떨어져 분위기를 관망하는 걸 좋아하는 타입. 클래식하고 절제된 스타일을 선호하고, 쉽게 곁을 내주지 않아 묘한 존재감을 풍깁니다. 파티가 끝나갈 때쯤에도 서두르지 않고 여운을 충분히 즐기고서야 자리를 떠나는 편.",
    notes: ["Cedarwood", "Fig", "Spice", "Oak"],
    scentDescription:
      "시더우드와 오크의 깊은 우디함에 무화과의 은은한 단맛과 스파이스가 더해진, 묵직하고 여운이 긴 향.",
    whyItFits:
      "쉽게 파악되지 않는 당신의 깊이처럼, 이 향도 처음엔 절제돼 보이지만 시간이 지날수록 복합적인 매력을 드러냅니다.",
    recommendedFor: "말수는 적어도 존재감은 확실한, 클래식하고 깊이 있는 사람에게.",
  },
};
