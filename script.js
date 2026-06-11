/**
 * 서봉초등학교 아침 글쓰기 주제 추천 & 기록 시스템 전반 제어 스크립트
 */

// 학생 목록 데이터베이스정의
const studentsList = {
    "S101": { name: "김민준", role: "학생" },
    "S102": { name: "이서아", role: "학생" },
    "S103": { name: "박도현", role: "학생" },
    "ADMIN77": { name: "임선생님", role: "관리자" }
};

// 학년별 글쓰기 주제 목록 (초등학교 교사 맞춤 가독성 및 눈높이 조정)
const writingTopics = {
    1: [
        "내가 만약 말할 수 있는 귀여운 강아지가 된다면 어떨까요?",
        "어젯밤 내 꿈에 나타난 신비로운 비밀의 문을 열었더니?",
        "가장 좋아하는 장난감이 밤에 몰래 살아 움직인다면?",
        "내가 우주선 주방장이 된다면 외계인들에게 어떤 요리를 만들어줄까?",
        "눈을 떴더니 손가락만 한 엄지동자가 되었다면 어떤 모험을 할까?",
        "하늘에서 달콤한 사탕 비가 내린다면 내가 할 일은?"
    ],
    2: [
        "딱 하루 동안만 투명인간이 되는 마법 망토가 생긴다면?",
        "내가 생각하는 나만의 가장 소중한 보물 1호와 그것에 얽힌 소중한 비밀",
        "동물들과 대화할 수 있는 마법 물약을 먹었다면 가장 먼저 누구와 얘기할까?",
        "기억에 남는 가족과의 소중한 여행 중 최고의 한 장면",
        "새로운 아름다운 계절이 하나 생긴다면 어떤 날씨로 이름을 지을까?",
        "내가 가장 아끼는 내 짝꿍의 멋진 매력 3가지 써보기"
    ],
    3: [
        "타임머신이 있다면 아주 미래의 나를 만나고 싶을까 과거로 갈까?",
        "기분 좋은 칭찬 한 마디가 오늘 나의 아침을 어떻게 기쁘게 만들었나요?",
        "내가 우리 동네를 지키는 초능력 영웅 '히어로'가 된다면 해보고 싶은 일",
        "놀이터 미끄럼틀 밑에 비밀 지하 아지트가 있다면 어떤 모습일까?",
        "동화책 속의 주인공을 딱 한 명 초대해 함께 급식을 먹는다면?",
        "하루 동안 부모님이 되고, 부모님이 내가 된다면 어떨까요?"
    ],
    4: [
        "세상에서 단 하나뿐인 내 상상 속의 발명품을 묘사하고 설계해보기",
        "진정한 친한 친구란 무엇일까요? 내가 생각하는 멋진 친구의 모습",
        "하루 동안 우리 학교의 교장 선생님이 된다면 바꾸고 싶은 즐거운 규칙",
        "우리가 잘 아는 흥부와 놀부 이야기의 뒤를 내 마음대로 바꾸어 쓴다면?",
        "아침에 기분 좋은 향기를 눈으로 볼 수 있다면 세상은 어떤 색깔일까?",
        "지구를 아프지 않게 하기 위해 오늘 학교에서 실천할 수 있는 작은 약속"
    ],
    5: [
        "나에게 갑자기 백만 원이 생긴다면 어떻게 가치 있고 행복하게 쓸 것인가?",
        "역사 속 위인 중 한 분을 직접 만난다면 나누고 싶은 가장 깊은 대화",
        "나에게 큰 성장과 가르침을 선물했던 실수나 실패의 아름다운 경험담",
        "미래의 인공지능(AI) 로봇과 베프(단짝)가 된다면 하고 싶은 일상",
        "스마트폰 메시지를 주고받을 때 우리가 꼭 지켜야 할 바른 언어 습관"
    ],
    6: [
        "서로 생각이 다른 친구를 만났을 때, 다름을 존중하는 현명한 나의 자세",
        "중학교에 들어가기 전 초등학교 생활에서 꼭 이뤄보고 싶은 멋진 목표",
        "인상 깊었던 영화나 책 속 명대사를 적고 나에게 준 교훈이나 감동 쓰기",
        "미래의 멋진 나의 직업과, 그 직업을 가졌을 때의 나의 완벽한 하루",
        "어려움이 다가와도 씩씩하게 극복해낸 나만의 도전 정신 자랑하기"
    ]
};

// 상태 관리 전역 변수들
let currentUser = null; // { code, name, role }
let selectedGradeNum = null;
let currentTopicText = "";
let firebaseUnsubscribe = null;

// Firebase 라이브러리 연동 후 로딩 완료 시 자동 호출되는 안전 장치
window.onFirebaseReady = function() {
    // Firebase 익명 로그인 인증 진행
    if (window.firebaseAuthSignIn) {
        window.firebaseAuthSignIn(window.auth)
            .then(() => {
                console.log("Firebase 인증 연결 성공");
            })
            .catch((error) => {
                console.error("Firebase 익명 로그인 에러:", error);
            });
    }
};

// 1. 로그인 핸들링 함수
function handleLogin() {
    const codeInput = document.getElementById('loginCodeInput').value.trim().toUpperCase();
    
    if (!codeInput) {
        alert("코드를 입력해 주세요!");
        return;
    }

    if (studentsList[codeInput]) {
        currentUser = {
            code: codeInput,
            name: studentsList[codeInput].name,
            role: studentsList[codeInput].role
        };

        // 로컬 UI 업데이트
        document.getElementById('userNameDisplay').innerText = currentUser.name;
        document.getElementById('userRoleDisplay').innerText = `(${currentUser.role})`;
        
        // 화면 전환 처리
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('appSection').classList.remove('hidden');

        // 관리자인 경우 학생 선택 필터 및 기능 제어
        const adminFilter = document.getElementById('adminFilterContainer');
        const historySubTitle = document.getElementById('historySubTitle');
        const historyTitle = document.getElementById('historyTitle');
        
        if (currentUser.role === '관리자') {
            adminFilter.classList.remove('hidden');
            historyTitle.innerText = "학급 글쓰기 현황";
            historySubTitle.innerText = "학생들의 생각 보관함을 실시간으로 관리하세요.";
        } else {
            adminFilter.classList.add('hidden');
            historyTitle.innerText = "나의 글쓰기 생각 보관함";
            historySubTitle.innerText = "내가 그동안 기록한 멋진 생각들이 보관되어 있어요.";
        }

        // 기본 탭인 '주제 선택' 탭 활성화
        switchTab('topic');
        
    } else {
        alert("올바르지 않은 코드입니다. 학생 개별 코드를 확인해 주세요.");
    }
}

// 2. 로그아웃 핸들링 함수
function handleLogout() {
    // 구독 리스너 해제
    if (typeof firebaseUnsubscribe === 'function') {
        firebaseUnsubscribe();
    }
    currentUser = null;
    selectedGradeNum = null;
    currentTopicText = "";
    lastTopic = "";

    // 입력 필드 초기화
    document.getElementById('loginCodeInput').value = "";
    document.getElementById('writingTextarea').value = "";
    document.getElementById('chosenTopicDisplay').innerText = "아직 선택된 주제가 없습니다. 주제 선택 탭으로 이동해보세요!";
    
    // UI 원복
    document.getElementById('topicSelectionArea').classList.add('hidden');
    document.getElementById('defaultTopicInstruction').classList.remove('hidden');
    document.getElementById('refreshBtn').classList.add('hidden');
    document.getElementById('topicCheckbox').checked = false;

    // 학년 버튼 원복
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`btn-${i}`);
        if (btn) btn.className = "btn-bounce bg-[#fdfaf2] hover:bg-[#fff7d9] border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs shadow-sm";
    }

    document.getElementById('appSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// 3. 탭 전환 처리 시스템
function switchTab(tabId) {
    // 모든 탭 컨텐츠 숨기기
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.add('hidden'));

    // 하단 내비게이션 활성화 비활성화 상태 색상 초기화
    const tabs = ['topic', 'write', 'history'];
    tabs.forEach(t => {
        const nav = document.getElementById(`nav-${t}`);
        if (nav) {
            nav.className = "flex flex-col items-center flex-1 py-1 text-gray-400 font-medium";
        }
    });

    // 지정 탭 보이기 및 스타일 업데이트
    const activeContent = document.getElementById(`tabContent-${tabId}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }

    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.className = "flex flex-col items-center flex-1 py-1 text-[#794acf] font-extrabold";
    }

    // 탭별 추가 처리
    if (tabId === 'history') {
        loadHistoryData();
    }
}

// 4. 학년 선택 및 주제 골라오기
let lastTopic = "";
function selectGrade(grade) {
    selectedGradeNum = grade;

    // 버튼 스타일 제어
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`btn-${i}`);
        if (btn) {
            btn.className = "btn-bounce bg-[#fdfaf2] hover:bg-[#fff7d9] border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs shadow-sm";
        }
    }

    const activeBtn = document.getElementById(`btn-${grade}`);
    if (activeBtn) {
        activeBtn.className = "btn-bounce bg-[#ffd21a] hover:bg-[#ffc200] border-2 border-[#b88c00] text-[#332200] font-extrabold py-2 rounded-xl text-xs shadow-md scale-105";
    }

    // 버튼 노출 제어
    document.getElementById('refreshBtn').classList.remove('hidden');
    
    // 무작위 주제 선정 후 표시
    showRandomTopic();
}

function showRandomTopic() {
    if (!selectedGradeNum) return;

    const topics = writingTopics[selectedGradeNum];
    let randomTopic = topics[Math.floor(Math.random() * topics.length)];

    while (randomTopic === lastTopic && topics.length > 1) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
    }
    lastTopic = randomTopic;
    currentTopicText = randomTopic;

    // 체크박스 해제 및 세팅
    const chk = document.getElementById('topicCheckbox');
    if (chk) chk.checked = false;

    // DOM 업데이트
    document.getElementById('defaultTopicInstruction').classList.add('hidden');
    const selectionArea = document.getElementById('topicSelectionArea');
    selectionArea.classList.remove('hidden');

    const topicLabel = document.getElementById('topicText');
    topicLabel.innerHTML = `<span class="text-[#8c651e] font-extrabold text-[11px] block">[${selectedGradeNum}학년 추천]</span> ${randomTopic}`;
}

function refreshTopic() {
    showRandomTopic();
}

// 5. 주제 선택 체크 시 작동하는 트리거 및 탭 자동 전환
function confirmTopicSelection() {
    const chk = document.getElementById('topicCheckbox');
    if (chk && chk.checked) {
        // 선택주제 글쓰기 탭에 주제 주입
        const chosenTopicDisplay = document.getElementById('chosenTopicDisplay');
        chosenTopicDisplay.innerHTML = `<span class="text-[#794acf] font-extrabold">[${selectedGradeNum}학년]</span> "${currentTopicText}"`;
        
        // 짧은 이펙트를 주기 위해 0.2초 후에 탭 전환
        setTimeout(() => {
            switchTab('write');
        }, 220);
    }
}

// 6. Firebase Firestore 데이터 저장 비즈니스 로직
async function savePostToFirebase() {
    if (!currentUser) return;

    const content = document.getElementById('writingTextarea').value.trim();
    if (!content) {
        alert("글쓰기 내용을 작성한 다음 보관해 보세요! 😊");
        return;
    }

    if (!currentTopicText) {
        alert("선택된 글쓰기 주제가 없습니다. 주제선택 탭에서 골라주세요!");
        return;
    }

    try {
        const app_id = "seobong-morning-writing-v1"; // 고유 앱 ID
        const postCollection = collection(window.db, "artifacts", app_id, "public", "data", "writingPosts");

        // 업로드 데이터 객체 형성
        const writingData = {
            studentCode: currentUser.code,
            studentName: currentUser.name,
            topic: currentTopicText,
            grade: selectedGradeNum || "공통",
            content: content,
            timestamp: new Date().toISOString()
        };

        // Firestore 문서 신규 작성 추가
        await addDoc(postCollection, writingData);

        // 글쓰기 창 클리어 및 안내
        document.getElementById('writingTextarea').value = "";
        alert("정성스레 쓴 글이 보관함에 안전하게 담겼어요! 🌟");

        // 기록 탭으로 즉각적인 전환 처리
        switchTab('history');

    } catch (e) {
        console.error("데이터 저장 실패 : ", e);
        alert("Firestore 저장 중 문제가 발생했습니다. 관리자 설정을 점검해 주세요.");
    }
}

// 7. Firebase 데이터 실시간 읽기 및 뷰어 렌더링
async function loadHistoryData() {
    if (!currentUser) return;

    // 구독중인 이전 리스너 해제 (메모리 누수 방지)
    if (typeof firebaseUnsubscribe === 'function') {
        firebaseUnsubscribe();
    }

    const app_id = "seobong-morning-writing-v1";
    const historyListContainer = document.getElementById('historyList');
    
    // 로딩 인디케이터 제공
    historyListContainer.innerHTML = `<p class="text-xs text-center text-gray-400 py-10">보관함에서 글을 꺼내오는 중입니다... 🧺</p>`;

    try {
        const postCollection = collection(window.db, "artifacts", app_id, "public", "data", "writingPosts");

        // 단순 정방향 읽기 수행 후 클라이언트 가공 (복잡 쿼리 금지 규칙 준수)
        firebaseUnsubscribe = onSnapshot(postCollection, (querySnapshot) => {
            let posts = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
            });

            // 시간순 내림차순 수동 정렬
            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // 로그인 주체별 필터 처리
            if (currentUser.role === '학생') {
                // 본인의 글만 보이도록 필터링
                posts = posts.filter(p => p.studentCode === currentUser.code);
            } else if (currentUser.role === '관리자') {
                // 관리자 지정 필터 값 읽기
                const filterValue = document.getElementById('adminStudentSelect').value;
                if (filterValue !== 'all') {
                    posts = posts.filter(p => p.studentCode === filterValue);
                }
            }

            // HTML 카드 템플릿 실시간 생성
            if (posts.length === 0) {
                historyListContainer.innerHTML = `
                    <div class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p class="text-xs text-gray-400 font-bold">아직 작성된 글이 없습니다. ✏️</p>
                    </div>`;
                return;
            }

            historyListContainer.innerHTML = "";
            posts.forEach(post => {
                const writeDate = new Date(post.timestamp);
                const formattedDate = `${writeDate.getFullYear()}-${String(writeDate.getMonth() + 1).padStart(2, '0')}-${String(writeDate.getDate()).padStart(2, '0')} ${String(writeDate.getHours()).padStart(2, '0')}:${String(writeDate.getMinutes()).padStart(2, '0')}`;

                const card = document.createElement('div');
                card.className = "bg-[#fffef7] border border-[#e5d5be] rounded-xl p-3.5 shadow-sm space-y-1.5 hover:shadow-md transition-shadow relative";
                
                // 학생 본인의 글 여부 표시 혹은 작성자 구분
                const authorTag = currentUser.role === '관리자' ? `<span class="bg-[#e9dff7] text-[#794acf] text-[10px] px-1.5 py-0.5 rounded-md font-extrabold mr-1.5">${post.studentName} (${post.grade}학년)</span>` : "";

                card.innerHTML = `
                    <div class="flex justify-between items-center text-[10px] text-gray-400 border-b border-dashed border-gray-100 pb-1.5">
                        <div class="flex items-center">
                            ${authorTag}
                            <span class="font-bold">⏰ ${formattedDate}</span>
                        </div>
                    </div>
                    <p class="text-xs font-bold text-[#8c651e] bg-[#fffbf0] py-1 px-1.5 rounded border border-[#f5ebcb]">주제: ${post.topic}</p>
                    <p class="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed pt-1">${post.content}</p>
                `;
                historyListContainer.appendChild(card);
            });
        }, (error) => {
            console.error("실시간 온스냅샷 동기화 중 오류 발생: ", error);
            historyListContainer.innerHTML = `<p class="text-xs text-center text-red-400 py-10">동기화 로딩 실패. 다시 한 번 시도해 주세요.</p>`;
        });

    } catch (err) {
        console.error("기록 호출 도중 심각한 에러 발생: ", err);
        historyListContainer.innerHTML = `<p class="text-xs text-center text-red-400 py-10">오류가 발생했습니다.</p>`;
    }
}