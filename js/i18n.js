/**
 * I18N Module
 * 文案与代码分离：所有用户可见文案收拢于此字典
 * 静态 DOM 通过 data-i18n 系列属性绑定，动态渲染通过 t() 取词
 */

(function () {
    'use strict';

    var DICT = {
        'zh-CN': {
            'html.lang': 'zh-CN',
            'nav.home': '首页',
            'nav.about': '关于',
            'nav.works': '作品',
            'nav.skills': '技能',
            'nav.contact': '联系',

            'hero.title.1': '用 AI 编织想象',
            'hero.title.2': '让创意触手可及',
            'hero.subtitle': '一名热衷于探索 AI 与创造边界的在校学生，致力于将脑海中的理想工具化为现实，融合设计之美与功能之实。',
            'hero.action.works': '浏览作品',
            'hero.action.contact': '联系我',
            'hero.stat.curiosity.label': '好奇心',
            'hero.stat.exp.label': 'AI 实验',
            'hero.stat.learn.label': '学习状态',
            'hero.stat.learn.value': '24/7',
            'hero.scroll': '向下滚动',

            'about.tag': '关于我',
            'about.title': '用设计讲述故事',
            'about.name': 'LaoBiDeng321',
            'about.role': '学生',
            'about.p1': '我是一名热衷于探索技术边界的学生，致力于运用人工智能的力量，将脑海中那些灵光一闪的理想工具转化为现实。',
            'about.p2': '在这个 AI 迅猛发展的时代，我深信技术的民主化正在重塑创造的可能性。我渴望成为这场变革的参与者与推动者，用代码编织想象，用设计赋予温度，让每一个从脑海中诞生的工具都能真正触达人心、解决实际问题。',
            'about.h1.title': 'AI 驱动',
            'about.h1.desc': '善用人工智能工具，将想象快速转化为原型',
            'about.h2.title': '持续进化',
            'about.h2.desc': '保持学习热情，在试错中快速成长迭代',

            'works.tag': '作品展示',
            'works.title': '实验与探索',
            'works.desc': '这里记录着我用 AI 辅助创作的实验项目，每一个想法都是一次学习的机会',
            'works.cat.web': '网页设计',
            'works.cat.extension': '浏览器插件',
            'works.cat.blog': '博客主题',
            'works.cat.pet': '桌面宠物',
            'works.cat.skill': '设计技能',
            'works.simplenavy.title': 'SimpleNAVY',
            'works.simplenavy.desc': '帮助朋友开发的游戏设计的宣传网页，展示游戏特色与玩法。',
            'works.othershore.title': 'OtherShore Game Studio',
            'works.othershore.desc': '朋友创建的游戏工作室官网，展示团队作品与信息。',
            'works.soloplugin.title': 'SoloPlugin',
            'works.soloplugin.desc': '为防止 Web 开发时插件干扰而开发的浏览器扩展工具。',
            'works.firefly.title': 'Firefly 主题博客',
            'works.firefly.desc': '流萤主题的个人博客，融合二次元美学与现代设计。',
            'works.desktoppet.title': 'ShShu 桌面宠物',
            'works.desktoppet.desc': '常驻桌面的电子宠物伴侣，用 JavaScript 编写的桌宠小应用。',
            'works.endfieldskill.title': 'Endfield 风格 Skill',
            'works.endfieldskill.desc': '将任意 Web 项目改造为终末地工业编辑风的设计技能。',
            'works.view': '查看项目',
            'works.viewCode': '查看源码',
            'works.viewBlog': '查看博客',

            'skills.tag': '技能探索',
            'skills.title': '我在学什么',
            'skills.group.ai': 'AI 工具',
            'skills.group.dev': '开发',

            'contact.tag': '联系方式',
            'contact.title': '一起交流',
            'contact.desc': '对 AI 创作感兴趣？或有想法想要探讨？欢迎随时找我聊天，一起学习成长。',
            'contact.notice': '表单功能暂未正式接入，请通过邮箱或社交链接联系我。',
            'contact.email.label': '邮箱',
            'contact.location.label': '地址',
            'contact.location.value': '中国 · 无锡',
            'contact.form.name': '姓名',
            'contact.form.name.ph': '请输入您的姓名',
            'contact.form.email': '邮箱',
            'contact.form.email.ph': '请输入您的邮箱',
            'contact.form.subject': '主题',
            'contact.form.subject.ph': '请输入邮件主题',
            'contact.form.message': '留言',
            'contact.form.message.ph': '请输入您的留言内容...',
            'contact.form.send': '发送消息',
            'contact.form.sending': '发送中',
            'contact.form.fail': '发送失败',
            'contact.toast.fail': '表单功能暂未接入，请通过邮箱联系我',

            'modal.close': '关闭',
            'modal.stay': '再看看',

            'footer.license': 'MIT License © 2026 LaoBiDeng321.',
            'footer.slogan': '用 AI 探索创造的无限可能',

            'preview.live': '实时预览',
            'preview.repo': '仓库预览',
            'preview.fallback': '静态快照',
            'preview.offline': '信号中断'
        },

        'en-US': {
            'html.lang': 'en-US',
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.works': 'Works',
            'nav.skills': 'Skills',
            'nav.contact': 'Contact',

            'hero.title.1': 'Weaving Imagination with AI',
            'hero.title.2': 'Making Ideas Tangible',
            'hero.subtitle': 'A student passionate about exploring the boundary of AI and creation, turning ideal tools from mind into reality, blending design and function.',
            'hero.action.works': 'Browse Works',
            'hero.action.contact': 'Contact Me',
            'hero.stat.curiosity.label': 'Curiosity',
            'hero.stat.exp.label': 'AI Experiments',
            'hero.stat.learn.label': 'Learning',
            'hero.stat.learn.value': '24/7',
            'hero.scroll': 'Scroll Down',

            'about.tag': 'About Me',
            'about.title': 'Telling Stories by Design',
            'about.name': 'LaoBiDeng321',
            'about.role': 'Student',
            'about.p1': 'I am a student keen on exploring the edge of technology, using the power of AI to turn fleeting ideas into real tools.',
            'about.p2': 'In this era of rapid AI development, I believe the democratization of technology is reshaping what can be created. I aspire to be a participant and promoter of this change — weaving imagination with code, giving warmth through design, so every tool born in mind can truly reach people and solve real problems.',
            'about.h1.title': 'AI Driven',
            'about.h1.desc': 'Leveraging AI tools to turn imagination into prototypes fast',
            'about.h2.title': 'Evolving',
            'about.h2.desc': 'Keeping the passion to learn, iterating fast through trial and error',

            'works.tag': 'Works',
            'works.title': 'Experiments & Exploration',
            'works.desc': 'A record of AI-assisted experimental projects — every idea is a chance to learn',
            'works.cat.web': 'Web Design',
            'works.cat.extension': 'Browser Extension',
            'works.cat.blog': 'Blog Theme',
            'works.cat.pet': 'Desktop Pet',
            'works.cat.skill': 'Design Skill',
            'works.simplenavy.title': 'SimpleNAVY',
            'works.simplenavy.desc': 'A promo site for a friend\'s game, showcasing features and gameplay.',
            'works.othershore.title': 'OtherShore Game Studio',
            'works.othershore.desc': 'Official site of a friend\'s game studio, presenting the team and its works.',
            'works.soloplugin.title': 'SoloPlugin',
            'works.soloplugin.desc': 'A browser extension built to prevent plugin interference during web development.',
            'works.firefly.title': 'Firefly Blog Theme',
            'works.firefly.desc': 'A personal blog theme blending anime aesthetics with modern design.',
            'works.desktoppet.title': 'ShShu Desktop Pet',
            'works.desktoppet.desc': 'A little pet companion living on your desktop, built with JavaScript.',
            'works.endfieldskill.title': 'Endfield Style Skill',
            'works.endfieldskill.desc': 'A design skill that transforms any web project into the Endfield industrial-editorial style.',
            'works.view': 'View Project',
            'works.viewCode': 'View Source',
            'works.viewBlog': 'View Blog',

            'skills.tag': 'Skills',
            'skills.title': 'What I\'m Learning',
            'skills.group.ai': 'AI Tools',
            'skills.group.dev': 'Development',

            'contact.tag': 'Contact',
            'contact.title': 'Let\'s Talk',
            'contact.desc': 'Interested in AI creation? Got ideas to discuss? Feel free to reach out anytime — let\'s learn and grow together.',
            'contact.notice': 'The form is not yet connected. Please reach me via email or social links.',
            'contact.email.label': 'Email',
            'contact.location.label': 'Location',
            'contact.location.value': 'Wuxi, China',
            'contact.form.name': 'Name',
            'contact.form.name.ph': 'Your name',
            'contact.form.email': 'Email',
            'contact.form.email.ph': 'Your email',
            'contact.form.subject': 'Subject',
            'contact.form.subject.ph': 'Message subject',
            'contact.form.message': 'Message',
            'contact.form.message.ph': 'Write your message...',
            'contact.form.send': 'Send Message',
            'contact.form.sending': 'Sending',
            'contact.form.fail': 'Failed',
            'contact.toast.fail': 'Form is not connected yet. Please contact me via email.',

            'modal.close': 'Close',
            'modal.stay': 'Keep Looking',

            'footer.license': 'MIT License © 2026 LaoBiDeng321.',
            'footer.slogan': 'Exploring the infinite possibilities of AI',

            'preview.live': 'Live Preview',
            'preview.repo': 'Repo Preview',
            'preview.fallback': 'Static Snapshot',
            'preview.offline': 'Signal Lost'
        }
    };

    var STORAGE_KEY = 'lang';
    var DEFAULT_LANG = 'zh-CN';

    function detectLang() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && DICT[saved]) return saved;
        } catch (e) { /* 存储不可用时忽略 */ }
        return DEFAULT_LANG;
    }

    window.I18N = {
        lang: detectLang(),

        /** 取词条：字典为字面键（'a.b.c'），直接命中即返回 */
        t: function (path) {
            var dict = DICT[this.lang] || DICT[DEFAULT_LANG];
            var node = dict[path];
            if (typeof node === 'string') return node;
            // 回退到默认语言
            node = DICT[DEFAULT_LANG][path];
            return typeof node === 'string' ? node : path;
        },

        /** 扫描并应用静态 DOM 绑定 */
        apply: function (root) {
            var scope = root || document;
            var nodes = scope.querySelectorAll('[data-i18n]');
            nodes.forEach(function (el) {
                el.textContent = window.I18N.t(el.getAttribute('data-i18n'));
            });
            // placeholder 属性绑定
            var phNodes = scope.querySelectorAll('[data-i18n-ph]');
            phNodes.forEach(function (el) {
                el.setAttribute('placeholder', window.I18N.t(el.getAttribute('data-i18n-ph')));
            });
            // aria-label 属性绑定
            var ariaNodes = scope.querySelectorAll('[data-i18n-aria]');
            ariaNodes.forEach(function (el) {
                el.setAttribute('aria-label', window.I18N.t(el.getAttribute('data-i18n-aria')));
            });
            document.documentElement.lang = this.t('html.lang');
        },

        /** 切换语言：持久化 + 重刷静态文案 + 派发事件（动态渲染区自行监听重绘） */
        set: function (lang) {
            if (!DICT[lang] || lang === this.lang) return;
            this.lang = lang;
            try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* 忽略 */ }
            this.apply();
            this.syncToggle();
            document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
        },

        /** 同步顶栏 CN|EN 按钮态 */
        syncToggle: function () {
            document.querySelectorAll('.lang-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.lang === window.I18N.lang);
                btn.setAttribute('aria-pressed', String(btn.dataset.lang === window.I18N.lang));
            });
        },

        init: function () {
            this.apply();
            this.syncToggle();
            document.querySelectorAll('.lang-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    window.I18N.set(btn.dataset.lang);
                });
            });
        }
    };
})();
