import type { QuizQuestion } from "../types";

export const quizKo: QuizQuestion[] = [
  {
    id: "q1",
    text: "파티에 가기 전, 오늘은 어떤 룩을 입을까?",
    options: [
      { id: "q1o1", label: "살짝 반짝이는 소재나 포인트가 있는 룩", type: "CHAMPAGNE" },
      { id: "q1o2", label: "편안하지만 은근히 멋스러운 캐주얼", type: "MOJITO" },
      { id: "q1o3", label: "실루엣이 돋보이는 세련된 룩", type: "WINE" },
      { id: "q1o4", label: "클래식하고 깔끔한 룩", type: "COGNAC" },
      { id: "q1o5", label: "컬러나 패턴이 눈에 띄는 룩", type: "FRUIT_PUNCH" },
      { id: "q1o6", label: "블랙 계열의 차분하고 분위기 있는 룩", type: "RUM" },
    ],
  },
  {
    id: "q2",
    text: "파티에 도착한 당신, 가장 먼저 어디로 향할까?",
    options: [
      { id: "q2o1", label: "음악이 가장 잘 들리는 곳", type: "FRUIT_PUNCH" },
      { id: "q2o2", label: "사람들이 많이 모여 있는 곳", type: "WINE" },
      { id: "q2o3", label: "예쁜 포토존이나 거울이 있는 곳", type: "CHAMPAGNE" },
      { id: "q2o4", label: "바가 있는 곳", type: "RUM" },
      { id: "q2o5", label: "재미있어 보이는 공간", type: "MOJITO" },
      { id: "q2o6", label: "조금 떨어진 조용한 곳", type: "COGNAC" },
    ],
  },
  {
    id: "q3",
    text: "테이블에 음식이 가득 차 있다면, 가장 먼저 손이 가는 것은?",
    options: [
      { id: "q3o1", label: "딸기·체리처럼 한입에 먹기 좋은 과일", type: "FRUIT_PUNCH" },
      { id: "q3o2", label: "치즈와 햄이 담긴 플래터", type: "WINE" },
      { id: "q3o3", label: "초콜릿이나 달콤한 디저트", type: "CHAMPAGNE" },
      { id: "q3o4", label: "올리브·허브가 들어간 가벼운 핑거푸드", type: "MOJITO" },
      { id: "q3o5", label: "톡 쏘는 소스가 들어간 매콤한 음식", type: "RUM" },
      { id: "q3o6", label: "천천히 음미하고 싶은 진한 디저트", type: "COGNAC" },
    ],
  },
  {
    id: "q4",
    text: "파티에서 사람들이 당신에게 끌리는 가장 큰 매력은?",
    options: [
      { id: "q4o1", label: "어디서든 분위기를 밝게 만드는 에너지", type: "FRUIT_PUNCH" },
      { id: "q4o2", label: "편하게 말을 걸게 만드는 친근함", type: "WINE" },
      { id: "q4o3", label: "자연스럽게 시선을 끄는 존재감", type: "CHAMPAGNE" },
      { id: "q4o4", label: "쉽게 읽히지 않는 묘한 분위기", type: "COGNAC" },
      { id: "q4o5", label: "장난스럽고 자유로운 매력", type: "MOJITO" },
      { id: "q4o6", label: "차분하지만 오래 기억에 남는 분위기", type: "RUM" },
    ],
  },
  {
    id: "q5",
    text: "파티가 무르익고, 마음에 드는 사람이 눈에 들어왔다면?",
    options: [
      { id: "q5o1", label: "먼저 자연스럽게 말을 건다", type: "RUM" },
      { id: "q5o2", label: "장난스럽게 분위기를 만든다", type: "MOJITO" },
      { id: "q5o3", label: "눈이 마주칠 때마다 은근히 신호를 보낸다", type: "CHAMPAGNE" },
      { id: "q5o4", label: "굳이 다가가지 않고 분위기를 즐긴다", type: "COGNAC" },
      { id: "q5o5", label: "친구처럼 편하게 가까워진다", type: "FRUIT_PUNCH" },
      { id: "q5o6", label: "서두르지 않고 천천히 상대를 살펴본다", type: "WINE" },
    ],
  },
  {
    id: "q6",
    text: "파티가 끝나갈 무렵, 당신은?",
    options: [
      { id: "q6o1", label: "마지막까지 음악을 즐기며 남아 있다", type: "FRUIT_PUNCH" },
      { id: "q6o2", label: "친해진 사람들과 자연스럽게 인사를 나눈다", type: "WINE" },
      { id: "q6o3", label: "오늘 찍은 사진을 확인하며 추억을 남긴다", type: "CHAMPAGNE" },
      { id: "q6o4", label: "마음에 드는 사람과 조용히 이야기를 나눈다", type: "RUM" },
      { id: "q6o5", label: "아직 재미있는 일이 남아 있을 것 같아 조금 더 돌아다닌다", type: "MOJITO" },
      { id: "q6o6", label: "여운을 즐기며 혼자 천천히 자리를 떠난다", type: "COGNAC" },
    ],
  },
];
