/**
 * Main Application
 * 主要交互逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化头部滚动效果
    initHeaderScroll();
    
    // 初始化技能条动画
    initSkillBars();
    
    // 初始化表单处理
    initContactForm();
    
    // 初始化作品卡片交互
    initWorkCards();
    
    // 监听全屏滚动事件
    initFullPageEvents();
});

/**
 * 头部滚动效果
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * 技能条动画
 */
function initSkillBars() {
    const skillSection = document.querySelector('.section-skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.style.getPropertyValue('--progress');
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillSection);
}

/**
 * 联系表单处理
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // 模拟提交 - 暂未接入，总是显示失败
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>发送中...</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                    <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;

        setTimeout(() => {
            // 显示发送失败提示
            submitBtn.innerHTML = `
                <span>发送失败</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            `;
            submitBtn.style.background = '#ef4444';

            // 显示提示信息
            showToast('表单功能暂未接入，请通过邮箱联系我');

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 2500);
        }, 1500);

        console.log('Form submitted (not connected):', data);
    });
}

/**
 * 显示提示信息
 */
function showToast(message) {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px; flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 14px 24px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transition: all 300ms ease;
        display: flex;
        align-items: center;
        box-shadow: var(--glass-shadow);
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * 作品卡片交互
 */
function initWorkCards() {
    const cards = document.querySelectorAll('.work-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const workId = card.dataset.work;
            showWorkDetail(workId);
        });
    });
}

/**
 * 显示作品详情
 */
function showWorkDetail(workId) {
    // 作品详情通过链接直接跳转，无需弹窗
    console.log('Work detail:', workId);
}

/**
 * 全屏滚动事件监听
 */
function initFullPageEvents() {
    // 章节变化事件
    document.addEventListener('fullpage:sectionChange', (e) => {
        const { currentIndex, prevIndex, direction } = e.detail;
        console.log(`Section changed from ${prevIndex} to ${currentIndex} (${direction})`);
        
        // 更新头部样式
        updateHeaderStyle(currentIndex);
    });

    // 滚动结束事件
    document.addEventListener('fullpage:scrollEnd', (e) => {
        const { currentIndex } = e.detail;
        
        // 触发章节内动画
        triggerSectionAnimations(currentIndex);
    });
}

/**
 * 更新头部样式
 */
function updateHeaderStyle(sectionIndex) {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    // 根据章节调整头部样式
    if (sectionIndex === 0) {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
    } else {
        header.style.background = '';
        header.style.backdropFilter = '';
    }
}

/**
 * 触发章节内动画
 */
function triggerSectionAnimations(sectionIndex) {
    const section = document.querySelector(`.section[data-section="${sectionIndex}"]`);
    if (!section) return;
    
    // 添加动画类
    const animatedElements = section.querySelectorAll('.skill-progress, .work-card, .highlight-item');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = 'fadeInUp 0.6s ease forwards';
        }, index * 50);
    });
}

/**
 * 平滑滚动到指定元素
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 导出工具函数
window.utils = {
    scrollToElement,
    throttle,
    debounce,
    showWorkDetail
};
