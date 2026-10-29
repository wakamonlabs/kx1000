---
version: alpha
name: KX-1000 방어선
description: 외계행성 1000부대 막기의 UI 디자인 시스템. 검은 테두리를 두른 무거운 금속판, 붉은 경보색 주요 버튼, 금색 보상, 청록색 외계 기술.
colors:
  # 주요 행동 (전투 시작, 확인, 구매) — 코드의 .kb.gold 붉은 그라데이션
  primary: "#e62018"
  primary-light: "#ff5a4c"
  primary-dark: "#c4140e"
  # 외계 기술·젬·보석 — 코드의 --bio, .kb.teal
  secondary: "#7ae9ff"
  secondary-dark: "#1aa7d6"
  # 보상·재화·강조 숫자
  tertiary: "#ffd34a"
  amber: "#ffb23e"
  # 글자
  on-surface: "#fff1dc"
  on-primary: "#fff4e8"
  on-surface-dim: "#d2b99b"
  on-surface-muted: "#b9a98f"
  # 바탕과 금속판
  outline: "#0c0c0d"
  ground: "#0b0b0c"
  panel: "#151516"
  panel-hi: "#1f1f21"
  steel-dark: "#1d1d1f"
  steel: "#2a2a2d"
  steel-light: "#414146"
  line: "#343438"
  # 상태
  alert: "#ff5340"
  success: "#9be38a"
  event: "#d93fae"
typography:
  # 큰 제목·결과 연출 (Black Han Sans는 굵기 400 하나뿐)
  display-xl:
    fontFamily: Black Han Sans
    fontSize: 2em
    fontWeight: 400
    lineHeight: 1.05
  display-lg:
    fontFamily: Black Han Sans
    fontSize: 1.6em
    fontWeight: 400
    lineHeight: 1.1
  # 버튼·탭·카드 제목
  display-md:
    fontFamily: Black Han Sans
    fontSize: 1em
    fontWeight: 400
    lineHeight: 1.1
  display-sm:
    fontFamily: Black Han Sans
    fontSize: 0.85em
    fontWeight: 400
    lineHeight: 1.1
  # 설명·본문
  body-md:
    fontFamily: Gothic A1
    fontSize: 0.95em
    fontWeight: 700
    lineHeight: 1.35
  body-sm:
    fontFamily: Gothic A1
    fontSize: 0.78em
    fontWeight: 700
    lineHeight: 1.3
  # 가장 작은 글자. 이보다 작게 쓰지 않는다.
  caption:
    fontFamily: Gothic A1
    fontSize: 0.62em
    fontWeight: 800
    lineHeight: 1.2
  # 숫자 (전투력, 웨이브, 재화 수량, 퍼센트)
  number-md:
    fontFamily: Chakra Petch
    fontSize: 1em
    fontWeight: 700
    lineHeight: 1
  number-sm:
    fontFamily: Chakra Petch
    fontSize: 0.72em
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: 0.45em
  md: 0.5em
  lg: 0.8em
  pill: 0.95em
  cut: 0.42em
spacing:
  xxs: 0.12em
  xs: 0.2em
  sm: 0.3em
  md: 0.55em
  lg: 0.9em
  xl: 1.2em
  border: 0.14em
  press-depth: 0.24em
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: 0.45em
  button-primary-pressed:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary}"
  # 붉은 버튼 그라데이션 위쪽 밝은 부분 (글자 바탕으로 쓰지 않음)
  button-primary-highlight:
    backgroundColor: "{colors.primary-light}"
  button-secondary:
    backgroundColor: "{colors.steel-light}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: 0.45em
  button-tech:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.outline}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
  button-tech-pressed:
    backgroundColor: "{colors.secondary-dark}"
    textColor: "{colors.outline}"
  button-event:
    backgroundColor: "{colors.event}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
  button-dark:
    backgroundColor: "{colors.steel-dark}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
  currency-chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-surface}"
    typography: "{typography.number-md}"
    rounded: "{rounded.pill}"
    height: 2.05em
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 0.9em
  panel-raised:
    backgroundColor: "{colors.panel-hi}"
    textColor: "{colors.on-surface}"
  card-steel:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.cut}"
  card-divider:
    backgroundColor: "{colors.line}"
  label-dim:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.on-surface-dim}"
    typography: "{typography.body-sm}"
  label-muted:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.caption}"
  label-number:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.tertiary}"
    typography: "{typography.number-sm}"
  reward-amount:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.amber}"
    typography: "{typography.number-md}"
  badge-alert:
    backgroundColor: "{colors.alert}"
    textColor: "{colors.outline}"
    typography: "{typography.caption}"
  badge-success:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
  title-hero:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display-xl}"
  title-popup:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.tertiary}"
    typography: "{typography.display-lg}"
  title-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display-sm}"
  body-text:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
---

# KX-1000 방어선 디자인 시스템

이 파일은 `index.html`의 UI를 만들거나 고칠 때 따르는 기준입니다. 위쪽 YAML 값이 정답이고, 아래 글은 그 값을 언제 어떻게 쓰는지 설명합니다. 코드에서는 이 값들이 CSS 변수(`--kk`, `--kfg`, `--f-display` 등)로 들어 있습니다. 대응표는 Colors와 Typography 절에 있습니다.

## Overview

인류 최후의 방어선. 붉게 타는 외계 행성 위에서 검은 테두리를 두른 두꺼운 금속판 UI로 버티는 느낌입니다.

- 바탕은 거의 검은 숯색, 판은 회색 금속. 모든 판과 버튼에 검은 테두리(`outline`)와 아래로 떨어지는 단단한 그림자를 줍니다.
- 색은 아껴 씁니다. 붉은색은 "지금 눌러야 할 것", 금색은 "받을 것", 청록색은 "외계 기술·젬"에만 씁니다.
- 마린 키우기의 UI **구조**(상단 재화, 좌우 사이드 버튼, 하단 5탭)는 참고하지만, 색과 아이콘은 이 게임만의 것을 씁니다.
- 화면 크기는 `#frame`의 기준 글자 크기 하나로 맞춥니다. 360×640 화면에서 13.5px이고 화면이 커지면 같이 커집니다. 그래서 크기는 모두 `em`으로 적습니다.

## Colors

| 토큰 | 값 | 코드 변수 | 쓰는 곳 |
|---|---|---|---|
| primary / primary-light / primary-dark | #e62018 / #ff5a4c / #c4140e | `.kb.gold` 그라데이션 | 전투 시작, 확인, 구매 같은 그 화면의 **단 하나의** 주요 버튼 |
| secondary / secondary-dark | #7ae9ff / #1aa7d6 | `--bio`, `.kb.teal` | 젬, 외계 기술, 적의 발광부 |
| tertiary | #ffd34a | (직접 값) | 보상 숫자, 팝업 제목, 강조 |
| amber | #ffb23e | `--amber` | 보상 수량, 광고 보상 강조 |
| on-surface | #fff1dc | `--kfg` | 기본 글자색 |
| on-primary | #fff4e8 | (직접 값) | 붉은 버튼 위 글자 |
| on-surface-dim | #d2b99b | `--kdim` | 보조 설명 |
| on-surface-muted | #b9a98f | (직접 값) | 아주 약한 안내 문구 |
| outline | #0c0c0d | `--kk` | 모든 테두리, 버튼 그림자, 글자 외곽선(`.ol`) |
| ground / panel / panel-hi | #0b0b0c / #151516 / #1f1f21 | `--ground`, `--panel`, `--panel-hi` | 화면 바탕, 팝업 판 |
| steel-dark / steel / steel-light | #1d1d1f / #2a2a2d / #414146 | `--kst2`, `--kst`, `--kst3` | 금속판, 보조 버튼 |
| line | #343438 | `--line` | 구분선 |
| alert | #ff5340 | `--kred` | 빨간 알림 점, 경고 |
| success | #9be38a | (직접 값) | 완료, 충족, 획득 |
| event | #d93fae | `.kb.pink` | 이벤트·특가 버튼만 |

규칙:

- 위 표에 없는 색을 새로 만들지 않습니다. 비슷한 색이 필요하면 표에서 고릅니다.
- 반투명이 필요하면 표의 색에 투명도만 줍니다. 예: `rgba(0,0,0,.5)`, `rgba(255,241,220,.15)`.
- 붉은 주요 버튼은 한 화면에 하나만 둡니다. 나머지는 `button-secondary`나 `button-dark`를 씁니다.
- 예전 코드에는 이 표에 없는 색이 남아 있습니다. 그 부분을 고칠 일이 생기면 가장 가까운 토큰으로 바꿉니다.

## Typography

글꼴은 딱 세 개만 씁니다.

| 역할 | 글꼴 | 코드 변수 | 쓰는 곳 |
|---|---|---|---|
| 제목·버튼·탭 | Black Han Sans | `var(--f-display)` | display-xl ~ display-sm |
| 본문·설명 | Gothic A1 | `var(--f-body)` | body-md, body-sm, caption |
| 숫자 | Chakra Petch | `var(--f-num)` | number-md, number-sm |

규칙:

- CSS에서는 글꼴 이름을 직접 쓰지 말고 반드시 `var(--f-display)`, `var(--f-body)`, `var(--f-num)`을 씁니다.
- 캔버스(`ctx.font`)는 변수를 못 쓰므로 위 세 글꼴 이름만 씁니다.
- `Do Hyeon`은 파일에 들어 있지만 쓰지 않습니다. 새로 쓰지 않습니다.
- Black Han Sans는 굵기가 400 하나뿐입니다. `font-weight:700` 이상을 주면 가짜 굵게로 뭉개지므로 항상 400으로 둡니다.
- 가장 작은 글자는 `caption`(0.62em)입니다. 이보다 작게 쓰지 않습니다.
- 바뀌는 숫자(재화, 타이머, 전투력)에는 `font-variant-numeric: tabular-nums`를 줘서 숫자가 바뀔 때 글자 폭이 흔들리지 않게 합니다.
- 글자 크기는 `em`으로 적습니다. `px`는 쓰지 않습니다. 예전 코드의 하단 탭 `.kt`처럼 `px`로 남아 있는 부분은 손댈 때 `em`으로 바꿉니다.

## Layout

- 대상 화면: 가로 360px(작은 안드로이드) ~ 430px(큰 아이폰), 세로 640px 이상. 360×640에서 잘리지 않으면 통과입니다.
- 화면 위쪽에 붙는 요소는 상단 안전 영역 `var(--sat,0px)`을 더해서 놓습니다. 노치와 겹치면 안 됩니다.
- 간격은 spacing 토큰(0.12 / 0.2 / 0.3 / 0.55 / 0.9 / 1.2em)에서 고릅니다.
- 화면 구조는 그대로 유지합니다: 상단 재화줄 → 좌우 사이드 버튼 → 가운데 내용 → 주요 버튼 → 하단 5탭.

## Elevation & Depth

입체감은 흐린 그림자가 아니라 **아래로 떨어지는 단단한 그림자**로 냅니다.

- 붉은 주요 버튼(4.2:1)과 이벤트 버튼(3.6:1)은 lint의 대비 경고가 나옵니다. 둘 다 큰 굵은 글자에 검은 외곽선이 있어서 읽히므로 그대로 둡니다. 새로 만드는 조합은 4.5:1 이상으로 맞춥니다.
- 버튼: `box-shadow: 0 .24em 0 var(--kk), inset 0 .1em 0 rgba(255,255,255,.18)`
- 누를 때: `transform: translateY(.18em)` 하면서 그림자를 `0 .06em 0 var(--kk)`로 줄입니다.
- 사진 위 글자는 `.ol` 클래스로 검은 외곽선을 둘러 읽히게 합니다.
- 빛나는 효과(`text-shadow` 글로우)는 보상 연출과 결과 화면에만 씁니다.

## Shapes

- 모든 판과 버튼에 `0.14em` 검은 테두리(`var(--kk)`)를 둡니다.
- 모서리: 작은 버튼 `0.45em`, 일반 버튼 `0.5em`, 큰 판 `0.8em`, 재화 칩처럼 둥근 것 `0.95em`.
- 군용 금속판 느낌의 카드는 모서리를 깎습니다(`--cut: .42em`, `clip-path`).
- 한 화면 안에서 같은 종류의 판은 같은 모서리 값을 씁니다.

## Components

새 버튼이나 판을 만들 때는 아래 기존 클래스를 먼저 씁니다. 비슷한 것을 새로 만들지 않습니다.

| 컴포넌트 | 클래스 | 메모 |
|---|---|---|
| button-primary | `.kb.gold` | 이름은 gold지만 붉은 버튼입니다 |
| button-secondary | `.kb` | 회색 금속 기본 버튼 |
| button-tech | `.kb.teal` | 젬, 외계 기술 관련 |
| button-event | `.kb.pink` | 이벤트, 특가 |
| button-dark | `.kb.dark` | 닫기, 취소 |
| 비활성 | `.kb.off` | 회색 처리 |
| 작은 버튼 | `.kb.sm` | 0.85em |
| currency-chip | `.kcur` | 상단 재화 |
| 사이드 버튼 | `.krb` | 로비 좌우 아이콘 버튼 |
| 하단 탭 | `.kt` | 5개 고정 |
| 버튼 안 아이콘 | `.ai` | 1.15em 정사각형 |

## Do's and Don'ts

**글자 넘침 막기 (가장 자주 터지는 문제)**

- Do: 폭이 정해진 칸(버튼, 탭, 칩, 카드 제목) 안의 글자에는 항상 아래 세 줄을 함께 줍니다.
  `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
- Do: flex 안에서 글자를 담는 자식에는 `min-width: 0`을 줍니다. 이게 없으면 말줄임이 안 되고 칸 밖으로 밀려 나갑니다.
- Do: 버튼 글자가 길어질 수 있으면 너비를 고정하지 말고 `padding`으로 크기를 잡습니다. 정말 칸이 고정이면 글자 수가 많을 때 `font-size`를 한 단계 낮춥니다(예: 재화 칸의 `.78em` 처리처럼).
- Do: 새 문구를 넣으면 가장 긴 경우로 확인합니다. 예: 큰 숫자(`1,234,567`), 긴 이름, `999+`.
- Do: UI를 고친 뒤에는 `node tools/ui-check.cjs`를 돌려 360px 화면에서 넘침이 없는지 확인합니다.
- Do: 버튼·탭·칩 안의 글자는 한 줄로 둡니다. 두 줄이 꼭 필요하면 `word-break: keep-all`을 줘서 단어 중간에서 끊기지 않게 합니다.
- Don't: 칸을 넘친 글자를 `overflow: visible`로 그냥 두지 않습니다.
- Don't: 넘침을 고치려고 글자를 `caption`(0.62em)보다 작게 줄이지 않습니다. 그럴 땐 문구를 줄이거나 칸 구조를 바꿉니다.

**색과 글꼴**

- Do: 색은 CSS 변수나 Colors 표의 값만 씁니다.
- Do: 글꼴은 `var(--f-display)`, `var(--f-body)`, `var(--f-num)`만 씁니다.
- Do: `<button>`, `<input>`, `<select>`는 글꼴을 부모에게서 물려받지 않습니다. 새로 만들면 `font-family`를 꼭 지정합니다. 빠뜨리면 기기 기본 글꼴(Arial 등)로 나옵니다.
- Do: 글자 크기는 `em`으로 적습니다. `px`로 적으면 화면이 커져도 글자만 그대로 작게 남습니다.
- Don't: 화면 하나를 고치면서 그 화면만의 새 색이나 새 글꼴을 들여오지 않습니다.
- Don't: 마린 키우기의 색, 아이콘, 장식을 그대로 가져오지 않습니다.

**입체감과 연출**

- Do: 누르는 것은 모두 눌림 효과(아래로 내려감 + 그림자 줄어듦)를 줍니다.
- Don't: 글로우 같은 빛 효과를 일반 버튼과 판에 깔지 않습니다. 보상과 결과 화면에서만 씁니다.
