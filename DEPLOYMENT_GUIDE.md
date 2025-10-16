# CRO 관리 시스템 배포 가이드

다중 사용자를 지원하는 CRO(Contract Research Organization) 클라이언트 관리 시스템의 배포 가이드입니다.

## 시스템 구조

```
프로젝트/
├── backend/          # Node.js + Express + MongoDB 백엔드
├── src/             # React + TypeScript 프론트엔드
├── .env             # 프론트엔드 환경 변수
└── README.md        # 이 파일
```

## 사전 요구사항

- **Node.js** 18+
- **MongoDB** 4.4+
- **npm** 또는 **yarn**

## 1. 백엔드 설정 및 실행

### 1.1 MongoDB 설치 및 실행

**Windows:**

```bash
# MongoDB Community Server 다운로드 및 설치
# https://www.mongodb.com/try/download/community

# MongoDB 서비스 시작
net start MongoDB
```

**macOS (Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 1.2 백엔드 의존성 설치

```bash
cd backend
npm install
```

### 1.3 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 편집
# 필수 설정:
# - JWT_SECRET: 강력한 비밀키로 변경
# - MONGODB_URI: MongoDB 연결 문자열 (기본값 사용 가능)
```

### 1.4 백엔드 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 또는 프로덕션 모드
npm start
```

백엔드 서버가 `http://localhost:5000`에서 실행됩니다.

## 2. 프론트엔드 설정 및 실행

### 2.1 프론트엔드 의존성 설치

```bash
# 프로젝트 루트 디렉토리에서
npm install
```

### 2.2 환경 변수 설정

```bash
# .env.example을 .env로 복사 (이미 생성됨)
# .env 파일에서 API URL 확인
VITE_API_URL=http://localhost:5000/api
```

### 2.3 프론트엔드 서버 실행

```bash
# 개발 모드
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

## 3. 시스템 사용법

### 3.1 첫 사용자 등록

1. 브라우저에서 `http://localhost:5173` 접속
2. "회원가입" 클릭
3. 필요한 정보 입력하여 계정 생성
4. 자동으로 로그인됨

### 3.2 주요 기능

- **고객사 관리**: 연락처, 견적서, 계약서, 연구 정보 관리
- **미팅 관리**: 고객사별 미팅 일정 및 내용 관리
- **업무 관리**: 프로젝트 업무 및 일정 관리
- **알림 시스템**: 지연 업무 등 자동 알림
- **대시보드**: 전체 현황 한눈에 보기

## 4. 프로덕션 배포

### 4.1 백엔드 배포 (예: Ubuntu 서버)

```bash
# PM2 설치 (프로세스 관리자)
npm install -g pm2

# 프로덕션 환경 변수 설정
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=mongodb://localhost:27017/cro_management_prod
export JWT_SECRET=your_super_secure_jwt_secret_key

# PM2로 백엔드 실행
cd backend
pm2 start server.js --name "cro-backend"
pm2 save
pm2 startup
```

### 4.2 프론트엔드 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드된 파일은 dist/ 폴더에 생성됨
# 웹 서버(Nginx, Apache 등)에 배포
```

### 4.3 Nginx 설정 예시

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 프론트엔드 정적 파일
    location / {
        root /path/to/your/dist;
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API 프록시
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. 데이터베이스 백업

```bash
# MongoDB 백업
mongodump --db cro_management --out /path/to/backup/

# MongoDB 복원
mongorestore --db cro_management /path/to/backup/cro_management/
```

## 6. 보안 고려사항

- **JWT Secret**: 강력하고 고유한 비밀키 사용
- **HTTPS**: 프로덕션에서는 반드시 HTTPS 사용
- **방화벽**: MongoDB 포트(27017)는 외부 접근 차단
- **정기 백업**: 데이터베이스 정기 백업 설정
- **업데이트**: 의존성 패키지 정기 업데이트

## 7. 문제 해결

### 7.1 백엔드 연결 오류

```bash
# MongoDB 상태 확인
sudo systemctl status mongod

# 백엔드 로그 확인
cd backend
npm run dev
```

### 7.2 프론트엔드 API 연결 오류

- `.env` 파일의 `VITE_API_URL` 확인
- 백엔드 서버가 실행 중인지 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

### 7.3 인증 문제

- JWT 토큰 만료: 다시 로그인
- 브라우저 로컬스토리지 확인 및 정리

## 8. 개발 환경 재설정

```bash
# 백엔드 재설정
cd backend
rm -rf node_modules
npm install

# 프론트엔드 재설정
cd ..
rm -rf node_modules
npm install

# MongoDB 데이터 초기화 (주의!)
mongo
use cro_management
db.dropDatabase()
```

## 지원 및 문의

시스템 사용 중 문제가 발생하면 다음을 확인하세요:

1. 백엔드 서버 로그
2. 브라우저 개발자 도구 콘솔
3. MongoDB 연결 상태
4. 환경 변수 설정

추가 지원이 필요한 경우 개발팀에 문의하세요.
