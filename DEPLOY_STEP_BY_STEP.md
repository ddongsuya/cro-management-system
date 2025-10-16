# 🎓 완전 초보자를 위한 배포 가이드

**"아무것도 모르는 사람"을 위한 A to Z 가이드**

---

## 📌 시작하기 전에

### 필요한 것:

- ✅ 인터넷 연결된 컴퓨터
- ✅ 이메일 주소 (Gmail 추천)
- ✅ 이 프로젝트 폴더

### 예상 소요 시간:

- 처음: 20-30분
- 익숙해지면: 10분

---

## 🔍 STEP 0: 현재 상태 확인

### 0-1. GitHub 계정이 있나요?

**있음** → STEP 1로 이동
**없음** → 아래 진행

#### GitHub 계정 만들기:

1. 브라우저 열기
2. https://github.com 접속
3. 우측 상단 **"Sign up"** 클릭
4. 이메일 입력 → **"Continue"** 클릭
5. 비밀번호 만들기 → **"Continue"** 클릭
6. 사용자 이름 입력 → **"Continue"** 클릭
7. 이메일 인증 코드 입력
8. 완료!

### 0-2. Git이 설치되어 있나요?

#### 확인 방법:

1. **Windows**: 시작 메뉴 → "cmd" 검색 → 명령 프롬프트 열기
2. 다음 입력 후 Enter:
   ```
   git --version
   ```

**결과:**

- `git version 2.x.x` 표시 → 설치됨! STEP 1로 이동
- `'git'은(는) 내부 또는 외부 명령...` 표시 → 설치 필요

#### Git 설치하기 (설치 안 된 경우):

1. https://git-scm.com/download/win 접속
2. **"Click here to download"** 클릭
3. 다운로드된 파일 실행
4. 계속 **"Next"** 클릭 (기본 설정 사용)
5. **"Install"** 클릭
6. 완료 후 명령 프롬프트 다시 열기
7. `git --version` 다시 확인

---

## 📦 STEP 1: GitHub에 코드 올리기

### 1-1. GitHub 저장소 만들기

1. 브라우저에서 https://github.com 접속
2. 로그인
3. 우측 상단 **"+"** 버튼 클릭
4. **"New repository"** 클릭
5. 다음과 같이 입력:
   ```
   Repository name: cro-management-system
   Description: CRO 클라이언트 관리 시스템
   Public 선택 (또는 Private)
   ❌ Add a README file 체크 해제
   ❌ Add .gitignore 체크 해제
   ❌ Choose a license 체크 해제
   ```
6. **"Create repository"** 클릭
7. 화면에 나타나는 URL 복사 (예: `https://github.com/YOUR_USERNAME/cro-management-system.git`)

### 1-2. 프로젝트 폴더에서 Git 초기화

1. **Windows 탐색기**에서 프로젝트 폴더 열기
2. 주소창에 `cmd` 입력 후 Enter (해당 폴더에서 명령 프롬프트 열림)
3. 다음 명령어 **하나씩** 입력:

```bash
# Git 초기화
git init
```

**결과:** `Initialized empty Git repository...` 표시

```bash
# Git 사용자 설정 (처음 한 번만)
git config --global user.name "당신의이름"
git config --global user.email "your-email@gmail.com"
```

**주의:** 이메일은 GitHub 가입 시 사용한 이메일

```bash
# 모든 파일 추가
git add .
```

**결과:** 아무것도 안 나옴 (정상)

```bash
# 커밋 (저장)
git commit -m "Initial commit"
```

**결과:** 여러 줄의 파일 목록 표시

```bash
# 기본 브랜치 이름 설정
git branch -M main
```

**결과:** 아무것도 안 나옴 (정상)

```bash
# GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/cro-management-system.git
```

**주의:** YOUR_USERNAME을 실제 GitHub 사용자명으로 변경!

```bash
# GitHub에 업로드
git push -u origin main
```

**결과:** GitHub 로그인 창 나타남 → 로그인
**결과:** 업로드 진행... 완료!

### 1-3. 확인하기

1. 브라우저에서 GitHub 저장소 새로고침
2. 파일들이 보이면 성공! ✅

---

## 🍃 STEP 2: MongoDB Atlas 설정 (데이터베이스)

### 2-1. MongoDB Atlas 계정 만들기

1. 브라우저에서 https://www.mongodb.com/cloud/atlas 접속
2. **"Try Free"** 버튼 클릭
3. **"Sign up with Google"** 클릭 (Gmail 계정 사용)
4. Google 계정 선택
5. 약관 동의 체크 → **"Submit"** 클릭

### 2-2. 설문 조사 (선택사항)

다음과 같이 선택하거나 **"Skip"** 클릭:

```
What is your goal today? → Learn MongoDB
What type of application are you building? → Other
What is your preferred language? → JavaScript
```

### 2-3. 무료 클러스터 만들기

1. **"Create"** 버튼 클릭 (또는 "Create a deployment")
2. **"M0 FREE"** 선택 (왼쪽 첫 번째)
3. 다음과 같이 설정:
   ```
   Provider: AWS (기본값)
   Region: Seoul (ap-northeast-2) 선택
   Name: Cluster0 (기본값 사용)
   ```
4. **"Create Deployment"** 버튼 클릭 (우측 하단)

### 2-4. 보안 설정 화면 나타남

#### A. 데이터베이스 사용자 만들기

화면에 표시된 폼에서:

```
Username: cro_admin (또는 원하는 이름)
Password: 자동 생성된 비밀번호 그대로 사용
```

**중요! 비밀번호 복사하기:**

1. 비밀번호 옆 **"Copy"** 버튼 클릭
2. 메모장 열기 (시작 → "메모장" 검색)
3. 메모장에 붙여넣기 (Ctrl+V)
4. 메모장 저장 (파일명: mongodb-password.txt)

**"Create Database User"** 버튼 클릭

#### B. 네트워크 접근 허용

화면 아래쪽에서:

```
IP Access List 섹션
```

1. **"Add My Current IP Address"** 버튼 클릭
2. 그 아래 **"Add a Different IP Address"** 클릭
3. IP Address 입력란에: `0.0.0.0/0` 입력
4. Description: `Allow all` 입력
5. **"Add Entry"** 버튼 클릭

**"Finish and Close"** 버튼 클릭

### 2-5. 연결 문자열 복사하기

1. **"Go to Overview"** 버튼 클릭 (또는 "Close" 클릭)
2. 화면 중앙에 클러스터 표시됨
3. **"Connect"** 버튼 클릭
4. **"Drivers"** 선택 (또는 "Connect your application")
5. Driver: **Node.js** 선택
6. Version: **5.5 or later** 선택
7. 아래 연결 문자열 복사:
   ```
   mongodb+srv://cro_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2-6. 연결 문자열 수정하기

1. 메모장 열기
2. 복사한 연결 문자열 붙여넣기
3. `<password>` 부분을 실제 비밀번호로 변경
4. 끝에 데이터베이스 이름 추가

**변경 전:**

```
mongodb+srv://cro_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**변경 후:**

```
mongodb+srv://cro_admin:실제비밀번호@cluster0.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
```

**주의:**

- `<password>` 부분을 `실제비밀번호`로 변경
- `?retryWrites` 앞에 `/cro_management` 추가

5. 메모장 저장 (나중에 사용)

✅ **MongoDB 설정 완료!**

---

## 🚂 STEP 3: Render에 백엔드 배포

### 3-1. Render 계정 만들기

1. 브라우저에서 https://render.com 접속
2. **"Get Started for Free"** 버튼 클릭
3. **"GitHub"** 버튼 클릭
4. GitHub 로그인 (이미 로그인되어 있으면 자동)
5. **"Authorize Render"** 버튼 클릭
6. 이메일 인증 (이메일 확인 → 링크 클릭)

### 3-2. 새 Web Service 만들기

1. Render 대시보드에서 **"New +"** 버튼 클릭 (우측 상단)
2. **"Web Service"** 클릭
3. **"Build and deploy from a Git repository"** 선택
4. **"Next"** 버튼 클릭

### 3-3. GitHub 저장소 연결

1. **"Connect GitHub"** 버튼 클릭 (처음이면)
2. **"Install Render"** 클릭
3. **"All repositories"** 선택 (또는 특정 저장소만)
4. **"Install"** 버튼 클릭
5. 저장소 목록에서 `cro-management-system` 찾기
6. 우측 **"Connect"** 버튼 클릭

### 3-4. 서비스 설정하기

화면에 나타나는 폼을 다음과 같이 입력:

```
Name: cro-backend
Region: Singapore (드롭다운에서 선택)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

**Instance Type:**

- **Free** 선택 (0 USD/month)

### 3-5. 환경 변수 추가하기

1. 아래로 스크롤
2. **"Advanced"** 버튼 클릭
3. **"Add Environment Variable"** 버튼 클릭

다음 변수들을 **하나씩** 추가:

#### 변수 1:

```
Key: NODE_ENV
Value: production
```

**"Add Environment Variable"** 클릭

#### 변수 2:

```
Key: PORT
Value: 5555
```

**"Add Environment Variable"** 클릭

#### 변수 3:

```
Key: MONGODB_URI
Value: (메모장에 저장한 MongoDB 연결 문자열 붙여넣기)
```

**예시:**

```
mongodb+srv://cro_admin:실제비밀번호@cluster0.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
```

**"Add Environment Variable"** 클릭

#### 변수 4:

```
Key: JWT_SECRET
Value: my-super-secret-jwt-key-for-production-12345
```

**"Add Environment Variable"** 클릭

#### 변수 5:

```
Key: JWT_EXPIRE
Value: 7d
```

**"Add Environment Variable"** 클릭

#### 변수 6:

```
Key: CORS_ORIGIN
Value: *
```

**"Add Environment Variable"** 클릭

#### 변수 7:

```
Key: RATE_LIMIT_WINDOW_MS
Value: 900000
```

**"Add Environment Variable"** 클릭

#### 변수 8:

```
Key: RATE_LIMIT_MAX_REQUESTS
Value: 100
```

### 3-6. 배포 시작하기

1. 맨 아래로 스크롤
2. **"Create Web Service"** 버튼 클릭 (파란색 큰 버튼)
3. 배포 시작! (2-3분 소요)

### 3-7. 배포 진행 상황 확인

화면에 로그가 표시됨:

```
==> Cloning from https://github.com/...
==> Downloading cache...
==> Running 'npm install'
==> Starting service...
Your service is live 🎉
```

**"Your service is live 🎉"** 표시되면 성공!

### 3-8. 백엔드 URL 복사하기

1. 화면 상단에 URL 표시됨 (예: `https://cro-backend.onrender.com`)
2. URL 복사 (클릭하면 자동 복사)
3. 메모장에 저장:
   ```
   백엔드 URL: https://cro-backend.onrender.com
   ```

### 3-9. 백엔드 테스트하기

1. 새 브라우저 탭 열기
2. 주소창에 입력: `https://cro-backend.onrender.com/api/health`
3. Enter 키
4. 화면에 `{"status":"ok"}` 표시되면 성공! ✅

**표시 안 되면:**

- 30초 기다리기 (서버가 깨어나는 중)
- 다시 새로고침

✅ **백엔드 배포 완료!**

---

## ▲ STEP 4: Vercel에 프론트엔드 배포

### 4-1. Vercel 계정 만들기

1. 브라우저에서 https://vercel.com 접속
2. **"Start Deploying"** 버튼 클릭
3. **"Continue with GitHub"** 클릭
4. GitHub 로그인 (이미 로그인되어 있으면 자동)
5. **"Authorize Vercel"** 버튼 클릭

### 4-2. 새 프로젝트 만들기

1. **"Add New..."** 버튼 클릭 (우측 상단)
2. **"Project"** 클릭
3. **"Import Git Repository"** 섹션에서 저장소 찾기
4. `cro-management-system` 찾기
5. **"Import"** 버튼 클릭

### 4-3. 프로젝트 설정하기

화면에 나타나는 설정:

```
Framework Preset: Vite (자동 감지됨)
Root Directory: ./ (기본값)
Build Command: npm run build (자동)
Output Directory: dist (자동)
Install Command: npm install (자동)
```

**아무것도 변경하지 마세요!** (자동으로 올바르게 설정됨)

### 4-4. 환경 변수 추가하기

1. 아래로 스크롤
2. **"Environment Variables"** 섹션 찾기
3. 다음 입력:

```
Name: VITE_API_URL
Value: https://cro-backend.onrender.com/api
```

**주의:**

- `https://cro-backend.onrender.com` 부분을 실제 백엔드 URL로 변경
- 끝에 `/api` 꼭 붙이기!

4. **"Add"** 버튼 클릭

### 4-5. 배포 시작하기

1. **"Deploy"** 버튼 클릭 (파란색 큰 버튼)
2. 배포 시작! (2-3분 소요)

### 4-6. 배포 진행 상황 확인

화면에 로그가 표시됨:

```
Building...
Cloning repository...
Installing dependencies...
Building application...
Deploying...
```

**"Congratulations!"** 화면 나타나면 성공! 🎉

### 4-7. 사이트 확인하기

1. **"Visit"** 버튼 클릭 (또는 **"Continue to Dashboard"**)
2. 새 탭에서 사이트 열림
3. CRO 관리 시스템 화면 표시되면 성공! ✅

### 4-8. URL 저장하기

1. 주소창의 URL 복사 (예: `https://cro-management-system.vercel.app`)
2. 메모장에 저장:
   ```
   프론트엔드 URL: https://cro-management-system.vercel.app
   ```

✅ **프론트엔드 배포 완료!**

---

## 🎉 STEP 5: 첫 사용자 등록 및 테스트

### 5-1. 사이트 접속하기

1. 브라우저에서 Vercel URL 접속
2. CRO 관리 시스템 화면 표시

### 5-2. 회원가입하기

**주의: 현재 인증 시스템이 비활성화되어 있어 바로 사용 가능합니다!**

1. 화면에서 **"Add New Company"** 버튼 클릭
2. 고객사 정보 입력
3. **"Save"** 클릭
4. 고객사가 목록에 표시되면 성공! ✅

### 5-3. 모바일에서 테스트하기

1. 스마트폰 꺼내기
2. 브라우저 열기
3. Vercel URL 입력
4. 완벽하게 작동! 📱

---

## 🎊 완료! 축하합니다!

이제 전 세계 어디서나 접속 가능한 시스템이 완성되었습니다!

### 📝 저장해둔 정보:

```
프론트엔드: https://your-app.vercel.app
백엔드: https://cro-backend.onrender.com
MongoDB: mongodb+srv://...
```

---

## 🔄 STEP 6: 코드 수정 후 업데이트하는 방법

### 6-1. 코드 수정하기

1. 프로젝트 폴더에서 파일 수정
2. 저장

### 6-2. GitHub에 업로드하기

프로젝트 폴더에서 명령 프롬프트 열고:

```bash
# 변경사항 추가
git add .

# 커밋 (저장)
git commit -m "Update code"

# GitHub에 업로드
git push origin main
```

### 6-3. 자동 재배포

- Vercel: 자동으로 재배포 시작 (2-3분)
- Render: 자동으로 재배포 시작 (2-3분)

**아무것도 안 해도 됩니다!** 자동으로 업데이트됨!

---

## ❓ 문제 해결

### 문제 1: "백엔드에 연결할 수 없습니다"

**해결:**

1. 30초 기다리기 (Render 서버가 깨어나는 중)
2. 페이지 새로고침
3. 여전히 안 되면:
   - Render 대시보드 → Logs 확인
   - MongoDB Atlas → Network Access 확인 (0.0.0.0/0 있는지)

### 문제 2: "git push 안 됨"

**해결:**

```bash
# GitHub 로그인 다시 하기
git push origin main
```

로그인 창 나타남 → GitHub 계정으로 로그인

### 문제 3: "Vercel 배포 실패"

**해결:**

1. Vercel 대시보드 → Deployments
2. 실패한 배포 클릭
3. 로그 확인
4. 대부분 환경 변수 문제:
   - Settings → Environment Variables
   - `VITE_API_URL` 확인

### 문제 4: "MongoDB 연결 안 됨"

**해결:**

1. MongoDB Atlas 접속
2. Network Access → 0.0.0.0/0 있는지 확인
3. Database Access → 사용자 있는지 확인
4. 연결 문자열 비밀번호 확인

---

## 📞 도움이 필요하면

1. **Render 로그 확인:**
   - Render Dashboard → Logs 탭
2. **Vercel 로그 확인:**
   - Vercel Dashboard → Deployments → 클릭
3. **브라우저 콘솔 확인:**
   - F12 키 → Console 탭

---

## 🎓 다음 단계

### 커스텀 도메인 연결하기 (선택)

1. Vercel Dashboard
2. Settings → Domains
3. 도메인 추가

### 팀원 초대하기

1. Vercel Dashboard
2. Settings → Members
3. 이메일로 초대

---

**끝! 이제 프로 개발자입니다! 🚀**
