/* eslint-disable max-len */
/* eslint-disable no-plusplus */

function jaccardIndex(str1, str2) {
  let intersection = 0;
  const set1 = new Set(str1.toLowerCase());
  const set2 = new Set(str2.toLowerCase());
  const union = new Set([...set1, ...set2]);
  set1.forEach(value => {
    if (set2.has(value)) {
      intersection++;
    }
  });
  return intersection / union.size;
}

function findSimilarEntries(chart1, chart2) {
  const combinedEntries = [];
  chart1.forEach(entry1 => {
    const match = chart2.find(entry2 => {
      const titleSimilarity = jaccardIndex(entry1.title, entry2.title);
      const artistSimilarity = jaccardIndex(entry1.artist, entry2.artist);
      return titleSimilarity > 0.8 && artistSimilarity > 0.8; // Adjust similarity threshold as needed
    });
    if (match) {
      combinedEntries.push({
        title: entry1.title,
        artist: entry1.artist,
        ranks: [{ chart: 'melonChart', rank: entry1.rank }, { chart: 'Chart List', rank: match.rank }],
      });
    }
  });
  return combinedEntries;
}

const melonChart = [
  { rank: '1', title: '나는 아픈 건 딱 질색이니까', artist: '(여자)아이들' },
  { rank: '2', title: '첫 만남은 계획대로 되지 않아', artist: 'TWS (투어스)' },
  { rank: '3', title: '밤양갱', artist: '비비 (BIBI)' },
  { rank: '4', title: 'Magnetic', artist: '아일릿(ILLIT)' },
  { rank: '5', title: 'Love wins all', artist: '아이유' },
  { rank: '6', title: 'EASY', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '7', title: '천상연', artist: '이창섭' },
  { rank: '8', title: '비의 랩소디', artist: '임재현' },
  { rank: '9', title: 'To. X', artist: '태연 (TAEYEON)' },
  { rank: '10', title: 'Smart', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '11', title: '예뻤어', artist: 'DAY6 (데이식스)' },
  {
    rank: '12',
    title: '그대만 있다면 (여름날 우리 X 너드커넥션 (Nerd Connection))',
    artist: '너드커넥션 (Nerd Connection)',
  },
  { rank: '13', title: '한 페이지가 될 수 있게', artist: 'DAY6 (데이식스)' },
  { rank: '14', title: '홀씨', artist: '아이유' },
  { rank: '15', title: 'Love 119', artist: 'RIIZE' },
  { rank: '16', title: '사랑은 늘 도망가', artist: '임영웅' },
  { rank: '17', title: 'Perfect Night', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '18', title: '헤어지자 말해요', artist: '박재정' },
  { rank: '19', title: '에피소드', artist: '이무진' },
  { rank: '20', title: '모래 알갱이', artist: '임영웅' },
  { rank: '21', title: 'Drama', artist: 'aespa' },
  { rank: '22', title: '우리들의 블루스', artist: '임영웅' },
  { rank: '23', title: '인사', artist: '범진' },
  {
    rank: '24',
    title: 'Seven (feat. Latto) - Clean Ver.',
    artist: '정국',
  },
  { rank: '25', title: 'Do or Die', artist: '임영웅' },
  { rank: '26', title: 'I AM', artist: 'IVE (아이브)' },
  { rank: '27', title: '다시 만날 수 있을까', artist: '임영웅' },
  { rank: '28', title: '꿈', artist: '태연 (TAEYEON)' },
  { rank: '29', title: 'WAY 4 LUV', artist: 'PLAVE' },
  { rank: '30', title: '사랑인가 봐', artist: '멜로망스' },
  { rank: '31', title: 'MANIAC', artist: 'VIVIZ (비비지)' },
  { rank: '32', title: '무지개', artist: '임영웅' },
  { rank: '33', title: '이제 나만 믿어요', artist: '임영웅' },
  { rank: '34', title: 'Super Lady', artist: '(여자)아이들' },
  { rank: '35', title: '너의 모든 순간', artist: '성시경' },
  { rank: '36', title: 'Polaroid', artist: '임영웅' },
  { rank: '37', title: 'Love Lee', artist: 'AKMU (악뮤)' },
  { rank: '38', title: 'London Boy', artist: '임영웅' },
  { rank: '39', title: 'Shopper', artist: '아이유' },
  { rank: '40', title: '아버지', artist: '임영웅' },
  { rank: '41', title: 'Hype Boy', artist: 'NewJeans' },
  { rank: '42', title: '인생찬가', artist: '임영웅' },
  { rank: '43', title: '봄날', artist: '방탄소년단' },
  { rank: '44', title: 'Welcome to the Show', artist: 'DAY6 (데이식스)' },
  { rank: '45', title: '사막에서 꽃을 피우듯', artist: '우디 (Woody)' },
  { rank: '46', title: 'Wife', artist: '(여자)아이들' },
  { rank: '47', title: '우리 영화', artist: 'PLAVE' },
  { rank: '48', title: 'A bientot', artist: '임영웅' },
  { rank: '49', title: 'Get A Guitar', artist: 'RIIZE' },
  { rank: '50', title: 'Watch Me Woo!', artist: 'PLAVE' },
  { rank: '51', title: 'Super Shy', artist: 'NewJeans' },
  { rank: '52', title: '퀸카 (Queencard)', artist: '(여자)아이들' },
  {
    rank: '53',
    title: '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지',
    artist: 'AKMU (악뮤)',
  },
  { rank: '54', title: 'From', artist: 'PLAVE' },
  { rank: '55', title: '연애편지', artist: '임영웅' },
  { rank: '56', title: 'Ditto', artist: 'NewJeans' },
  { rank: '57', title: '잘 지내자, 우리 (여름날 우리 X 로이킴)', artist: '로이킴' },
  { rank: '58', title: 'Baddie', artist: 'IVE (아이브)' },
  { rank: '59', title: '주저하는 연인들을 위해', artist: '잔나비' },
  { rank: '60', title: 'You & Me', artist: '제니 (JENNIE)' },
  { rank: '61', title: '사건의 지평선', artist: '윤하 (YOUNHA)' },
  { rank: '62', title: '사랑할 수밖에', artist: '볼빨간사춘기' },
  { rank: '63', title: '그대가 내 안에 박혔다(그내박)', artist: '순순희(기태)' },
  { rank: '64', title: 'Smoothie', artist: 'NCT DREAM' },
  { rank: '65', title: 'Deja Vu', artist: '투모로우바이투게더' },
  { rank: '66', title: 'ETA', artist: 'NewJeans' },
  { rank: '67', title: '취중고백', artist: '김민석' },
  { rank: '68', title: '후라이의 꿈', artist: 'AKMU (악뮤)' },
  { rank: '69', title: '버추얼 아이돌', artist: 'PLAVE' },
  { rank: '70', title: 'Dynamite', artist: '방탄소년단' },
  {
    rank: '71',
    title: '모든 날, 모든 순간 (Every day, Every Moment)',
    artist: '폴킴',
  },
  { rank: '72', title: '심(心)', artist: 'DK(디셈버)' },
  { rank: '73', title: 'Standing Next to You', artist: '정국' },
  { rank: '74', title: '사랑하지 않아서 그랬어', artist: '임한별' },
  {
    rank: '75',
    title: 'I Don\'t Think That I Like Her',
    artist: 'Charlie Puth',
  },
  { rank: '76', title: 'Spicy', artist: 'aespa' },
  { rank: '77', title: '사랑..그게 뭔데', artist: '지아' },
  { rank: '78', title: 'LOVE DIVE', artist: 'IVE (아이브)' },
  { rank: '79', title: '다정히 내 이름을 부르면', artist: '경서예지, 전건호' },
  { rank: '80', title: '해요 (2022)', artist: '#안녕' },
  { rank: '81', title: '기억해줘요 내 모든 날과 그때를', artist: '화곡동 청개구리' },
  { rank: '82', title: 'Kitsch', artist: 'IVE (아이브)' },
  {
    rank: '83',
    title: '이브, 프시케 그리고 푸른 수염의 아내',
    artist: 'LE SSERAFIM (르세라핌)',
  },
  { rank: '84', title: '별 떨어진다 (I Do)', artist: '디오 (D.O.)' },
  {
    rank: '85',
    title: 'Yes or No (Feat. 허윤진 of LE SSERAFIM, Crush)',
    artist: '그루비룸 (GroovyRoom)',
  },
  { rank: '86', title: '물론', artist: '허각' },
  {
    rank: '87',
    title: '파이팅 해야지 (Feat. 이영지)',
    artist: '부석순 (SEVENTEEN)',
  },
  { rank: '88', title: 'Merry PLLIstmas', artist: 'PLAVE' },
  { rank: '89', title: 'Steal The Show (From “엘리멘탈”)', artist: 'Lauv' },
  { rank: '90', title: 'After LIKE', artist: 'IVE (아이브)' },
  { rank: '91', title: '봄이 와도', artist: '로이킴' },
  { rank: '92', title: '손오공', artist: '세븐틴 (SEVENTEEN)' },
  {
    rank: '93',
    title: '건물 사이에 피어난 장미 (Rose Blossom)',
    artist: 'H1-KEY (하이키)',
  },
  { rank: '94', title: '벚꽃 엔딩', artist: '버스커 버스커' },
  { rank: '95', title: 'Dangerously', artist: 'Charlie Puth' },
  { rank: '96', title: '봄 사랑 벚꽃 말고', artist: 'HIGH4 (하이포), 아이유' },
  { rank: '97', title: 'Butter', artist: '방탄소년단' },
  { rank: '98', title: 'OMG', artist: 'NewJeans' },
  { rank: '99', title: '너의 편이 돼 줄게', artist: '다비치' },
  {
    rank: '100',
    title: '내일에서 기다릴게 (I\'ll See You There Tomorrow)',
    artist: '투모로우바이투게더',
  },
];

const genieChart = [
  { rank: '1', title: '나는 아픈 건 딱 질색이니까', artist: '(여자)아이들' },
  { rank: '2', title: '첫 만남은 계획대로 되지 않아', artist: 'TWS (투어스)' },
  { rank: '3', title: '밤양갱', artist: '비비 (BIBI)' },
  { rank: '4', title: 'EASY', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '5', title: 'Love wins all', artist: '아이유 (IU)' },
  { rank: '6', title: 'Magnetic', artist: '아일릿 (ILLIT)' },
  { rank: '7', title: '예뻤어', artist: 'DAY6 (데이식스)' },
  { rank: '8', title: '한 페이지가 될 수 있게', artist: 'DAY6 (데이식스)' },
  { rank: '9', title: '비의 랩소디', artist: '임재현' },
  { rank: '10', title: '천상연', artist: '이창섭' },
  { rank: '11', title: 'To. X', artist: '태연 (TAEYEON)' },
  { rank: '12', title: '에피소드', artist: '이무진' },
  {
    rank: '13',
    title: '그대만 있다면 (여름날 우리 X 너드커넥션 (Nerd Connection))',
    artist: '너드커넥션 (Nerd Connection)',
  },
  { rank: '14', title: '홀씨', artist: '아이유 (IU)' },
  { rank: '15', title: '헤어지자 말해요', artist: '박재정' },
  { rank: '16', title: 'Smart', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '17', title: 'Perfect Night', artist: 'LE SSERAFIM (르세라핌)' },
  { rank: '18', title: '인사', artist: '범진' },
  { rank: '19', title: 'I AM', artist: 'IVE (아이브)' },
  { rank: '20', title: 'Love 119', artist: 'RIIZE' },
  { rank: '21', title: 'Drama', artist: 'aespa' },
  { rank: '22', title: '사랑은 늘 도망가', artist: '임영웅' },
  { rank: '23', title: 'Love Lee', artist: 'AKMU (악뮤)' },
  { rank: '24', title: '너의 모든 순간', artist: '성시경' },
  { rank: '25', title: '사건의 지평선', artist: '윤하 (YOUNHA)' },
  { rank: '26', title: '후라이의 꿈', artist: 'AKMU (악뮤)' },
  { rank: '27', title: '사랑인가 봐', artist: '멜로망스 (MeloMance)' },
  { rank: '28', title: '심 (心)', artist: 'DK (디셈버)' },
  { rank: '29', title: 'Shopper', artist: '아이유 (IU)' },
  { rank: '30', title: 'Wife', artist: '(여자)아이들' },
  { rank: '31', title: '다정히 내 이름을 부르면', artist: '경서예지 & 전건호' },
  { rank: '32', title: '우리들의 블루스', artist: '임영웅' },
  { rank: '33', title: 'Hype Boy', artist: 'NewJeans' },
  { rank: '34', title: '이제 나만 믿어요', artist: '임영웅' },
  { rank: '35', title: '퀸카 (Queencard)', artist: '(여자)아이들' },
  { rank: '36', title: '사막에서 꽃을 피우듯', artist: '우디 (Woody)' },
  { rank: '37', title: 'Super Lady', artist: '(여자)아이들' },
  { rank: '38', title: 'Welcome to the Show', artist: 'DAY6 (데이식스)' },
  {
    rank: '39',
    title: 'I Don\'t Think That I Like Her',
    artist: 'Charlie Puth',
  },
  { rank: '40', title: '모래 알갱이', artist: '임영웅' },
  { rank: '41', title: 'Ditto', artist: 'NewJeans' },
  {
    rank: '42',
    title: 'Seven (Feat. Latto) (Clean Ver.)',
    artist: '정국',
  },
  { rank: '43', title: 'You & Me', artist: '제니 (JENNIE)' },
  { rank: '44', title: '봄이 와도', artist: '로이킴' },
  { rank: '45', title: 'Baddie', artist: 'IVE (아이브)' },
  { rank: '46', title: 'MANIAC', artist: 'VIVIZ (비비지)' },
  { rank: '47', title: '다시 만날 수 있을까', artist: '임영웅' },
  { rank: '48', title: '무지개', artist: '임영웅' },
  { rank: '49', title: 'Do or Die', artist: '임영웅' },
  { rank: '50', title: 'ETA', artist: 'NewJeans' },
  { rank: '51', title: 'Kitsch', artist: 'IVE (아이브)' },
  { rank: '52', title: 'Super Shy', artist: 'NewJeans' },
  { rank: '53', title: '그대가 내 안에 박혔다 (그내박)', artist: '순순희 (기태)' },
  { rank: '54', title: 'Dangerously', artist: 'Charlie Puth' },
  { rank: '55', title: '잘 지내자, 우리 (여름날 우리 X 로이킴)', artist: '로이킴' },
  { rank: '56', title: 'London Boy', artist: '임영웅' },
  { rank: '57', title: 'After LIKE', artist: 'IVE (아이브)' },
  { rank: '58', title: '물론', artist: '허각' },
  { rank: '59', title: '주저하는 연인들을 위해', artist: '잔나비' },
  { rank: '60', title: '건물 사이에 피어난 장미', artist: 'H1-KEY (하이키)' },
  { rank: '61', title: '영원', artist: 'DK (디셈버)' },
  { rank: '62', title: 'Polaroid', artist: '임영웅' },
  { rank: '63', title: '나의 X에게', artist: '경서' },
  { rank: '64', title: '아버지', artist: '임영웅' },
  { rank: '65', title: '꿈', artist: '태연 (TAEYEON)' },
  { rank: '66', title: '너의 편이 돼 줄게', artist: '다비치' },
  { rank: '67', title: 'LOVE DIVE', artist: 'IVE (아이브)' },
  {
    rank: '68',
    title: '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지',
    artist: 'AKMU (악뮤)',
  },
  { rank: '69', title: 'Spicy', artist: 'aespa' },
  { rank: '70', title: '흔들리는 꽃들 속에서 네 샴푸향이 느껴진거야', artist: '장범준' },
  { rank: '71', title: 'A bientot', artist: '임영웅' },
  {
    rank: '72',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
  },
  {
    rank: '73',
    title: '모든 날, 모든 순간 (Every day, Every Moment)',
    artist: '폴킴',
  },
  { rank: '74', title: '사랑하지 않아서 그랬어', artist: '임한별' },
  { rank: '75', title: 'Attention', artist: 'NewJeans' },
  {
    rank: '76',
    title: 'Smoke (Prod. by Dynamicduo & Padi)',
    artist: '다이나믹 듀오 & 이영지',
  },
  { rank: '77', title: '인생찬가', artist: '임영웅' },
  { rank: '78', title: '취중고백', artist: '김민석' },
  { rank: '79', title: 'When I Get Old', artist: 'Christopher & 청하' },
  {
    rank: '80',
    title: '이브, 프시케 그리고 푸른 수염의 아내',
    artist: 'LE SSERAFIM (르세라핌)',
  },
  { rank: '81', title: '해요 (2022)', artist: '#안녕' },
  { rank: '82', title: '연애편지', artist: '임영웅' },
  { rank: '83', title: 'Get A Guitar', artist: 'RIIZE' },
  { rank: '84', title: '희재', artist: '성시경' },
  { rank: '85', title: 'Discord', artist: 'QWER' },
  { rank: '86', title: '2002', artist: 'Anne-Marie' },
  { rank: '87', title: 'The Drum', artist: 'Alan Walker' },
  { rank: '88', title: '숲', artist: '최유리' },
  { rank: '89', title: '칵테일 사랑', artist: '경서' },
  { rank: '90', title: 'That\'s Hilarious', artist: 'Charlie Puth' },
  { rank: '91', title: '손오공', artist: '세븐틴 (SEVENTEEN)' },
  { rank: '92', title: 'BODY', artist: '하이라이트 (Highlight)' },
  {
    rank: '93',
    title: '파이팅 해야지 (Feat. 이영지)',
    artist: '부석순 (SEVENTEEN)',
  },
  { rank: '94', title: '사랑..그게 뭔데', artist: '지아' },
  { rank: '95', title: '미안해 미워해 사랑해', artist: 'Crush' },
  { rank: '96', title: 'OMG', artist: 'NewJeans' },
  { rank: '97', title: 'Off My Face', artist: 'Justin Bieber' },
  { rank: '98', title: '그라데이션', artist: '10CM' },
  { rank: '99', title: '벚꽃 엔딩', artist: '버스커 버스커 (Busker Busker)' },
  { rank: '100', title: 'TOMBOY', artist: '(여자)아이들' },
];

const similarEntries = findSimilarEntries(melonChart, genieChart);
console.dir(similarEntries, { depth: 100 });