# CRO Management Backend API

다중 사용자를 지원하는 CRO(Contract Research Organization) 클라이언트 관리 시스템의 백엔드 API입니다.

## 기능

- **사용자 인증 및 권한 관리** (JWT 기반)
- **고객사 관리** (연락처, 견적서, 계약서, 연구 포함)
- **미팅 관리**
- **업무 관리** (Task Management)
- **알림 시스템**
- **데이터 보안** (사용자별 데이터 격리)

## 기술 스택

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** 인증
- **bcryptjs** 패스워드 해싱
- **express-validator** 데이터 검증
- **helmet** 보안 헤더
- **cors** CORS 설정
- **express-rate-limit** API 요청 제한

## 설치 및 실행

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env`로 복사하고 필요한 값들을 설정하세요:

```bash
cp .env.example .env
```

### 3. MongoDB 설정

MongoDB가 실행 중인지 확인하고, 필요시 연결 문자열을 수정하세요.

### 4. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 인증 (Authentication)

- `POST /api/auth/register` - 사용자 등록
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/profile` - 프로필 업데이트

### 고객사 관리 (Companies)

- `GET /api/companies` - 고객사 목록 조회
- `GET /api/companies/:id` - 특정 고객사 조회
- `POST /api/companies` - 고객사 생성
- `PUT /api/companies/:id` - 고객사 수정
- `DELETE /api/companies/:id` - 고객사 삭제 (소프트 삭제)
- `POST /api/companies/:id/quotations` - 견적서 추가

### 미팅 관리 (Meetings)

- `GET /api/meetings` - 미팅 목록 조회
- `GET /api/meetings/:id` - 특정 미팅 조회
- `POST /api/meetings` - 미팅 생성
- `PUT /api/meetings/:id` - 미팅 수정
- `DELETE /api/meetings/:id` - 미팅 삭제
- `GET /api/meetings/upcoming` - 예정된 미팅 조회

### 업무 관리 (Tasks)

- `GET /api/tasks` - 업무 목록 조회
- `GET /api/tasks/:id` - 특정 업무 조회
- `POST /api/tasks` - 업무 생성
- `PUT /api/tasks/:id` - 업무 수정
- `DELETE /api/tasks/:id` - 업무 삭제
- `GET /api/tasks/overdue` - 지연된 업무 조회
- `GET /api/tasks/upcoming` - 예정된 업무 조회
- `POST /api/tasks/check-overdue` - 지연 업무 확인 및 알림 생성

### 알림 관리 (Notifications)

- `GET /api/notifications` - 알림 목록 조회
- `GET /api/notifications/unread` - 읽지 않은 알림 조회
- `GET /api/notifications/:id` - 특정 알림 조회
- `POST /api/notifications` - 알림 생성
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/mark-all-read` - 모든 알림 읽음 처리
- `DELETE /api/notifications/:id` - 알림 삭제
- `DELETE /api/notifications/clear-read` - 읽은 알림 모두 삭제

### 헬스 체크

- `GET /api/health` - 서버 상태 확인

## 인증

모든 보호된 엔드포인트는 JWT 토큰이 필요합니다. 요청 헤더에 다음과 같이 포함하세요:

```
Authorization: Bearer <your-jwt-token>
```

## 데이터 모델

### User (사용자)

- username, email, password
- role (admin, manager, user)
- profile (firstName, lastName, department, phone)

### Company (고객사)

- name, address, website, mainPhoneNumber
- contacts[] (연락처 배열)
- quotations[] (견적서 배열)
- contracts[] (계약서 배열)
- studies[] (연구 배열)

### Meeting (미팅)

- companyId, contactId, title, date
- attendees, summary, actionItems

### Task (업무)

- companyId, contactId, name, description
- startDate, endDate, status, assignee

### Notification (알림)

- message, type (info/warning/error)
- relatedId, relatedType, isRead

## 보안 기능

- **JWT 기반 인증**
- **비밀번호 해싱** (bcryptjs)
- **요청 제한** (Rate Limiting)
- **CORS 설정**
- **보안 헤더** (Helmet)
- **데이터 검증** (express-validator)
- **사용자별 데이터 격리**

## 개발 도구

```bash
# 테스트 실행
npm test

# 개발 서버 (자동 재시작)
npm run dev
```

## 환경 변수

- `NODE_ENV` - 환경 설정 (development/production)
- `PORT` - 서버 포트 (기본값: 5000)
- `MONGODB_URI` - MongoDB 연결 문자열
- `JWT_SECRET` - JWT 서명 키
- `JWT_EXPIRE` - JWT 만료 시간
- `FRONTEND_URL` - 프론트엔드 URL (CORS 설정용)
- `RATE_LIMIT_WINDOW_MS` - 요청 제한 시간 창
- `RATE_LIMIT_MAX_REQUESTS` - 최대 요청 수
