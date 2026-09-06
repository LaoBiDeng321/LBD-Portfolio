/**
 * Main Application — Endfield Edition
 * 渲染（配置+i18n 驱动）/ 弹窗（强制选择）/ Toast（堆叠）/ 视差（精简）
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================
       动态渲染
       ============================================ */

    /** 卡片内 2K 实时帧等比压缩（内嵌视口 2560x1600） */
    function fitCardFrame(box, frame) {
        frame.style.transform = 'scale(' + (box.clientWidth / 2560) + ')';
    }

    /** 作品卡片：数据来自 SITE.works，文案来自 i18n 字典 */
    function renderWorks() {
        var grid = document.getElementById('worksGrid');
        if (!grid) return;

        grid.innerHTML = '';
        window.SITE.works.forEach(function (work, i) {
            var card = document.createElement('article');
            card.className = 'work-card corner-marks';
            card.dataset.workIndex = String(i);
            if (work.color) card.dataset.color = work.color;

            var index = String(i + 1).padStart(2, '0');
            var category = window.I18N.t('works.cat.' + categoryKey(work.id));
            var title = window.I18N.t('works.' + work.id + '.title');
            var desc = window.I18N.t('works.' + work.id + '.desc');

            var info =
                '<div class="work-info">' +
                    '<div class="work-meta">' +
                        '<span class="work-category">' + category + '</span>' +
                        '<span class="work-year">' + work.year + '</span>' +
                    '</div>' +
                    '<h3 class="work-title">' + title + '</h3>' +
                    '<p class="work-desc">' + desc + '</p>' +
                '</div>';

            var indexSpan = '<span class="work-index">' + index + '</span>';

            if (work.preview) {
                // 实时渲染：工业占位层垫底（不依赖本地快照），2K 帧加载完成后淡出
                var box = document.createElement('div');
                box.className = 'work-image';
                box.innerHTML = indexSpan;

                var ph = window.Preview.buildPlaceholder('SYNC.WAIT');
                box.appendChild(ph);

                var frame = document.createElement('iframe');
                frame.className = 'work-frame';
                frame.src = work.preview;
                frame.title = work.id;
                frame.loading = 'lazy';
                frame.tabIndex = -1;
                frame.setAttribute('aria-hidden', 'true');
                frame.addEventListener('load', function () {
                    setTimeout(function () {
                        frame.classList.add('loaded');
                        // 移除占位层：远端页面比例不定，透明背景会透出占位层
                        window.Preview.dismissPlaceholder(ph);
                    }, 350);
                });
                box.appendChild(frame);

                if (window.ResizeObserver) {
                    var ro = new ResizeObserver(function () {
                        fitCardFrame(box, frame);
                    });
                    ro.observe(box);
                }
                fitCardFrame(box, frame);

                card.appendChild(box);
                card.insertAdjacentHTML('beforeend', info);
            } else {
                var src = work.previewImg || work.image;
                card.innerHTML =
                    '<div class="work-image">' +
                        indexSpan +
                        '<img src="' + src + '" alt="' + title + '" class="work-img' + (work.previewImg ? ' work-img-repo' : '') + '" loading="lazy" decoding="async">' +
                    '</div>' +
                    info;
            }
            grid.appendChild(card);
        });
    }

    /** 作品分类的 i18n 键映射 */
    function categoryKey(id) {
        var map = {
            simplenavy: 'web',
            othershore: 'web',
            soloplugin: 'extension',
            firefly: 'blog',
            aiprojects: 'ai',
            endfieldskill: 'skill'
        };
        return map[id] || 'web';
    }

    /** 联系条目 + 社交链接（同源渲染到常规/横屏两组容器） */
    function renderContactBlocks() {
        var email = window.SITE.contact.email;
        var emailSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
        var locationSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

        var contactHTML =
            '<div class="contact-item">' +
                '<div class="contact-icon">' + emailSvg + '</div>' +
                '<div class="contact-detail">' +
                    '<span class="contact-label">' + window.I18N.t('contact.email.label') + '</span>' +
                    '<span class="contact-value">' + email + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="contact-item">' +
                '<div class="contact-icon">' + locationSvg + '</div>' +
                '<div class="contact-detail">' +
                    '<span class="contact-label">' + window.I18N.t('contact.location.label') + '</span>' +
                    '<span class="contact-value">' + window.I18N.t('contact.location.value') + '</span>' +
                '</div>' +
            '</div>';

        var socialHTML = window.SITE.socials.map(function (s) {
            return '<a href="' + s.url + '" class="social-link" aria-label="' + s.label + '" target="_blank" rel="noopener noreferrer">' +
                window.SITE.icons[s.id] + '</a>';
        }).join('');

        document.querySelectorAll('[data-render="contact-links"]').forEach(function (box) {
            box.innerHTML = contactHTML;
        });
        document.querySelectorAll('[data-render="social-links"]').forEach(function (box) {
            box.innerHTML = socialHTML;
        });
    }

    /** 右缘刻度指示器：短横线 + 等宽序号 */
    function renderIndicator(total) {
        var box = document.getElementById('indicatorDots');
        if (!box) return;
        box.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = String(i).padStart(2, '0');
            dot.setAttribute('aria-label', String(i + 1));
            (function (idx) {
                dot.addEventListener('click', function () {
                    if (window.fullpage) window.fullpage.goToSection(idx);
                });
            })(i);
            box.appendChild(dot);
        }
    }

    /* ============================================
       Toast — 堆叠显示，新提示不覆盖旧提示
       ============================================ */

    function showToast(message) {
        var stack = document.getElementById('toastStack');
        if (!stack) return;

        var toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                '<circle cx="12" cy="12" r="10"/>' +
                '<line x1="12" y1="16" x2="12" y2="12"/>' +
                '<line x1="12" y1="8" x2="12.01" y2="8"/>' +
            '</svg><span></span>';
        toast.querySelector('span').textContent = message;
        stack.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(function () { toast.remove(); }, 300);
        }, 4000);
    }

    /* ============================================
       作品详情弹窗 — 强制选择
       禁止点击遮罩/Escape 关闭；同级按钮等权重描边
       ============================================ */

    function showWorkDetail(workIndex) {
        var work = window.SITE.works[workIndex];
        if (!work) return;

        // 旧弹窗先销毁（含 iframe 释放）
        var existing = document.querySelector('.work-detail-modal');
        if (existing) {
            if (existing._destroy) existing._destroy();
            existing.remove();
        }

        var modal = document.createElement('div');
        modal.className = 'work-detail-modal';

        var previewEl = window.Preview.build(work);

        var linkBtnHTML;
        if (work.link) {
            var linkText = window.I18N.t(work.linkKey);
            linkBtnHTML =
                '<a href="' + work.link + '" class="btn btn-primary" target="_blank" rel="noopener noreferrer">' +
                    '<span>' + linkText + '</span>' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                        '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
                        '<polyline points="15 3 21 3 21 9"/>' +
                        '<line x1="10" y1="14" x2="21" y2="3"/>' +
                    '</svg>' +
                '</a>';
        } else {
            linkBtnHTML = '<button class="btn btn-primary" disabled><span>' + window.I18N.t(work.linkKey) + '</span></button>';
        }

        modal.innerHTML =
            '<div class="work-detail-modal-overlay"></div>' +
            '<div class="work-detail-modal-content">' +
                '<button class="work-detail-modal-close" aria-label="' + window.I18N.t('modal.close') + '">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                        '<line x1="18" y1="6" x2="6" y2="18"/>' +
                        '<line x1="6" y1="6" x2="18" y2="18"/>' +
                    '</svg>' +
                '</button>' +
                '<div class="work-detail-modal-header">' +
                    '<span class="work-detail-category">' + window.I18N.t('works.cat.' + categoryKey(work.id)) + '</span>' +
                    '<span class="work-detail-year">' + work.year + '</span>' +
                '</div>' +
                '<h3 class="work-detail-title">' + window.I18N.t('works.' + work.id + '.title') + '</h3>' +
                '<p class="work-detail-description">' + window.I18N.t('works.' + work.id + '.desc') + '</p>' +
            '</div>';

        // 预览区插入在描述之后、动作区之前；弹窗随作品信号色
        var content = modal.querySelector('.work-detail-modal-content');
        if (work.color) content.dataset.color = work.color;
        content.appendChild(previewEl);

        var actions = document.createElement('div');
        actions.className = 'work-detail-actions';
        actions.innerHTML = linkBtnHTML +
            '<button class="btn btn-secondary work-detail-modal-cancel"><span>' + window.I18N.t('modal.stay') + '</span></button>';
        content.appendChild(actions);

        document.body.appendChild(modal);

        // 关闭：销毁 iframe 释放资源
        var closeBtn = modal.querySelector('.work-detail-modal-close');
        var cancelBtn = modal.querySelector('.work-detail-modal-cancel');

        var closeModal = function () {
            if (modal._destroy) modal._destroy();
            modal.classList.remove('visible');
            setTimeout(function () { modal.remove(); }, 300);
        };

        modal._destroy = function () { previewEl.destroy(); };

        // 强制选择：仅绑定明确控件（关闭按钮/再看看），遮罩与 Escape 均不响应
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        requestAnimationFrame(function () {
            modal.classList.add('visible');
        });
    }

    /* ============================================
       头部与全屏联动
       ============================================ */

    var headerTimeout;

    function initHeaderEvents() {
        var header = document.querySelector('.main-header');
        if (!header) return;

        document.addEventListener('fullpage:sectionChange', function (e) {
            var currentIndex = e.detail.currentIndex;
            header.classList.add('visible');
            clearTimeout(headerTimeout);
            headerTimeout = setTimeout(function () {
                header.classList.remove('visible');
            }, 2000);
            // 首屏透明顶栏，其余显示玻璃底
            header.classList.toggle('transparent', currentIndex === 0);
        });

        document.addEventListener('fullpage:scrollEnd', function (e) {
            triggerSectionAnimations(e.detail.currentIndex);
        });

        // 页面加载时先展示顶栏再收起
        header.classList.add('visible');
        setTimeout(function () {
            header.classList.remove('visible');
        }, 2000);
    }

    function triggerSectionAnimations(sectionIndex) {
        var section = document.querySelector('.section[data-section="' + sectionIndex + '"]');
        if (!section) return;
        var animatedElements = section.querySelectorAll('.work-card, .highlight-item');
        animatedElements.forEach(function (el, index) {
            setTimeout(function () {
                el.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 50);
        });
    }

    /* ============================================
       小屏导航按钮
       ============================================ */

    function initMobileNav() {
        var prevBtn = document.getElementById('prevBtn');
        var nextBtn = document.getElementById('nextBtn');
        if (!prevBtn || !nextBtn) return;
        if (!isMobileDevice()) return;

        document.body.classList.add('is-mobile');

        function updateButtonState() {
            if (!window.fullpage) return;
            var currentIndex = window.fullpage.state.currentIndex;
            var totalSections = window.fullpage.totalSections;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSections - 1;
        }

        prevBtn.addEventListener('click', function () {
            if (window.fullpage) window.fullpage.scroll(-1);
        });
        nextBtn.addEventListener('click', function () {
            if (window.fullpage) window.fullpage.scroll(1);
        });

        document.addEventListener('fullpage:sectionChange', updateButtonState);
        setTimeout(updateButtonState, 100);
    }

    /* ============================================
       联系表单（未接入，明确反馈）
       ============================================ */

    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn = form.querySelector('button[type="submit"]');
            var labelSpan = submitBtn.querySelector('span');

            submitBtn.disabled = true;
            labelSpan.textContent = window.I18N.t('contact.form.sending');

            setTimeout(function () {
                labelSpan.textContent = window.I18N.t('contact.form.fail');
                showToast(window.I18N.t('contact.toast.fail'));

                setTimeout(function () {
                    submitBtn.disabled = false;
                    labelSpan.textContent = window.I18N.t('contact.form.send');
                }, 2500);
            }, 1200);
        });
    }

    /* ============================================
       视差（精简版）：仅 hero 内容区整体微移
       reduced-motion / 移动端 / 页面隐藏 时停用
       ============================================ */

    function initParallax() {
        if (reducedMotion || !isPCDevice()) return;

        var section = document.querySelector('.section-hero');
        var target = section ? section.querySelector('.section-content') : null;
        if (!target) return;

        var mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

        section.addEventListener('mousemove', function (e) {
            var rect = section.getBoundingClientRect();
            mouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            mouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        });

        section.addEventListener('mouseleave', function () {
            mouseX = 0;
            mouseY = 0;
        });

        function animate() {
            if (!document.hidden) {
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;
                target.style.transform = 'translate(' + (currentX * 8).toFixed(2) + 'px,' + (currentY * 6).toFixed(2) + 'px)';
            }
            requestAnimationFrame(animate);
        }

        animate();
    }

    /* ============================================
       工具
       ============================================ */

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function isPCDevice() {
        return !isMobileDevice();
    }

    /** 开屏后首屏逐个渐显（每项约 110ms） */
    function initRevealOnBoot() {
        var reveals = document.querySelectorAll('.section-hero .reveal');
        document.addEventListener('loader:done', function () {
            reveals.forEach(function (el, i) {
                setTimeout(function () {
                    el.classList.add('revealed');
                }, i * 110);
            });
            // 顶栏淡入
            var header = document.querySelector('.main-header');
            if (header) header.classList.add('visible');
        });
    }

    /* ============================================
       初始化
       ============================================ */

    function init() {
        window.I18N.init();
        renderWorks();
        renderContactBlocks();

        var fullpage = window.fullpage;
        if (fullpage) renderIndicator(fullpage.totalSections);

        initHeaderEvents();
        initContactForm();
        initMobileNav();
        initParallax();
        initRevealOnBoot();

        // 作品卡片点击：事件委托
        var grid = document.getElementById('worksGrid');
        if (grid) {
            grid.addEventListener('click', function (e) {
                var card = e.target.closest('.work-card');
                if (card) showWorkDetail(parseInt(card.dataset.workIndex, 10));
            });
        }

        // 语言切换：重渲染动态区
        document.addEventListener('i18n:change', function () {
            renderWorks();
            renderContactBlocks();
        });

        // 暴露调试接口
        window.utils = { showToast: showToast, showWorkDetail: showWorkDetail };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
