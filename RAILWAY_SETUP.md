# Railway 백엔드 배포 가이드

## 현재 상태

- Railway URL: `https://cro-management-system-production.up.railway.app`
- 백엔드 상태: ✅ 정상 작동 중

## Railway 환경 변수 설정

Railway 대시보드에서 다음 환경 변수를 설정하세요:

### 필수 환경 변수

```bash
NODE_ENV=production
PORT=5555
JWT_SECRET=cro_management_super_secure_jwt_secret_key_2024_production_ready
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB 설정

**옵션 1: MongoDB Atlas 사용 (권장)**

```bash
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/cro_management?retryWrites=true&w=majority
```

MongoDB Atlas 설정:

1. https://cloud.mongodb.com 접속
2. 새 클러스터 생성 (무료 M0 tier 사용 가능)
3. Database Access에서 사용자 생성
4. Network Access에서 `0.0.0.0/0` 추가 (모든 IP 허용)
5. Connect > Connect your application에서 연결 문자열 복사

**옵션 2: Railway MongoDB 플러그인 사용**

1. Railway 프로젝트에서 "New" > "Database" > "Add MongoDB" 클릭
2. 자동으로 `MONGO_URL` 환경 변수가 생성됨
3. 백엔드 환경 변수에 추가:

```bash
MONGODB_URI=${{MONGO_URL}}
```

### CORS 설정 (프론트엔드 배포 후)

Vercel에 프론트엔드를 배포한 후, Railway에서 다음 환경 변수 추가:

```bash
FRONTEND_URL=https://[your-app].vercel.app
CORS_ORIGIN=https://[your-app].vercel.app
```

## 배포 확인

환경 변수 설정 후 Railway가 자동으로 재배포됩니다.

헬스 체크:

```bash
curl https://cro-management-system-production.up.railway.app/api/health
```

응답 예시:

```json
{
  "status": "OK",
  "timestamp": "2025-10-20T00:24:26.701Z",
  "environment": "production"
}
```

## 다음 단계

1. ✅ Railway 백엔드 환경 변수 설정
2. ⬜ Vercel에 프론트엔드 배포
3. ⬜ Vercel 환경 변수 설정: `VITE_API_URL=https://cro-management-system-production.up.railway.app/api`
4. ⬜ Railway CORS 설정 업데이트
