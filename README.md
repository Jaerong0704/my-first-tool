# AI Tools Hub 🚀

모던하고 화려한 AI 도구 모음 웹사이트

## 📁 파일 구조

```
ai-tools-hub/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트 (모던/화려한 디자인)
├── script.js       # JavaScript (검색, 필터 기능)
├── tools.json      # AI 도구 데이터베이스
└── README.md       # 이 파일
```

## 🚀 빠른 시작

### 1. 파일 업로드
모든 파일을 호스팅 서버에 업로드하세요:
- index.html
- style.css
- script.js
- tools.json

### 2. 바로 사용 가능!
index.html을 브라우저로 열거나 웹 서버에서 실행하세요.

## ✨ 주요 기능

### 사용자 기능
- 🔍 **실시간 검색**: 도구 이름, 설명, 태그로 검색
- 🎯 **카테고리 필터**: 8개 카테고리로 분류
- 💰 **가격 필터**: 무료/유료 필터링
- 📱 **반응형 디자인**: 모바일/태블릿/PC 모두 지원
- 🎨 **화려한 UI**: 그라디언트, 애니메이션
- 📋 **링크 복사**: 원클릭 링크 복사

### 관리자 기능 (데이터 추가)
- ✏️ **쉬운 업데이트**: JSON 파일만 수정
- 🔄 **자동 렌더링**: 코드 수정 없이 도구 추가

## 📝 AI 도구 추가 방법

`tools.json` 파일을 열고 새 항목 추가:

```json
{
  "id": 51,
  "name": "새로운 AI 도구",
  "icon": "🤖",
  "description": "이 도구에 대한 간단한 설명",
  "category": "writing",
  "price": "freemium",
  "tags": ["태그1", "태그2", "태그3"],
  "link": "https://example.com",
  "popular": false
}
```

### 필드 설명:
- **id**: 고유 번호 (순차적으로 증가)
- **name**: 도구 이름
- **icon**: 이모지 아이콘
- **description**: 한 줄 설명 (80자 이내 추천)
- **category**: 카테고리
  - `writing` (글쓰기)
  - `image` (이미지)
  - `video` (영상)
  - `coding` (코딩)
  - `audio` (음악/음성)
  - `productivity` (생산성)
  - `design` (디자인)
- **price**: 가격
  - `free` (완전 무료)
  - `freemium` (무료 + 유료)
  - `paid` (유료만)
- **tags**: 검색용 태그 배열
- **link**: 도구 웹사이트 URL
- **popular**: 인기 도구 여부 (true/false)

## 🎨 디자인 커스터마이징

### 색상 변경
`style.css` 파일 상단의 `:root` 변수 수정:

```css
:root {
    --primary: #6366f1;      /* 메인 색상 */
    --secondary: #ec4899;    /* 보조 색상 */
    --accent: #06b6d4;       /* 강조 색상 */
    --bg: #0f172a;           /* 배경색 */
    --text: #f8fafc;         /* 텍스트 색상 */
}
```

### 폰트 변경
`style.css`의 `body` 섹션에서 `font-family` 수정

## 💰 수익화 방법

### 1. 구글 애드센스
`index.html`의 `<head>` 또는 원하는 위치에 광고 코드 삽입

### 2. 제휴 링크
`tools.json`의 `link` 필드를 제휴 링크로 교체
예: `https://example.com?ref=yourcode`

### 3. 프리미엄 콘텐츠
- 유료 프롬프트 팩 판매
- 독점 AI 도구 리스트
- 이메일 뉴스레터 구독

## 📊 SEO 최적화

### 메타 태그 추가 (index.html)
```html
<head>
    <meta name="keywords" content="AI 도구, ChatGPT, Midjourney, AI 추천">
    <meta property="og:title" content="AI Tools Hub">
    <meta property="og:description" content="2026년 최고의 AI 도구 모음">
    <meta property="og:image" content="thumbnail.jpg">
</head>
```

### Google Search Console 등록
1. https://search.google.com/search-console
2. 사이트 URL 등록
3. sitemap.xml 제출

## 🔧 고급 기능 추가 아이디어

### 1. 사용자 평점 시스템
```javascript
// tools.json에 rating 필드 추가
{
  "id": 1,
  "name": "ChatGPT",
  "rating": 4.8,
  // ...
}
```

### 2. 즐겨찾기 기능
```javascript
// localStorage 사용
function toggleFavorite(toolId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    // ...
}
```

### 3. 다크/라이트 모드 토글
```javascript
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}
```

## 📱 호스팅 추천

### 무료 호스팅:
- **GitHub Pages** (추천)
- **Netlify**
- **Vercel**
- **Cloudflare Pages**

### 유료 호스팅:
- **AWS S3**
- **Google Cloud Storage**
- **카페24**, **가비아** (국내)

## 🚀 배포 방법 (GitHub Pages)

1. GitHub 저장소 생성
2. 파일 업로드
3. Settings > Pages > Branch: main 선택
4. 몇 분 후 `https://yourusername.github.io/repo-name` 접속

## 📈 성장 전략

### 초기 (1-2개월)
- [ ] 도구 50개 → 100개로 확대
- [ ] SEO 최적화
- [ ] 소셜 미디어 공유

### 중기 (3-6개월)
- [ ] 구글 애드센스 신청
- [ ] 제휴 마케팅 시작
- [ ] 주 2-3회 신규 도구 추가

### 장기 (6개월+)
- [ ] 프리미엄 콘텐츠 판매
- [ ] 이메일 뉴스레터
- [ ] 커뮤니티 기능 추가

## 🐛 문제 해결

### 검색이 안 돼요
→ `script.js`와 `tools.json`이 같은 폴더에 있는지 확인

### 디자인이 안 나와요
→ `style.css` 파일 경로 확인

### 카드가 안 나와요
→ 브라우저 콘솔(F12) 에서 에러 확인
→ `tools.json` 문법 오류 체크 (쉼표, 따옴표)

## 📞 지원

문제가 있으면:
1. 브라우저 콘솔(F12) 확인
2. JSON 문법 검사기 사용: https://jsonlint.com
3. 파일 경로 재확인

## 📜 라이선스

자유롭게 사용, 수정, 배포 가능합니다!
상업적 용도로도 사용 가능합니다.

---

**만든 날짜**: 2026년 2월 9일
**버전**: 1.0
**제작**: Claude AI

행운을 빕니다! 🚀
