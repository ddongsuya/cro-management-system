# 🚀 지금 바로 배포하기!

**예상 소요 시간: 10분**

---

## ✅ 배포 전 체크리스트

- [x] 백엔드 CORS 설정 완료
- [x] 환경 변수 템플릿 준비
- [x] Vercel 설정 파일 준비
- [ ] GitHub에 코드 푸시
- [ ] MongoDB Atlas 설정
- [ ] Render 백엔드 배포
- [ ] Vercel 프론트엔드 배포

---

## 📝 1단계: GitHub에 코드 푸시 (1분)

```bash
# 현재 변경사항 커밋
git add .
git commit -m "Ready for deployment"
git push origin main
```

**GitHub 저장소가 없다면:**

```bash
# GitHub에서 새 저장소 생성 후
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 🍃 2단계: MongoDB Atlas 설정 (3분)

### 2.1 계정 생성

1. https://www.mongodb.com/cloud/atlas 접속
2. **"Try Free"** 클릭
3. Google 계정으로 간편 가입

### 2.2 클러스터 생성

1. **"Create"** 클릭
2. **FREE (M0)** 선택
3. Provider: **AWS**
4. Region: **Seoul (ap-northeast-2)** 선택
5. Cluster Name: `cro-cluster`
6. **"Create Cluster"** 클릭

### 2.3 데이터베이스 사용자 생성

1. 좌측 메뉴 **Security → Database Access**
2. **"Add New Database User"** 클릭
3. Authentication Method: **Password**
4. Username: `cro_admin`
5. Password: **"Autogenerate Secure Password"** 클릭 → **복사해두기!**
6. Database User Privileges: **"Read and write to any database"**
7. **"Add User"** 클릭

### 2.4 네트워크 접근 허용

1. 좌측 메뉴 **Security → Network Access**
2. **"Add IP Address"** 클릭
3. **"Allow Access from Anywhere"** 클릭 (0.0.0.0/0)
4. **"Confirm"** 클릭

### 2.5 연결 문자열 복사

1. 좌측 메뉴 **Database → Clusters**
2. **"Connect"** 버튼 클릭
3. **"Connect your application"** 선택
4. Driver: **Node.js**, Version: **5.5 or later**
5. 연결 문자열 복사:
   ```
   mongodb+srv://cro_admin:<password>@cro-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. `<password>`를 실제 비밀번호로 변경
7. 데이터베이스 이름 추가:
   ```
   mongodb+srv://cro_admin:YOUR_PASSWORD@cro-cluster.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
   ```

**✅ 완료! 연결 문자열을 메모장에 저장해두세요.**

---

## 🚂 3단계: Render 백엔드 배포 (3분)

### 3.1 계정 생성

1. https://render.com 접속
2. **"Get Started for Free"** 클릭
3. **GitHub 계정으로 로그인**

### 3.2 Web Service 생성

1. Dashboard에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. **"Build and deploy from a Git repository"** → **"Next"**
4. GitHub 저장소 연결 (처음이면 "Connect GitHub" 클릭)
5. 저장소 선택 → **"Connect"** 클릭

### 3.3 서비스 설정

다음과 같이 입력:

```
Name: cro-backend
Region: Singapore (또는 가장 가까운 지역)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### 3.4 환경 변수 설정

**"Advanced"** 클릭 후 **"Add Environment Variable"** 클릭하여 다음 추가:

```
NODE_ENV=production
PORT=5555
MONGODB_URI=mongodb+srv://cro_admin:YOUR_PASSWORD@cro-cluster.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
JWT_SECRET=cro-super-secret-jwt-key-change-this-12345-production
JWT_EXPIRE=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**중요:**

- `MONGODB_URI`: 2단계에서 복사한 연결 문자열 사용
- `JWT_SECRET`: 랜덤한 긴 문자열로 변경 (보안!)

### 3.5 배포 시작

1. **"Create Web Service"** 클릭
2. 배포 시작... (2-3분 소요)
3. 로그에서 "Your service is live 🎉" 확인
4. 상단에 표시된 URL 복사 (예: `https://cro-backend.onrender.com`)

**✅ 완료! 백엔드 URL을 메모장에 저장해두세요.**

**테스트:**
브라우저에서 `https://cro-backend.onrender.com/api/health` 접속
→ `{"status":"ok"}` 표시되면 성공!

---

## ▲ 4단계: Vercel 프론트엔드 배포 (3분)

### 4.1 계정 생성

1. https://vercel.com 접속
2. **"Start Deploying"** 클릭
3. **GitHub 계정으로 로그인**

### 4.2 프로젝트 Import

1. **"Add New..."** → **"Project"** 클릭
2. GitHub 저장소 선택
3. **"Import"** 클릭

### 4.3 프로젝트 설정

다음과 같이 설정:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.4 환경 변수 설정

**"Environment Variables"** 섹션에서:

```
Name: VITE_API_URL
Value: https://cro-backend.onrender.com/api
```

**중요:** 3단계에서 복사한 Render URL 사용 (끝에 `/api` 추가)

### 4.5 배포 시작

1. **"Deploy"** 클릭
2. 배포 진행... (2-3분 소요)
3. 🎉 **"Congratulations!"** 화면 표시
4. **"Visit"** 클릭하여 사이트 확인

**✅ 완료! 배포 성공! 🎊**

---

## 🎉 5단계: 배포 완료 및 테스트

### 5.1 프론트엔드 URL 확인

Vercel에서 자동 생성된 URL (예: `https://your-app.vercel.app`)

### 5.2 첫 사용자 등록

1. Vercel URL 접속
2. **"회원가입"** 클릭
3. 정보 입력하여 계정 생성
4. 자동 로그인 완료!

### 5.3 모바일 테스트

스마트폰에서 Vercel URL 접속 → 완벽하게 작동! 📱

---

## 🔧 문제 해결

### ❌ 백엔드 연결 안 됨

1. **Render 로그 확인:**
   - Render Dashboard → Logs 탭
   - 오류 메시지 확인
2. **MongoDB 연결 확인:**
   - MongoDB Atlas → Network Access → 0.0.0.0/0 허용 확인
   - 연결 문자열 비밀번호 확인
3. **Vercel 환경 변수 확인:**
   - Settings → Environment Variables
   - `VITE_API_URL` 값 확인

### ⏱️ 첫 로딩이 느림 (30초)

**정상입니다!** Render 무료 플랜은 15분 비활성 시 슬립 모드 진입.
첫 요청 시 서버가 깨어나는 데 30초 소요.

**해결책:**

- 기다리면 됨 (이후 빠름)
- 또는 UptimeRobot으로 5분마다 핑 (무료)
- 또는 Render 유료 플랜 ($7/월)

### 🔄 CORS 오류

Render 환경 변수에서 `CORS_ORIGIN` 업데이트:

```
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🎊 축하합니다!

이제 전 세계 어디서나 접속 가능한 CRO 관리 시스템이 완성되었습니다!

**프론트엔드:** https://your-app.vercel.app
**백엔드:** https://cro-backend.onrender.com
**데이터베이스:** MongoDB Atlas

---

## 📱 다음 단계

### 커스텀 도메인 설정 (선택)

Vercel → Settings → Domains에서 자신의 도메인 연결 가능

### 업데이트 배포

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push origin main
```

→ Vercel과 Render가 자동으로 재배포!

### 팀원 초대

Vercel과 Render 대시보드에서 팀원 초대 가능

---

## 💰 비용

**완전 무료!**

- Vercel: 무제한 배포, 100GB/월
- Render: 750시간/월 (한 달 내내 실행 가능)
- MongoDB Atlas: 512MB (수천 개 레코드)

---

## 📞 지원

문제 발생 시:

1. Render Logs 확인
2. Vercel Logs 확인
3. 브라우저 개발자 도구 콘솔 확인
4. MongoDB Atlas Metrics 확인

**Happy Deploying! 🚀**
