// 학년별 초등학생 눈높이에 맞춘 흥미진진한 작문 주제 목록 데이터베이스
const writingTopics = {
    1: [
        "내가 만약 말할 수 있는 귀여운 강아지가 된다면?",
        "어젯밤 내 꿈에 나타난 신비로운 비밀의 문 이야기",
        "가장 좋아하는 장난감이 밤에 몰래 살아 움직인다면?",
        "내가 우주선 주방장이 된다면 어떤 외계인 요리를 만들까?",
        "눈을 떴더니 내가 손가락만 한 엄지동자가 되어 있었다!",
        "하늘에서 사탕 비가 내린다면 나는 무엇을 제일 먼저 할까?",
        "엄마, 아빠 몰래 나만 알고 있는 우리 집 최고의 비밀 장소"
    ],
    2: [
        "나에게 딱 하루 동안만 투명인간이 되는 망토가 생긴다면?",
        "내가 가장 아끼는 소중한 보물 1호와 그것에 얽힌 비밀",
        "동물들과 대화할 수 있는 마법 물약을 마셨다! 첫 마디는?",
        "기억에 남는 가족과의 여행 중에서 가장 웃겼던 에피소드",
        "새로운 계절이 생긴다면 어떤 날씨와 이름을 지어주고 싶나요?",
        "내가 제일 싫어하는 채소(예: 당근, 시금치)가 나에게 말을 건다면?",
        "바닷속에 지어진 아주 특별한 우리들만의 해저 학교 풍경"
    ],
    3: [
        "타임머신이 있다면 아주 먼 미래로 가고 싶나요, 과거로 가고 싶나요?",
        "기분 좋은 칭찬 한 마디가 나의 하루를 어떻게 바꾸어 놓았는지 써보세요.",
        "내가 우리 동네를 지키는 초능력 영웅 '히어로'가 된다면 해보고 싶은 일",
        "놀이터 미끄럼틀 밑에 비밀 지하 기지가 있다면 그곳에는 무엇이 있을까?",
        "책 속의 주인공을 딱 한 명 현실로 초대할 수 있다면 누구를 부르고 싶나요?",
        "하루 동안 우리 집의 부모님이 되고, 부모님이 내가 된다면 일어날 일",
        "학교 끝난 운동장에 남아있는 노을을 바라보며 했던 생각들"
    ],
    4: [
        "세상에서 단 하나뿐인 나만의 멋진 발명품을 설계하고 소개해 보세요.",
        "진정한 친구란 어떤 사람일까요? 내가 생각하는 우정의 정의",
        "내가 하루 동안 우리 학교 교장 선생님이 된다면 바꾸고 싶은 규칙 3가지",
        "동화 '신데렐라'나 '아기돼지 삼형제'의 결말을 내 마음대로 바꾼다면?",
        "소리나 향기를 눈으로 볼 수 있다면 세상은 어떤 색깔로 가득 찰까요?",
        "최근에 나를 가장 화나게 하거나 억울하게 만들었던 일과 그것을 극복한 방법",
        "지구를 구하기 위해 우리가 지금 당장 실천할 수 있는 아주 작은 환경 습관"
    ],
    5: [
        "누군가 나에게 평생 쓸 수 있는 백만 원을 준다면 어떻게 가치 있게 쓸까?",
        "역사 속으로 들어가서 세종대왕님이나 이순신 장군님을 직접 만난다면 나누고 싶은 대화",
        "나에게 가장 큰 배움이나 깨달음을 주었던 실수 또는 실패의 경험 이야기",
        "내가 만약 인공지능(AI) 로봇과 단짝 친구가 된다면 어떤 하루를 보낼까?",
        "나만의 스트레스 해소 비법! 기분이 우울할 때 나를 위로해 주는 것은?",
        "인터넷이나 스마트폰 소통 속에서 우리가 꼭 지켜야 할 아름다운 언어 예절",
        "미래의 우주 도시에서 살아간다면 교통수단이나 주택은 어떤 모습일까?"
    ],
    6: [
        "다름과 틀림의 차이! 친구들과의 생각 차이를 존중해야 하는 이유와 나의 생각",
        "중학생이 되기 전에 내가 꼭 이루고 싶거나 도전해 보고 싶은 버킷리스트",
        "영화나 책을 보고 내 삶에 큰 영향을 주었던 주인공의 대사나 명언 소개하기",
        "미래에 내가 정말 행복하게 일하고 있을 멋진 나의 직업과 하루 일과 상상하기",
        "만약 세상의 모든 돈과 계급이 사라진다면 사람들은 어떤 기준으로 살아갈까?",
        "나에게 세 가지 소원을 들어주는 요술 램프가 생긴다면 빌고 싶은 진짜 소원들",
        "졸업을 앞둔 지금, 지난 초등학교 생활을 돌아보며 가장 감사했던 분들에게 쓰는 편지"
    ]
};

let selectedGradeNum = null;
let lastTopic = ""; // 중복 방지를 위한 직전 주제 임시 저장 변수

// 학년 버튼을 클릭했을 때 작동하는 함수
function selectGrade(grade) {
    selectedGradeNum = grade;

    // 1. 모든 학년 버튼의 스타일 초기화 (기본 디자인 적용)
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`btn-${i}`);
        if (btn) {
            btn.className = "btn-bounce bg-[#fdfaf2] hover:bg-[#fff7d9] border border-gray-200 text-gray-700 font-bold py-2.5 px-2 rounded-xl text-sm shadow-sm";
        }
    }

    // 2. 선택된 학년 버튼만 노란색 강조 디자인으로 변경
    const activeBtn = document.getElementById(`btn-${grade}`);
    if (activeBtn) {
        activeBtn.className = "btn-bounce bg-[#ffd21a] hover:bg-[#ffc200] border-2 border-[#b88c00] text-[#332200] font-extrabold py-2.5 px-2 rounded-xl text-sm shadow-md scale-105";
    }

    // 3. '다른 주제 살펴보기' 버튼 보이게 처리
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.classList.remove('hidden');
    }

    // 4. 무작위 주제 선정 및 노출
    showRandomTopic();
}

// 해당 학년에서 무작위로 주제를 골라 화면에 표시하는 함수
function showRandomTopic() {
    if (!selectedGradeNum) return;

    const topics = writingTopics[selectedGradeNum];
    let randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // 중복 방지 로직: 이전과 완전히 동일한 주제가 연속해서 나오지 않도록 함
    while (randomTopic === lastTopic && topics.length > 1) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
    }
    lastTopic = randomTopic;

    const topicText = document.getElementById('topicText');
    if (topicText) {
        // 투명도 애니메이션과 함께 새 주제 삽입
        topicText.style.opacity = 0;
        setTimeout(() => {
            topicText.innerHTML = `<span class="text-[#8c651e] font-extrabold text-base">[${selectedGradeNum}학년 글쓰기]</span><br><span class="text-gray-800 text-base md:text-lg block mt-2">"${randomTopic}"</span>`;
            topicText.style.opacity = 1;
        }, 150);
    }
}

// '다른 주제 살펴보기' 버튼 클릭 시 실행될 함수
function refreshTopic() {
    showRandomTopic();
}