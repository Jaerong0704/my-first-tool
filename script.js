// ===== 전역 변수 =====
let allTools = [];
let filteredTools = [];
let compareMode = false;
let selectedTools = [];
let favorites = JSON.parse(localStorage.getItem('ai-tools-favorites') || '[]');
let currentView = 'grid';
let currentFilters = {
    category: 'all',
    price: 'all',
    search: '',
    sort: 'popular'
};

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadTools();
    initEventListeners();
    displayFeaturedTools();
    filterAndDisplay();
    updateFreeCount();
    
    // 로딩 화면 숨기기
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 500);
});

// ===== 도구 데이터 로드 =====
async function loadTools() {
    try {
        const response = await fetch('tools.json');
        allTools = await response.json();
        filteredTools = [...allTools];
    } catch (error) {
        console.error('도구 로드 실패:', error);
        allTools = [];
        filteredTools = [];
    }
}

// ===== 이벤트 리스너 초기화 =====
function initEventListeners() {
    // 검색
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // 카테고리 필터
    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => handleCategoryFilter(btn));
    });
    
    // 가격 필터
    document.querySelectorAll('[data-price]').forEach(btn => {
        btn.addEventListener('click', () => handlePriceFilter(btn));
    });
    
    // 정렬
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    
    // 스크롤 탑 버튼
    window.addEventListener('scroll', handleScroll);
    document.getElementById('scrollTop').addEventListener('click', scrollToTop);
}

// ===== 히어로 섹션 =====
function scrollToTools() {
    document.getElementById('searchSection').scrollIntoView({ behavior: 'smooth' });
}

function updateFreeCount() {
    const freeCount = allTools.filter(t => t.price === 'free' || t.price === 'freemium').length;
    document.getElementById('freeCount').textContent = freeCount;
}

// ===== 인기 도구 표시 =====
function displayFeaturedTools() {
    const featuredTools = allTools.filter(t => t.popular).slice(0, 6);
    const grid = document.getElementById('featuredGrid');
    
    grid.innerHTML = featuredTools.map(tool => `
        <div class="featured-card" onclick="openModal(${tool.id})">
            <span class="featured-badge">인기</span>
            <div class="card-header">
                <div class="tool-icon">${tool.icon}</div>
                <div>
                    <h3 class="tool-title">${tool.name}</h3>
                </div>
            </div>
            <p class="tool-description">${tool.description}</p>
            <div class="card-tags">
                ${tool.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ===== 검색 =====
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    currentFilters.search = query;
    
    // 검색어 있으면 clear 버튼 표시
    const clearBtn = document.getElementById('searchClear');
    clearBtn.classList.toggle('visible', query.length > 0);
    
    filterAndDisplay();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    currentFilters.search = '';
    document.getElementById('searchClear').classList.remove('visible');
    filterAndDisplay();
}

// ===== 필터링 =====
function handleCategoryFilter(btn) {
    document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilters.category = btn.dataset.category;
    filterAndDisplay();
}

function handlePriceFilter(btn) {
    document.querySelectorAll('[data-price]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilters.price = btn.dataset.price;
    filterAndDisplay();
}

function handleSort(e) {
    currentFilters.sort = e.target.value;
    filterAndDisplay();
}

function resetFilters() {
    currentFilters = {
        category: 'all',
        price: 'all',
        search: '',
        sort: 'popular'
    };
    
    document.querySelectorAll('[data-category]').forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'all');
    });
    document.querySelectorAll('[data-price]').forEach(b => {
        b.classList.toggle('active', b.dataset.price === 'all');
    });
    document.getElementById('sortSelect').value = 'popular';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').classList.remove('visible');
    
    filterAndDisplay();
}

function filterByCategory(category) {
    currentFilters.category = category;
    document.querySelectorAll('[data-category]').forEach(b => {
        b.classList.toggle('active', b.dataset.category === category);
    });
    filterAndDisplay();
    scrollToTools();
}

// ===== 필터 & 표시 =====
function filterAndDisplay() {
    filteredTools = allTools.filter(tool => {
        // 카테고리 필터
        if (currentFilters.category !== 'all' && tool.category !== currentFilters.category) {
            return false;
        }
        
        // 가격 필터
        if (currentFilters.price !== 'all' && tool.price !== currentFilters.price) {
            return false;
        }
        
        // 검색
        if (currentFilters.search) {
            const searchText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
            if (!searchText.includes(currentFilters.search)) {
                return false;
            }
        }
        
        return true;
    });
    
    // 정렬
    if (currentFilters.sort === 'popular') {
        filteredTools.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (currentFilters.sort === 'name') {
        filteredTools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentFilters.sort === 'newest') {
        filteredTools.sort((a, b) => {
            const dateA = new Date(a.releaseDate || '2020-01-01');
            const dateB = new Date(b.releaseDate || '2020-01-01');
            return dateB - dateA;
        });
    }
    
    displayTools();
}

// ===== 도구 표시 =====
function displayTools() {
    const grid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `${filteredTools.length}개의 AI 도구`;
    
    if (filteredTools.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = filteredTools.map(tool => createToolCard(tool)).join('');
}

function createToolCard(tool) {
    const priceText = {
        'free': '무료',
        'freemium': '무료+유료',
        'paid': '유료'
    };
    
    const isFavorited = favorites.includes(tool.id);
    const isSelected = selectedTools.includes(tool.id);
    
    return `
        <div class="tool-card ${isSelected ? 'compare-selected' : ''}" 
             onclick="${compareMode ? `toggleCompare(${tool.id})` : `openModal(${tool.id})`}">
            <div class="card-header">
                <div class="tool-icon">${tool.icon}</div>
                <h3 class="tool-title">${tool.name}</h3>
                <button class="favorite-btn-card ${isFavorited ? 'favorited' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${tool.id})">
                    ${isFavorited ? '★' : '☆'}
                </button>
            </div>
            
            <p class="tool-description">${tool.description}</p>
            
            <div class="card-tags">
                ${tool.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                <span class="price-badge ${tool.price}">${priceText[tool.price]}</span>
            </div>
            
            ${!compareMode ? `
            <div class="card-footer">
                <button class="btn btn-primary" onclick="event.stopPropagation(); window.open('${tool.link}', '_blank')">
                    사용하기 →
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); copyLink('${tool.link}')">
                    링크 복사
                </button>
            </div>
            ` : ''}
        </div>
    `;
}

// ===== 뷰 모드 전환 =====
function changeView(view) {
    currentView = view;
    const grid = document.getElementById('toolsGrid');
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// ===== 비교 모드 =====
function toggleCompareMode() {
    compareMode = !compareMode;
    const btn = document.getElementById('compareModeBtn');
    btn.classList.toggle('active', compareMode);
    
    if (!compareMode) {
        selectedTools = [];
        updateCompareCount();
    }
    
    filterAndDisplay();
}

function toggleCompare(toolId) {
    if (!compareMode) return;
    
    const index = selectedTools.indexOf(toolId);
    if (index > -1) {
        selectedTools.splice(index, 1);
    } else {
        if (selectedTools.length >= 3) {
            showToast('최대 3개까지만 비교할 수 있습니다');
            return;
        }
        selectedTools.push(toolId);
    }
    
    updateCompareCount();
    filterAndDisplay();
    
    if (selectedTools.length >= 2) {
        openCompareModal();
    }
}

function updateCompareCount() {
    document.getElementById('compareCount').textContent = selectedTools.length;
}

function clearComparison() {
    selectedTools = [];
    updateCompareCount();
    closeCompareModal();
    filterAndDisplay();
}

// ===== 비교 모달 =====
function openCompareModal() {
    const modal = document.getElementById('compareModal');
    const grid = document.getElementById('compareGrid');
    
    const tools = selectedTools.map(id => allTools.find(t => t.id === id));
    
    grid.innerHTML = tools.map(tool => `
        <div class="compare-card">
            <div class="compare-card-header">
                <div class="compare-card-icon">${tool.icon}</div>
                <div>
                    <h3 class="compare-card-title">${tool.name}</h3>
                    <p style="color: var(--text-muted); margin-top: 4px;">${tool.company || '정보 없음'}</p>
                </div>
            </div>
            
            ${tool.pricingDetails ? `
            <div class="compare-section">
                <h4>💰 가격</h4>
                <ul>
                    ${Object.entries(tool.pricingDetails).slice(0, 2).map(([key, value]) => `
                        <li><strong>${key}:</strong> ${value}</li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${tool.pros ? `
            <div class="compare-section">
                <h4>✅ 장점</h4>
                <ul>
                    ${tool.pros.slice(0, 3).map(pro => `<li>${pro}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${tool.cons ? `
            <div class="compare-section">
                <h4>❌ 단점</h4>
                <ul>
                    ${tool.cons.slice(0, 3).map(con => `<li>${con}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== 즐겨찾기 =====
function toggleFavorite(toolId) {
    const index = favorites.indexOf(toolId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(toolId);
    }
    
    localStorage.setItem('ai-tools-favorites', JSON.stringify(favorites));
    filterAndDisplay();
    updateFavoritesPanel();
    showToast(index > -1 ? '즐겨찾기 해제' : '즐겨찾기 추가 ⭐');
}

function toggleFavoriteFromModal() {
    const toolId = parseInt(document.getElementById('modalFavoriteBtn').dataset.toolId);
    toggleFavorite(toolId);
    
    const btn = document.getElementById('modalFavoriteBtn');
    const isFavorited = favorites.includes(toolId);
    btn.classList.toggle('favorited', isFavorited);
    btn.querySelector('.favorite-icon').textContent = isFavorited ? '★' : '☆';
}

function toggleFavoritesPanel() {
    const panel = document.getElementById('favoritesPanel');
    panel.classList.toggle('active');
    updateFavoritesPanel();
}

function updateFavoritesPanel() {
    const content = document.getElementById('favoritesContent');
    
    if (favorites.length === 0) {
        content.innerHTML = '<p class="favorites-empty">아직 즐겨찾기한 도구가 없습니다</p>';
        return;
    }
    
    const favoriteTools = allTools.filter(t => favorites.includes(t.id));
    content.innerHTML = favoriteTools.map(tool => `
        <div class="tool-card" onclick="openModal(${tool.id})" style="margin-bottom: 16px;">
            <div class="card-header">
                <div class="tool-icon">${tool.icon}</div>
                <h3 class="tool-title" style="font-size: 1.1rem;">${tool.name}</h3>
            </div>
        </div>
    `).join('');
}

// ===== 상세 모달 =====
function openModal(toolId) {
    if (compareMode) return;
    
    const tool = allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    const modal = document.getElementById('toolModal');
    const isFavorited = favorites.includes(toolId);
    
    // 기본 정보
    document.getElementById('modalIcon').textContent = tool.icon;
    document.getElementById('modalTitle').textContent = tool.name;
    document.getElementById('modalCompany').textContent = tool.company || '정보 없음';
    document.getElementById('modalDate').textContent = tool.releaseDate || '출시일 정보 없음';
    document.getElementById('modalDescription').textContent = tool.description;
    document.getElementById('modalLink').href = tool.link;
    
    // 즐겨찾기 버튼
    const favoriteBtn = document.getElementById('modalFavoriteBtn');
    favoriteBtn.dataset.toolId = toolId;
    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.querySelector('.favorite-icon').textContent = isFavorited ? '★' : '☆';
    
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
                    <div class="pricing-title">${key}</div>
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
    const tagsHTML = tool.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');
    document.getElementById('modalTags').innerHTML = tagsHTML;
    
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('toolModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function copyModalLink() {
    const link = document.getElementById('modalLink').href;
    navigator.clipboard.writeText(link).then(() => {
        showToast('링크가 복사되었습니다! ✅');
    });
}

// ===== 유틸리티 =====
function copyLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showToast('링크가 복사되었습니다! ✅');
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function handleScroll() {
    const scrollBtn = document.getElementById('scrollTop');
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCompareModal();
    }
});
