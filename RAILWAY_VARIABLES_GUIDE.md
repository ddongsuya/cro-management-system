# Railway 환경 변수 추가 가이드 (상세)

## 1단계: Railway 대시보드 접속

1. 브라우저에서 https://railway.app 접속
2. 로그인 (GitHub 계정으로 로그인했을 가능성이 높음)

## 2단계: 프로젝트 찾기

1. 대시보드에서 프로젝트 목록이 보입니다
2. **"cro-management-system-production"** 또는 비슷한 이름의 프로젝트 클릭
3. 프로젝트 안에 여러 서비스가 있을 수 있습니다 (예: backend, database 등)
4. **백엔드 서비스**를 클릭 (보통 Node.js 아이콘이나 "backend" 이름)

## 3단계: Variables 탭 열기

프로젝트/서비스 화면에서:

1. 상단 메뉴에서 **"Variables"** 탭 클릭
   - 다른 탭들: Settings, Deployments, Metrics, Logs 등이 함께 보입니다
2. Variables 탭을 클릭하면 현재 설정된 환경 변수 목록이 보입니다

## 4단계: 환경 변수 추가

### 방법 1: Raw Editor 사용 (추천)

1. Variables 탭에서 **"Raw Editor"** 버튼 클릭 (오른쪽 상단)
2. 텍스트 에디터가 열립니다
3. 기존 변수들이 보일 것입니다. 예:
   ```
   NODE_ENV=production
   PORT=5555
   JWT_SECRET=...
   ```
4. 맨 아래에 새 줄을 추가:
   ```
   FRONTEND_URL=https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app
   CORS_ORIGIN=https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app
   ```
5. 완성된 모습:
   ```
   NODE_ENV=production
   PORT=5555
   JWT_SECRET=cro_management_super_secure_jwt_secret_key_2024_production_ready
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   MONGODB_URI=mongodb+srv://...
   FRONTEND_URL=https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app
   CORS_ORIGIN=https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app
   ```
6. **"Update Variables"** 버튼 클릭 (하단 또는 상단)

### 방법 2: 개별 추가

1. Variables 탭에서 **"New Variable"** 버튼 클릭
2. 첫 번째 변수 추가:
   - **Variable Name**: `FRONTEND_URL`
   - **Value**: `https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app`
   - **Add** 버튼 클릭
3. 다시 **"New Variable"** 버튼 클릭
4. 두 번째 변수 추가:
   - **Variable Name**: `CORS_ORIGIN`
   - **Value**: `https://cro-client-management-bad42u0ye-ddongsus-projects.vercel.app`
   - **Add** 버튼 클릭

## 5단계: MongoDB 확인

Variables 목록에서 `MONGODB_URI` 변수가 있는지 확인:

### 있는 경우

- ✅ 그대로 두면 됩니다

### 없는 경우 (옵션 A - MongoDB Atlas)

1. **"New Variable"** 클릭
2. Variable Name: `MONGODB_URI`
3. Value: MongoDB Atlas 연결 문자열
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cro_management?retryWrites=true&w=majority
   ```
4. **Add** 클릭

### 없는 경우 (옵션 B - Railway MongoDB 플러그인)

1. 프로젝트 대시보드로 돌아가기 (뒤로가기)
2. **"New"** 버튼 클릭
3. **"Database"** 선택
4. **"Add MongoDB"** 클릭
5. MongoDB가 자동으로 생성되고 `MONGO_URL` 변수가 생성됩니다
6. 백엔드 서비스의 Variables로 돌아가서:
   - Variable Name: `MONGODB_URI`
   - Value: `${{MONGO_URL}}` (Railway 변수 참조)
   - **Add** 클릭

## 6단계: 저장 및 재배포

1. 변수를 추가/수정하면 자동으로 저장됩니다
2. Railway가 자동으로 백엔드를 재배포합니다
3. 상단에 "Deploying..." 메시지가 보입니다
4. 1-2분 정도 기다립니다
5. "Deployed" 또는 "Active" 상태가 되면 완료

## 7단계: 확인

### Deployments 탭에서 확인

1. **"Deployments"** 탭 클릭
2. 최신 배포가 "Success" 상태인지 확인
3. 실패했다면 로그를 클릭해서 에러 확인

### Logs 탭에서 확인

1. **"Logs"** 탭 클릭
2. 실시간 로그가 보입니다
3. 다음과 같은 메시지가 보이면 성공:
   ```
   MongoDB connected successfully
   Server running on port 5555
   ```

## 문제 해결

### "Variables" 탭이 안 보이는 경우

- 프로젝트가 아닌 서비스를 선택했는지 확인
- 백엔드 서비스를 클릭해야 합니다

### 변수를 추가했는데 적용이 안 되는 경우

- 재배포가 완료될 때까지 기다리기 (1-2분)
- Deployments 탭에서 최신 배포 상태 확인

### MongoDB 연결 에러가 나는 경우

- MONGODB_URI 값이 올바른지 확인
- MongoDB Atlas의 경우 Network Access에서 0.0.0.0/0 허용 확인
- 사용자 이름과 비밀번호가 올바른지 확인

## 완료 체크리스트

- [ ] Railway 대시보드 접속
- [ ] 백엔드 프로젝트/서비스 선택
- [ ] Variables 탭 열기
- [ ] FRONTEND_URL 추가
- [ ] CORS_ORIGIN 추가
- [ ] MONGODB_URI 확인/추가
- [ ] 재배포 완료 대기
- [ ] Logs에서 "MongoDB connected" 확인
- [ ] 브라우저에서 프론트엔드 테스트
