# 🚀 Vercel 배포 가이드

CRO 클라이언트 관리 시스템을 Vercel에 배포하는 완벽 가이드입니다.

## 📋 배포 아키텍처

```
프론트엔드 (React) → Vercel (무료)
백엔드 (Node.js) → Railway/Render (무료)
데이터베이스 → MongoDB Atlas (무료)
```

---

## 1️⃣ MongoDB Atlas 설정 (데이터베이스)

### 1.1 MongoDB Atlas 계정 생성

1. https://www.mongodb.com/cloud/atlas 접속
2. "Try Free" 클릭하여 무료 계정 생성
3. Google 계정으로 간편 가입 가능

### 1.2 클러스터 생성

1. "Build a Database" 클릭
2. **FREE (M0)** 선택 (512MB 무료)
3. Provider: **AWS** 선택
4. Region: **Seoul (ap-northeast-2)** 선택 (한국 서버)
5. Cluster Name: `cro-management` (원하는 이름)
6. "Create" 클릭

### 1.3 데이터베이스 사용자 생성

1. Security → Database Access
2. "Add New Database User" 클릭
3. Authentication Method: **Password**
4. Username: `cro_admin` (원하는 이름)
5. Password: 강력한 비밀번호 생성 (복사해두기!)
6. Database User Privileges: **Read and write to any database**
7. "Add User" 클릭

### 1.4 네트워크 접근 허용

1. Security → Network Access
2. "Add IP Address" 클릭
3. **"Allow Access from Anywhere"** 선택 (0.0.0.0/0)
4. "Confirm" 클릭

### 1.5 연결 문자열 복사

1. Database → Connect
2. "Connect your application" 선택
3. Driver: **Node.js**, Version: **4.1 or later**
4. 연결 문자열 복사:
   ```
   mongodb+srv://cro_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. `<password>`를 실제 비밀번호로 변경
6. 데이터베이스 이름 추가:
   ```
   mongodb+srv://cro_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
   ```

---

## 2️⃣ 백엔드 배포 (Railway 추천)

### 옵션 A: Railway 배포 (추천)

#### 2.1 Railway 계정 생성

1. https://railway.app 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인

#### 2.2 프로젝트 생성

1. "Deploy from GitHub repo" 선택
2. 저장소 연결 (또는 "Empty Project" 선택)
3. "Add a New Service" → "Empty Service" 클릭

#### 2.3 백엔드 코드 배포

Railway에서 직접 배포하는 대신, 로컬에서 백엔드를 별도로 관리하는 것을 추천합니다.

**간단한 방법: Render 사용**

### 옵션 B: Render 배포 (더 간단)

#### 2.1 Render 계정 생성

1. https://render.com 접속
2. "Get Started for Free" 클릭
3. GitHub 계정으로 로그인

#### 2.2 Web Service 생성

1. Dashboard → "New +" → "Web Service"
2. "Build and deploy from a Git repository" 선택
3. GitHub 저장소 연결
4. 설정:
   - **Name**: `cro-backend`
   - **Region**: Singapore (가장 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

#### 2.3 환경 변수 설정

Environment 탭에서 추가:

```
NODE_ENV=production
PORT=5555
MONGODB_URI=mongodb+srv://cro_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cro_management?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CORS_ORIGIN=https://your-app.vercel.app
```

#### 2.4 배포 URL 복사

배포 완료 후 URL 복사 (예: `https://cro-backend.onrender.com`)

---

## 3️⃣ 프론트엔드 배포 (Vercel)

### 3.1 Vercel 계정 생성

1. https://vercel.com 접속
2. "Start Deploying" 클릭
3. GitHub 계정으로 로그인

### 3.2 프로젝트 Import

1. "Add New..." → "Project" 클릭
2. GitHub 저장소 선택
3. "Import" 클릭

### 3.3 프로젝트 설정

- **Framework Preset**: Vite
- **Root Directory**: `./` (루트)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 환경 변수 설정

Environment Variables 섹션에서 추가:

```
VITE_API_URL=https://cro-backend.onrender.com/api
```

(백엔드 URL을 실제 Render URL로 변경)

### 3.5 배포

1. "Deploy" 클릭
2. 2-3분 대기
3. 배포 완료! 🎉

### 3.6 배포 URL 확인

- 자동 생성된 URL: `https://your-app.vercel.app`
- 커스텀 도메인 설정 가능 (Settings → Domains)

---

## 4️⃣ 배포 후 설정

### 4.1 백엔드 CORS 업데이트

Render 환경 변수에서 `CORS_ORIGIN` 업데이트:

```
CORS_ORIGIN=https://your-app.vercel.app
```

### 4.2 첫 사용자 등록

1. Vercel URL 접속
2. 회원가입 진행
3. 시스템 사용 시작!

---

## 5️⃣ 업데이트 배포

### 프론트엔드 업데이트

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

→ Vercel이 자동으로 재배포

### 백엔드 업데이트

```bash
git add .
git commit -m "Update backend"
git push origin main
```

→ Render가 자동으로 재배포

---

## 6️⃣ 문제 해결

### 프론트엔드가 백엔드에 연결 안 됨

1. Vercel 환경 변수 확인: `VITE_API_URL`
2. Render 백엔드가 실행 중인지 확인
3. Render 로그 확인 (Logs 탭)
4. CORS 설정 확인

### 백엔드 오류

1. Render Dashboard → Logs 확인
2. MongoDB 연결 문자열 확인
3. 환경 변수 확인

### MongoDB 연결 오류

1. MongoDB Atlas → Network Access 확인 (0.0.0.0/0 허용)
2. Database User 비밀번호 확인
3. 연결 문자열에 비밀번호 특수문자 URL 인코딩

---

## 7️⃣ 비용

### 무료 플랜 제한

- **Vercel**: 무제한 배포, 100GB 대역폭/월
- **Render**: 750시간/월 (충분함), 15분 비활성 시 슬립
- **MongoDB Atlas**: 512MB 저장소 (수천 개 레코드 가능)

### 슬립 모드 해결

Render 무료 플랜은 15분 비활성 시 슬립 모드 진입.
첫 요청 시 30초 정도 소요될 수 있음.

**해결책**:

- UptimeRobot으로 5분마다 핑 (무료)
- 유료 플랜 ($7/월)

---

## 8️⃣ 체크리스트

배포 전 확인:

- [ ] MongoDB Atlas 클러스터 생성
- [ ] 데이터베이스 사용자 생성
- [ ] 네트워크 접근 허용 (0.0.0.0/0)
- [ ] 연결 문자열 복사
- [ ] Render 백엔드 배포
- [ ] 백엔드 환경 변수 설정
- [ ] 백엔드 URL 복사
- [ ] Vercel 프론트엔드 배포
- [ ] 프론트엔드 환경 변수 설정 (VITE_API_URL)
- [ ] 백엔드 CORS 설정 업데이트
- [ ] 첫 사용자 등록 테스트
- [ ] 모바일에서 접속 테스트

---

## 9️⃣ 추가 최적화

### 커스텀 도메인 설정

1. Vercel → Settings → Domains
2. 도메인 추가 (예: cro.yourdomain.com)
3. DNS 설정 (Vercel이 안내)

### HTTPS 자동 적용

Vercel과 Render 모두 자동으로 HTTPS 인증서 발급

### 성능 모니터링

- Vercel Analytics 활성화 (무료)
- Render Metrics 확인

---

## 🎉 완료!

이제 전 세계 어디서나 모바일/데스크톱으로 접속 가능합니다!

**프론트엔드**: https://your-app.vercel.app
**백엔드**: https://cro-backend.onrender.com

---

## 📞 지원

문제 발생 시:

1. Vercel Logs 확인
2. Render Logs 확인
3. 브라우저 개발자 도구 콘솔 확인
4. MongoDB Atlas Metrics 확인

**Happy Deploying! 🚀**
