# Vercel 프론트엔드 배포 가이드

## 빌드 확인

✅ 로컬 빌드 성공 완료

## Vercel 배포 단계

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 배포
vercel
```

또는 Vercel 웹사이트에서:

1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 선택

### 2. 빌드 설정

Vercel이 자동으로 감지하지만, 수동 설정이 필요한 경우:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 환경 변수 설정

Vercel 대시보드 > Settings > Environment Variables에서 추가:

```bash
VITE_API_URL=https://cro-management-system-production.up.railway.app/api
```

**중요**:

- Production, Preview, Development 모두 체크
- 환경 변수 추가 후 재배포 필요

### 4. 배포 후 작업

Vercel 배포가 완료되면 URL을 받게 됩니다 (예: `https://your-app.vercel.app`)

이 URL을 Railway 백엔드 환경 변수에 추가:

1. Railway 대시보드 접속
2. 백엔드 프로젝트 선택
3. Variables 탭에서 추가/수정:

```bash
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

### 5. 테스트

배포 완료 후:

1. Vercel URL 접속
2. 로그인 시도
3. 브라우저 콘솔에서 에러 확인

## 현재 설정

- ✅ `.env.production` - Railway URL 설정 완료
- ✅ `vercel.json` - Vercel 설정 완료
- ✅ 빌드 테스트 성공
- ⬜ Vercel 배포 대기
- ⬜ Railway CORS 설정 업데이트 대기

## 문제 해결

### Tailwind CSS CDN 경고

현재 CDN을 사용 중입니다. 프로덕션에서는 문제없지만, 나중에 PostCSS 플러그인으로 전환 권장.

### API 404 에러

- Railway 백엔드가 정상 작동 중인지 확인
- Vercel 환경 변수 `VITE_API_URL`이 올바른지 확인
- Railway CORS 설정에 Vercel URL이 포함되어 있는지 확인

## 다음 단계

```bash
# 1. Vercel 배포
vercel --prod

# 2. 배포된 URL 확인
# 3. Railway CORS 업데이트
# 4. 테스트
```
