# 🕊️ 전령 비둘기 편지 키오스크 (Pigeon Post Kiosk)

> **"마음을 적어 띄우면, 전령새가 하늘길을 건너 당신의 소중한 사람에게 닿습니다."**  
> 이메일과 전화번호로 마음을 전하는 아날로그 감성 비둘기 편지 배달 키오스크입니다. 지도 위에서 실제 거리를 비행하고, 목적지에 닿으면 편지가 3차원 입체로 펼쳐집니다.

---

## ✨ 핵심 기능 (Key Features)

1. **아날로그 편지 작성대 (Letter Composer)**
   - 수신자 이메일 및 휴대폰 번호 입력 및 유효성 검증
   - 출발지 및 도착지 거점 선택 (서울, 부산, 제주, 강릉, 대구, 대전, 광주, 전주, 속초, 독도 등)
   - 5종 고서 지질 (양피지, 크라프트지, 벚꽃지, 은하수지, 청록지) 및 흘림 손글씨/정갈한 명조 서체 선택
   - 비둘기 전령 기념 우표 및 4색 실링 왁스 인장 (크림슨, 골드, 네이비, 에메랄드) 커스텀
   - 감성적인 편지 템플릿 원클릭 적용

2. **편지 3단 접기 및 밀봉 연출 (Origami Tri-Fold)**
   - 작성 완료 시 편지가 3단으로 접혀 우편 봉투에 들어가고, 왁스 인장이 찍히며 전령새가 출항하는 시네마틱 애니메이션

3. **실시간 지도 비행 시뮬레이션 (Flight Map & Simulation)**
   - **하버사인 공식(Haversine Formula)** 대원거리($\text{km}$) 및 비둘기 실제 비행 속도($65\text{ km/h}$) 기반 시간 계산
   - 2차 베지에 곡선(Quadratic Bezier Curve) 궤적 및 비행 접선 각도 자동 뱅킹
   - 날갯짓 공기역학 애니메이션 및 실시간 순항 고도, 풍향/풍속, 통과 랜드마크 텔레메트리
   - 배속 컨트롤 (1x, 3x, 8x, 즉시 도착 버튼)

4. **도착 알림 및 3D 편지 펼침 연출 (Delivery & Unfolding)**
   - 전령 비둘기 착륙 및 축하 금빛 깃털 캔버스 파티클
   - 수신자 이메일 수신함 및 휴대폰 알림톡 뷰
   - 왁스 인장이 깨지며 3D 원근법으로 편지지가 스르륵 펼쳐지는 오리가미 연출
   - 우체국 공식 소인 도장 (출발-도착지, 거리, 날짜 각인)
   - 브라우저 Web Speech API 한국어 음성 낭독 (TTS), 인쇄/PDF 저장, 답장 비둘기 띄우기

5. **Web Audio API 절차적 사운드 효과 (Zero-Asset Audio)**
   - 외부 오디오 파일 없이 브라우저 내장 오실레이터와 노이즈 필터로 펜 사각거림, 인장 쿵 소리, 깃털 날갯짓 소리, 은은한 차임벨 합성

---

## 🚀 100% 무료 이메일 & 전화번호 연동 가이드 (Free Tiers)

이 프로젝트는 깃허브 공개 및 개인 프로젝트를 위해 **100% 무료 버전(Free Tier)**만으로 실제 이메일과 문자를 보낼 수 있도록 설계되었습니다.

### 1. 무료 이메일 발송: Resend API (월 3,000건 / 일 100건 무료)
- **비용**: 100% 평생 무료 (신용카드 등록 불필요)
- **발급 방법**:
  1. [resend.com](https://resend.com) 가입 (30초 소요)
  2. **API Keys** 메뉴에서 `Create API Key` 클릭
  3. 발급받은 키를 `.env` 파일의 `RESEND_API_KEY`에 입력:
     ```env
     RESEND_API_KEY="re_1234567890abcdef"
     RESEND_FROM_EMAIL="Pigeon Post <onboarding@resend.dev>"
     ```
  4. 이제 편지가 도착하면 입력한 수신자 이메일로 고서 편지지 스타일의 실제 HTML 메일이 도착합니다!

---

### 2. 무료 휴대폰 문자(SMS) 발송: 3가지 무료 옵션

#### 옵션 A: 모바일 스마트폰 기본 문자앱 직접 전송 (0원 무료 · API 키 불필요)
- 수신처 도착 시 **[기본 문자앱으로 무료 발송 (0원)]** 버튼 제공.
- 스마트폰 브라우저에서 터치 시 스마트폰 내장 문자(SMS) 앱이 즉시 실행되며, 수신인 번호와 편지 열람 링크가 채워져 **통신사 무료 기본 문자로 100% 무료 전송**됩니다.

#### 옵션 B: 카카오톡 및 모바일 메신저 무료 공유 (Web Share API)
- **[카카오/공유]** 버튼을 통해 스마트폰의 카카오톡, 라인, 메시지 앱 등으로 편지 링크를 친구에게 무제한 무료 공유할 수 있습니다.

#### 옵션 C: Twilio Free Trial ($15 무료 체험 크레딧)
- [twilio.com](https://twilio.com) 가입 시 제공되는 **$15 무료 체험 크레딧**을 사용해 API로 직접 SMS를 전송할 수 있습니다.
  ```env
  TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxx"
  TWILIO_AUTH_TOKEN="your_auth_token"
  TWILIO_PHONE_NUMBER="+1234567890"
  ```

> 💡 **제로 컨피그(Zero-Config) 시뮬레이션 지원**:  
> API 키를 입력하지 않아도 에러 없이 화면 상의 **가상 수신함 시뮬레이션 모드**로 100% 안전하게 작동합니다.

---

## 🛠️ 로컬 개발 및 실행 방법 (Quick Start)

### 사전 요구사항
- Node.js 18.0 이상
- npm 또는 bun / pnpm

### 설치 및 구동
```bash
# 1. 저장소 클론
git clone https://github.com/your-username/pigeon-post-kiosk.git
cd pigeon-post-kiosk

# 2. 의존성 패키지 설치
npm install

# 3. 환경 변수 설정 (.env 파일 생성)
cp .env.example .env

# 4. 개발 서버 시작 (포트 3000)
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하면 키오스크를 체험할 수 있습니다.

---

## 📂 프로젝트 구조 (Project Structure)

```
├── server.ts                    # Express + Resend/Twilio 무료 API 프록시 + Vite 미들웨어
├── index.html                   # 한국어 폰트(나눔명조, 나눔손글씨) 및 메타태그
├── package.json                 # 스크립트 및 의존성
├── .env.example                 # 무료 API 키 안내 템플릿
├── src/
│   ├── App.tsx                  # 키오스크 상태 머신(Compose-Folding-Flight-Delivered)
│   ├── types.ts                 # 서신 데이터, 지리 좌표, 텔레메트리 타입 정의
│   ├── components/
│   │   ├── Header.tsx           # 탑 내비게이션 바 & 오디오 컨트롤
│   │   ├── LetterComposer.tsx   # 편지 작성대 (지질, 우표, 인장, 연락처)
│   │   ├── LetterFolding.tsx    # 3D 편지 접기 및 왁스 인장 밀봉 시퀀스
│   │   ├── FlightSimulation.tsx # 비둘기 비행 맵 및 계기판 대시보드
│   │   ├── KoreaMap.tsx         # 한반도 지리 벡터 맵 & 2차 베지에 궤적 렌더러
│   │   ├── PigeonSvg.tsx        # 날갯짓 애니메이션 벡터 비둘기 (편지 물고 비행)
│   │   ├── LetterArrival.tsx    # 수신자 도착 알림, 3D 편지 펼침, TTS, 답장
│   │   ├── ConfettiCanvas.tsx   # 금빛 깃털 및 장미꽃잎 파티클 캔버스
│   │   └── SystemArchitectureModal.tsx # 전체 시스템 구현 원리 설명서 모달
│   └── utils/
│       ├── geo.ts               # 하버사인 거리 계산, 베지에 제어점, 랜드마크 계산
│       ├── audio.ts             # Web Audio API 절차적 사운드 신디사이저
│       └── deliveryService.ts   # Resend / Twilio / SMS URI 무료 발송 클라이언트
```

---

## 📜 라이선스 (License)

Apache-2.0 License. 자유롭게 포크하고 배포하실 수 있습니다.
