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
    
    // モバイルナビゲーション
    initializeMobileNavigation();
    
    // 医院選択追跡
    initializeClinicTracking();
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
        
        .option-card.animate-on-scroll {
            transform: translateY(50px);
        }
        
        .option-card.animate-on-scroll.animate {
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
                    'event_label': 'header_phone'
                });
            }
            
            // コンソールログ（開発用）
            console.log('Phone link clicked:', this.href);
        });
    });
}

// モバイルナビゲーション機能
function initializeMobileNavigation() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item:not(.mobile-nav-phone):not(.mobile-nav-course)');
    const sections = document.querySelectorAll('section[id]');
    
    // コースサブメニューの初期化
    initializeCourseSubmenu();
    
    // 電話サブメニューの初期化
    initializePhoneSubmenu();
    
    // アクティブな状態の管理
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
        
        // コースサブメニューのアクティブ状態
        const courseSubmenu = document.querySelector('.mobile-nav-course');
        const courseSubItems = document.querySelectorAll('.mobile-nav-subitem');
        courseSubItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active');
                courseSubmenu.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // コースメニュー全体のアクティブ状態
        if (currentSection === 'basic-course' || currentSection === 'option-course') {
            courseSubmenu.classList.add('active');
        } else {
            courseSubmenu.classList.remove('active');
        }
    }
    
    // スクロールイベントリスナー
    window.addEventListener('scroll', updateActiveNavItem);
    
    // 初期化時にアクティブ状態を設定
    updateActiveNavItem();
    
    // モバイルナビゲーションの電話番号クリック追跡
    const mobilePhoneButtons = document.querySelectorAll('.mobile-nav-phone-submenu a');
    mobilePhoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'contact',
                    'event_label': 'mobile_nav_phone'
                });
            }
            console.log('Mobile nav phone clicked:', this.href);
        });
    });
    
    // アクティブ状態のスタイルをCSSに追加
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav-item.active {
            color: var(--primary-color);
            background: var(--background-section);
        }
        
        .mobile-nav-item.active i {
            color: var(--primary-color);
            transform: scale(1.1);
        }
        
        .mobile-nav-course.active {
            color: #f4de24;
            background: rgba(244, 222, 36, 0.1);
        }
        
        .mobile-nav-course.active i {
            color: #f4de24;
            transform: scale(1.1);
        }
        
        .mobile-nav-subitem.active {
            background: rgba(244, 222, 36, 0.2);
            color: #f4de24;
            font-weight: 600;
        }
        
        .mobile-nav-phone-menu.active {
            color: white;
            background: linear-gradient(135deg, #f4de24, #e6c61a);
            transform: translateY(-2px);
        }
        
        .mobile-nav-phone-menu.active i {
            color: white;
            transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
            .mobile-nav-item.active {
                background: rgba(244, 222, 36, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
}

// コースサブメニューの初期化
function initializeCourseSubmenu() {
    const courseMenu = document.querySelector('.mobile-nav-course');
    const submenu = document.querySelector('.mobile-nav-submenu');
    
    if (!courseMenu || !submenu) return;
    
    // コースメニューのクリックイベント
    courseMenu.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // サブメニューの表示/非表示を切り替え
        submenu.classList.toggle('show');
        
        // 他のサブメニューが開いている場合は閉じる
        const otherSubmenus = document.querySelectorAll('.mobile-nav-submenu:not(.show)');
        otherSubmenus.forEach(menu => {
            if (menu !== submenu) {
                menu.classList.remove('show');
            }
        });
    });
    
    // サブメニューアイテムのクリックイベント
    const subItems = document.querySelectorAll('.mobile-nav-subitem');
    subItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // タップ後のホバー状態を解除
            this.blur();
            
            // サブメニューを閉じる
            submenu.classList.remove('show');
            
            // モバイルデバイスでのホバー状態を完全にリセット
            if (window.innerWidth <= 768) {
                console.log('Resetting hover states for mobile...');
                const allSubItems = document.querySelectorAll('.mobile-nav-subitem');
                allSubItems.forEach(subItem => {
                    // 既存のスタイルを強制的にリセット
                    subItem.style.background = '';
                    subItem.style.color = '';
                    subItem.style.transform = '';
                    subItem.style.transition = 'none';
                    subItem.style.pointerEvents = 'none';
                    
                    // 全てのクラスを削除
                    subItem.classList.remove('mobile-hover', 'mobile-tapped', 'hover-disabled');
                    
                    // 一時的にホバー無効化クラスを追加
                    subItem.classList.add('hover-disabled');
                    
                    // 疑似クラスのホバー状態をリセット
                    subItem.blur();
                });
                
                // 一時的に無効化後、再度有効化
                setTimeout(() => {
                    allSubItems.forEach(subItem => {
                        subItem.style.pointerEvents = 'auto';
                        subItem.style.transition = 'all 0.3s ease';
                        subItem.classList.remove('hover-disabled');
                    });
                }, 400);
            }
            
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
        
        // タッチイベントでのホバー状態制御
        item.addEventListener('touchstart', function(e) {
            if (window.innerWidth <= 768) {
                // タップ時の視覚的フィードバック
                this.classList.add('mobile-tapped');
                this.classList.add('hover-disabled');
            }
        });
        
        item.addEventListener('touchend', function(e) {
            if (window.innerWidth <= 768) {
                // タップ後の状態をリセット
                setTimeout(() => {
                    this.classList.remove('mobile-tapped');
                    this.classList.remove('hover-disabled');
                }, 150);
            }
        });
        
        // マウスリーブイベントでホバー状態をリセット（追加の安全策）
        item.addEventListener('mouseleave', function(e) {
            if (window.innerWidth <= 768) {
                this.classList.remove('mobile-tapped');
                this.classList.add('hover-disabled');
                setTimeout(() => {
                    this.classList.remove('hover-disabled');
                }, 100);
            }
        });
    });
    
    // サブメニュー外をクリックしたら閉じる
    document.addEventListener('click', function(e) {
        if (!courseMenu.contains(e.target)) {
            submenu.classList.remove('show');
            
            // サブメニューが閉じられた時にホバー状態をリセット
            if (window.innerWidth <= 768) {
                const allSubItems = document.querySelectorAll('.mobile-nav-subitem');
                allSubItems.forEach(subItem => {
                    subItem.style.background = '';
                    subItem.style.color = '';
                    subItem.style.transform = '';
                    subItem.blur();
                    subItem.classList.remove('mobile-hover', 'mobile-tapped');
                });
            }
        }
    });
    
    // 追加の強制リセット機能
    function forceResetHoverStates() {
        if (window.innerWidth <= 768) {
            const allSubItems = document.querySelectorAll('.mobile-nav-subitem');
            allSubItems.forEach(subItem => {
                // 全てのスタイルをリセット
                subItem.style.cssText = '';
                subItem.blur();
                subItem.classList.remove('mobile-hover', 'mobile-tapped', 'hover-disabled');
                
                // 一時的にホバー無効化
                subItem.classList.add('hover-disabled');
                
                // 短時間後にクラスを削除
                setTimeout(() => {
                    subItem.classList.remove('hover-disabled');
                }, 200);
            });
        }
    }
    
    // ウィンドウの向きが変わった時や、サイズが変わった時にリセット
    window.addEventListener('resize', forceResetHoverStates);
    window.addEventListener('orientationchange', forceResetHoverStates);
}

// 電話サブメニューの初期化
function initializePhoneSubmenu() {
    const phoneMenu = document.querySelector('.mobile-nav-phone-menu');
    const submenu = document.querySelector('.mobile-nav-phone-submenu');
    
    if (!phoneMenu || !submenu) return;
    
    // 電話メニューのクリックイベント
    phoneMenu.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // サブメニューの表示/非表示を切り替え
        submenu.classList.toggle('show');
        
        // 他のサブメニューが開いている場合は閉じる
        const otherSubmenus = document.querySelectorAll('.mobile-nav-submenu');
        otherSubmenus.forEach(menu => {
            if (menu !== submenu) {
                menu.classList.remove('show');
            }
        });
    });
    
    // サブメニューアイテムのクリックイベント
    const subItems = document.querySelectorAll('.mobile-nav-phone-submenu a');
    subItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // サブメニューを閉じる
            submenu.classList.remove('show');
            
            // 電話をかける（デフォルトの動作）
            // 別途追跡イベントは既に設定済み
        });
    });
    
    // サブメニュー外をクリックしたら閉じる
    document.addEventListener('click', function(e) {
        if (!phoneMenu.contains(e.target)) {
            submenu.classList.remove('show');
        }
    });
}

// 医院選択追跡機能
function initializeClinicTracking() {
    // 医院のホームページリンク追跡
    const clinicWebsiteLinks = document.querySelectorAll('a[href*="hachishika.com"]');
    clinicWebsiteLinks.forEach(link => {
        link.addEventListener('click', function() {
            const clinicName = this.href.includes('sakuranamiki') ? '桜並木はち歯科医院' : 'はち歯科医院';
            
            // Google Analytics追跡
            if (typeof gtag !== 'undefined') {
                gtag('event', 'clinic_website_click', {
                    'event_category': 'clinic_selection',
                    'event_label': clinicName,
                    'value': 1
                });
            }
            
            // コンソールログ（開発用）
            console.log('Clinic website clicked:', clinicName, this.href);
        });
    });
    
    // 医院の電話番号追跡（医院別）
    const clinicPhoneLinks = document.querySelectorAll('a[href^="tel:"]');
    clinicPhoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.href.replace('tel:', '');
            let clinicName = '';
            let eventLabel = '';
            
            if (phoneNumber.includes('092-504-2323')) {
                clinicName = 'はち歯科医院';
                eventLabel = 'hachi_main';
            } else if (phoneNumber.includes('092-404-2098')) {
                clinicName = '桜並木はち歯科医院';
                eventLabel = 'hachi_sakuranamiki';
            } else {
                clinicName = '一般';
                eventLabel = 'general';
            }
            
            // Google Analytics追跡
            if (typeof gtag !== 'undefined') {
                gtag('event', 'clinic_phone_click', {
                    'event_category': 'clinic_contact',
                    'event_label': eventLabel,
                    'clinic_name': clinicName,
                    'phone_number': phoneNumber
                });
            }
            
            // コンソールログ（開発用）
            console.log('Clinic phone clicked:', clinicName, phoneNumber);
        });
    });
    
    // QRコードからのアクセス検出
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const clinic = urlParams.get('clinic');
    
    if (source === 'qr') {
        // QRコードアクセスの追跡
        if (typeof gtag !== 'undefined') {
            gtag('event', 'qr_code_access', {
                'event_category': 'traffic_source',
                'event_label': clinic || 'unknown',
                'value': 1
            });
        }
        
        console.log('QR Code access detected:', clinic || 'unknown clinic');
        
        // QRコードアクセス時に該当医院セクションにスクロール
        if (clinic) {
            setTimeout(() => {
                const clinicSection = document.getElementById('clinic-selection');
                if (clinicSection) {
                    clinicSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    }
}

// ページロード時のパフォーマンス最適化
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

// リサイズ時の処理
window.addEventListener('resize', function() {
    // FAQ常に表示のため、高さ調整は不要
    // 必要に応じて他のリサイズ処理をここに追加
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.warn('JavaScript error occurred:', e.error);
});

// タッチデバイス対応
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // タッチデバイス用のCSSを追加
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .touch-device .option-card:hover,
        .touch-device .faq-question:hover {
            transform: none;
        }
        
        .touch-device .btn:hover {
            transform: none;
        }
    `;
    document.head.appendChild(touchStyle);
}

// PWA対応（Service Worker）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service Workerがある場合は登録
        // navigator.serviceWorker.register('/sw.js');
    });
}

// アクセシビリティ向上
document.addEventListener('keydown', function(e) {
    // FAQ常に表示のため、Escキーでの閉じる機能は不要
    // 必要に応じて他のキーボード操作をここに追加
});

// 外部リンクに target="_blank" と rel="noopener" を自動追加
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}); 