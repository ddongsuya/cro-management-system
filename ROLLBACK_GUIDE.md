# 롤백 가이드

## 현재 안정 버전

- **v1.0-stable**: 자동 로그아웃 + 마이페이지 기능 포함 (2025-10-21)

## 롤백 방법

### 방법 1: 특정 태그로 롤백

```bash
# 사용 가능한 태그 확인
git tag -l

# 특정 태그로 롤백
git checkout v1.0-stable

# 새 브랜치 생성 (선택사항)
git checkout -b rollback-to-v1.0

# 강제로 main 브랜치를 해당 태그로 되돌리기
git reset --hard v1.0-stable
git push origin main --force
```

### 방법 2: 특정 커밋으로 롤백

```bash
# 커밋 히스토리 확인
git log --oneline

# 특정 커밋으로 롤백 (커밋 해시 사용)
git reset --hard <commit-hash>
git push origin main --force
```

### 방법 3: 최근 N개 커밋 되돌리기

```bash
# 최근 1개 커밋 되돌리기
git reset --hard HEAD~1
git push origin main --force

# 최근 3개 커밋 되돌리기
git reset --hard HEAD~3
git push origin main --force
```

### 방법 4: 특정 파일만 이전 버전으로 복구

```bash
# 특정 커밋의 파일 복구
git checkout <commit-hash> -- path/to/file.tsx

# 커밋 및 푸시
git commit -m "Restore file from previous version"
git push
```

## 배포 롤백

### Vercel 롤백

1. Vercel 대시보드 접속
2. Deployments 탭
3. 이전 성공한 배포 선택
4. "Promote to Production" 클릭

### Railway 롤백

1. Railway 대시보드 접속
2. Deployments 탭
3. 이전 성공한 배포 선택
4. "Redeploy" 클릭

## 안전한 개발 워크플로우

### 1. 기능 개발 전 브랜치 생성

```bash
git checkout -b feature/new-feature
# 개발 진행
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### 2. 테스트 후 main에 병합

```bash
git checkout main
git merge feature/new-feature
git push origin main
```

### 3. 문제 발생 시 브랜치 삭제

```bash
git branch -D feature/new-feature
git push origin --delete feature/new-feature
```

## 주요 커밋 히스토리

### 최근 안정 버전들

```bash
# 현재 커밋 히스토리 확인
git log --oneline --graph --all -20
```

### 중요 커밋 기록

- `v1.0-stable`: 자동 로그아웃 + 마이페이지 (2025-10-21)
- 이전 버전들은 `git log`로 확인

## 백업 생성

### 로컬 백업

```bash
# 현재 상태를 zip으로 백업
git archive -o backup-$(date +%Y%m%d).zip HEAD
```

### GitHub에서 백업 다운로드

1. GitHub 저장소 페이지
2. Code > Download ZIP

## 데이터베이스 롤백

### MongoDB Atlas 백업

1. MongoDB Atlas 대시보드
2. Clusters > Backup 탭
3. 특정 시점으로 복구 가능

### Railway MongoDB 백업

Railway에서 자동 백업 제공 (Pro 플랜)

## 긴급 롤백 스크립트

```bash
# rollback.sh 생성
#!/bin/bash
echo "Rolling back to v1.0-stable..."
git fetch --all
git reset --hard v1.0-stable
git push origin main --force
echo "Rollback complete!"
```

## 주의사항

⚠️ **`--force` 푸시는 신중하게 사용하세요!**

- 팀원들과 협업 중이라면 먼저 알려야 합니다
- 로컬 백업을 먼저 만드세요
- 가능하면 `git revert`를 사용하세요 (히스토리 보존)

### 안전한 롤백 (revert 사용)

```bash
# 특정 커밋을 되돌리는 새 커밋 생성
git revert <commit-hash>
git push origin main
```

## 문제 해결

### "Your branch is behind" 에러

```bash
git fetch origin
git reset --hard origin/main
```

### 로컬 변경사항 모두 버리기

```bash
git reset --hard HEAD
git clean -fd
```

### 특정 시점의 코드 확인만 하기 (변경 없이)

```bash
git checkout <commit-hash>
# 확인 후
git checkout main
```
