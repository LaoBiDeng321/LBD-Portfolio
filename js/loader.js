/**
 * Boot Loader — 开屏三阶段
 * 阶段 1 充填 ~1900ms：左侧竖条 scaleY 0→1，同步底部细进度线与三位百分比
 *         模拟上限 99，必须等 window.load 后才放行到 100
 * 阶段 2 右滑 ~780ms：满值停顿 ~320ms 后遮罩 translateX(102%)
 * 阶段 3 渐显：到位后停顿 ~460ms 移除加载层，派发 loader:done
 * prefers-reduced-motion: reduce 时跳过模拟与扫场，直接快速淡出
 */
(function () {
    'use strict';

    var loader = document.getElementById('bootLoader');

    function finishBoot() {
        document.body.classList.remove('is-loading');
        document.dispatchEvent(new CustomEvent('loader:done'));
    }

    if (!loader) {
        finishBoot();
        return;
    }

    var fill = loader.querySelector('.loader-fill');
    var lineBar = loader.querySelector('.loader-line-bar');
    var percentNum = loader.querySelector('.loader-percent .num');
    var statusText = loader.querySelector('.loader-status-text');

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* reduced motion：跳过模拟与扫场，快速淡出（时长由 loader.css 定义） */
    if (reduced) {
        render(100);
        requestAnimationFrame(function () {
            loader.classList.add('slide-out');
            setTimeout(function () {
                loader.remove();
                finishBoot();
            }, 260);
        });
        return;
    }

    var DURATION = 1900;  // 充填主行程
    var HOLD = 320;       // 满值停顿
    var SETTLE = 460;     // 扫场到位后停顿
    var SLIDE = 780;      // 与 CSS transition 同步
    var CAP = 99;         // 模拟上限，等 window.load 放行

    var start = null;
    var pageLoaded = document.readyState === 'complete';

    window.addEventListener('load', function () {
        pageLoaded = true;
    });

    function render(p) {
        var clamped = Math.max(0, Math.min(100, p));
        if (fill) fill.style.transform = 'scaleY(' + (clamped / 100) + ')';
        if (lineBar) lineBar.style.width = clamped + '%';
        if (percentNum) {
            percentNum.textContent = String(Math.round(clamped)).padStart(3, '0');
        }
    }

    function setStatus(text) {
        if (statusText) statusText.textContent = text;
    }

    function tick(now) {
        if (start === null) start = now;
        var elapsed = now - start;

        // 主行程：前 88% 在 DURATION 内完成
        var base = Math.min(elapsed / DURATION, 1) * 88;
        // 尾段缓慢逼近 99
        var creep = Math.min(Math.max(elapsed - DURATION, 0) / 1000, 1) * (CAP - 88);
        var p = Math.min(CAP, base + creep);

        if (pageLoaded && p >= CAP - 0.5) p = 100;

        render(p);

        if (p >= 100) {
            setStatus('READY');
            // 满值停顿后右滑扫场
            setTimeout(function () {
                loader.classList.add('slide-out');
                // 扫场到位 + 停顿后移除加载层，派发完成事件
                setTimeout(function () {
                    loader.remove();
                    finishBoot();
                }, SLIDE + SETTLE);
            }, HOLD);
            return;
        }

        requestAnimationFrame(tick);
    }

    setStatus('LOADING RESOURCES');
    requestAnimationFrame(tick);
})();
