/**
 * Fullpage Scroll System
 * 工业级全屏滚动解决方案
 * 支持鼠标滚轮、触摸滑动、键盘导航
 * 支持特定区域内滚动
 */

class FullPageScroll {
    constructor(options = {}) {
        // 默认配置
        this.config = {
            container: '.fullpage-container',
            sectionSelector: '.section',
            activeClass: 'active',
            prevClass: 'prev',
            nextClass: 'next',
            transitionDuration: 400,
            scrollThreshold: 50,
            touchThreshold: 50,
            keyboardNavigation: true,
            loop: false,
            // 支持内部滚动的区域选择器
            scrollableSections: ['.section-works'],
            ...options
        };

        // 状态管理
        this.state = {
            currentIndex: 0,
            isScrolling: false,
            isTouching: false,
            touchStartY: 0,
            touchEndY: 0,
            wheelDelta: 0,
            lastScrollTime: 0
        };

        // DOM 元素
        this.container = document.querySelector(this.config.container);
        this.sections = document.querySelectorAll(this.config.sectionSelector);
        this.totalSections = this.sections.length;

        // 初始化
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        if (!this.container || this.totalSections === 0) {
            console.warn('FullPageScroll: No container or sections found');
            return;
        }

        this.bindEvents();
        
        // 从 localStorage 读取保存的页面位置
        const savedIndex = this.loadSavedSection();
        this.goToSection(savedIndex, false);
        this.updateIndicator();
        
        // 触发初始化完成事件
        this.emit('init', { currentIndex: savedIndex });
    }

    /**
     * 保存当前页面位置到 localStorage
     */
    saveSection(index) {
        try {
            localStorage.setItem('fullpage_current_section', index.toString());
        } catch (e) {
            console.warn('FullPageScroll: Failed to save section to localStorage', e);
        }
    }

    /**
     * 从 localStorage 读取保存的页面位置
     */
    loadSavedSection() {
        try {
            const saved = localStorage.getItem('fullpage_current_section');
            if (saved !== null) {
                const index = parseInt(saved, 10);
                if (!isNaN(index) && index >= 0 && index < this.totalSections) {
                    return index;
                }
            }
        } catch (e) {
            console.warn('FullPageScroll: Failed to load section from localStorage', e);
        }
        return 0;
    }

    /**
     * 检查元素是否在可滚动区域内
     */
    isInScrollableArea(element) {
        const currentSection = this.sections[this.state.currentIndex];
        if (!currentSection) return false;

        for (const selector of this.config.scrollableSections) {
            if (currentSection.matches(selector)) {
                const scrollableContent = currentSection.querySelector('.section-content');
                if (scrollableContent) {
                    return scrollableContent.contains(element) || element === scrollableContent;
                }
            }
        }
        return false;
    }

    /**
     * 检查可滚动区域是否可以继续滚动
     */
    canScrollInArea(direction) {
        const currentSection = this.sections[this.state.currentIndex];
        if (!currentSection) return false;

        for (const selector of this.config.scrollableSections) {
            if (currentSection.matches(selector)) {
                const scrollableContent = currentSection.querySelector('.section-content');
                if (scrollableContent) {
                    const scrollTop = scrollableContent.scrollTop;
                    const scrollHeight = scrollableContent.scrollHeight;
                    const clientHeight = scrollableContent.clientHeight;
                    
                    if (direction > 0) {
                        // 向下滚动：检查是否到达底部
                        return scrollTop + clientHeight < scrollHeight - 5;
                    } else {
                        // 向上滚动：检查是否到达顶部
                        return scrollTop > 5;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 鼠标滚轮事件
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

        // 触摸事件
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

        // 键盘事件
        if (this.config.keyboardNavigation) {
            document.addEventListener('keydown', this.handleKeyboard.bind(this));
        }

        // 导航点击事件 - 只绑定按钮元素，排除 section 元素
        document.querySelectorAll('button[data-section], a[data-section], .nav-link[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.section);
                if (!isNaN(index)) {
                    this.goToSection(index);
                }
            });
        });

        // 指示器点击事件
        document.querySelectorAll('.indicator-dots .dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSection(index));
        });

        // 窗口大小改变
        window.addEventListener('resize', this.debounce(() => {
            this.emit('resize');
        }, 250));

        // 为可滚动区域绑定滚动事件
        this.config.scrollableSections.forEach(selector => {
            document.querySelectorAll(selector).forEach(section => {
                const content = section.querySelector('.section-content');
                if (content) {
                    content.style.overflowY = 'auto';
                    content.style.maxHeight = 'calc(100vh - var(--space-16))';
                }
            });
        });
    }

    /**
     * 处理鼠标滚轮
     */
    handleWheel(e) {
        const now = Date.now();
        const timeDiff = now - this.state.lastScrollTime;

        // 检查是否在可滚动区域内
        if (this.isInScrollableArea(e.target)) {
            // 如果可以继续在该区域内滚动，则不阻止默认行为
            if (this.canScrollInArea(Math.sign(e.deltaY))) {
                return;
            }
        }

        e.preventDefault();

        // 滚动锁定，防止快速连续滚动
        if (this.state.isScrolling || timeDiff < this.config.transitionDuration + 100) {
            return;
        }

        this.state.wheelDelta += e.deltaY;

        // 达到阈值才触发滚动
        if (Math.abs(this.state.wheelDelta) >= this.config.scrollThreshold) {
            const direction = this.state.wheelDelta > 0 ? 1 : -1;
            this.scroll(direction);
            this.state.wheelDelta = 0;
            this.state.lastScrollTime = now;
        }

        // 重置 wheelDelta
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
            this.state.wheelDelta = 0;
        }, 150);
    }

    /**
     * 处理触摸开始
     */
    handleTouchStart(e) {
        this.state.isTouching = true;
        this.state.touchStartY = e.touches[0].clientY;
    }

    /**
     * 处理触摸移动
     */
    handleTouchMove(e) {
        if (!this.state.isTouching) return;
        this.state.touchEndY = e.touches[0].clientY;
    }

    /**
     * 处理触摸结束
     */
    handleTouchEnd(e) {
        if (!this.state.isTouching) return;
        
        this.state.isTouching = false;

        if (this.state.isScrolling) return;

        // 检查触摸点是否在可滚动区域内
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && this.isInScrollableArea(element)) {
            const diff = this.state.touchStartY - this.state.touchEndY;
            if (this.canScrollInArea(Math.sign(diff))) {
                return;
            }
        }

        const diff = this.state.touchStartY - this.state.touchEndY;

        if (Math.abs(diff) >= this.config.touchThreshold) {
            const direction = diff > 0 ? 1 : -1;
            this.scroll(direction);
        }
    }

    /**
     * 处理键盘事件
     */
    handleKeyboard(e) {
        if (this.state.isScrolling) return;

        const currentSection = this.sections[this.state.currentIndex];
        let isInScrollable = false;
        
        for (const selector of this.config.scrollableSections) {
            if (currentSection && currentSection.matches(selector)) {
                isInScrollable = true;
                break;
            }
        }

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (isInScrollable && this.canScrollInArea(1)) {
                    const content = currentSection.querySelector('.section-content');
                    if (content) {
                        content.scrollBy({ top: 100, behavior: 'smooth' });
                    }
                } else {
                    this.scroll(1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (isInScrollable && this.canScrollInArea(-1)) {
                    const content = currentSection.querySelector('.section-content');
                    if (content) {
                        content.scrollBy({ top: -100, behavior: 'smooth' });
                    }
                } else {
                    this.scroll(-1);
                }
                break;
            case ' ':
                e.preventDefault();
                this.scroll(1);
                break;
            case 'Home':
                e.preventDefault();
                this.goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSection(this.totalSections - 1);
                break;
        }
    }

    /**
     * 滚动到指定方向
     */
    scroll(direction) {
        const newIndex = this.state.currentIndex + direction;

        // 边界检查
        if (newIndex < 0 || newIndex >= this.totalSections) {
            if (this.config.loop) {
                const loopIndex = newIndex < 0 ? this.totalSections - 1 : 0;
                this.goToSection(loopIndex);
            }
            return;
        }

        this.goToSection(newIndex);
    }

    /**
     * 跳转到指定章节
     */
    goToSection(index, animate = true) {
        if (index < 0 || index >= this.totalSections) return;
        if (index === this.state.currentIndex && animate) return;

        this.state.isScrolling = true;
        const prevIndex = this.state.currentIndex;
        this.state.currentIndex = index;

        // 更新章节状态
        this.sections.forEach((section, i) => {
            section.classList.remove(this.config.activeClass, this.config.prevClass, this.config.nextClass);
            
            if (i === index) {
                section.classList.add(this.config.activeClass);
            } else if (i < index) {
                section.classList.add(this.config.prevClass);
            } else {
                section.classList.add(this.config.nextClass);
            }
        });

        // 重置可滚动区域的滚动位置（当从其他页面切换回来时）
        this.config.scrollableSections.forEach(selector => {
            const section = this.sections[index];
            if (section && section.matches(selector)) {
                const content = section.querySelector('.section-content');
                if (content && prevIndex !== index) {
                    content.scrollTop = 0;
                }
            }
        });

        // 更新导航状态
        this.updateNavigation();
        this.updateIndicator();

        // 保存当前页面位置
        this.saveSection(index);

        // 触发事件
        this.emit('sectionChange', {
            currentIndex: index,
            prevIndex: prevIndex,
            direction: index > prevIndex ? 'down' : 'up'
        });

        // 滚动完成
        setTimeout(() => {
            this.state.isScrolling = false;
            this.emit('scrollEnd', { currentIndex: index });
        }, animate ? this.config.transitionDuration : 0);
    }

    /**
     * 更新导航状态
     */
    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            link.classList.toggle('active', index === this.state.currentIndex);
        });
    }

    /**
     * 更新进度指示器
     */
    updateIndicator() {
        // 更新进度条
        const progress = (this.state.currentIndex / (this.totalSections - 1)) * 100;
        const progressBar = document.querySelector('.indicator-progress');
        if (progressBar) {
            progressBar.style.height = `${progress}%`;
        }

        // 更新圆点
        document.querySelectorAll('.indicator-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentIndex);
        });
    }

    /**
     * 获取当前索引
     */
    getCurrentIndex() {
        return this.state.currentIndex;
    }

    /**
     * 获取总章节数
     */
    getTotalSections() {
        return this.totalSections;
    }

    /**
     * 检查是否正在滚动
     */
    isScrolling() {
        return this.state.isScrolling;
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.container.removeEventListener('wheel', this.handleWheel);
        this.container.removeEventListener('touchstart', this.handleTouchStart);
        this.container.removeEventListener('touchmove', this.handleTouchMove);
        this.container.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('keydown', this.handleKeyboard);
    }

    /**
     * 事件发射器
     */
    emit(eventName, data) {
        const event = new CustomEvent(`fullpage:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.fullpage = new FullPageScroll({
        transitionDuration: 400,
        scrollThreshold: 50,
        touchThreshold: 50,
        keyboardNavigation: true,
        loop: false,
        scrollableSections: ['.section-works']
    });
});
