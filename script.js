// 전역 변수
let allTools = [];
let filteredTools = [];
let currentCategory = 'all';
let currentPrice = 'all';

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', async () => {
    // JSON 데이터 로드
    await loadTools();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 도구 표시
    displayTools(allTools);
    
    // 맨 위로 버튼 설정
    setupScrollTop();
});

// AI 도구 데이터 로드
async function loadTools() {
    try {
        const response = await fetch('tools.json');
        allTools = await response.json();
        filteredTools = allTools;
        
        // 통계 업데이트
        document.getElementById('totalTools').textContent = `${allTools.length}+`;
    } catch (error) {
        console.error('도구 데이터 로드 실패:', error);
        allTools = [];
        filteredTools = [];
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 입력
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // 검색 버튼
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        handleSearch();
    });
    
    // 카테고리 필터 버튼
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성 버튼 변경
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 카테고리 필터 적용
            currentCategory = btn.dataset.category;
            applyFilters();
        });
    });
    
    // 가격 필터 버튼
    const tagButtons = document.querySelectorAll('.tag-btn');
    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성 버튼 변경
            tagButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 가격 필터 적용
            currentPrice = btn.dataset.price;
            applyFilters();
        });
    });
}

// 검색 처리
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredTools = allTools;
    } else {
        filteredTools = allTools.filter(tool => {
            return tool.name.toLowerCase().includes(searchTerm) ||
                   tool.description.toLowerCase().includes(searchTerm) ||
                   tool.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
    }
    
    applyFilters();
}

// 필터 적용
function applyFilters() {
    let result = filteredTools;
    
    // 카테고리 필터
    if (currentCategory !== 'all') {
        result = result.filter(tool => tool.category === currentCategory);
    }
    
    // 가격 필터
    if (currentPrice !== 'all') {
        result = result.filter(tool => {
            if (currentPrice === 'free') {
                return tool.price === 'free' || tool.price === 'freemium';
            } else if (currentPrice === 'paid') {
                return tool.price === 'paid';
            }
            return true;
        });
    }
    
    displayTools(result);
}

// 도구 카드 표시
function displayTools(tools) {
    const toolsGrid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    
    // 결과 개수 업데이트
    resultCount.textContent = tools.length;
    
    // 결과 없음 처리
    if (tools.length === 0) {
        toolsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    toolsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // 카드 생성
    toolsGrid.innerHTML = tools.map(tool => createToolCard(tool)).join('');
    
    // 카드 애니메이션
    const cards = toolsGrid.querySelectorAll('.tool-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// 도구 카드 HTML 생성
function createToolCard(tool) {
    const priceText = {
        'free': '무료',
        'freemium': '무료 + 유료',
        'paid': '유료'
    };
    
    const priceClass = tool.price;
    
    const tagsHTML = tool.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    return `
        <div class="tool-card" onclick="openModal(${tool.id})">
            <div class="card-header">
                <div class="tool-icon">${tool.icon}</div>
                <h3 class="tool-title">${tool.name}</h3>
            </div>
            
            <p class="tool-description">${tool.description}</p>
            
            <div class="card-tags">
                ${tagsHTML}
                <span class="price-badge ${priceClass}">${priceText[tool.price]}</span>
            </div>
            
            <div class="card-footer">
                <button class="btn btn-primary" onclick="event.stopPropagation(); window.open('${tool.link}', '_blank')">
                    사용하기 →
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); copyLink('${tool.link}')">
                    링크 복사
                </button>
            </div>
        </div>
    `;
}

// 모달 열기
function openModal(toolId) {
    const tool = allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    const modal = document.getElementById('toolModal');
    
    // 기본 정보
    document.getElementById('modalIcon').textContent = tool.icon;
    document.getElementById('modalTitle').textContent = tool.name;
    document.getElementById('modalCompany').textContent = tool.company || '정보 없음';
    document.getElementById('modalDate').textContent = tool.releaseDate || '출시일 정보 없음';
    document.getElementById('modalDescription').textContent = tool.description;
    document.getElementById('modalLink').href = tool.link;
    
    // 가격 배지
    const priceText = {
        'free': '완전 무료',
        'freemium': '무료 + 유료 플랜',
        'paid': '유료 전용'
    };
    document.getElementById('modalPriceBadge').textContent = priceText[tool.price];
    
    // 상세 설명
    const detailedSection = document.getElementById('detailedSection');
    if (tool.detailedDescription) {
        document.getElementById('modalDetailedDesc').textContent = tool.detailedDescription;
        detailedSection.style.display = 'block';
    } else {
        detailedSection.style.display = 'none';
    }
    
    // 가격 정보
    const pricingSection = document.getElementById('pricingSection');
    const pricingGrid = document.getElementById('modalPricing');
    if (tool.pricingDetails) {
        let pricingHTML = '';
        for (const [key, value] of Object.entries(tool.pricingDetails)) {
            pricingHTML += `
                <div class="pricing-item">
                    <div class="pricing-title">${key.toUpperCase()}</div>
                    <div class="pricing-desc">${value}</div>
                </div>
            `;
        }
        pricingGrid.innerHTML = pricingHTML;
        pricingSection.style.display = 'block';
    } else {
        pricingSection.style.display = 'none';
    }
    
    // 장점
    const prosSection = document.getElementById('prosSection');
    const prosList = document.getElementById('modalPros');
    if (tool.pros && tool.pros.length > 0) {
        prosList.innerHTML = tool.pros.map(pro => `<li>${pro}</li>`).join('');
        prosSection.style.display = 'block';
    } else {
        prosSection.style.display = 'none';
    }
    
    // 단점
    const consSection = document.getElementById('consSection');
    const consList = document.getElementById('modalCons');
    if (tool.cons && tool.cons.length > 0) {
        consList.innerHTML = tool.cons.map(con => `<li>${con}</li>`).join('');
        consSection.style.display = 'block';
    } else {
        consSection.style.display = 'none';
    }
    
    // 추천 대상
    const recommendedSection = document.getElementById('recommendedSection');
    const recommendedList = document.getElementById('modalRecommended');
    if (tool.recommendedFor && tool.recommendedFor.length > 0) {
        recommendedList.innerHTML = tool.recommendedFor.map(rec => `<li>${rec}</li>`).join('');
        recommendedSection.style.display = 'block';
    } else {
        recommendedSection.style.display = 'none';
    }
    
    // 태그
    const tagsHTML = tool.tags.map(tag => 
        `<span class="modal-tag">${tag}</span>`
    ).join('');
    document.getElementById('modalTags').innerHTML = tagsHTML;
    
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('toolModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 모달 링크 복사
function copyModalLink() {
    const link = document.getElementById('modalLink').href;
    navigator.clipboard.writeText(link).then(() => {
        showToast('링크가 복사되었습니다! ✅');
    }).catch(err => {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다 ❌');
    });
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// 링크 복사 기능
function copyLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        // 복사 성공 알림 (간단한 alert 대신 토스트 메시지 추천)
        showToast('링크가 복사되었습니다! ✅');
    }).catch(err => {
        console.error('복사 실패:', err);
        showToast('복사에 실패했습니다 ❌');
    });
}

// 토스트 메시지 표시
function showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 맨 위로 버튼 설정
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // 스크롤 이벤트
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // 클릭 이벤트
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// CSS 애니메이션 추가 (동적)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 인기 도구 먼저 표시 (선택사항)
function sortByPopularity() {
    allTools.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return 0;
    });
}

// 페이지 로드 시 인기 순으로 정렬
sortByPopularity();
