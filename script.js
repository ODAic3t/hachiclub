// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQ機能
    initializeFAQ();
    
    // ヘッダーのスクロール効果
    initializeHeaderScroll();
    
    // スムーズスクロール
    initializeSmoothScroll();
    
    // アニメーション効果
    initializeAnimations();
    
    // 電話番号クリック追跡
    initializePhoneTracking();
    
    // モバイルナビゲーション（簡素化版）
    initializeMobileNavigation();
    
    // バーガーメニュー
    initializeBurgerMenu();
});

// FAQ機能の初期化（常に表示バージョン）
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        
        // 回答を常に表示
        answer.style.maxHeight = 'none';
        answer.style.overflow = 'visible';
        answer.style.transition = 'none';
    });
}

// ヘッダーのスクロール効果
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // スクロール位置に応じてヘッダーの背景を変更
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--background-light)';
            header.style.backdropFilter = 'none';
        }
        
        // スクロール方向に応じてヘッダーの表示/非表示
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // 下にスクロール - ヘッダーを隠す
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上にスクロール - ヘッダーを表示
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// スムーズスクロールの初期化
function initializeSmoothScroll() {
    // ページ内リンクがある場合のスムーズスクロール
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// スクロールアニメーションの初期化
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素の設定
    const animateElements = document.querySelectorAll(
        '.section-title, .philosophy-content, .inflammation-check, .lifestyle-check, .total-savings, .option-section, .supplement-content, .contact-content'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // CSSアニメーションクラスの追加
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-on-scroll.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// 電話番号クリック追跡
function initializePhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // アナリティクス追跡（Google Analyticsなどを使用する場合）
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'contact',
                    'event_label': 'phone_click'
                });
            }
            
            // コンソールログ（開発用）
            console.log('Phone link clicked:', this.href);
        });
    });
}

// モバイルナビゲーション（簡素化版）
function initializeMobileNavigation() {
    // 基本的なアクティブ状態の管理のみ
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    // サブメニューの初期化
    initializeSubmenus();
    
    // アクティブ状態の更新
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // アクティブ状態の更新
        mobileNavItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // スクロールイベントリスナー
    window.addEventListener('scroll', updateActiveNavItem);
    
    // 初期化時にアクティブ状態を設定
    updateActiveNavItem();
}

// サブメニューの初期化（簡素化版）
function initializeSubmenus() {
    // コースサブメニュー
    const courseMenu = document.querySelector('.mobile-nav-course');
    const courseSubmenu = document.querySelector('.mobile-nav-submenu');
    
    if (courseMenu && courseSubmenu) {
        courseMenu.addEventListener('click', function(e) {
            e.preventDefault();
            courseSubmenu.classList.toggle('show');
            
            // 他のサブメニューを閉じる
            const phoneSubmenu = document.querySelector('.mobile-nav-phone-submenu');
            if (phoneSubmenu) {
                phoneSubmenu.classList.remove('show');
            }
        });
        
        // サブメニューアイテムのクリック
        const subItems = courseSubmenu.querySelectorAll('.mobile-nav-subitem');
        subItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                courseSubmenu.classList.remove('show');
                
                // スムーズスクロール
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 電話サブメニュー
    const phoneMenu = document.querySelector('.mobile-nav-phone-menu');
    const phoneSubmenu = document.querySelector('.mobile-nav-phone-submenu');
    
    if (phoneMenu && phoneSubmenu) {
        phoneMenu.addEventListener('click', function(e) {
            e.preventDefault();
            phoneSubmenu.classList.toggle('show');
            
            // 他のサブメニューを閉じる
            if (courseSubmenu) {
                courseSubmenu.classList.remove('show');
            }
        });
        
        // 電話サブメニューアイテムのクリック
        const phoneSubItems = phoneSubmenu.querySelectorAll('.mobile-nav-subitem');
        console.log('Found phone sub items:', phoneSubItems.length);
        
        phoneSubItems.forEach((item, index) => {
            console.log(`Setting up phone item ${index}:`, item.href);
            
            item.addEventListener('click', function(e) {
                console.log('Phone item clicked:', this.href);
                
                // イベントの伝播を止める
                e.stopPropagation();
                
                // サブメニューを閉じる
                phoneSubmenu.classList.remove('show');
                
                // 確実に電話をかける
                const phoneNumber = this.href;
                console.log('Attempting to call:', phoneNumber);
                
                // 複数の方法で電話をかける
                try {
                    // 方法1: window.location.href
                    window.location.href = phoneNumber;
                    
                    // 方法2: window.open (フォールバック)
                    setTimeout(() => {
                        window.open(phoneNumber, '_self');
                    }, 200);
                    
                } catch (error) {
                    console.error('Error making phone call:', error);
                    // 方法3: 新しいタブで開く (最後の手段)
                    window.open(phoneNumber, '_blank');
                }
            });
        });
    }
    
    // 外側をクリックしたらサブメニューを閉じる
    document.addEventListener('click', function(e) {
        // 電話番号のリンクをクリックした場合は処理しない
        if (e.target.closest('.mobile-nav-phone-submenu a')) {
            return;
        }
        
        const isClickInsideSubmenu = e.target.closest('.mobile-nav-course') || 
                                   e.target.closest('.mobile-nav-phone-menu') ||
                                   e.target.closest('.mobile-nav-submenu') ||
                                   e.target.closest('.mobile-nav-phone-submenu');
        
        if (!isClickInsideSubmenu) {
            if (courseSubmenu) courseSubmenu.classList.remove('show');
            if (phoneSubmenu) phoneSubmenu.classList.remove('show');
        }
    });
}

// バーガーメニューの初期化
function initializeBurgerMenu() {
    const burgerButton = document.getElementById('burgerMenu');
    const burgerDropdown = document.getElementById('burgerDropdown');
    
    if (!burgerButton || !burgerDropdown) return;
    
    // バーガーメニューの開閉
    burgerButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        burgerButton.classList.toggle('active');
        burgerDropdown.classList.toggle('show');
        
        // 開いたときは他のサブメニューを閉じる
        if (burgerDropdown.classList.contains('show')) {
            const allSubmenus = burgerDropdown.querySelectorAll('.burger-submenu');
            allSubmenus.forEach(submenu => submenu.classList.remove('show'));
        }
    });
    
    // サブメニューの処理
    const courseMenu = burgerDropdown.querySelector('.burger-menu-course');
    
    if (courseMenu) {
        courseMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const submenu = this.querySelector('.burger-submenu');
            if (submenu) {
                submenu.classList.toggle('show');
                
                // 他のサブメニューを閉じる
                const otherSubmenus = burgerDropdown.querySelectorAll('.burger-submenu');
                otherSubmenus.forEach(menu => {
                    if (menu !== submenu) {
                        menu.classList.remove('show');
                    }
                });
            }
        });
        
        // コースサブメニューアイテムのクリック
        const courseSubItems = courseMenu.querySelectorAll('.burger-submenu-item');
        courseSubItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // メニューを閉じる
                burgerButton.classList.remove('active');
                burgerDropdown.classList.remove('show');
                
                // スムーズスクロール
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 通常のメニューアイテムのクリック
    const normalMenuItems = burgerDropdown.querySelectorAll('.burger-menu-item:not(.burger-menu-course)');
    normalMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // メニューを閉じる
            burgerButton.classList.remove('active');
            burgerDropdown.classList.remove('show');
            
            // スムーズスクロール
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 外側をクリックしたらメニューを閉じる
    document.addEventListener('click', function(e) {
        if (!burgerButton.contains(e.target) && !burgerDropdown.contains(e.target)) {
            burgerButton.classList.remove('active');
            burgerDropdown.classList.remove('show');
            
            // サブメニューも閉じる
            const allSubmenus = burgerDropdown.querySelectorAll('.burger-submenu');
            allSubmenus.forEach(submenu => submenu.classList.remove('show'));
        }
    });
}

// ページロード時の処理
window.addEventListener('load', function() {
    // 遅延画像読み込み
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Intersection Observerが使えない場合のフォールバック
        lazyImages.forEach(img => img.classList.add('loaded'));
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.warn('JavaScript error occurred:', e.error);
});

// 外部リンクに target="_blank" と rel="noopener" を自動追加
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}); 