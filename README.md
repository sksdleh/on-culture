# ON Culture Site

Netlify 배포용 정적 사이트입니다.

## 폴더 구조

```text
.
├─ index.html
├─ home.html
├─ netlify.toml
└─ assets/
   ├─ css/
   │  ├─ entry.css
   │  └─ site.css
   ├─ js/
   │  └─ site.js
   └─ img/
      └─ README.md
```

## 페이지

- `/` 또는 `/index.html`: 첫 입구 페이지
- `/home.html`: 실제 홈페이지

## Netlify 설정

GitHub 저장소 루트에 이 폴더의 파일들이 바로 들어가 있는 경우:

- Build command: 비워두기
- Publish directory: `.`

만약 상위 프로젝트 전체를 GitHub에 올리고 이 사이트가 `outputs/on-culture-site` 안에 있는 경우:

- Base directory: `outputs/on-culture-site`
- Build command: 비워두기
- Publish directory: `.`

## 이미지 교체

현재 이미지는 임시 외부 URL을 사용합니다.
실제 자료를 받으면 `assets/img`에 파일을 넣고 HTML/CSS의 이미지 경로를 `/assets/img/파일명`으로 바꾸면 됩니다.
