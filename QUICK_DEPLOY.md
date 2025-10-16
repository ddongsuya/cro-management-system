# ⚡ 빠른 배포 가이드 (5분 완성)

## 🎯 목표

5분 안에 Vercel + Render + MongoDB Atlas로 배포 완료!

---

## 📝 준비물

- GitHub 계정
- 이메일 주소

---

## 🚀 3단계 배포

### 1단계: MongoDB Atlas (2분)

1. https://www.mongodb.com/cloud/atlas 접속
2. Google 계정으로 가입
3. "Build a Database" → **FREE** 선택
4. Provider: AWS, Region: **Seoul** 선택
5. "Create" 클릭
6. Database Access → "Add New Database User"
   - Username: `admin`
   - Password: 자동 생성 (복사!)
7. Network Access → "Add IP Address" → **"Allow Access from Anywhere"**
8. Database → Connect → "Connect your application"
   - 연결 문자열 복사:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cro_db?retryWrites=true&w=majority
   ```

✅ **완료! 연결 문자열 저장해두기**

---

### 2단계: 백엔드 배포 - Render (2분)

1. https://render.com 접속
2. GitHub 계정으로 로그인
3. "New +" → "Web Service"
4. GitHub 저장소 연결
5. 설정:
   ```
   Name: cro-backend
   Region: Singapore
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   ```
6. Environment Variables 추가:
   ```
   NODE_ENV=production
   PORT=5555
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cro_db?retryWrites=true&w=majority
   JWT_SECRET=my-super-secret-jwt-key-12345
   CORS_ORIGIN=*
   ```
7. "Create Web Service" 클릭
8. 배포 완료 후 URL 복사 (예: `https://cro-backend.onrender.com`)

✅ **완료! 백엔드 URL 저장해두기**

---

### 3단계: 프론트엔드 배포 - Vercel (1분)

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "Add New..." → "Project"
4. GitHub 저장소 선택 → "Import"
5. Environment Variables 추가:
   ```
   Name: VITE_API_URL
   Value: https://cro-backend.onrender.com/api
   ```
   (백엔드 URL로 변경)
6. "Deploy" 클릭
7. 2분 대기...

✅ **완료! 🎉**

---

## 🎊 배포 완료!

**프론트엔드 URL**: https://your-app.vercel.app

1. 위 URL 접속
2. 회원가입
3. 시스템 사용 시작!

---

## 📱 모바일 테스트

스마트폰에서 Vercel URL 접속하면 바로 사용 가능!

---

## 🔧 문제 발생 시

### 백엔드 연결 안 됨

1. Render 대시보드 → Logs 확인
2. MongoDB 연결 문자열 확인
3. Vercel 환경 변수 `VITE_API_URL` 확인

### 첫 로딩이 느림

Render 무료 플랜은 15분 비활성 시 슬립 모드.
첫 요청 시 30초 소요 (정상)

---

## 💡 팁

### 커스텀 도메인

Vercel → Settings → Domains에서 설정 가능

### 업데이트 배포

```bash
git add .
git commit -m "Update"
git push
```

→ 자동 재배포!

---

## 📊 무료 플랜 제한

- **Vercel**: 무제한 배포
- **Render**: 750시간/월 (충분)
- **MongoDB**: 512MB (수천 개 레코드)

---

**끝! 이제 전 세계 어디서나 접속 가능합니다! 🌍**
