// Ultraman Card Game Collection Viewer Application Logic
(function() {
  'use strict';

  // State
  let rawCards = [];
  let userOverrides = {};
  let currentFilteredCards = [];
  let selectedCard = null;

  const filters = {
    status: 'all',
    series: 'all',
    rarity: 'all',
    search: '',
    sort: 'excel'
  };

  let manualColorMode = false;
  let viewMode = 'grid'; // 'grid' | 'table'

  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const sortSelect = document.getElementById('sortSelect');
  const colorToggleBtn = document.getElementById('colorToggleBtn');
  const colorToggleText = document.getElementById('colorToggleText');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const statusTabs = document.getElementById('statusTabs');
  const rarityPills = document.getElementById('rarityPills');
  const seriesChipsContainer = document.getElementById('seriesChipsContainer');
  const breakdownToggle = document.getElementById('breakdownToggle');
  const breakdownIcon = document.getElementById('breakdownIcon');
  
  const galleryContainer = document.getElementById('galleryContainer');
  const tableContainer = document.getElementById('tableContainer');
  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  const filteredCount = document.getElementById('filteredCount');
  const filterSummaryText = document.getElementById('filterSummaryText');
  const btnResetFilters = document.getElementById('btnResetFilters');

  // Stats DOM
  const statOwnedCount = document.getElementById('statOwnedCount');
  const statTotalCount = document.getElementById('statTotalCount');
  const statOwnedRate = document.getElementById('statOwnedRate');
  const statOwnedProgressBar = document.getElementById('statOwnedProgressBar');
  const statTransitCount = document.getElementById('statTransitCount');
  const statTransitProgressBar = document.getElementById('statTransitProgressBar');
  const statUnownedCount = document.getElementById('statUnownedCount');
  const statWatchlistCount = document.getElementById('statWatchlistCount');
  const statUnownedProgressBar = document.getElementById('statUnownedProgressBar');
  const statTotalSpent = document.getElementById('statTotalSpent');
  const statAvgPrice = document.getElementById('statAvgPrice');
  const statTotalMarket = document.getElementById('statTotalMarket');
  const statTotalProfit = document.getElementById('statTotalProfit');
  const statProfitBadge = document.getElementById('statProfitBadge');

  // Badges in Tabs
  const badgeAllCount = document.getElementById('badgeAllCount');
  const badgeOwnedCount = document.getElementById('badgeOwnedCount');
  const badgeTransitCount = document.getElementById('badgeTransitCount');
  const badgeUnownedCount = document.getElementById('badgeUnownedCount');
  const badgeWatchlistCount = document.getElementById('badgeWatchlistCount');
  const badgeWinnerCount = document.getElementById('badgeWinnerCount');

  // Modal DOM
  const cardModal = document.getElementById('cardModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCardTitle = document.getElementById('modalCardTitle');
  const modalCardImg = document.getElementById('modalCardImg');
  const modalCurrentStatus = document.getElementById('modalCurrentStatus');
  const modalStatusSelect = document.getElementById('modalStatusSelect');
  const modalCardNumber = document.getElementById('modalCardNumber');
  const modalCardRarity = document.getElementById('modalCardRarity');
  const modalCardType = document.getElementById('modalCardType');
  const modalCardPrice = document.getElementById('modalCardPrice');
  const modalInputPrice = document.getElementById('modalInputPrice');
  const btnSavePrice = document.getElementById('btnSavePrice');
  const modalCardPriceRaw = document.getElementById('modalCardPriceRaw');
  const modalCardMarketPrice = document.getElementById('modalCardMarketPrice');
  const modalCardProfit = document.getElementById('modalCardProfit');
  const modalCardProfitRate = document.getElementById('modalCardProfitRate');
  const modalCardBP = document.getElementById('modalCardBP');
  const modalCardEffect = document.getElementById('modalCardEffect');
  const modalCardFlavor = document.getElementById('modalCardFlavor');
  const modalCardObtain = document.getElementById('modalCardObtain');
  const modalCardIllust = document.getElementById('modalCardIllust');
  const modalEffectSection = document.getElementById('modalEffectSection');
  const modalFlavorSection = document.getElementById('modalFlavorSection');
  const modalIllustSection = document.getElementById('modalIllustSection');

  const toastMessage = document.getElementById('toastMessage');
  const btnExport = document.getElementById('btnExport');
  const btnResetAll = document.getElementById('btnResetAll');

  // Load Saved Overrides from localStorage
  function loadUserOverrides() {
    try {
      const saved = localStorage.getItem('ucg_card_overrides');
      if (saved) {
        userOverrides = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user overrides from localStorage:', e);
      userOverrides = {};
    }
  }

  function saveUserOverrides() {
    try {
      localStorage.setItem('ucg_card_overrides', JSON.stringify(userOverrides));
    } catch (e) {
      console.error('Failed to save user overrides to localStorage:', e);
    }
  }

  // Toast Notification
  function showToast(text) {
    if (!toastMessage) return;
    toastMessage.textContent = text;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2500);
  }

  // Initialize Data
  async function initData() {
    loadUserOverrides();

    if (window.INITIAL_CARDS_DATA && Array.isArray(window.INITIAL_CARDS_DATA)) {
      rawCards = window.INITIAL_CARDS_DATA;
    } else {
      try {
        const res = await fetch('cards_data.json');
        rawCards = await res.json();
      } catch (e) {
        console.error('Failed to fetch cards_data.json:', e);
        rawCards = [];
      }
    }

    // Apply any local user overrides to cards
    applyOverridesToCards();

    // Render series chips & overall stats
    renderSeriesBreakdown();
    updateOverallStats();

    // Render list
    applyFiltersAndRender();
  }

  function applyOverridesToCards() {
    rawCards.forEach(card => {
      const override = userOverrides[card.id];
      if (override) {
        if (override.status) {
          card.status = override.status;
          card.status_label = getStatusLabel(override.status);
          card.badge_class = getBadgeClass(override.status);
        }
        if (override.price !== undefined) {
          card.price = override.price;
        }
      }
    });
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'owned': return '保有';
      case 'owned_winner': return '保有 (Winner)';
      case 'transit': return '到着待ち';
      case 'watchlist': return '検討中';
      case 'winner_target': return '未保有 (Winner)';
      case 'unowned': return '未保有';
      default: return '未保有';
    }
  }

  function getBadgeClass(status) {
    switch (status) {
      case 'owned': return 'badge-owned';
      case 'owned_winner': return 'badge-winner';
      case 'transit': return 'badge-transit';
      case 'watchlist': return 'badge-watchlist';
      case 'winner_target': return 'badge-winner-target';
      case 'unowned': return 'badge-unowned';
      default: return 'badge-unowned';
    }
  }

  // Compute and update stats
  function updateOverallStats() {
    const total = rawCards.length;
    let owned = 0;
    let transit = 0;
    let unowned = 0;
    let watchlist = 0;
    let winner = 0;
    let totalSpent = 0;
    let spentCount = 0;
    let totalMarketOwned = 0;
    let marketOfPurchased = 0;

    rawCards.forEach(c => {
      const isOwned = (c.status === 'owned' || c.status === 'owned_winner');
      const isTransit = (c.status === 'transit');
      const mPrice = c.market_price || 50;

      if (isOwned) {
        owned++;
        totalMarketOwned += mPrice;
      } else if (isTransit) {
        transit++;
        totalMarketOwned += mPrice;
      } else if (c.status === 'watchlist') {
        watchlist++;
        unowned++;
      } else {
        unowned++;
      }

      if (c.status === 'owned_winner' || c.status === 'winner_target' || (c.status_raw && c.status_raw.includes('Winner'))) {
        winner++;
      }

      if (c.price && typeof c.price === 'number') {
        totalSpent += c.price;
        spentCount++;
        marketOfPurchased += mPrice;
      }
    });

    const ownedRate = total > 0 ? ((owned / total) * 100).toFixed(1) : '0.0';
    const transitRate = total > 0 ? ((transit / total) * 100).toFixed(1) : '0.0';
    const unownedRate = total > 0 ? ((unowned / total) * 100).toFixed(1) : '0.0';
    const avgPrice = spentCount > 0 ? Math.round(totalSpent / spentCount) : 0;

    const totalProfit = marketOfPurchased - totalSpent;
    const profitPct = totalSpent > 0 ? ((totalProfit / totalSpent) * 100).toFixed(1) : '0.0';
    const isProfitPos = totalProfit >= 0;

    if (statOwnedCount) statOwnedCount.textContent = owned.toLocaleString();
    if (statTotalCount) statTotalCount.textContent = total.toLocaleString();
    if (statOwnedRate) statOwnedRate.textContent = `${ownedRate}%`;
    if (statOwnedProgressBar) statOwnedProgressBar.style.width = `${ownedRate}%`;

    if (statTransitCount) statTransitCount.textContent = transit.toLocaleString();
    if (statTransitProgressBar) statTransitProgressBar.style.width = `${transitRate}%`;

    if (statUnownedCount) statUnownedCount.textContent = unowned.toLocaleString();
    if (statWatchlistCount) statWatchlistCount.textContent = watchlist.toLocaleString();
    if (statUnownedProgressBar) statUnownedProgressBar.style.width = `${unownedRate}%`;

    if (statTotalSpent) statTotalSpent.textContent = `¥${totalSpent.toLocaleString()}`;
    if (statAvgPrice) statAvgPrice.textContent = `¥${avgPrice.toLocaleString()} (${spentCount}枚記録)`;

    if (statTotalMarket) statTotalMarket.textContent = `¥${totalMarketOwned.toLocaleString()}`;
    if (statTotalProfit) {
      statTotalProfit.textContent = `${isProfitPos ? '+' : ''}¥${totalProfit.toLocaleString()} (${isProfitPos ? '+' : ''}${profitPct}%)`;
      statTotalProfit.style.color = isProfitPos ? '#34d399' : '#f87171';
    }
    if (statProfitBadge) {
      statProfitBadge.textContent = `${isProfitPos ? '含み益' : '含み損'}: ${isProfitPos ? '+' : ''}¥${totalProfit.toLocaleString()}`;
      statProfitBadge.style.color = isProfitPos ? '#34d399' : '#f87171';
      statProfitBadge.style.borderColor = isProfitPos ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)';
      statProfitBadge.style.background = isProfitPos ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)';
    }

    // Update tab badges
    if (badgeAllCount) badgeAllCount.textContent = total;
    if (badgeOwnedCount) badgeOwnedCount.textContent = owned;
    if (badgeTransitCount) badgeTransitCount.textContent = transit;
    if (badgeUnownedCount) badgeUnownedCount.textContent = unowned;
    if (badgeWatchlistCount) badgeWatchlistCount.textContent = watchlist;
    if (badgeWinnerCount) badgeWinnerCount.textContent = winner;
  }

  // Render Series Breakdown Chips
  function renderSeriesBreakdown() {
    if (!seriesChipsContainer) return;

    // Series list ordered logically
    const seriesOrder = [
      'PR', 'Y25', 'Y26', 'TD',
      'BP01', 'BP02', 'BP03', 'BP04', 'BP05', 'BP06', 'BP07', 'BP08', 'BP09',
      'SD01', 'SD02', 'SD03', 'SD04', 'UD01', 'EXD01', 'EXS01', 'EXS02',
      'LTP01', 'OTHER'
    ];

    const seriesStats = {};
    rawCards.forEach(c => {
      const code = c.series_code || 'OTHER';
      if (!seriesStats[code]) {
        seriesStats[code] = { total: 0, owned: 0, code: code, name: c.series_name || code };
      }
      seriesStats[code].total++;
      if (c.status === 'owned' || c.status === 'owned_winner') {
        seriesStats[code].owned++;
      }
    });

    // Total promos (PR + Y25 + Y26 + TD)
    const promoCodes = ['PR', 'Y25', 'Y26', 'TD'];
    let promoTotal = 0;
    let promoOwned = 0;
    promoCodes.forEach(cd => {
      if (seriesStats[cd]) {
        promoTotal += seriesStats[cd].total;
        promoOwned += seriesStats[cd].owned;
      }
    });
    const promoRate = promoTotal > 0 ? ((promoOwned / promoTotal) * 100).toFixed(0) : '0';

    let html = `
      <div class="breakdown-chip ${filters.series === 'all' ? 'active' : ''}" data-series="all">
        <div class="breakdown-chip-title">
          <span>全シリーズ</span>
          <span>${rawCards.length}枚</span>
        </div>
        <div class="breakdown-chip-stats">
          <span>全体進捗</span>
          <span>${statOwnedRate ? statOwnedRate.textContent : ''}</span>
        </div>
      </div>
      <div class="breakdown-chip ${filters.series === 'PROMO_ALL' ? 'active' : ''}" data-series="PROMO_ALL" style="border-color: #8b5cf6;">
        <div class="breakdown-chip-title">
          <span style="color: #c084fc;">全プロモ統合</span>
          <span>${promoOwned}/${promoTotal}</span>
        </div>
        <div class="breakdown-chip-stats">
          <span style="font-size: 10px; color: var(--text-sub);">PR+Y25+Y26+TD</span>
          <span style="font-weight: 700; color: #a78bfa;">${promoRate}%</span>
        </div>
      </div>
    `;

    seriesOrder.forEach(code => {
      const stat = seriesStats[code];
      if (stat && stat.total > 0) {
        const rate = ((stat.owned / stat.total) * 100).toFixed(0);
        const isActive = filters.series === code ? 'active' : '';
        const bracketMatch = stat.name.match(/「([^」]+)」/);
        const subName = bracketMatch ? bracketMatch[1] : stat.name.replace(/「.*」/, '').substring(0, 10);
        html += `
          <div class="breakdown-chip ${isActive}" data-series="${code}">
            <div class="breakdown-chip-title">
              <span>${code}</span>
              <span style="color: ${rate === '100' ? '#10b981' : 'var(--text-main)'};">${stat.owned}/${stat.total}</span>
            </div>
            <div class="breakdown-chip-stats">
              <span style="font-size: 10px; color: var(--text-sub); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px;" title="${stat.name}">${subName}</span>
              <span style="font-weight: 700; color: ${rate === '100' ? '#10b981' : 'var(--accent-blue)'};">${rate}%</span>
            </div>
          </div>
        `;
      }
    });

    seriesChipsContainer.innerHTML = html;

    // Attach click events
    seriesChipsContainer.querySelectorAll('.breakdown-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const s = chip.dataset.series;
        filters.series = s;
        seriesChipsContainer.querySelectorAll('.breakdown-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        applyFiltersAndRender();
      });
    });
  }

  // Filter and Sort Cards
  function applyFiltersAndRender() {
    const q = filters.search.toLowerCase().trim();

    currentFilteredCards = rawCards.filter(c => {
      // 1. Status filter
      if (filters.status === 'owned') {
        if (c.status !== 'owned' && c.status !== 'owned_winner') return false;
      } else if (filters.status === 'transit') {
        if (c.status !== 'transit') return false;
      } else if (filters.status === 'unowned') {
        if (c.status === 'owned' || c.status === 'owned_winner' || c.status === 'transit') return false;
      } else if (filters.status === 'watchlist') {
        if (c.status !== 'watchlist') return false;
      } else if (filters.status === 'winner') {
        const isWinner = c.status === 'owned_winner' || c.status === 'winner_target' || (c.status_raw && c.status_raw.includes('Winner'));
        if (!isWinner) return false;
      }

      // 2. Series filter
      if (filters.series === 'PROMO_ALL') {
        if (!['PR', 'Y25', 'Y26', 'TD'].includes(c.series_code)) return false;
      } else if (filters.series !== 'all') {
        if (c.series_code !== filters.series) return false;
      }

      // 3. Rarity filter
      if (filters.rarity !== 'all') {
        if (c.rarity !== filters.rarity) return false;
      }

      // 4. Text Search
      if (q) {
        const numMatch = (c.card_number || '').toLowerCase().includes(q);
        const nameMatch = (c.name || '').toLowerCase().includes(q);
        const rawNameMatch = (c.raw_name || '').toLowerCase().includes(q);
        const charMatch = (c.character_name || '').toLowerCase().includes(q);
        const obtainMatch = (c.obtain || '').toLowerCase().includes(q);
        const effectMatch = (c.effect || '').toLowerCase().includes(q);
        const rarityMatch = (c.rarity || '').toLowerCase().includes(q);
        if (!numMatch && !nameMatch && !rawNameMatch && !charMatch && !obtainMatch && !effectMatch && !rarityMatch) {
          return false;
        }
      }

      return true;
    });

    // Sort
    sortCards(currentFilteredCards, filters.sort);

    // Update Result counts
    if (filteredCount) filteredCount.textContent = currentFilteredCards.length.toLocaleString();

    const isFiltered = (filters.status !== 'all' || filters.series !== 'all' || filters.rarity !== 'all' || q !== '');
    if (btnResetFilters) {
      btnResetFilters.style.display = isFiltered ? 'inline-block' : 'none';
    }

    let summaryParts = [];
    if (filters.status !== 'all') summaryParts.push(getStatusLabel(filters.status));
    if (filters.series !== 'all') summaryParts.push(filters.series);
    if (filters.rarity !== 'all') summaryParts.push(filters.rarity);
    if (q) summaryParts.push(`"${filters.search}"`);
    if (filterSummaryText) {
      filterSummaryText.textContent = summaryParts.length > 0 ? `(${summaryParts.join(' / ')})` : '';
    }

    // Determine whether to display unowned cards in color
    // When sorted by unowned_first OR status is unowned OR manual toggle is ON: show in full color!
    const shouldColorUnowned = manualColorMode || filters.status === 'unowned' || filters.sort === 'unowned_first';
    if (shouldColorUnowned) {
      document.body.classList.add('show-unowned-color');
      if (galleryContainer) galleryContainer.classList.add('show-unowned-color');
      if (colorToggleBtn) colorToggleBtn.classList.add('btn-primary');
      if (colorToggleText) colorToggleText.textContent = '未保有カラー: ON';
    } else {
      document.body.classList.remove('show-unowned-color');
      if (galleryContainer) galleryContainer.classList.remove('show-unowned-color');
      if (colorToggleBtn) colorToggleBtn.classList.remove('btn-primary');
      if (colorToggleText) colorToggleText.textContent = '未保有カラー: OFF';
    }

    // Render
    if (currentFilteredCards.length === 0) {
      if (galleryContainer) galleryContainer.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (viewMode === 'grid') {
        if (galleryContainer) galleryContainer.style.display = 'grid';
        if (tableContainer) tableContainer.style.display = 'none';
        renderGallery(currentFilteredCards);
      } else {
        if (galleryContainer) galleryContainer.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'block';
        renderTable(currentFilteredCards);
      }
    }
  }

  // Sorting
  function sortCards(list, sortType) {
    const rarityRank = {
      'UR': 10, 'SSSP': 9, 'SP': 8, 'AP': 7, 'RRRR': 6, 'RRR': 5, 'ExP': 4, 'RR': 3, 'R': 2, 'U': 1, 'C': 0
    };

    const getRowVal = (c) => typeof c.excel_row === 'number' ? c.excel_row : 99999;

    list.sort((a, b) => {
      switch (sortType) {
        case 'excel':
          return getRowVal(a) - getRowVal(b);
        case 'unowned_first': {
          // Unowned / watchlist / winner_target cards come first (rank 0), transit (rank 1), owned (rank 2)
          const rankA = (a.status === 'unowned' || a.status === 'watchlist' || a.status === 'winner_target') ? 0 : (a.status === 'transit' ? 1 : 2);
          const rankB = (b.status === 'unowned' || b.status === 'watchlist' || b.status === 'winner_target') ? 0 : (b.status === 'transit' ? 1 : 2);
          if (rankA !== rankB) return rankA - rankB;
          return getRowVal(a) - getRowVal(b);
        }
        case 'owned_first': {
          // Owned cards come first (rank 0), transit (rank 1), unowned (rank 2)
          const rankA = (a.status === 'owned' || a.status === 'owned_winner') ? 0 : (a.status === 'transit' ? 1 : 2);
          const rankB = (b.status === 'owned' || b.status === 'owned_winner') ? 0 : (b.status === 'transit' ? 1 : 2);
          if (rankA !== rankB) return rankA - rankB;
          return getRowVal(a) - getRowVal(b);
        }
        case 'number_asc':
          return a.card_number.localeCompare(b.card_number, undefined, { numeric: true, sensitivity: 'base' });
        case 'market_price_desc':
          return (b.market_price || 0) - (a.market_price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'profit_desc': {
          const diffA = (a.price_diff !== null && a.price_diff !== undefined) ? a.price_diff : -999999;
          const diffB = (b.price_diff !== null && b.price_diff !== undefined) ? b.price_diff : -999999;
          return diffB - diffA;
        }
        case 'profit_asc': {
          const diffA = (a.price_diff !== null && a.price_diff !== undefined) ? a.price_diff : 999999;
          const diffB = (b.price_diff !== null && b.price_diff !== undefined) ? b.price_diff : 999999;
          return diffA - diffB;
        }
        case 'rarity':
          const rA = rarityRank[a.rarity] || 0;
          const rB = rarityRank[b.rarity] || 0;
          if (rB !== rA) return rB - rA;
          return getRowVal(a) - getRowVal(b);
        case 'name':
          return (a.name || '').localeCompare(b.name || '', 'ja');
        default:
          return getRowVal(a) - getRowVal(b);
      }
    });
  }

  // Render Grid Gallery
  function renderGallery(cards) {
    if (!galleryContainer) return;

    // Render first 200 items immediately, chunk subsequent items to prevent UI freeze
    const initialBatch = cards.slice(0, 150);
    galleryContainer.innerHTML = initialBatch.map(c => createCardHtml(c)).join('');

    if (cards.length > 150) {
      let offset = 150;
      const batchSize = 150;
      function loadNextBatch() {
        if (offset >= cards.length) return;
        const nextBatch = cards.slice(offset, offset + batchSize);
        const fragment = document.createRange().createContextualFragment(
          nextBatch.map(c => createCardHtml(c)).join('')
        );
        galleryContainer.appendChild(fragment);
        offset += batchSize;
        if (offset < cards.length) {
          requestAnimationFrame(loadNextBatch);
        }
      }
      requestAnimationFrame(loadNextBatch);
    }
  }

  function createCardHtml(c) {
    const isUnowned = (c.status === 'unowned' || c.status === 'watchlist' || c.status === 'winner_target');
    const isOwned = (c.status === 'owned' || c.status === 'owned_winner');

    let badgeIcon = '⚪️';
    if (isOwned) badgeIcon = c.status === 'owned_winner' ? '🏆' : '🟢';
    else if (c.status === 'transit') badgeIcon = '🟡';
    else if (c.status === 'watchlist') badgeIcon = '🟣';

    let diffBadge = '';
    const marketVal = c.market_price || 50;

    if (c.price && typeof c.price === 'number') {
      const diff = marketVal - c.price;
      if (diff > 0) {
        diffBadge = `<span class="card-diff-tag pos">+¥${diff.toLocaleString()}</span>`;
      } else if (diff < 0) {
        diffBadge = `<span class="card-diff-tag neg">¥${diff.toLocaleString()}</span>`;
      } else {
        diffBadge = `<span class="card-diff-tag zero">±0</span>`;
      }
    } else if (c.target_price) {
      diffBadge = `<span class="card-diff-tag" style="background: rgba(192,132,252,0.2); border: 1px solid rgba(192,132,252,0.4); color: #c084fc;">目標</span>`;
    }

    const priceBar = `
      <div class="card-price-bar">
        <div class="card-price-col">
          <span class="price-lbl">購入</span>
          <span class="price-val ${c.price ? 'has-price' : ''}">${c.price ? '¥' + c.price.toLocaleString() : (c.target_price ? '目:¥' + c.target_price.toLocaleString() : '未記録')}</span>
        </div>
        <div class="card-price-col">
          <span class="price-lbl">市場</span>
          <span class="price-val market">¥${marketVal.toLocaleString()}</span>
        </div>
        ${diffBadge}
      </div>
    `;

    const rarityClass = `rarity-${c.rarity.replace(/[^a-zA-Z]/g, '')}`;

    let imageContent = '';
    if (c.image_url) {
      imageContent = `<img class="card-img" src="${c.thumbnail_url || c.image_url}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="placeholder-card" style="display: none;">
        <div class="placeholder-icon">⚡️</div>
        <div class="placeholder-num">${escapeHtml(c.card_number)}</div>
        <div class="placeholder-name">${escapeHtml(c.name)}</div>
      </div>`;
    } else {
      imageContent = `
        <div class="placeholder-card">
          <div class="placeholder-icon">⚡️</div>
          <div class="placeholder-num">${escapeHtml(c.card_number)}</div>
          <div class="placeholder-name">${escapeHtml(c.name)}</div>
        </div>
      `;
    }

    return `
      <div class="card-item ${isUnowned ? 'is-unowned' : ''}" data-id="${c.id}" onclick="window.ucgApp.openCardModal(${c.id})">
        <div class="card-image-wrap">
          <div class="card-badge-status ${c.badge_class}">
            <span>${badgeIcon}</span> ${c.status_label}
          </div>
          <div class="card-badge-rarity ${rarityClass}">
            ${c.rarity}
          </div>
          ${imageContent}
          ${priceBar}
        </div>
        <div class="card-body">
          <div class="card-num-row">
            <span class="card-code">${escapeHtml(c.card_number)}</span>
            <span class="card-series-tag">${escapeHtml(c.series_code)}</span>
          </div>
          <div class="card-name-text" title="${escapeHtml(c.name)}">
            ${escapeHtml(c.name)}
          </div>
          <div class="card-footer">
            ${typeof c.excel_row === 'number' 
              ? `<span style="font-size: 11px; color: var(--text-sub);">行 #${c.excel_row}</span>`
              : `<span style="font-size: 10px; background: rgba(59,130,246,0.25); color: #93c5fd; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59,130,246,0.4); font-weight: 700;">公式追加</span>`
            }
            <button class="quick-status-btn" onclick="event.stopPropagation(); window.ucgApp.cycleCardStatus(${c.id});" title="ステータスを素早く切り替え">
              変更 ➔
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Render Table View
  function renderTable(cards) {
    if (!tableBody) return;
    const initialBatch = cards.slice(0, 150);
    tableBody.innerHTML = initialBatch.map(c => createTableRowHtml(c)).join('');

    if (cards.length > 150) {
      let offset = 150;
      const batchSize = 150;
      function loadNextTableBatch() {
        if (offset >= cards.length) return;
        const nextBatch = cards.slice(offset, offset + batchSize);
        const fragment = document.createRange().createContextualFragment(
          nextBatch.map(c => createTableRowHtml(c)).join('')
        );
        tableBody.appendChild(fragment);
        offset += batchSize;
        if (offset < cards.length) {
          requestAnimationFrame(loadNextTableBatch);
        }
      }
      requestAnimationFrame(loadNextTableBatch);
    }
  }

  function createTableRowHtml(c) {
    const isOwned = (c.status === 'owned' || c.status === 'owned_winner');
    let badgeIcon = '⚪️';
    if (isOwned) badgeIcon = c.status === 'owned_winner' ? '🏆' : '🟢';
    else if (c.status === 'transit') badgeIcon = '🟡';
    else if (c.status === 'watchlist') badgeIcon = '🟣';

    const rarityClass = `rarity-${c.rarity.replace(/[^a-zA-Z]/g, '')}`;
    const thumbSrc = c.thumbnail_url || c.image_url;
    const marketVal = c.market_price || 50;

    let diffText = '-';
    let diffClass = 'profit-neutral';
    if (c.price && typeof c.price === 'number') {
      const diff = marketVal - c.price;
      const diffPct = ((diff / c.price) * 100).toFixed(0);
      if (diff > 0) {
        diffText = `+¥${diff.toLocaleString()} (+${diffPct}%)`;
        diffClass = 'profit-positive';
      } else if (diff < 0) {
        diffText = `¥${diff.toLocaleString()} (${diffPct}%)`;
        diffClass = 'profit-negative';
      } else {
        diffText = `±0 (0%)`;
        diffClass = 'profit-neutral';
      }
    }

    return `
      <tr style="cursor: pointer;" onclick="window.ucgApp.openCardModal(${c.id})">
        <td>
          ${thumbSrc ? `<img src="${thumbSrc}" class="table-thumb" loading="lazy" alt="">` : `<div class="table-thumb" style="display:flex;align-items:center;justify-content:center;font-size:16px;">⚡️</div>`}
        </td>
        <td>
          <span style="font-weight: 700; color: var(--accent-blue);">${escapeHtml(c.card_number)}</span>
          ${typeof c.excel_row === 'number'
            ? `<div style="font-size: 11px; color: var(--text-sub);">行 #${c.excel_row}</div>`
            : `<div style="font-size: 10px; color: #93c5fd; font-weight: 700;">公式追加</div>`
          }
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(c.name)}</div>
          ${c.character_name ? `<div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(c.character_name)}</div>` : ''}
        </td>
        <td>
          <span class="card-badge-rarity ${rarityClass}" style="position: static; display: inline-block;">
            ${c.rarity}
          </span>
        </td>
        <td>
          <span class="card-badge-status ${c.badge_class}" style="position: static; display: inline-flex;" onclick="event.stopPropagation(); window.ucgApp.cycleCardStatus(${c.id});">
            <span>${badgeIcon}</span> ${c.status_label}
          </span>
        </td>
        <td style="font-weight: 700; color: ${c.price ? '#fef08a' : 'var(--text-sub)'};">
          ${c.price ? `¥${c.price.toLocaleString()}` : (c.target_price ? `<span style="color:#c084fc;">▶️ ¥${c.target_price.toLocaleString()}</span>` : '未記録')}
        </td>
        <td style="font-weight: 700; color: #6ee7b7;">
          ¥${marketVal.toLocaleString()}
        </td>
        <td style="font-weight: 700; font-size: 12px;" class="${diffClass}">
          ${diffText}
        </td>
        <td>
          <span style="font-size: 12px; color: var(--text-muted);">${escapeHtml(c.series_code)}</span>
        </td>
        <td style="font-size: 12px; color: var(--text-sub); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${escapeHtml(c.obtain || '-')}
        </td>
      </tr>
    `;
  }

  // Card Modal Handler
  function openCardModal(cardId) {
    const card = rawCards.find(c => c.id === cardId);
    if (!card) return;
    selectedCard = card;

    if (modalCardTitle) modalCardTitle.textContent = card.name || card.card_number;
    if (modalCardNumber) modalCardNumber.textContent = card.card_number;
    if (modalCardRarity) modalCardRarity.textContent = card.rarity;
    if (modalCardType) modalCardType.textContent = `${card.type_name || '基本'}${card.level ? ` (Lv.${card.level})` : ''}`;
    if (modalCardPrice) modalCardPrice.textContent = card.price ? `¥${card.price.toLocaleString()}` : (card.target_price ? `目標: ¥${card.target_price.toLocaleString()}` : '記録なし');
    
    const bpText = (card.battle_power_1 || card.battle_power_2 || card.battle_power_3)
      ? `${card.battle_power_1?.toLocaleString() || '-'} / ${card.battle_power_2?.toLocaleString() || '-'} / ${card.battle_power_3?.toLocaleString() || '-'}`
      : '-';
    if (modalCardBP) modalCardBP.textContent = bpText;

    if (modalCurrentStatus) {
      modalCurrentStatus.textContent = `${card.status_label} (Excel原本: ${card.status_raw || '未保有'})`;
      modalCurrentStatus.style.color = (card.status === 'owned' || card.status === 'owned_winner') ? '#10b981' : (card.status === 'transit' ? '#f59e0b' : '#94a3b8');
    }

    if (modalStatusSelect) {
      modalStatusSelect.value = card.status;
    }

    if (modalCardImg) {
      if (card.image_url) {
        modalCardImg.src = card.image_url;
        modalCardImg.style.display = 'block';
      } else {
        modalCardImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="300" height="420" fill="%231a233a"/><text x="50%" y="45%" text-anchor="middle" fill="%233b82f6" font-size="20" font-weight="bold">No Image Available</text><text x="50%" y="55%" text-anchor="middle" fill="%2394a3b8" font-size="14">公式未登録プロモ</text></svg>';
        modalCardImg.style.display = 'block';
      }
    }

    // Effect
    if (modalCardEffect) {
      if (card.effect) {
        modalCardEffect.textContent = card.effect;
        if (modalEffectSection) modalEffectSection.style.display = 'flex';
      } else {
        if (modalEffectSection) modalEffectSection.style.display = 'none';
      }
    }

    // Flavor
    if (modalCardFlavor) {
      if (card.flavor_text) {
        modalCardFlavor.textContent = card.flavor_text;
        if (modalFlavorSection) modalFlavorSection.style.display = 'flex';
      } else {
        if (modalFlavorSection) modalFlavorSection.style.display = 'none';
      }
    }

    // Obtain
    if (modalCardObtain) {
      modalCardObtain.textContent = card.obtain || '通常入手 / 入手方法の記載なし';
    }

    // Illustrator
    if (modalCardIllust) {
      if (card.illustrator) {
        modalCardIllust.textContent = card.illustrator;
        if (modalIllustSection) modalIllustSection.style.display = 'block';
      } else {
        if (modalIllustSection) modalIllustSection.style.display = 'none';
      }
    }

    // Financial Comparison
    const marketVal = card.market_price || 50;
    if (modalInputPrice) modalInputPrice.value = (card.price !== null && card.price !== undefined) ? card.price : '';
    if (modalCardPriceRaw) {
      modalCardPriceRaw.textContent = `Excel原本: ${card.status_raw || '未記録'}${card.price ? ` (${card.price}円)` : ''}`;
    }
    if (modalCardMarketPrice) {
      modalCardMarketPrice.textContent = `¥${marketVal.toLocaleString()}`;
    }

    if (modalCardProfit && modalCardProfitRate) {
      if (card.price && typeof card.price === 'number') {
        const diff = marketVal - card.price;
        const diffPct = ((diff / card.price) * 100).toFixed(1);
        const isPos = diff >= 0;
        modalCardProfit.textContent = `${isPos ? '+' : ''}¥${diff.toLocaleString()}`;
        modalCardProfit.className = `modal-price-val-large ${isPos ? 'profit-positive' : 'profit-negative'}`;
        modalCardProfitRate.textContent = `${isPos ? '+' : ''}${diffPct}% 評価損益`;
        modalCardProfitRate.className = isPos ? 'profit-positive' : 'profit-negative';
      } else {
        modalCardProfit.textContent = '-';
        modalCardProfit.className = 'modal-price-val-large profit-neutral';
        modalCardProfitRate.textContent = '購入価格未入力';
        modalCardProfitRate.className = 'profit-neutral';
      }
    }

    cardModal.classList.add('open');
  }

  function closeCardModal() {
    if (cardModal) cardModal.classList.remove('open');
    selectedCard = null;
  }

  function saveCardPrice(card, newPriceVal) {
    let parsedPrice = null;
    if (newPriceVal !== '' && newPriceVal !== null && !isNaN(Number(newPriceVal))) {
      parsedPrice = Math.round(Number(newPriceVal));
    }

    card.price = parsedPrice;
    if (parsedPrice !== null && parsedPrice > 0) {
      card.price_diff = (card.market_price || 50) - parsedPrice;
      card.price_diff_percent = Number(((card.price_diff / parsedPrice) * 100).toFixed(1));
    } else {
      card.price_diff = null;
      card.price_diff_percent = null;
    }

    userOverrides[card.id] = {
      ...userOverrides[card.id],
      price: parsedPrice
    };

    saveUserOverrides();
    updateOverallStats();
    applyFiltersAndRender();
    if (selectedCard && selectedCard.id === card.id) {
      openCardModal(card.id);
    }
    showToast(`「${card.name || card.card_number}」の購入金額を【${parsedPrice !== null ? '¥' + parsedPrice.toLocaleString() : '未記録'}】に更新しました`);
  }

  // Cycle status: unowned ➔ transit ➔ owned ➔ unowned
  function cycleCardStatus(cardId) {
    const card = rawCards.find(c => c.id === cardId);
    if (!card) return;

    let nextStatus = 'owned';
    if (card.status === 'unowned' || card.status === 'watchlist' || card.status === 'winner_target') {
      nextStatus = 'transit';
    } else if (card.status === 'transit') {
      nextStatus = 'owned';
    } else {
      nextStatus = 'unowned';
    }

    setCardStatus(card, nextStatus);
  }

  function setCardStatus(card, newStatus) {
    card.status = newStatus;
    card.status_label = getStatusLabel(newStatus);
    card.badge_class = getBadgeClass(newStatus);

    userOverrides[card.id] = {
      ...userOverrides[card.id],
      status: newStatus
    };

    saveUserOverrides();
    updateOverallStats();
    renderSeriesBreakdown();
    applyFiltersAndRender();
    showToast(`「${card.name || card.card_number}」のステータスを【${card.status_label}】に変更しました`);
  }

  // Export updated data to CSV / JSON
  function exportData() {
    const format = confirm('現在のデータをJSON形式でエクスポートしますか？\n（キャンセルを押すとCSV形式でエクスポートします）');
    
    if (format) {
      // JSON
      const blob = new Blob([JSON.stringify(rawCards, null, 2)], { type: 'application/json;charset=utf-8;' });
      downloadBlob(blob, 'ウルトラマンカードゲーム_コレクション.json');
    } else {
      // CSV
      let csv = 'Excel行番号,カード番号,カード名,レアリティ,シリーズ,ステータス,購入金額,入手方法\n';
      rawCards.forEach(c => {
        csv += `"${c.excel_row}","${c.card_number}","${(c.name || '').replace(/"/g, '""')}","${c.rarity}","${c.series_code}","${c.status_label}","${c.price || ''}","${(c.obtain || '').replace(/"/g, '""')}"\n`;
      });
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM for Excel
      const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, 'ウルトラマンカードゲーム_コレクション.csv');
    }
    showToast('エクスポートが完了しました');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function resetAllOverrides() {
    if (!confirm('ローカルで行ったステータス変更をすべてリセットし、Excel原本の状態に戻しますか？')) {
      return;
    }
    userOverrides = {};
    saveUserOverrides();
    // reload data
    rawCards.forEach(card => {
      // restore original status
      const status_str = card.status_raw || '';
      if ('▶️' in status_str) {
        card.status = 'watchlist';
      } else if ('◯' in status_str) {
        card.status = 'transit';
      } else if (['●', '⚫︎', '●❓', '⚫︎❓'].some(sym => status_str.includes(sym))) {
        card.status = status_str.includes('Winner') ? 'owned_winner' : 'owned';
      } else if (status_str.includes('Winner')) {
        card.status = 'winner_target';
      } else {
        card.status = 'unowned';
      }
      card.status_label = getStatusLabel(card.status);
      card.badge_class = getBadgeClass(card.status);
    });

    updateOverallStats();
    renderSeriesBreakdown();
    applyFiltersAndRender();
    showToast('Excel原本の状態にリセットしました');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search input
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const val = e.target.value;
        if (searchClear) searchClear.classList.toggle('visible', val.length > 0);
        searchTimeout = setTimeout(() => {
          filters.search = val;
          applyFiltersAndRender();
        }, 200);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchClear.classList.remove('visible');
        filters.search = '';
        applyFiltersAndRender();
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        filters.sort = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Color mode toggle
    if (colorToggleBtn) {
      colorToggleBtn.addEventListener('click', () => {
        manualColorMode = !manualColorMode;
        applyFiltersAndRender();
        showToast(manualColorMode ? '未保有カードをカラー表示にしました' : '未保有カードのカラー表示を解除しました');
      });
    }

    // View mode switch
    if (viewGridBtn) {
      viewGridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        viewGridBtn.classList.add('active');
        if (viewTableBtn) viewTableBtn.classList.remove('active');
        applyFiltersAndRender();
      });
    }

    if (viewTableBtn) {
      viewTableBtn.addEventListener('click', () => {
        viewMode = 'table';
        viewTableBtn.classList.add('active');
        if (viewGridBtn) viewGridBtn.classList.remove('active');
        applyFiltersAndRender();
      });
    }

    // Status tabs
    if (statusTabs) {
      statusTabs.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          statusTabs.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          filters.status = tab.dataset.status;
          applyFiltersAndRender();
        });
      });
    }

    // Rarity pills
    if (rarityPills) {
      rarityPills.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          rarityPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          filters.rarity = pill.dataset.rarity;
          applyFiltersAndRender();
        });
      });
    }

    // Breakdown Toggle
    if (breakdownToggle) {
      breakdownToggle.addEventListener('click', () => {
        const isHidden = seriesChipsContainer.style.display === 'none';
        seriesChipsContainer.style.display = isHidden ? 'flex' : 'none';
        if (breakdownIcon) breakdownIcon.classList.toggle('expanded', isHidden);
      });
    }

    // Reset Filters Button
    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        filters.status = 'all';
        filters.series = 'all';
        filters.rarity = 'all';
        filters.search = '';
        searchInput.value = '';
        searchClear.classList.remove('visible');

        statusTabs.querySelectorAll('.status-tab').forEach(t => t.classList.toggle('active', t.dataset.status === 'all'));
        rarityPills.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.rarity === 'all'));
        if (seriesChipsContainer) {
          seriesChipsContainer.querySelectorAll('.breakdown-chip').forEach(c => c.classList.toggle('active', c.dataset.series === 'all'));
        }

        applyFiltersAndRender();
      });
    }

    // Modal Events
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCardModal);
    if (cardModal) {
      cardModal.addEventListener('click', (e) => {
        if (e.target === cardModal) closeCardModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cardModal && cardModal.classList.contains('open')) {
        closeCardModal();
      }
    });

    if (modalStatusSelect) {
      modalStatusSelect.addEventListener('change', (e) => {
        if (selectedCard) {
          setCardStatus(selectedCard, e.target.value);
          if (modalCurrentStatus) {
            modalCurrentStatus.textContent = `${selectedCard.status_label} (Excel原本: ${selectedCard.status_raw || '未保有'})`;
            modalCurrentStatus.style.color = (selectedCard.status === 'owned' || selectedCard.status === 'owned_winner') ? '#10b981' : (selectedCard.status === 'transit' ? '#f59e0b' : '#94a3b8');
          }
        }
      });
    }

    if (btnSavePrice) {
      btnSavePrice.addEventListener('click', () => {
        if (selectedCard && modalInputPrice) {
          saveCardPrice(selectedCard, modalInputPrice.value.trim());
        }
      });
    }
    if (modalInputPrice) {
      modalInputPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (selectedCard) saveCardPrice(selectedCard, modalInputPrice.value.trim());
        }
      });
    }

    // Export & Reset All
    if (btnExport) btnExport.addEventListener('click', exportData);
    if (btnResetAll) btnResetAll.addEventListener('click', resetAllOverrides);

    // Stat card quick filters
    const statCardOwned = document.getElementById('statCardOwned');
    if (statCardOwned) {
      statCardOwned.style.cursor = 'pointer';
      statCardOwned.addEventListener('click', () => {
        statusTabs.querySelector('[data-status="owned"]').click();
      });
    }

    const statCardTransit = document.getElementById('statCardTransit');
    if (statCardTransit) {
      statCardTransit.style.cursor = 'pointer';
      statCardTransit.addEventListener('click', () => {
        statusTabs.querySelector('[data-status="transit"]').click();
      });
    }

    const statCardUnowned = document.getElementById('statCardUnowned');
    if (statCardUnowned) {
      statCardUnowned.style.cursor = 'pointer';
      statCardUnowned.addEventListener('click', () => {
        statusTabs.querySelector('[data-status="unowned"]').click();
      });
    }
  }

  // Expose global methods for inline HTML onclick handlers
  window.ucgApp = {
    openCardModal,
    closeCardModal,
    cycleCardStatus,
    setCardStatus,
    saveCardPrice,
    exportData,
    resetAllOverrides
  };

  // Init on DOM ready or immediate if already loaded
  function boot() {
    try {
      setupEventListeners();
    } catch (err) {
      console.error('Error during setupEventListeners:', err);
    }
    try {
      initData();
    } catch (err) {
      console.error('Error during initData:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
