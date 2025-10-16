# 🏢 CRO 클라이언트 관리 시스템

**다중 사용자를 지원하는 전문적인 CRO(Contract Research Organization) 클라이언트 관리 통합 솔루션**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)
![Mobile](https://img.shields.io/badge/mobile-optimized-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 목차

- [🎯 프로젝트 개요](#-프로젝트-개요)
- [✨ 주요 기능](#-주요-기능)
- [🛠 기술 스택](#-기술-스택)
- [🚀 빠른 시작](#-빠른-시작)
- [📱 모바일 최적화](#-모바일-최적화)
- [📊 데이터 관리](#-데이터-관리)
- [🔒 보안 기능](#-보안-기능)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🎨 UX/UI 특징](#-uxui-특징)
- [📖 사용 가이드](#-사용-가이드)
- [🔧 개발자 가이드](#-개발자-가이드)
- [📈 성능 및 최적화](#-성능-및-최적화)
- [🚀 배포 가이드](#-배포-가이드)
- [🔮 로드맵](#-로드맵)
- [🤝 기여하기](#-기여하기)
- [📞 지원 및 문의](#-지원-및-문의)

---

## 🎯 프로젝트 개요

### 배경

본 시스템은 CRO(Contract Research Organization) 업무 효율성 향상을 위해 개발된 통합 클라이언트 관리 솔루션입니다. 기존 Excel 기반 관리의 한계를 극복하고, 현대적인 웹 기술을 활용하여 직관적이고 효율적인 업무 환경을 제공합니다.

### 핵심 가치

- **🎯 업무 효율성**: 반복 작업 자동화 및 통합 관리
- **📱 접근성**: 언제 어디서나 모바일/데스크톱 접근
- **🔒 데이터 보안**: 사용자별 데이터 격리 및 안전한 저장
- **🚀 확장성**: 다중 사용자 및 대용량 데이터 지원
- **💡 사용자 경험**: 직관적 인터페이스 및 반응형 디자인

---

## ✨ 주요 기능

### 🏢 고객사 관리

- **통합 정보 관리**: 기본 정보, 연락처, 주소, 웹사이트
- **다중 연락처**: 부서별/담당자별 연락처 관리
- **견적서 관리**: 견적번호, 금액, 할인율, 지급조건
- **계약서 관리**: 계약번호, 기간, 세금계산서 발행 여부
- **연구 관리**: 시험기준, 물질정보, 제출용도, 담당자

### 📅 일정 및 업무 관리

- **미팅 관리**: 일정, 참석자, 회의록, 액션 아이템
- **업무 관리**: 프로젝트 업무, 일정, 상태 추적
- **상태 관리**: Pending, In Progress, Completed, Delayed, On Hold
- **자동 알림**: 지연 업무 및 중요 일정 알림

### 🔍 검색 및 분석

- **실시간 검색**: 고객사명, 연락처명으로 즉시 검색
- **고급 필터링**: 담당자별, 시험기준별, 날짜별 필터
- **대시보드 분석**: 통계 카드, 차트, 진행 현황
- **데이터 시각화**: 월별 추이, 상태별 분포

### 📊 데이터 관리

- **Excel 업로드**: .xlsx, .xls, .csv 파일 자동 파싱
- **템플릿 제공**: 표준 Excel 템플릿 다운로드
- **데이터 내보내기**: CSV 형태로 백업 및 공유
- **자동 변환**: Excel 날짜 시리얼 번호 자동 변환

### 👥 사용자 관리 (백엔드 준비완료)

- **JWT 기반 인증**: 안전한 로그인/로그아웃
- **권한 관리**: Admin, Manager, User 역할 구분
- **프로필 관리**: 개인정보 및 부서 정보
- **데이터 격리**: 사용자별 완전 분리된 데이터

---

## 🛠 기술 스택

### 프론트엔드

```
⚛️  React 19          - 최신 React 기능 활용
📘  TypeScript        - 타입 안전성 보장
⚡  Vite             - 빠른 개발 서버 및 빌드
🎨  Tailwind CSS     - 유틸리티 기반 스타일링
📊  Recharts          - 데이터 시각화
📱  Responsive Design - 모바일 우선 설계
📄  xlsx              - Excel 파일 처리
```

### 백엔드 (구현완료)

```
🟢  Node.js           - JavaScript 런타임
🚀  Express.js        - 웹 프레임워크
🍃  MongoDB           - NoSQL 데이터베이스
🔐  JWT               - 토큰 기반 인증
🛡️  bcryptjs          - 패스워드 해싱
✅  express-validator - 데이터 검증
```

### 보안 및 성능

```
🛡️  Helmet            - 보안 헤더
🌐  CORS              - 교차 출처 리소스 공유
⏱️  Rate Limiting     - API 요청 제한
📝  Input Validation  - 입력 데이터 검증
🔒  Data Isolation    - 사용자별 데이터 분리
```

---

## 🚀 빠른 시작

### 시스템 요구사항

- **Node.js** 18.0.0 이상
- **MongoDB** 4.4 이상 (또는 MongoDB Atlas)
- **npm** 또는 **yarn**
- **모던 브라우저** (Chrome, Firefox, Safari, Edge)

### 1단계: 저장소 클론

```bash
git clone <repository-url>
cd cro-management-system
```

### 2단계: 의존성 설치

```bash
# 프론트엔드 의존성
npm install

# 백엔드 의존성
cd backend
npm install
cd ..
```

### 3단계: 환경 설정

```bash
# 백엔드 환경 변수
cp backend/.env.example backend/.env
# backend/.env 파일에서 JWT_SECRET, MONGODB_URI 설정

# 프론트엔드 환경 변수
echo "VITE_API_URL=http://localhost:5555/api" > .env
```

### 4단계: 서버 실행

```bash
# 터미널 1: 백엔드 서버
cd backend
node server.js

# 터미널 2: 프론트엔드 서버
npm run dev
```

### 5단계: 브라우저 접속

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:5555
- **헬스 체크**: http://localhost:5555/api/health

---

## 📱 모바일 최적화

### 반응형 디자인

- **모바일 우선**: 320px부터 완벽 지원
- **터치 친화적**: 최소 44px 터치 타겟
- **적응형 레이아웃**: 화면 크기별 최적화

### 모바일 전용 기능

```
📱 카드 뷰          - 테이블 대신 카드 레이아웃
🎯 FAB 버튼         - 플로팅 액션 버튼
📋 Bottom Sheet     - 하단 시트 모달
🔍 모바일 검색       - 터치 최적화 검색창
📞 원터치 연락       - 전화/이메일 바로 연결
```

### 성능 최적화

- **16px 폰트**: iOS Safari 줌 방지
- **터치 피드백**: 즉각적인 시각적 반응
- **부드러운 애니메이션**: 60fps 애니메이션
- **Safe Area 지원**: iPhone 노치 대응

---

## 📊 데이터 관리

### Excel 업로드 지원

**지원 형식**: `.xlsx`, `.xls`, `.csv`

**필수 컬럼 구조**:

```
견적 송부 날짜 | 견적서 번호 | 계약번호 | 시험기준 | 견적명
의뢰기관 | 의뢰자 | 의뢰자연락처 | 의뢰자 e-mail | 제출용도
물질종류 | 담당자 | 견적금액 | 할인율 | 계약금액 | 결론
```

**자동 처리 기능**:

- ✅ Excel 날짜 시리얼 번호 변환 (45992 → 2025-10-15)
- ✅ 숫자/문자열 자동 감지 및 변환
- ✅ 중복 고객사 자동 통합
- ✅ 연락처 자동 생성 및 매핑
- ✅ 견적서/계약서/연구 자동 생성

### 데이터 내보내기

- **CSV 내보내기**: 전체 고객사 데이터
- **템플릿 다운로드**: 표준 Excel 템플릿
- **백업 기능**: JSON 형태 전체 백업 (구현 예정)

---

## 🔒 보안 기능

### 인증 및 권한

```
🔐 JWT 토큰 인증     - 안전한 세션 관리
👥 역할 기반 권한     - Admin/Manager/User
🛡️ 비밀번호 해싱     - bcryptjs 암호화
⏱️ 토큰 만료 관리     - 자동 갱신 및 만료
```

### 데이터 보호

```
🔒 사용자별 격리     - 완전 분리된 데이터
✅ 입력 데이터 검증   - SQL Injection 방지
🛡️ CORS 보안 설정   - 허용된 도메인만 접근
⚡ Rate Limiting    - API 남용 방지
```

### 개인정보 보호

- **최소 수집 원칙**: 필요한 정보만 수집
- **암호화 저장**: 민감 정보 암호화
- **접근 로그**: 데이터 접근 기록 (구현 예정)

---

## 📁 프로젝트 구조

```
cro-management-system/
├── 📁 backend/                 # 백엔드 서버
│   ├── 📁 models/             # MongoDB 스키마
│   │   ├── User.js           # 사용자 모델
│   │   ├── Company.js        # 고객사 모델
│   │   ├── Meeting.js        # 미팅 모델
│   │   ├── Task.js           # 업무 모델
│   │   └── Notification.js   # 알림 모델
│   ├── 📁 routes/             # API 라우트
│   │   ├── auth.js           # 인증 API
│   │   ├── companies.js      # 고객사 API
│   │   ├── meetings.js       # 미팅 API
│   │   ├── tasks.js          # 업무 API
│   │   └── notifications.js  # 알림 API
│   ├── 📁 middleware/         # 미들웨어
│   │   └── auth.js           # 인증 미들웨어
│   ├── server.js             # 서버 엔트리포인트
│   ├── package.json          # 백엔드 의존성
│   └── README.md             # 백엔드 문서
├── 📁 components/             # React 컴포넌트
│   ├── 📁 auth/              # 인증 컴포넌트
│   ├── 📁 ui/                # UI 컴포넌트
│   └── MobileOptimized.tsx   # 모바일 컴포넌트
├── 📁 contexts/               # React Context
│   └── AuthContext.tsx       # 인증 컨텍스트
├── 📁 services/               # API 서비스
│   └── api.ts                # API 클라이언트
├── 📁 hooks/                  # 커스텀 Hook
│   └── useResponsive.ts      # 반응형 Hook
├── App.tsx                   # 메인 앱 컴포넌트
├── components.tsx            # 공통 컴포넌트
├── types.ts                  # TypeScript 타입
├── icons.tsx                 # 아이콘 컴포넌트
├── index.css                 # 전역 스타일
├── index.html                # HTML 엔트리포인트
├── package.json              # 프론트엔드 의존성
├── vite.config.ts            # Vite 설정
├── tsconfig.json             # TypeScript 설정
├── tailwind.config.js        # Tailwind 설정
├── .env                      # 환경 변수
├── FEATURES_IMPLEMENTED.md   # 구현된 기능 목록
├── UX_UI_IMPROVEMENTS.md     # UX/UI 개선 가이드
├── DEPLOYMENT_GUIDE.md       # 배포 가이드
└── README.md                 # 이 파일
```

---

## 🎨 UX/UI 특징

### 디자인 시스템

```
🎨 색상 팔레트
   Primary: #0052CC (브랜드 블루)
   Secondary: #007BFF (액센트 블루)
   Success: #10B981 (성공 그린)
   Warning: #F59E0B (경고 오렌지)
   Error: #EF4444 (오류 레드)

📝 타이포그래피
   Heading: Inter, -apple-system, sans-serif
   Body: system-ui, sans-serif
   Code: 'Fira Code', monospace

📐 간격 시스템
   Base: 4px (0.25rem)
   Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
```

### 인터랙션 디자인

- **마이크로 애니메이션**: 버튼 호버, 카드 전환
- **로딩 상태**: Skeleton UI, 스피너
- **피드백 시스템**: Toast 알림, 상태 메시지
- **접근성**: 키보드 네비게이션, 스크린 리더 지원

### 반응형 브레이크포인트

```
Mobile:  < 768px   (1열 레이아웃)
Tablet:  768-1024px (2열 레이아웃)
Desktop: > 1024px   (3열 레이아웃)
```

---

## 📖 사용 가이드

### 첫 사용자 등록 (백엔드 활성화 시)

1. 브라우저에서 시스템 접속
2. "회원가입" 클릭
3. 필요한 정보 입력 (사용자명, 이메일, 비밀번호 등)
4. 자동 로그인 후 대시보드 이용

### 고객사 관리

**추가 방법**:

1. 사이드바에서 "Clients" 클릭
2. "Add New Company" 버튼 클릭 (모바일: FAB 버튼)
3. 기본 정보 및 연락처 입력
4. 필요시 견적서, 계약서, 연구 정보 추가

**Excel 업로드**:

1. "Data Export" 메뉴 클릭
2. "Download Excel Template" 버튼으로 템플릿 다운로드
3. Excel에서 데이터 입력
4. "Excel/CSV 파일 업로드" 버튼으로 업로드

### 검색 및 필터링

- **실시간 검색**: 검색창에 고객사명 또는 연락처명 입력
- **담당자 필터**: 드롭다운에서 특정 담당자 선택
- **시험기준 필터**: KGLP, NGLP 등으로 필터링
- **필터 초기화**: "Clear filters" 버튼 클릭

### 미팅 관리

1. 대시보드 또는 고객사 상세에서 "Add Meeting" 클릭
2. 미팅 정보 입력 (제목, 일시, 참석자, 요약)
3. 저장 후 캘린더에서 확인

### 업무 관리

1. "Add Task" 버튼으로 새 업무 등록
2. 업무 정보 입력 (이름, 설명, 기간, 담당자)
3. 상태 업데이트로 진행 상황 관리
4. 지연 업무는 자동으로 알림 생성

---

## 🔧 개발자 가이드

### 개발 환경 설정

```bash
# 개발 의존성 설치
npm install
cd backend && npm install && cd ..

# 개발 서버 실행
npm run dev          # 프론트엔드
cd backend && npm run dev  # 백엔드
```

### 코드 스타일

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안전성
- **Conventional Commits**: 커밋 메시지 규칙

### API 엔드포인트

```
인증
POST   /api/auth/register     # 사용자 등록
POST   /api/auth/login        # 로그인
GET    /api/auth/me           # 현재 사용자
PUT    /api/auth/profile      # 프로필 업데이트

고객사
GET    /api/companies         # 고객사 목록
POST   /api/companies         # 고객사 생성
GET    /api/companies/:id     # 고객사 조회
PUT    /api/companies/:id     # 고객사 수정
DELETE /api/companies/:id     # 고객사 삭제

미팅
GET    /api/meetings          # 미팅 목록
POST   /api/meetings          # 미팅 생성
GET    /api/meetings/:id      # 미팅 조회
PUT    /api/meetings/:id      # 미팅 수정
DELETE /api/meetings/:id      # 미팅 삭제

업무
GET    /api/tasks             # 업무 목록
POST   /api/tasks             # 업무 생성
GET    /api/tasks/:id         # 업무 조회
PUT    /api/tasks/:id         # 업무 수정
DELETE /api/tasks/:id         # 업무 삭제

알림
GET    /api/notifications     # 알림 목록
POST   /api/notifications     # 알림 생성
PUT    /api/notifications/:id/read  # 읽음 처리
```

### 커스텀 Hook 사용

```typescript
import { useIsMobile } from "./hooks/useResponsive";

const MyComponent = () => {
  const isMobile = useIsMobile();

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};
```

---

## 📈 성능 및 최적화

### 프론트엔드 최적화

- **코드 스플리팅**: React.lazy로 지연 로딩
- **메모이제이션**: React.memo, useMemo 활용
- **가상 스크롤**: 대용량 리스트 최적화 (구현 예정)
- **이미지 최적화**: lazy loading, WebP 지원

### 백엔드 최적화

- **데이터베이스 인덱싱**: 검색 성능 향상
- **페이지네이션**: 대용량 데이터 처리
- **캐싱**: Redis 캐싱 (구현 예정)
- **압축**: gzip 응답 압축

### 모니터링

- **성능 메트릭**: Core Web Vitals
- **오류 추적**: 에러 로깅 시스템 (구현 예정)
- **사용자 분석**: 사용 패턴 분석 (구현 예정)

---

## 🚀 배포 가이드

### 프로덕션 배포

상세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참조하세요.

**빠른 배포 체크리스트**:

- [ ] MongoDB 설치 및 보안 설정
- [ ] JWT_SECRET 강력한 키로 변경
- [ ] HTTPS 인증서 설정
- [ ] 방화벽 구성 (포트 5555, 27017)
- [ ] 정기 백업 스케줄 설정
- [ ] 모니터링 도구 설치
- [ ] 도메인 및 DNS 설정

### Docker 배포 (구현 예정)

```dockerfile
# Dockerfile 예시
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5173
CMD ["npm", "start"]
```

---

## 🔮 로드맵

### v2.1 (다음 분기)

- [ ] 인증 시스템 재활성화
- [ ] 데이터 백업/복원 기능
- [ ] 고급 검색 필터 (날짜 범위, 금액 범위)
- [ ] 캘린더 뷰 개선
- [ ] 모바일 앱 (React Native)

### v2.2 (향후)

- [ ] 실시간 알림 (WebSocket)
- [ ] 파일 첨부 기능
- [ ] 이메일 통합
- [ ] 보고서 생성 (PDF)
- [ ] 다국어 지원 (i18n)

### v3.0 (장기)

- [ ] AI 기반 추천 시스템
- [ ] 자동 일정 조율
- [ ] 음성 인식 메모
- [ ] 고급 분석 대시보드
- [ ] 타사 CRM 통합

---

## 🤝 기여하기

### 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코드 기여 가이드라인

- TypeScript 타입 정의 필수
- ESLint 규칙 준수
- 단위 테스트 작성 (중요 기능)
- 문서 업데이트 (README, 주석)
- 커밋 메시지 규칙 준수

### 버그 리포트

이슈를 생성할 때 다음 정보를 포함해주세요:

- 버그 설명
- 재현 단계
- 예상 동작
- 실제 동작
- 스크린샷 (가능한 경우)
- 환경 정보 (OS, 브라우저, Node 버전)

---

## 📞 지원 및 문의

### 문서

- **사용자 가이드**: 이 README 파일
- **배포 가이드**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **기능 목록**: [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md)
- **UX/UI 가이드**: [UX_UI_IMPROVEMENTS.md](./UX_UI_IMPROVEMENTS.md)

### 지원 채널

- **이슈 트래커**: GitHub Issues
- **이메일**: support@example.com
- **문서**: Wiki 페이지

### FAQ

**Q: MongoDB 연결이 안 됩니다.**
A: `.env` 파일의 `MONGODB_URI` 설정을 확인하세요. MongoDB가 실행 중인지 확인하고, 연결 문자열이 올바른지 검증하세요.

**Q: Excel 업로드 시 날짜가 이상하게 표시됩니다.**
A: Excel 날짜는 자동으로 변환됩니다. 날짜 형식이 올바른지 확인하세요.

**Q: 모바일에서 레이아웃이 깨집니다.**
A: 최신 브라우저를 사용하고 있는지 확인하세요. iOS Safari 12+ 또는 Chrome 80+ 권장합니다.

**Q: 백엔드 포트를 변경하고 싶습니다.**
A: `backend/.env` 파일의 `PORT` 값을 변경하고, 프론트엔드 `.env`의 `VITE_API_URL`도 함께 변경하세요.

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- React Team
- TypeScript Team
- Tailwind CSS
- MongoDB
- Express.js
- 그 외 모든 기여자들

---

## 📊 프로젝트 통계

- **개발 기간**: 2024-2025
- **코드 라인**: ~10,000+ lines
- **컴포넌트**: 50+ React components
- **API 엔드포인트**: 20+ endpoints
- **지원 언어**: 한국어
- **테스트 커버리지**: 구현 예정

---

**CRO Management System** - 효율적인 고객 관계 관리를 위한 통합 솔루션 🚀

Made with ❤️ by CRO Team
