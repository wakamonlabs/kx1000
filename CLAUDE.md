# 외계행성 1000부대 막기 (kx1000)

게임 전체가 `index.html` 한 파일에 들어 있습니다 (CSS, JS, 이미지, 글꼴 포함).

## UI 작업 규칙

UI를 만들거나 고치기 전에 **반드시 `DESIGN.md`를 읽고 그대로 따릅니다.** 색, 글꼴, 글자 크기, 모서리, 버튼 종류가 모두 거기에 정해져 있습니다.

가장 자주 어기는 것:

1. 색은 `DESIGN.md`의 Colors 표에 있는 값이나 CSS 변수(`--kk`, `--kfg`, `--kst3` 등)만 씁니다. 새 색을 만들지 않습니다.
2. 글꼴은 `var(--f-display)`, `var(--f-body)`, `var(--f-num)` 세 개만 씁니다. `<button>`을 새로 만들면 `font-family`를 꼭 지정합니다 (안 하면 Arial로 나옵니다).
3. 크기는 `em`으로 적습니다. `px`는 쓰지 않습니다. 가장 작은 글자는 `0.62em`입니다.
4. 버튼·탭·칩 안 글자는 한 줄로 두고, 폭이 정해진 칸에는 `white-space:nowrap; overflow:hidden; text-overflow:ellipsis`와 (flex 자식이면) `min-width:0`을 줍니다.
5. 새 버튼은 기존 `.kb` 계열(`.kb.gold`, `.kb.teal`, `.kb.dark`, `.kb.sm` 등)을 먼저 씁니다. 비슷한 버튼을 새로 만들지 않습니다.

## UI를 고친 뒤 검사

```bash
node tools/ui-check.cjs          # 360x640 화면, 로비 + 하단 탭 5개 + 로비 좌우 버튼
node tools/ui-check.cjs --all    # 360x640, 390x844, 430x932, 673x841(폴드 펼침) (큰 변경일 때)
node tools/ui-check.cjs --file 경로/vNNN.html   # 작업 중인 파일 검사
```

- 출격(교리) 화면, 일시정지, 승리·패배 화면도 검사합니다. 전투 중 화면은 개발용 훅 `window.__kx`로 열기 때문에, 출시 전에 훅을 지운 빌드에서는 건너뜁니다.
- 전투 화면(캔버스) 글자는 이 검사가 못 봅니다. DESIGN.md Typography의 캔버스 글자 크기 규칙(HUD 8px, 전장 꼬리표 7px 이상)을 직접 지킵니다.

- 글자 넘침, 버튼 안 줄바꿈, 말줄임 없는 잘림, 화면 밖으로 나감, 허용 안 된 글꼴, 너무 작은 글자를 찾아 줍니다.
- 스크린샷이 `tools/ui-check-out/`에 저장됩니다. 고친 화면은 스크린샷을 직접 열어 눈으로도 확인합니다.
- 내가 고친 화면에서 **새 문제가 0개**여야 끝난 것입니다.
- 검사가 들어가지 않는 화면(전투 중 화면, 결과 화면 등)을 고쳤다면 `tools/ui-check.cjs`의 `SCREENS`에 그 화면을 여는 버튼을 추가합니다.

이 검사를 처음 만들었을 때(v1.38.0) 이미 있던 문제입니다. 해당 화면을 고칠 때 같이 고칩니다.

- (v1.40.0에서 고침) 지휘관 탭 이름 버튼 Arial·작은 글자, 로비 "여유" 글자, 강화 탭 `i.llv`
- 설정: 테스트 버튼 "모든 성장 가득 채우기"가 단어 중간에서 두 줄로 꺾임 (출시 전 테스트 기능과 함께 제거 예정)

## 번역 (v1.43.0부터)

- 화면에 나오는 새 한국어 문구를 넣으면 `i18n/en.json`에도 영어를 넣습니다. 자세한 방법은 `i18n/README.md`.
- 영어는 한국어보다 길어지기 쉬우므로 UI를 고친 뒤 `node tools/ui-check.cjs --lang en`도 돌립니다(번역 안 된 문구 수도 나옴).

## DESIGN.md를 바꿀 때

`DESIGN.md`는 Google Stitch의 DESIGN.md 형식(https://github.com/google-labs-code/design.md)을 따릅니다. 고친 뒤 검사합니다.

```bash
npx @google/design.md lint DESIGN.md
```

- 오류(error)가 0개여야 합니다.
- 대비 경고는 붉은 주요 버튼과 이벤트 버튼 두 개만 허용합니다 (DESIGN.md의 Elevation & Depth에 이유가 적혀 있습니다).
- 게임 코드의 CSS 변수와 DESIGN.md 값이 서로 다르면 둘 다 같은 값으로 맞춥니다.
