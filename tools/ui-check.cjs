#!/usr/bin/env node
/*
 * UI 검사: 글자 넘침·버튼 안 줄바꿈·잘림, 허용 안 된 글꼴, 너무 작은 글자, 팔레트 밖 글자색을 찾습니다.
 *
 *   node tools/ui-check.cjs            # 360x640 한 화면 크기로 로비 + 하단 탭 + 사이드 버튼 검사
 *   node tools/ui-check.cjs --all      # 360x640, 390x844, 430x932, 673x841(폴드 펼침) 네 크기
 *   node tools/ui-check.cjs --file w/v130.html   # index.html 대신 다른 파일 검사
 *   node tools/ui-check.cjs --colors   # 팔레트 밖 글자색 목록도 자세히 출력
 *
 * 스크린샷은 tools/ui-check-out/ 에 저장됩니다 (git에 올리지 않음).
 * 넘침·줄바꿈·잘림·글꼴·작은 글자 문제가 하나라도 있으면 종료 코드 1.
 * 팔레트 밖 색은 예전 코드에 많이 남아 있어서 경고로만 셉니다.
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('playwright가 없습니다. `npm i -D playwright` 후 다시 실행하세요.');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'ui-check-out');
const args = process.argv.slice(2);
const VIEWPORTS = args.includes('--all')
  ? [[360, 640], [390, 844], [430, 932], [673, 841]]
  : [[360, 640]];
const FILE = args.includes('--file') ? path.resolve(args[args.indexOf('--file') + 1]) : path.join(ROOT, 'index.html');
const SHOW_COLORS = args.includes('--colors');

// DESIGN.md 의 colors: 블록에서 팔레트를 읽어 옵니다.
function readPalette() {
  const md = fs.readFileSync(path.join(ROOT, 'DESIGN.md'), 'utf8');
  const fm = md.split(/^---\s*$/m)[1] || '';
  const block = (fm.match(/^colors:\n((?:[ \t]+.*\n|\s*\n)+)/m) || [])[1] || '';
  const hex = [...block.matchAll(/"(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toLowerCase());
  return [...new Set([...hex, '#ffffff', '#000000'])];
}
const PALETTE = readPalette();
const FONTS = ['black han sans', 'gothic a1', 'chakra petch'];

// 검사할 화면: 로비, 하단 탭 5개, 로비 좌우 버튼, 출격(교리) 화면, 전투 중 팝업.
// js 가 있는 화면은 게임의 개발용 훅(window.__kx)으로 엽니다. 훅이 없는 빌드(출시판)에서는 건너뜁니다.
// 각 화면은 새로 불러온 뒤 한 번만 눌러서 서로 영향이 없게 합니다.
// Playwright 의 마우스 클릭은 숨은 스크롤 영역(#stage)을 밀어서 가짜 문제를 만들므로,
// 화면 안에서 element.click() 으로 누릅니다.
const SCREENS = [
  { name: 'lobby' },
  ...[0, 1, 2, 3, 4].map((i) => ({ name: `tab${i + 1}`, sel: '.kt', i })),
  ...['btnDex', 'btnRecs', 'btnMission', 'btnHero', 'btnPass', 'btnDaily', 'btnSet'].map((id) => ({
    name: id,
    sel: `#${id}`,
    i: 0,
  })),
  { name: 'sortie', sel: '#btnStart', i: 0 },
  { name: 'pause', js: '__kx.start(); __kx.pause()' },
  { name: 'win', js: '__kx.start(); __kx.zoneClear()', wait: 3500 },
  { name: 'lose', js: '__kx.start(); __kx.baseDown()', wait: 3500 },
];

// 브라우저 안에서 실행되는 검사 함수
function inspect({ palette, fonts }) {
  const BOX = 'button,[role=button],.kb,.kcur,.krb,.kt,.karr,.kchip,.kchips i,.badge';
  // 설명 글이 들어가는 큰 카드형 버튼(교리 카드 등)은 여러 줄을 허용하되, 단어 중간에서 끊기면 안 됩니다.
  const CARD = '.perk,.kcard,.pthN';
  // 게임은 #frame 의 글자 크기 하나로 화면 크기를 맞춥니다 (360x640 기준 13.5px).
  const frame = document.getElementById('frame') || document.body;
  const base = parseFloat(getComputedStyle(frame).fontSize) || 13.5;
  const minPx = base * 0.62 - 0.05;
  const vw = innerWidth;

  const toHex = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean);
    if (parseFloat(a) === 0) return null;
    return '#' + [r, g, b].map((v) => Math.round(+v).toString(16).padStart(2, '0')).join('');
  };
  const near = (hex) => {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [r, g, b] = p(hex);
    return palette.some((q) => {
      const [x, y, z] = p(q);
      return Math.abs(r - x) + Math.abs(g - y) + Math.abs(b - z) <= 12;
    });
  };
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  const textRect = (el) => {
    const rects = [];
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const rg = document.createRange();
        rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) if (r.width > 0) rects.push(r);
      }
    }
    if (!rects.length) return null;
    const tops = [];
    for (const r of rects) if (!tops.some((t) => Math.abs(t - r.top) < r.height / 2)) tops.push(r.top);
    return {
      lines: tops.length,
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
      top: Math.min(...rects.map((r) => r.top)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
    };
  };
  // 팝업 뒤에 가려진 글자는 사용자에게 안 보이므로 검사하지 않습니다.
  const covered = (el, r) => {
    const x = Math.min(Math.max((r.left + r.right) / 2, 1), vw - 1);
    const y = Math.min(Math.max((r.top + r.bottom) / 2, 1), innerHeight - 1);
    const top = document.elementFromPoint(x, y);
    return !!top && !(el.contains(top) || top.contains(el));
  };
  // el 과 box 사이에 글자를 잘라 내는 조상이 있는지
  const clippedBetween = (el, box) => {
    for (let p = el; p && p !== box.parentElement; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.clipPath !== 'none') return true;
    }
    return false;
  };

  const issues = { spill: [], wrap: [], cut: [], offscreen: [], font: [], tiny: [] };
  const colors = {};
  const seen = new Set();

  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT', 'STYLE', 'CANVAS', 'svg', 'SVG'].includes(el.tagName)) continue;
    const tr = textRect(el);
    if (!tr || !visible(el) || covered(el, tr)) continue;
    const s = getComputedStyle(el);
    const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24);
    const key = label(el) + '|' + text;
    if (seen.has(key)) continue;
    seen.add(key);
    const who = `${label(el)} "${text}"`;

    // 1) 버튼·칩 밖으로 글자가 튀어나감
    const box = el.closest(BOX);
    if (box && visible(box)) {
      const b = box.getBoundingClientRect();
      const out = Math.max(b.left - tr.left, tr.right - b.right, b.top - tr.top - 2, tr.bottom - b.bottom - 2);
      if (out > 1.5 && !clippedBetween(el, box)) {
        issues.spill.push(`${who} 가 ${label(box)} 밖으로 ${out.toFixed(1)}px 나감`);
      }
      // 버튼·칩 안 글자가 여러 줄로 꺾임 (아이콘을 밀어내거나 단어 중간에서 끊김)
      if (tr.lines > 1) {
        if (!box.matches(CARD)) issues.wrap.push(`${who} 가 ${label(box)} 안에서 ${tr.lines}줄로 꺾임`);
        else if (s.wordBreak !== 'keep-all') issues.wrap.push(`${who} 가 ${label(box)} 안에서 단어 중간에 끊길 수 있음 (word-break: keep-all 필요)`);
      }
    }
    // 2) 말줄임 없이 잘림
    if (s.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1 && s.textOverflow !== 'ellipsis') {
      issues.cut.push(`${who} 가 말줄임 없이 잘림 (${el.scrollWidth}>${el.clientWidth})`);
    }
    // 3) 화면 옆으로 나감 (가로로 스크롤되는 목록 안은 제외)
    let hscroll = false;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (/(auto|scroll)/.test(ps.overflowX)) { hscroll = true; break; }
    }
    if (!hscroll && (tr.right > vw + 1 || tr.left < -1)) {
      issues.offscreen.push(`${who} 가 화면 밖으로 나감`);
    }
    // 4) 글꼴
    const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
    if (!fonts.includes(fam)) issues.font.push(`${who} 글꼴 "${fam}"`);
    // 5) 너무 작은 글자
    if (parseFloat(s.fontSize) < minPx) {
      issues.tiny.push(`${who} ${parseFloat(s.fontSize).toFixed(1)}px (최소 ${minPx.toFixed(1)}px)`);
    }
    // 6) 팔레트 밖 글자색
    const hex = toHex(s.color);
    if (hex && !near(hex)) (colors[hex] = colors[hex] || []).push(who);
  }
  return { issues, colors, base };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const url = 'file://' + FILE;
  const totals = { spill: 0, wrap: 0, cut: 0, offscreen: 0, font: 0, tiny: 0 };
  const allColors = {};
  const errors = [];

  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`[${w}x${h}] ${e.message}`));
    for (const sc of SCREENS) {
      await page.goto(url);
      // 로딩 화면(#loadScr)이 완전히 사라질 때까지 기다립니다.
      await page.waitForSelector('#btnStart', { state: 'visible', timeout: 20000 }).catch(() => {});
      await page.waitForSelector('#loadScr', { state: 'detached', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(300);
      if (sc.sel) {
        const ok = await page.evaluate(({ sel, i }) => {
          const el = document.querySelectorAll(sel)[i];
          if (!el || !el.getClientRects().length) return false;
          el.click();
          return true;
        }, sc);
        if (!ok) {
          console.log(`- [${w}x${h}] ${sc.name}: 버튼을 찾지 못해 건너뜀`);
          continue;
        }
        await page.waitForTimeout(1200);
      }
      if (sc.js) {
        const ok = await page.evaluate((js) => {
          if (!window.__kx) return false;
          const t = document.getElementById('ovTitle');
          if (t) t.hidden = true;
          try { new Function(js)(); return true; } catch (e) { return String(e); }
        }, sc.js);
        if (ok !== true) {
          console.log(`- [${w}x${h}] ${sc.name}: 열지 못해 건너뜀 (${ok || '개발용 훅 없음'})`);
          continue;
        }
        await page.waitForTimeout(sc.wait || 1200);
      }
      const shot = path.join(OUT, `${w}x${h}-${sc.name}.png`);
      await page.screenshot({ path: shot });
      const { issues, colors } = await page.evaluate(inspect, { palette: PALETTE, fonts: FONTS });
      const n = Object.values(issues).reduce((a, v) => a + v.length, 0);
      console.log(`${n ? '✗' : '✓'} [${w}x${h}] ${sc.name}${n ? ` — 문제 ${n}개` : ''}`);
      const names = { spill: '넘침', wrap: '줄바꿈', cut: '잘림', offscreen: '화면 밖', font: '글꼴', tiny: '작은 글자' };
      for (const k of Object.keys(issues)) {
        totals[k] += issues[k].length;
        for (const m of issues[k]) console.log(`    [${names[k]}] ${m}`);
      }
      for (const [hex, list] of Object.entries(colors)) {
        allColors[hex] = (allColors[hex] || new Set());
        list.forEach((x) => allColors[hex].add(x));
      }
    }
    await ctx.close();
  }
  await browser.close();

  const offColors = Object.keys(allColors);
  console.log('\n요약');
  console.log(`  넘침 ${totals.spill} · 줄바꿈 ${totals.wrap} · 잘림 ${totals.cut} · 화면 밖 ${totals.offscreen} · 글꼴 ${totals.font} · 작은 글자 ${totals.tiny}`);
  console.log(`  팔레트 밖 글자색 ${offColors.length}종 (경고)${SHOW_COLORS ? '' : ' — 자세히 보려면 --colors'}`);
  if (SHOW_COLORS) {
    for (const hex of offColors) console.log(`    ${hex}: ${[...allColors[hex]].slice(0, 4).join(', ')}`);
  }
  if (errors.length) console.log(`  페이지 오류 ${errors.length}개:\n    ` + errors.slice(0, 5).join('\n    '));
  console.log(`  스크린샷: ${path.relative(ROOT, OUT)}/`);
  const fail = totals.spill + totals.wrap + totals.cut + totals.offscreen + totals.font + totals.tiny;
  process.exit(fail ? 1 : 0);
})();
