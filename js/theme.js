/**
 * Theme Manager
 * 主题切换与管理
 */

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    /**
     * 初始化主题
     */
    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * 获取存储的主题
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    /**
     * 获取系统主题
     */
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * 应用主题
     */
    applyTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // 更新 meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fafafa');
        }

        // 触发主题变化事件
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    /**
     * 切换主题
     */
    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.storeTheme(newTheme);
    }

    /**
     * 设置主题
     */
    set(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.storeTheme(theme);
        }
    }

    /**
     * 存储主题
     */
    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // 忽略存储错误
        }
    }

    /**
     * 获取当前主题
     */
    get() {
        return this.theme;
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
