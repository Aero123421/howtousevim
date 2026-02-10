// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });
    });
});

// ===== Vim Movement Demo =====
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('vim-cursor');
    const cursorPos = document.getElementById('cursor-pos');
    const keys = document.querySelectorAll('.key');
    const editorBody = document.getElementById('vim-text-area');
    
    let cursorX = 0;
    let cursorY = 0;
    const lineHeight = 28; // Approximate line height
    const charWidth = 9;   // Approximate char width
    const maxLines = 5;
    const charsPerLine = [26, 36, 26, 20, 27]; // Approximate chars per line
    
    // Initialize cursor position
    function updateCursorPosition() {
        if (cursor) {
            cursor.style.left = `${cursorX * charWidth + 45}px`;
            cursor.style.top = `${cursorY * lineHeight + 16}px`;
        }
        if (cursorPos) {
            cursorPos.textContent = `${cursorY + 1},${cursorX + 1}`;
        }
    }
    
    updateCursorPosition();
    
    // Handle key presses
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyType = key.dataset.key;
            
            // Visual feedback
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 200);
            
            switch(keyType) {
                case 'h':
                    if (cursorX > 0) cursorX--;
                    break;
                case 'j':
                    if (cursorY < maxLines) {
                        cursorY++;
                        cursorX = Math.min(cursorX, charsPerLine[cursorY] || 0);
                    }
                    break;
                case 'k':
                    if (cursorY > 0) {
                        cursorY--;
                        cursorX = Math.min(cursorX, charsPerLine[cursorY] || 0);
                    }
                    break;
                case 'l':
                    if (cursorX < (charsPerLine[cursorY] || 0)) cursorX++;
                    break;
                case 'w':
                    // Move to next word (simplified)
                    cursorX = Math.min(cursorX + 5, charsPerLine[cursorY] || 0);
                    break;
                case 'b':
                    // Move to previous word (simplified)
                    cursorX = Math.max(cursorX - 5, 0);
                    break;
                case '0':
                    cursorX = 0;
                    break;
                case '$':
                    cursorX = charsPerLine[cursorY] || 0;
                    break;
                case 'gg':
                    cursorY = 0;
                    cursorX = 0;
                    break;
                case 'G':
                    cursorY = maxLines;
                    cursorX = 0;
                    break;
            }
            
            updateCursorPosition();
        });
    });
    
    // Keyboard support for the demo
    document.addEventListener('keydown', (e) => {
        if (editorBody && editorBody.contains(document.activeElement)) return;
        
        const keyMap = {
            'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
            'w': 'w', 'b': 'b', '0': '0', '$': '$'
        };
        
        if (keyMap[e.key]) {
            e.preventDefault();
            const keyElement = document.querySelector(`[data-key="${keyMap[e.key]}"]`);
            keyElement?.click();
        }
        
        if (e.key === 'g' && e.repeat === false) {
            // Handle 'gg' - requires double press
            const lastG = sessionStorage.getItem('lastG');
            const now = Date.now();
            if (lastG && now - parseInt(lastG) < 500) {
                const ggKey = document.querySelector('[data-key="gg"]');
                ggKey?.click();
                sessionStorage.removeItem('lastG');
            } else {
                sessionStorage.setItem('lastG', now.toString());
            }
        }
        
        if (e.key === 'G') {
            const GKey = document.querySelector('[data-key="G"]');
            GKey?.click();
        }
    });
});

// ===== Cheatsheet Filter =====
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categories = document.querySelectorAll('.cheatsheet-category');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            categories.forEach(category => {
                if (filter === 'all' || category.dataset.category === filter) {
                    category.style.display = 'block';
                    category.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    });
});

// ===== Copy to Clipboard =====
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    
    function showToast(message) {
        if (!toast) return;
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    
    // Copy config buttons
    document.querySelectorAll('.copy-config-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const block = btn.closest('.config-block');
            const code = block?.querySelector('code');
            
            if (code) {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    showToast('設定をコピーしました！');
                    btn.textContent = 'コピー済み';
                    setTimeout(() => btn.textContent = 'コピー', 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });
    
    // Copy command items
    document.querySelectorAll('.command-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', async () => {
            const keys = item.querySelector('.command-keys');
            if (keys) {
                const text = keys.textContent.trim();
                try {
                    await navigator.clipboard.writeText(text);
                    showToast('コピーしました！');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });
});

// ===== Scroll Progress =====
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00ff00, #56d364);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
});

// ===== Active Navigation Link =====
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// ===== Intersection Observer for Animations =====
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .mode-card, .cheatsheet-category, .scenario-card, .config-block').forEach(el => {
        observer.observe(el);
    });
});

// ===== Mobile Menu Styles =====
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            padding: var(--space-lg);
            flex-direction: column;
            gap: var(--space-md);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// ===== Console Welcome Message =====
console.log('%c📝 Vim マスターガイド', 'font-size: 24px; font-weight: bold; color: #00ff00;');
console.log('%cキーボードショートカット:', 'font-size: 14px; font-weight: bold; color: #8b949e;');
console.log('%c  h j k l  %cカーソル移動', 'background: #21262d; padding: 2px 6px; border-radius: 4px;', 'color: #8b949e;');
console.log('%c  i         %c挿入モード', 'background: #21262d; padding: 2px 6px; border-radius: 4px;', 'color: #8b949e;');
console.log('%c  Esc       %cノーマルモードに戻る', 'background: #21262d; padding: 2px 6px; border-radius: 4px;', 'color: #8b949e;');