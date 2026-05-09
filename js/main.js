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
    
    // 初始化小屏导航按钮
    initMobileNav();
    
    // 初始化鼠标视差效果
    initParallaxEffect();
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
    const workData = {
        1: {
            title: 'SimpleNAVY',
            category: '网页设计',
            year: '2026',
            description: '帮助朋友开发的游戏设计的宣传网页，展示游戏特色与玩法。',
            link: 'https://simplenavy.online/',
            linkText: '查看项目'
        },
        2: {
            title: 'OtherShore Game Studio',
            category: '网页设计',
            year: '2026',
            description: '朋友创建的游戏工作室官网，展示团队作品与信息。',
            link: 'https://simplenavy.online/othershoregamestudio/',
            linkText: '查看项目'
        },
        3: {
            title: 'SoloPlugin',
            category: '浏览器插件',
            year: '2026',
            description: '为防止 Web 开发时插件干扰而开发的浏览器扩展工具。',
            link: 'https://github.com/LaoBiDeng321/SoloPlugin',
            linkText: '查看源码'
        },
        4: {
            title: 'Firefly 主题博客',
            category: '博客主题',
            year: '2026',
            description: '流萤主题的个人博客，融合二次元美学与现代设计。',
            link: 'https://firefly-blog-lbd.netlify.app/',
            linkText: '查看博客'
        },
        5: {
            title: 'Some AI Projects',
            category: 'AI 工具集',
            year: '2025',
            description: '一些非系统化的 AI 工具集合，探索人工智能的实用场景。',
            link: 'https://laobideng321.github.io/LBD-Some_AI_projects/index.html',
            linkText: '在线预览'
        },
        6: {
            title: 'MC Java 模组',
            category: '游戏模组',
            year: '2026',
            description: '使用 AI 辅助开发的 Minecraft 1.20.1 Java 版模组。',
            link: null,
            linkText: '开发中'
        }
    };

    const work = workData[workId];
    if (!work) return;

    showWorkDetailModal(work);
}

/**
 * 显示作品详情确认弹窗
 */
function showWorkDetailModal(work) {
    const existingModal = document.querySelector('.work-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'work-detail-modal';
    modal.innerHTML = `
        <div class="work-detail-modal-overlay"></div>
        <div class="work-detail-modal-content">
            <button class="work-detail-modal-close" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="work-detail-modal-header">
                <span class="work-detail-category">${work.category}</span>
                <span class="work-detail-year">${work.year}</span>
            </div>
            <h3 class="work-detail-title">${work.title}</h3>
            <p class="work-detail-description">${work.description}</p>
            <div class="work-detail-actions">
                ${work.link ? `
                    <a href="${work.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        <span>${work.linkText}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                ` : `
                    <button class="btn btn-secondary" disabled>
                        <span>${work.linkText}</span>
                    </button>
                `}
                <button class="btn btn-secondary work-detail-modal-cancel">
                    <span>再看看</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.classList.add('visible');
    });

    const closeBtn = modal.querySelector('.work-detail-modal-close');
    const cancelBtn = modal.querySelector('.work-detail-modal-cancel');
    const overlay = modal.querySelector('.work-detail-modal-overlay');

    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            closeModal();
        }
    });
}

/**
 * 全屏滚动事件监听
 */
function initFullPageEvents() {
    let headerTimeout;
    
    // 章节变化事件
    document.addEventListener('fullpage:sectionChange', (e) => {
        const { currentIndex } = e.detail;
        
        // 显示导航栏
        showHeader();
        
        // 清除之前的定时器
        clearTimeout(headerTimeout);
        
        // 2 秒后隐藏导航栏
        headerTimeout = setTimeout(() => {
            hideHeader();
        }, 2000);
        
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
 * 初始化小屏导航按钮
 */
function initMobileNav() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 如果不是移动设备，不初始化
    if (!isMobileDevice()) return;
    
    // 添加移动设备标识
    document.body.classList.add('is-mobile');
    
    // 更新按钮状态
    function updateButtonState() {
        if (!window.fullpage) return;
        const currentIndex = window.fullpage.state.currentIndex;
        const totalSections = window.fullpage.totalSections;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSections - 1;
    }
    
    // 上一页
    prevBtn.addEventListener('click', () => {
        if (window.fullpage) {
            window.fullpage.scroll(-1);
        }
    });
    
    // 下一页
    nextBtn.addEventListener('click', () => {
        if (window.fullpage) {
            window.fullpage.scroll(1);
        }
    });
    
    // 监听页面变化更新按钮状态
    document.addEventListener('fullpage:sectionChange', updateButtonState);
    
    // 初始状态
    setTimeout(updateButtonState, 100);
}

/**
 * 显示导航栏
 */
function showHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    header.classList.add('visible');
}

/**
 * 隐藏导航栏
 */
function hideHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    header.classList.remove('visible');
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

// 页面加载时显示导航栏
window.addEventListener('load', () => {
    showHeader();
    setTimeout(() => {
        hideHeader();
    }, 2000);
});

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

/**
 * 检测是否为移动设备
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 检测是否为 PC 设备
 */
function isPCDevice() {
    return !isMobileDevice();
}

/**
 * 初始化鼠标视差效果（仅 PC 端）
 */
function initParallaxEffect() {
    // 仅在 PC 端启用视差效果
    if (!isPCDevice()) return;
    
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        // 为每个章节单独处理视差效果
        initSectionParallax(section);
    });
}

/**
 * 为单个章节初始化视差效果
 */
function initSectionParallax(section) {
    // 收集所有需要视差效果的元素
    const parallaxElements = [];
    
    // 标题类元素
    const titleLines = section.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        parallaxElements.push({ element: line, depth: 15 + index * 5 });
    });
    
    // 副标题
    const subtitle = section.querySelector('.hero-subtitle');
    if (subtitle) {
        parallaxElements.push({ element: subtitle, depth: 8 });
    }
    
    // 首页按钮
    const heroBtns = section.querySelectorAll('.hero-actions .btn');
    heroBtns.forEach((btn, index) => {
        parallaxElements.push({ element: btn, depth: 6 + index * 2, isCard: true });
        
        // 为按钮内的 SVG 添加视差效果（较小的深度）
        const btnSvg = btn.querySelector('svg');
        if (btnSvg) {
            parallaxElements.push({ element: btnSvg, depth: 4 + index, isCardChild: true });
        }
        
        // 为按钮内的文字添加视差效果
        const btnText = btn.querySelector('span');
        if (btnText) {
            parallaxElements.push({ element: btnText, depth: 5 + index });
        }
    });
    
    // 统计数字
    const statItems = section.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        parallaxElements.push({ element: item, depth: 5 + index * 2 });
    });
    
    // 章节标签和标题
    const sectionTag = section.querySelector('.section-tag');
    if (sectionTag) {
        parallaxElements.push({ element: sectionTag, depth: 10 });
    }
    
    const sectionTitle = section.querySelector('.section-title');
    if (sectionTitle) {
        parallaxElements.push({ element: sectionTitle, depth: 12 });
    }
    
    const sectionDesc = section.querySelector('.section-desc');
    if (sectionDesc) {
        parallaxElements.push({ element: sectionDesc, depth: 6 });
    }
    
    // 段落文本
    const paragraphs = section.querySelectorAll('.about-text p, .highlight-content p');
    paragraphs.forEach((p, index) => {
        parallaxElements.push({ element: p, depth: 4 + (index % 3) * 2 });
    });
    
    // 高亮标题
    const highlightTitles = section.querySelectorAll('.highlight-content h4');
    highlightTitles.forEach((h4, index) => {
        parallaxElements.push({ element: h4, depth: 7 + index * 2 });
    });
    
    // 技能组标题
    const skillGroupTitles = section.querySelectorAll('.skill-group h3');
    skillGroupTitles.forEach((h3, index) => {
        parallaxElements.push({ element: h3, depth: 8 + index * 2 });
    });
    
    // 技能标签容器
    const skillTagsContainers = section.querySelectorAll('.skill-tags');
    skillTagsContainers.forEach((container, index) => {
        parallaxElements.push({ element: container, depth: 6 + index });
    });
    
    // 技能标签（单独处理）
    const skillTags = section.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        parallaxElements.push({ element: tag, depth: 7 + (index % 6) * 2, isCard: true });
    });
    
    // 联系信息
    const contactLabels = section.querySelectorAll('.contact-label');
    contactLabels.forEach((label, index) => {
        parallaxElements.push({ element: label, depth: 4 + index * 2 });
    });
    
    const contactValues = section.querySelectorAll('.contact-value');
    contactValues.forEach((value, index) => {
        parallaxElements.push({ element: value, depth: 6 + index * 2 });
    });
    
    // 联系提示框
    const contactNotice = section.querySelector('.contact-notice');
    if (contactNotice) {
        parallaxElements.push({ element: contactNotice, depth: 5, isCard: true });
        const noticeText = contactNotice.querySelector('p');
        if (noticeText) {
            parallaxElements.push({ element: noticeText, depth: 4 });
        }
    }
    
    // 联系条目
    const contactItems = section.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        parallaxElements.push({ element: item, depth: 6 + index * 2, isCard: true });
        
        // 为图标添加视差效果
        const contactIcon = item.querySelector('.contact-icon');
        if (contactIcon) {
            parallaxElements.push({ element: contactIcon, depth: 10 + index * 2, isCardChild: true });
            
            // 为图标内的 SVG 添加视差效果
            const iconSvg = contactIcon.querySelector('svg');
            if (iconSvg) {
                parallaxElements.push({ element: iconSvg, depth: 12 + index * 2, isCardChild: true });
            }
        }
    });
    
    // 社交链接
    const socialLinks = section.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        parallaxElements.push({ element: link, depth: 8 + index * 2, isCard: true });
        
        // 为链接内的 SVG 添加视差效果
        const linkSvg = link.querySelector('svg');
        if (linkSvg) {
            parallaxElements.push({ element: linkSvg, depth: 10 + index * 2, isCardChild: true });
        }
    });
    
    // 表单元素
    const formGroups = section.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        parallaxElements.push({ element: group, depth: 5 + index * 2 });
        
        const label = group.querySelector('label');
        if (label) {
            parallaxElements.push({ element: label, depth: 4 + index * 2 });
        }
        
        const input = group.querySelector('input, textarea');
        if (input) {
            parallaxElements.push({ element: input, depth: 6 + index * 2 });
        }
    });
    
    // 表单按钮
    const formBtn = section.querySelector('.contact-form .btn');
    if (formBtn) {
        parallaxElements.push({ element: formBtn, depth: 8, isCard: true });
        const btnText = formBtn.querySelector('span');
        if (btnText) {
            parallaxElements.push({ element: btnText, depth: 7 });
        }
        const btnSvg = formBtn.querySelector('svg');
        if (btnSvg) {
            parallaxElements.push({ element: btnSvg, depth: 5, isCardChild: true });
        }
    }
    
    // 页脚文本
    const footerTexts = section.querySelectorAll('.section-footer p');
    footerTexts.forEach((p, index) => {
        parallaxElements.push({ element: p, depth: 3 + index });
    });
    
    // 作品卡片
    const workCards = section.querySelectorAll('.work-card');
    workCards.forEach((card, index) => {
        // 为卡片本身添加视差效果
        parallaxElements.push({ element: card, depth: 10 + index * 2, isCard: true });
        
        // 为卡片内的图片添加视差效果
        const workImage = card.querySelector('.work-img');
        if (workImage) {
            parallaxElements.push({ element: workImage, depth: 15 + index * 2, isCardChild: true });
        }
        
        // 为卡片内的分类标签添加视差效果
        const workCategory = card.querySelector('.work-category');
        if (workCategory) {
            parallaxElements.push({ element: workCategory, depth: 12 + index * 2 });
        }
        
        // 为卡片内的标题添加视差效果
        const workTitle = card.querySelector('.work-title');
        if (workTitle) {
            parallaxElements.push({ element: workTitle, depth: 11 + index * 2 });
        }
        
        // 为卡片内的描述添加视差效果
        const workDesc = card.querySelector('.work-desc');
        if (workDesc) {
            parallaxElements.push({ element: workDesc, depth: 9 + index * 2 });
        }
    });
    
    // 关于页面的高亮卡片
    const highlightItems = section.querySelectorAll('.highlight-item');
    highlightItems.forEach((item, index) => {
        // 为卡片本身添加视差效果
        parallaxElements.push({ element: item, depth: 8 + index * 2, isCard: true });
        
        // 为图标添加视差效果
        const highlightIcon = item.querySelector('.highlight-icon');
        if (highlightIcon) {
            parallaxElements.push({ element: highlightIcon, depth: 12 + index * 2, isCardChild: true });
        }
        
        // 为图标内的 SVG 添加视差效果
        const iconSvg = item.querySelector('.highlight-icon svg');
        if (iconSvg) {
            parallaxElements.push({ element: iconSvg, depth: 14 + index * 2, isCardChild: true });
        }
    });
    
    // 关于页面的个人资料卡片
    const profileCard = section.querySelector('.profile-card');
    if (profileCard) {
        parallaxElements.push({ element: profileCard, depth: 10, isCard: true });
        
        // 为头像添加视差效果
        const profileImage = profileCard.querySelector('.profile-avatar');
        if (profileImage) {
            parallaxElements.push({ element: profileImage, depth: 14, isCardChild: true });
        }
        
        // 为外环添加视差效果
        const profileRing = profileCard.querySelector('.profile-ring');
        if (profileRing) {
            parallaxElements.push({ element: profileRing, depth: 12, isCardChild: true });
        }
        
        // 为姓名添加视差效果
        const profileName = profileCard.querySelector('.profile-info h3');
        if (profileName) {
            parallaxElements.push({ element: profileName, depth: 11 });
        }
        
        // 为职位添加视差效果
        const profileRole = profileCard.querySelector('.profile-info p');
        if (profileRole) {
            parallaxElements.push({ element: profileRole, depth: 9 });
        }
    }
    
    if (parallaxElements.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // 监听鼠标移动
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算鼠标位置相对于中心的偏移（归一化到 -1 到 1）
        mouseX = (e.clientX - centerX) / (rect.width / 2);
        mouseY = (e.clientY - centerY) / (rect.height / 2);
    });
    
    // 离开时重置
    section.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });
    
    // 动画循环
    function animate() {
        // 平滑过渡
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        // 为每个元素应用视差效果
        parallaxElements.forEach(({ element, depth, isCard, isCardChild }) => {
            // 检查元素是否还在 DOM 中
            if (!document.contains(element)) return;
            
            if (isCard) {
                // 卡片本身的视差效果
                const x = currentX * depth;
                const y = currentY * depth * 0.8;
                element.classList.add('parallax-enabled');
                element.style.transform = `translate(${x}px, ${y}px)`;
            } else if (isCardChild) {
                // 卡片子元素的视差效果（相对于卡片）
                const x = currentX * depth;
                const y = currentY * depth * 0.8;
                element.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                // 普通文本元素的视差效果
                const x = currentX * depth;
                const y = currentY * depth * 0.8;
                element.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
