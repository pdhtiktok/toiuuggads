/* --- Data Templates --- */
const TEMPLATES = {
    foundation: [
        {
            group: "Tracking & Analytics",
            items: [
                { id: "f_ga4", title: "Link Google Analytics 4", desc: "Kết nối tài khoản GA4 để đồng bộ dữ liệu." },
                { id: "f_conv", title: "Cài đặt Conversion Tracking", desc: "Thiết lập các hành động chuyển đổi chính (Purchase, Lead)." },
                { id: "f_rmkt", title: "Cài đặt Remarketing Tag", desc: "Gắn thẻ tiếp thị lại toàn trang." }
            ]
        },
        {
            group: "Account Settings",
            items: [
                { id: "f_pay", title: "Payment Setup", desc: "Thêm thẻ visa/master, kiểm tra info xuất hóa đơn." },
                { id: "f_link", title: "Link Services", desc: "Merchant Center (nếu có), YouTube Channel." }
            ]
        }
    ],
    search: [
        {
            group: "Setup Phase",
            items: [
                { id: "s_kw", title: "Keyword Research", desc: "Bộ từ khóa chia theo topic, match types phù hợp." },
                { id: "s_ads", title: "Responsive Search Ads", desc: "Tối thiểu 2 ads/group, Ad Strength 'Good' trở lên." },
                { id: "s_ext", title: "Extensions (Assets)", desc: "Sitelinks, Callouts, Structured Snippets." }
            ]
        },
        {
            group: "Optimization",
            items: [
                { id: "s_neg", title: "Negative Keywords", desc: "Loại trừ từ khóa không liên quan." },
                { id: "s_bid", title: "Bidding Strategy", desc: "Kiểm tra giá thầu và ngân sách hàng ngày." }
            ]
        }
    ],
    gdn: [
        {
            group: "Targeting",
            items: [
                { id: "g_aud", title: "Audience Segments", desc: "Custom segments, In-market, Affinity." },
                { id: "g_exc", title: "Exclusions", desc: "Loại trừ App categories, nội dung nhạy cảm." }
            ]
        },
        {
            group: "Creatives",
            items: [
                { id: "g_img", title: "Responsive Display Ads", desc: "Đủ size hình ảnh, logo, headline." }
            ]
        }
    ],
    video: [
        { group: "Video Setup", items: [{ id: "v_vid", title: "Video Creative", desc: "Video đúng chuẩn YouTube Ads." }] }
    ],
    shopping: [
        { group: "Feed", items: [{ id: "sh_feed", title: "Merchant Center Feed", desc: "Feed không bị lỗi, được approve." }] }
    ]
};

/* --- State Management --- */
const STORAGE_KEY = 'gads_manager_pro_v2';
let data = {
    accounts: [], // { id, name, foundation: {}, campaigns: [] }
    selectedAccountId: null
};

// --- Initialization ---
function init() {
    loadData();
    renderSidebar();

    // Check if account was selected
    if (data.selectedAccountId && data.accounts.find(a => a.id === data.selectedAccountId)) {
        selectAccount(data.selectedAccountId);
    } else {
        showEmptyState();
    }
}

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        data = JSON.parse(raw);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderSidebar(); // Update sidebar stats if things change
}

function hardReset() {
    if (confirm("Xóa toàn bộ dữ liệu ứng dụng? Hành động này không thể hoàn tác.")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

/* --- Logic Controller --- */

// Account Management
function createAccount() {
    const nameInput = document.getElementById('newAccountName');
    const name = nameInput.value.trim();
    if (!name) return alert('Vui lòng nhập tên tài khoản');

    const newAccount = {
        id: 'acc_' + Date.now(),
        name: name,
        foundation: {}, // Stores check status key: { checked: bool, note: str }
        campaigns: []   // Array of campaign objects
    };

    data.accounts.push(newAccount);
    saveData();
    closeModal('addAccountModal');
    nameInput.value = '';

    selectAccount(newAccount.id);
}

function selectAccount(id) {
    data.selectedAccountId = id;
    saveData();

    const account = data.accounts.find(a => a.id === id);
    if (!account) return;

    // UI Updates
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('checklist-view').classList.add('hidden');

    document.getElementById('current-account-name').innerText = account.name;
    document.getElementById('account-stats').classList.remove('hidden');

    // Highlight sidebar
    document.querySelectorAll('.account-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-id="${id}"]`)?.classList.add('active');

    renderDashboard();
}

// Campaign Management
function createCampaign() {
    const nameInput = document.getElementById('newCampName');
    const typeInput = document.getElementById('newCampType');

    if (!nameInput.value.trim()) return alert('Vui lòng nhập tên chiến dịch');

    const account = data.accounts.find(a => a.id === data.selectedAccountId);
    if (!account) return;

    const newCamp = {
        id: 'camp_' + Date.now(),
        name: nameInput.value.trim(),
        type: typeInput.value,
        checks: {} // Stores status
    };

    account.campaigns.push(newCamp);
    saveData();
    closeModal('addCampaignModal');
    nameInput.value = '';

    renderDashboard();
}

/* --- Rendering --- */

function renderSidebar() {
    const list = document.getElementById('account-list');
    list.innerHTML = data.accounts.map(acc => `
        <div class="account-item ${data.selectedAccountId === acc.id ? 'active' : ''}" 
             data-id="${acc.id}" onclick="selectAccount('${acc.id}')">
            <i class="fa-solid fa-briefcase"></i>
            <span>${acc.name}</span>
        </div>
    `).join('');
}

function renderDashboard() {
    const account = data.accounts.find(a => a.id === data.selectedAccountId);
    if (!account) return;

    // Render Foundation Card Status
    const fStatus = calculateProgress(TEMPLATES.foundation, account.foundation);
    const fBadge = document.getElementById('foundation-badge');
    fBadge.innerText = fStatus.percent + '% Completed';
    fBadge.className = `status-badge ${fStatus.percent === 100 ? 'complete' : ''}`;

    // Render Campaigns
    const campList = document.getElementById('campaign-list');
    campList.innerHTML = account.campaigns.map(camp => {
        const template = TEMPLATES[camp.type] || [];
        const status = calculateProgress(template, camp.checks);
        return `
            <div class="camp-card" onclick="viewCampaign('${camp.id}')">
                <div class="camp-header">
                    <h4>${camp.name}</h4>
                    <span class="camp-type">${camp.type}</span>
                </div>
                <div class="camp-progress">
                    <div class="bar" style="width: ${status.percent}%"></div>
                </div>
                <div class="status-badge" style="margin-top: 10px; background: transparent; padding: 0;">
                    ${status.checked}/${status.total} Tasks
                </div>
            </div>
        `;
    }).join('');
}

/* --- Checklist Logic --- */

let currentContext = { type: null, id: null }; // type: 'foundation' or 'campaign', id: campId

function viewFoundation() {
    currentContext = { type: 'foundation', id: null };
    openChecklistView("Foundation Setup", "Thiết lập chung cho tài khoản", TEMPLATES.foundation);
}

function viewCampaign(campId) {
    const account = data.accounts.find(a => a.id === data.selectedAccountId);
    const camp = account.campaigns.find(c => c.id === campId);

    currentContext = { type: 'campaign', id: campId };
    openChecklistView(camp.name, `Chiến dịch ${camp.type.toUpperCase()}`, TEMPLATES[camp.type]);
}

function openChecklistView(title, subtitle, template) {
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('checklist-view').classList.remove('hidden');
    document.querySelector('.separator').classList.remove('hidden');

    const viewName = document.getElementById('current-view-name');
    viewName.innerText = title;

    document.getElementById('checklist-title').innerText = title;
    document.getElementById('checklist-subtitle').innerText = subtitle;

    renderChecklistItems(template);
}

function backToDashboard() {
    document.getElementById('checklist-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.querySelector('.separator').classList.add('hidden');
    document.getElementById('current-view-name').innerText = "Dashboard";
    renderDashboard(); // Refresh stats
}

function renderChecklistItems(template) {
    const container = document.getElementById('checklist-items-container');
    const account = data.accounts.find(a => a.id === data.selectedAccountId);

    // Determine where to get data from
    let storageTarget;
    if (currentContext.type === 'foundation') {
        storageTarget = account.foundation;
    } else {
        const camp = account.campaigns.find(c => c.id === currentContext.id);
        storageTarget = camp.checks;
    }

    // Render
    container.innerHTML = template.map(group => `
        <div class="check-group">
            <div class="check-group-title">${group.group}</div>
            ${group.items.map(item => {
        const state = storageTarget[item.id] || {};
        return `
                    <div class="task-item ${state.checked ? 'checked' : ''}" id="task-${item.id}">
                        <input type="checkbox" class="task-checkbox" 
                            onchange="toggleTask('${item.id}', this.checked)"
                            ${state.checked ? 'checked' : ''}>
                        <div class="task-content">
                            <div class="task-title">${item.title}</div>
                            <div class="task-desc">${item.desc}</div>
                            <textarea class="task-note" 
                                placeholder="Ghi chú..." 
                                oninput="saveTaskNote('${item.id}', this.value)">${state.note || ''}</textarea>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `).join('');

    updateViewProgress(template, storageTarget);
}

function toggleTask(taskId, isChecked) {
    const account = data.accounts.find(a => a.id === data.selectedAccountId);
    let storageTarget;

    if (currentContext.type === 'foundation') {
        storageTarget = account.foundation;
    } else {
        const camp = account.campaigns.find(c => c.id === currentContext.id);
        storageTarget = camp.checks;
    }

    if (!storageTarget[taskId]) storageTarget[taskId] = {};
    storageTarget[taskId].checked = isChecked;

    // UI Update
    document.getElementById(`task-${taskId}`).classList.toggle('checked', isChecked);

    saveData();

    // Update progress circle
    // Re-calculating using current scope template
    // We need to pass the template to this function or store it globally.
    // For simplicity, we just reload the view's progress bar.
    // Ideally we shouldn't re-render everything.

    // Hack: Find template again
    let template;
    if (currentContext.type === 'foundation') template = TEMPLATES.foundation;
    else template = TEMPLATES[account.campaigns.find(c => c.id === currentContext.id).type];

    updateViewProgress(template, storageTarget);
}

function saveTaskNote(taskId, note) {
    const account = data.accounts.find(a => a.id === data.selectedAccountId);
    let storageTarget;

    if (currentContext.type === 'foundation') storageTarget = account.foundation;
    else storageTarget = account.campaigns.find(c => c.id === currentContext.id).checks;

    if (!storageTarget[taskId]) storageTarget[taskId] = {};
    storageTarget[taskId].note = note;
    saveData(); // Debouncing recommended for prod
}

/* --- Helpers --- */

function calculateProgress(template, storage) {
    let total = 0;
    let checked = 0;
    template.forEach(group => {
        group.items.forEach(item => {
            total++;
            if (storage[item.id]?.checked) checked++;
        });
    });
    return {
        total,
        checked,
        percent: total === 0 ? 0 : Math.round((checked / total) * 100)
    };
}

function updateViewProgress(template, storage) {
    const status = calculateProgress(template, storage);
    document.getElementById('view-progress').innerText = `${status.percent}%`;
    document.querySelector('.mini-progress .bar').style.width = `${status.percent}%`; // Top bar
}

// Modal Utils
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
window.onclick = function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
}

function showEmptyState() {
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('checklist-view').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
}

// Start
init();
