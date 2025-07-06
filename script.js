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
        '.section-title, .philosophy-content, .course-grid, .option-card, .supplement-content, .contact-content'
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