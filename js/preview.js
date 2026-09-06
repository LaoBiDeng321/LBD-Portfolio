/**
 * Work Preview — 2K 视口 iframe 缩放预览
 *
 * 尺寸规格：内嵌视口固定 2560x1600（2K 16:10），远端站点始终以桌面布局
 *           渲染，避免 iframe 小窗触发移动端媒体查询导致样式错乱；
 *           容器 aspect-ratio 16/10 自适应弹窗宽度，JS 计算缩放比压缩展示
 * 渲染策略：不设置 sandbox 与 referrerpolicy——跨域 iframe 天然与本站隔离，
 *           同时保证远端脚本/字体/防盗链资源完整加载，元素不缺失；
 *           pointer-events:none 仅静态展示，完整访问走「查看项目」按钮
 * 占位策略：实时预览不依赖本地快照垫底（源图已废弃），加载期显示
 *           工业风格占位层（工程网格 + 等宽注记 + 扫描线），
 *           远端拒绝嵌入或加载超时 8s 时占位层转入 SIGNAL.LOST 状态
 */
(function () {
    'use strict';

    var INNER_W = 2560;   // 2K 内嵌视口宽
    var INNER_H = 1600;   // 2K 内嵌视口高
    var LOAD_TIMEOUT = 8000;

    /** 按容器实际宽度压缩 2K 视口 */
    function fitFrame(stage, frame) {
        var scale = stage.clientWidth / INNER_W;
        frame.style.transform = 'scale(' + scale + ')';
    }

    /**
     * 工业风格馈线占位层：工程网格 + 等宽注记 + 扫描线
     * 替代废弃的本地快照垫底；卡片实时帧与弹窗预览共用
     * @param {string} status 等宽状态读数（如 SYNC.WAIT）
     * @returns {HTMLElement} .work-feed-ph，附 setLost() 转入信号中断态
     */
    function buildPlaceholder(status) {
        var ph = document.createElement('div');
        ph.className = 'work-feed-ph';
        ph.innerHTML =
            '<span class="ph-scan" aria-hidden="true"></span>' +
            '<svg class="ph-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
                '<circle cx="12" cy="12" r="9"/>' +
                '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>' +
                '<circle cx="12" cy="12" r="1.5"/>' +
            '</svg>' +
            '<span class="ph-tag">// LIVE.FEED</span>' +
            '<span class="ph-status"></span>';
        ph.querySelector('.ph-status').textContent = status;

        // 信号中断态：注记与图标转红，状态读数置 OFFLINE
        ph.setLost = function () {
            ph.classList.add('is-lost');
            ph.querySelector('.ph-tag').textContent = '// SIGNAL.LOST';
            ph.querySelector('.ph-status').textContent = 'OFFLINE';
        };
        return ph;
    }

    /** 占位层淡出后移除节点（与实时帧 400ms 淡入同步） */
    function dismissPlaceholder(ph) {
        if (!ph || !ph.parentNode) return;
        ph.classList.add('is-hidden');
        setTimeout(function () {
            if (ph.parentNode) ph.parentNode.removeChild(ph);
        }, 420);
    }

    /**
     * 构建预览区元素（供作品弹窗使用）
     * @param {object} work SITE.works 条目（preview / previewImg 二选一）
     * @returns {HTMLElement} .work-preview
     */
    function build(work) {
        var box = document.createElement('div');
        box.className = 'work-preview corner-marks';

        var liveSrc = work.preview;        // 可嵌入站点 → iframe 实时预览
        var repoImg = work.previewImg;     // GitHub 仓库 → 官方自动预览图

        // 顶部注记条：等宽标签 + 源地址 + 状态
        var bar = document.createElement('div');
        bar.className = 'work-preview-bar';
        var label = document.createElement('span');
        label.textContent = '// ' + window.I18N.t(
            liveSrc ? 'preview.live' : (repoImg ? 'preview.repo' : 'preview.fallback')
        );
        var url = document.createElement('span');
        url.className = 'preview-url';
        url.textContent = liveSrc || (repoImg ? repoImg.replace(/^https:\/\/opengraph\.githubassets\.com\/\d+\//, 'https://github.com/') : work.link || '');
        var state = document.createElement('span');
        state.className = 'preview-state';
        bar.appendChild(label);
        if (url.textContent) bar.appendChild(url);
        bar.appendChild(state);

        // 16:10 视窗：实时模式用工业占位层垫底，静态模式直接展示快照
        var stage = document.createElement('div');
        stage.className = 'work-preview-stage';

        var frame = null;
        var timer = null;
        var ph = null;

        if (liveSrc) {
            // iframe 实时预览：2K 视口 + 等比压缩，占位层不依赖本地快照
            ph = buildPlaceholder('SYNC.WAIT');
            stage.appendChild(ph);

            frame = document.createElement('iframe');
            frame.className = 'work-preview-frame';
            frame.src = liveSrc;
            frame.title = work.id;
            frame.tabIndex = -1;
            frame.setAttribute('aria-hidden', 'true');
            stage.appendChild(frame);

            var settled = false;

            // onload 后淡入覆盖占位层（短停顿等待首帧绘制）：
            // 远端页面比例不定，透明背景会透出占位层
            frame.addEventListener('load', function () {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                setTimeout(function () {
                    frame.classList.add('loaded');
                    dismissPlaceholder(ph);
                    state.textContent = '[LIVE 2K]';
                }, 200);
            });

            // 超时回退：远端拒绝嵌入或网络异常时占位层转入信号中断态
            timer = setTimeout(function () {
                if (!settled) {
                    settled = true;
                    frame.remove();
                    frame = null;
                    if (ph) ph.setLost();
                    state.textContent = '[SIGNAL.LOST]';
                    label.textContent = '// ' + window.I18N.t('preview.offline');
                }
            }, LOAD_TIMEOUT);

            // 缩放适配：随容器宽度变化重算
            var onResize = function () {
                if (frame) fitFrame(stage, frame);
            };
            if (window.ResizeObserver) {
                var ro = new ResizeObserver(onResize);
                ro.observe(stage);
            } else {
                window.addEventListener('resize', onResize);
            }
            fitFrame(stage, frame);
            state.textContent = '[SYNC]';
        } else if (repoImg) {
            // GitHub 仓库预览图模式：官方自动生成，随仓库更新
            var repoShot = document.createElement('img');
            repoShot.className = 'work-preview-snapshot repo-shot';
            repoShot.src = repoImg;
            repoShot.alt = '';
            repoShot.decoding = 'async';
            repoShot.draggable = false;
            // 生成图异常时转入信号中断占位层
            repoShot.addEventListener('error', function () {
                repoShot.remove();
                var lost = buildPlaceholder('SYNC.WAIT');
                lost.setLost();
                stage.appendChild(lost);
                state.textContent = '[SIGNAL.LOST]';
                label.textContent = '// ' + window.I18N.t('preview.offline');
            });
            repoShot.addEventListener('load', function () {
                state.textContent = '[GITHUB]';
            });
            stage.appendChild(repoShot);
            state.textContent = '[GITHUB]';
        } else {
            // 静态快照模式：无实时源与仓库图时直接展示本地截图
            if (work.image) {
                var snapshot = document.createElement('img');
                snapshot.className = 'work-preview-snapshot';
                snapshot.src = work.image;
                snapshot.alt = '';
                snapshot.decoding = 'async';
                snapshot.draggable = false;
                stage.appendChild(snapshot);
            }
            state.textContent = '[SNAPSHOT]';
        }

        box.appendChild(bar);
        box.appendChild(stage);

        // 卸载钩子：弹窗关闭时释放 iframe 资源
        box.destroy = function () {
            if (timer) clearTimeout(timer);
            if (frame) {
                frame.src = 'about:blank';
                frame.remove();
            }
        };

        return box;
    }

    window.Preview = { build: build, buildPlaceholder: buildPlaceholder, dismissPlaceholder: dismissPlaceholder };
})();
