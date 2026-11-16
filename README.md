# Minjae Kim — Personal Website

https://minjae030321.github.io

GitHub Pages로 배포되는 개인 홈페이지입니다. 빌드 과정 없이 파일을 고치면 바로 반영됩니다.

## 내용 수정

| 고칠 내용 | 파일 |
|---|---|
| 소개, 연락처, 학력, 경력, 기술, 교육 수강, 참여 과제 | `data/profile.yml` |
| 프로젝트 (홈 화면 대표 프로젝트는 `featured: true`) | `data/projects.yml` |
| 논문, 학회 발표, 특허, 수상 | `data/publications.yml` |

- **More (상세 페이지):** `data/details/<프로젝트 id>.yml`을 만들고 `projects.yml`의 그 프로젝트에 `detail: true`를 넣으면
  카드에 "More →" 버튼이 생기고 `project.html?id=<id>`에서 상세 내용이 보입니다.
  블록 종류: `h`(소제목), `h4`(작은 제목), `p`(문단), `li`(목록, `level` 1~3), `img`(그림, `caption`), `video`(드라이브 ID)
- **증명서·성적표:** `data/details/award-*.yml`, `cert-*.yml`, `gpa.yml`의 이미지가 "증명서 보기" 버튼으로 열립니다.
  수상·학력·수료 항목에 `proof: <파일 이름>`, 관련 프로젝트는 `project: <프로젝트 id>`로 연결합니다.
- 프로젝트 영상은 구글 드라이브 파일 ID를 `video:`에 적으면 "영상 보기" 버튼으로 재생됩니다.
  드라이브에서 파일 공유를 **링크가 있는 모든 사용자**로 해두어야 다른 사람도 볼 수 있습니다.
- 사진은 `images/projects/`에 넣고 `image:`에 경로를 적습니다.
- yml 들여쓰기는 스페이스 2칸, 값에 `:`가 있으면 따옴표로 감쌉니다.

## 미리 보기

```bash
python -m http.server 8000
```

http://localhost:8000

## 배포 (처음 한 번)

1. GitHub Desktop에서 **`minjae030321`** 계정으로 로그인 (File → Options → Accounts)
2. File → Add local repository → 이 폴더 → create a repository (Name: `minjae-website` 그대로)
3. Publish repository → Name을 **`minjae030321.github.io`**로 변경, "Keep this code private" 체크 해제
4. github.com 저장소 → Settings → Pages → Branch `main` / `(root)` → Save
