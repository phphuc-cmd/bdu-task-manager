/* ==========================================================
   DỮ LIỆU LOCALSTORAGE
   ========================================================== */
let staffList = JSON.parse(localStorage.getItem('bdu_staff_v3')) || [
  { id: 1, code: "BDU-001", name: "ThS. Nguyễn Văn A", group: "Giảng viên", degree: "Thạc sĩ", role: "Giảng viên cơ hữu", phone: "0901234567", email: "nva@bdu.edu.vn", taskDesc: "Giảng dạy & NCKH" },
  { id: 2, code: "BDU-002", name: "Đặng Thị B", group: "Nhân viên", degree: "Cử nhân", role: "Thư ký Khoa", phone: "0902345678", email: "dtb@bdu.edu.vn", taskDesc: "Quản lý giáo vụ" },
  { id: 3, code: "BDU-003", name: "Lê Văn C", group: "Cộng tác viên", degree: "Cử nhân", role: "Trợ giảng", phone: "0903456789", email: "lvc@bdu.edu.vn", taskDesc: "Hỗ trợ chấm bài" }
];

let tasks = JSON.parse(localStorage.getItem('bdu_tasks_v3')) || [
  { id: 1, targetRole: "Giảng viên", cycle: "Tuần", date: "2026-08-20", deadline: "2026-08-24", staff: "ThS. Nguyễn Văn A", content: "Soạn bài giảng Tiếng Anh Chuyên ngành", hours: 4, status: "Hoàn thành" },
  { id: 2, targetRole: "Nhân viên", cycle: "Tháng", date: "2026-08-18", deadline: "2026-08-29", staff: "Đặng Thị B", content: "Tổng hợp thời khóa biểu học kỳ mới", hours: 6, status: "Đang thực hiện" },
  { id: 3, targetRole: "Đoàn Hội", cycle: "Tuần", date: "2026-08-19", deadline: "2026-08-22", staff: "BCH Đoàn Khoa", content: "Tổ chức Cuộc thi Rung Chuông Vàng Tiếng Anh", hours: 8, status: "Hoàn thành" },
  { id: 4, targetRole: "Cộng tác viên", cycle: "Tuần", date: "2026-08-12", deadline: "2026-08-19", staff: "Lê Văn C", content: "Hỗ trợ coi thi giữa kỳ lớp TA101", hours: 3, status: "Chưa hoàn thành" }
];

let currentActiveKey = 'dashboard';
let pendingAssignStaff = null;
let pendingKeepSearch = false;

function saveData() {
  localStorage.setItem('bdu_staff_v3', JSON.stringify(staffList));
  localStorage.setItem('bdu_tasks_v3', JSON.stringify(tasks));
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

function isOverdue(t) {
  return !!t.deadline && t.deadline < todayStr() && t.status !== 'Hoàn thành';
}

function effectiveStatus(t) { return isOverdue(t) ? 'Quá hạn' : t.status; }

function statusBadgeClass(effStatus) {
  if (effStatus === 'Hoàn thành') return 'bg-completed';
  if (effStatus === 'Đang thực hiện') return 'bg-doing';
  if (effStatus === 'Quá hạn') return 'bg-overdue';
  return 'bg-pending';
}

function statusIcon(effStatus) {
  if (effStatus === 'Hoàn thành') return '✅';
  if (effStatus === 'Đang thực hiện') return '⏳';
  if (effStatus === 'Quá hạn') return '⚠️';
  return '⏸';
}

function toast(msg, type='success') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⛔' : 'ℹ️';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s ease'; setTimeout(() => el.remove(), 300); }, 3200);
}

function toggleSubmenu(btn) { btn.parentElement.classList.toggle('open'); }

function showPage(pageKey, element = null, customTitle = null) {
  currentActiveKey = pageKey;
  document.querySelectorAll('.nav-item, .nav-sub-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));

  const titleEl = document.getElementById('pageTitle');
  const breadcrumbEl = document.getElementById('currentBreadcrumb');

  if (pageKey === 'dashboard') {
    document.getElementById('dashboard')?.classList.add('active-page');
    if(titleEl) titleEl.innerText = "Dashboard tổng quan"; 
    if(breadcrumbEl) breadcrumbEl.innerText = "Dashboard";
  } else if (pageKey === 'staff') {
    document.getElementById('staff')?.classList.add('active-page');
    if(titleEl) titleEl.innerText = "Danh mục nhân sự"; 
    if(breadcrumbEl) breadcrumbEl.innerText = "Quản lý Nhân sự";
  } else if (pageKey === 'principal') {
    document.getElementById('principal')?.classList.add('active-page');
    if(titleEl) titleEl.innerText = "Báo cáo trình Hiệu trưởng"; 
    if(breadcrumbEl) breadcrumbEl.innerText = "Báo cáo Ban Giám Hiệu";
  } else {
    document.getElementById('generic-plan-page')?.classList.add('active-page');
    const t = customTitle || "Kế hoạch công việc";
    if(titleEl) titleEl.innerText = t; 
    if(breadcrumbEl) breadcrumbEl.innerText = t;
    const planTitle = document.getElementById('planPageTitle');
    if(planTitle) planTitle.innerText = t;
    const searchBox = document.getElementById('searchTask');
    if (searchBox && !pendingKeepSearch) searchBox.value = '';
    renderPlanPage();
  }
  renderAllPages();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderAllPages() {
  renderDashboard();
  renderStaffPage();
  renderPrincipalReport();
  updateStaffBadge();
  updateStaffDatalist();
  updateOverdueAlert();
}

function updateStaffBadge() {
  const badge = document.getElementById('totalStaffBadge');
  if (badge) badge.innerText = staffList.length;
}

function updateStaffDatalist() {
  const dl = document.getElementById('staffNameList');
  if (dl) dl.innerHTML = staffList.map(s => `<option value="${s.name}">`).join('');
}

function updateOverdueAlert() {
  const overdue = tasks.filter(isOverdue);
  const bell = document.getElementById('bellDot');
  const banner = document.getElementById('overdueBanner');
  const text = document.getElementById('overdueBannerText');
  if (overdue.length > 0) {
    if (bell) bell.style.display = 'block';
    if (banner) banner.style.display = 'flex';
    if (text) text.innerText = `Hệ thống phát hiện ${overdue.length} công việc đã quá hạn hoàn thành. Vui lòng xử lý sớm.`;
  } else {
    if (bell) bell.style.display = 'none';
    if (banner) banner.style.display = 'none';
  }
}

function jumpToOverdue() {
  document.getElementById('overdueSection')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function renderDashboard() {
  const selectedCycle = document.getElementById('dashCycleFilter')?.value || 'ALL';
  const selectedRole = document.getElementById('dashRoleFilter')?.value || 'ALL';

  const filtered = tasks.filter(t => {
    const matchCycle = (selectedCycle === 'ALL') || (t.cycle === selectedCycle);
    const matchRole = (selectedRole === 'ALL') || (t.targetRole === selectedRole);
    return matchCycle && matchRole;
  });

  const total = filtered.length;
  const completed = filtered.filter(t => t.status === 'Hoàn thành').length;
  const doing = filtered.filter(t => t.status === 'Đang thực hiện' && !isOverdue(t)).length;
  const overdue = filtered.filter(isOverdue).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = total;
  if (document.getElementById('statCompleted')) document.getElementById('statCompleted').innerText = completed;
  if (document.getElementById('statDoing')) document.getElementById('statDoing').innerText = doing;
  if (document.getElementById('statOverdue')) document.getElementById('statOverdue').innerText = overdue;
  if (document.getElementById('statPercent')) document.getElementById('statPercent').innerText = percent + '%';
  if (document.getElementById('pipelinePercent')) document.getElementById('pipelinePercent').innerText = percent + '% hoàn tất';

  const recentBody = document.getElementById('recentTasks');
  if (recentBody) {
    const sorted = [...filtered].sort((a,b) => (b.date||'').localeCompare(a.date||''));
    recentBody.innerHTML = sorted.slice(0, 6).map(t => {
      const eff = effectiveStatus(t);
      return `<tr>
        <td>${fmtDate(t.date)}</td>
        <td><span class="badge">${t.targetRole} · ${t.cycle}</span></td>
        <td><strong>${t.staff}</strong></td>
        <td>${t.content}</td>
        <td>${t.hours}h</td>
        <td>${t.deadline ? fmtDate(t.deadline) : '—'}</td>
        <td><span class="badge-status ${statusBadgeClass(eff)}">${statusIcon(eff)} ${eff}</span></td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--ink-soft);">Chưa có dữ liệu công việc phù hợp.</td></tr>`;
  }

  initCharts(filtered);
}

function fmtDate(d) {
  if (!d) return '—';
  const [y,m,dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

function renderPlanPage() {
  const key = currentActiveKey;
  if (!key.startsWith('plan-') && !key.startsWith('assign-') && !key.startsWith('track-')) return;

  const parts = key.split('-');
  const roleMap = { gv: 'Giảng viên', nv: 'Nhân viên', ctv: 'Cộng tác viên', dh: 'Đoàn Hội' };
  const cycleMap = { all: 'Tất cả', week: 'Tuần', month: 'Tháng', quarter: 'Quý', year: 'Năm' };
  const targetRole = roleMap[parts[1]];
  const targetCycle = key.startsWith('plan-') ? cycleMap[parts[2]] : 'Tất cả';

  const keyword = (document.getElementById('searchTask')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('filterTaskStatus')?.value || 'ALL';

  const filtered = tasks.filter(t => {
    const eff = effectiveStatus(t);
    const matchRole = t.targetRole === targetRole;
    const matchCycle = (targetCycle === 'Tất cả') || (t.cycle === targetCycle);
    const matchSearch = t.content.toLowerCase().includes(keyword) || t.staff.toLowerCase().includes(keyword);
    const matchStatus = (statusFilter === 'ALL') || (eff === statusFilter);
    return matchRole && matchCycle && matchSearch && matchStatus;
  }).sort((a,b) => (a.deadline||'9999').localeCompare(b.deadline||'9999'));

  const tbody = document.getElementById('planTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:22px;color:var(--ink-soft);">Không tìm thấy dữ liệu công việc phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    const eff = effectiveStatus(t);
    return `<tr>
      <td>${fmtDate(t.date)}</td>
      <td><strong>${t.staff}</strong></td>
      <td><span class="badge">${t.targetRole} · ${t.cycle}</span></td>
      <td>${t.content}</td>
      <td><strong>${t.hours}h</strong></td>
      <td>${t.deadline ? fmtDate(t.deadline) : '—'}</td>
      <td><span class="badge-status ${statusBadgeClass(eff)}">${statusIcon(eff)} ${eff}</span></td>
      <td>
        <button class="btn-secondary" onclick="openTaskModal(${t.id})">Sửa</button>
        <button class="btn-danger-ghost" onclick="deleteTask(${t.id})">Xóa</button>
      </td>
    </tr>`;
  }).join('');
}

/* HIỂN THỊ DANH SÁCH NHÂN SỰ VÀ SỰ KIỆN CLICK XEM CHI TIẾT */
function renderStaffPage() {
  const grid = document.getElementById('staffGrid');
  if (!grid) return;
  const keyword = (document.getElementById('searchStaff')?.value || '').toLowerCase();
  const groupFilter = document.getElementById('filterStaffGroup')?.value || 'ALL';

  const filtered = staffList.filter(s => {
    const matchSearch = (s.name || '').toLowerCase().includes(keyword) || 
                        (s.code || '').toLowerCase().includes(keyword) || 
                        (s.role || '').toLowerCase().includes(keyword);
    const matchGroup = (groupFilter === 'ALL') || (s.group === groupFilter);
    return matchSearch && matchGroup;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--ink-soft);">Không tìm thấy nhân sự phù hợp.</div>`;
    return;
  }

  const badgeClass = g => g === 'Giảng viên' ? 'badge-gv' : g === 'Nhân viên' ? 'badge-nv' : 'badge-ctv';
  const initials = n => (n || 'NV').replace(/^(ThS\.|TS\.|PGS\.|GS\.)\s*/, '').trim().split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase();

  grid.innerHTML = filtered.map(s => {
    const activeCount = tasks.filter(t => t.staff === s.name && t.status !== 'Hoàn thành').length;
    return `<div class="staff-card">
      <div onclick="viewStaffDetail(${s.id})" style="cursor: pointer;" title="Bấm để xem chi tiết thông tin">
        <div class="staff-top">
          <div class="staff-avatar">${initials(s.name)}</div>
          <div style="flex:1;">
            <div style="font-size: 0.75rem; color: var(--ink-soft); font-weight: 600;">${s.code ? 'Mã: ' + s.code : ''}</div>
            <div class="staff-name">${s.name}</div>
            <div class="staff-role">${s.degree ? s.degree + ' - ' : ''}${s.role}</div>
          </div>
          <span class="badge ${badgeClass(s.group)}">${s.group}</span>
        </div>
      </div>
      <div class="staff-foot">
        <span style="font-size:0.76rem;color:var(--ink-soft);">${activeCount} việc đang xử lý</span>
        <div style="display:flex;gap:4px;align-items:center;">
          <button class="icon-btn" onclick="viewStaffDetail(${s.id})" title="Xem/Sửa chi tiết">👁️</button>
          <button class="btn-table btn-assign" onclick="openAssignModal('${s.name.replace(/'/g,"\\'")}')">➕ Giao việc</button>
          <button class="btn-table btn-track" onclick="trackStaff('${s.name.replace(/'/g,"\\'")}','${s.group}')">📊 Tiến độ</button>
          <button class="icon-btn" onclick="deleteStaff(${s.id})" title="Xóa">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* BẬT POPUP XEM & SỬA THÔNG TIN NHÂN SỰ */
function viewStaffDetail(id) {
  const staff = staffList.find(s => s.id === id);
  if (!staff) return;

  if (document.getElementById('staffCode')) document.getElementById('staffCode').value = staff.code || '';
  if (document.getElementById('staffName')) document.getElementById('staffName').value = staff.name || '';
  if (document.getElementById('staffGroup')) document.getElementById('staffGroup').value = staff.group || 'Giảng viên';
  if (document.getElementById('staffDegree')) document.getElementById('staffDegree').value = staff.degree || '';
  if (document.getElementById('staffRole')) document.getElementById('staffRole').value = staff.role || '';
  if (document.getElementById('staffPhone')) document.getElementById('staffPhone').value = staff.phone || '';
  if (document.getElementById('staffEmail')) document.getElementById('staffEmail').value = staff.email || '';
  if (document.getElementById('staffTaskDesc')) document.getElementById('staffTaskDesc').value = staff.taskDesc || '';

  const title = document.querySelector('#staffModal .modal-header h3');
  if (title) title.innerText = 'Chi tiết & Chỉnh sửa nhân sự';

  const form = document.getElementById('staffForm');
  if (form) form.dataset.editId = id;

  document.getElementById('staffModal').style.display = 'flex';
}

/* MỞ POPUP THÊM MỚI NHÂN SỰ */
function openStaffModal() {
  const form = document.getElementById('staffForm');
  if (form) {
    form.reset();
    delete form.dataset.editId;
  }
  const title = document.querySelector('#staffModal .modal-header h3');
  if (title) title.innerText = 'Thêm nhân sự mới';

  document.getElementById('staffModal').style.display = 'flex';
}

/* LƯU THÔNG TIN NHÂN SỰ (XỬ LÝ CẢ THÊM MỚI VÀ CẬP NHẬT) */
function saveStaff(event) {
  event.preventDefault();

  const form = document.getElementById('staffForm');
  const editId = form ? form.dataset.editId : null;

  const staffData = {
    code: document.getElementById('staffCode')?.value.trim() || '',
    name: document.getElementById('staffName')?.value.trim() || '',
    group: document.getElementById('staffGroup')?.value || 'Giảng viên',
    degree: document.getElementById('staffDegree')?.value.trim() || '',
    role: document.getElementById('staffRole')?.value.trim() || '',
    phone: document.getElementById('staffPhone')?.value.trim() || '',
    email: document.getElementById('staffEmail')?.value.trim() || '',
    taskDesc: document.getElementById('staffTaskDesc')?.value.trim() || ''
  };

  if (editId) {
    const index = staffList.findIndex(s => s.id == editId);
    if (index !== -1) {
      staffList[index] = { ...staffList[index], ...staffData };
      toast('Đã cập nhật thông tin nhân sự.');
    }
    delete form.dataset.editId;
  } else {
    staffData.id = Date.now();
    staffList.push(staffData);
    toast('Đã thêm nhân sự mới thành công.');
  }

  saveData();
  closeModal('staffModal');
  renderStaffPage();
  updateStaffBadge();
  updateStaffDatalist();
}

function trackStaff(name, group) {
  const roleKeyMap = { 'Giảng viên': 'gv', 'Nhân viên': 'nv', 'Cộng tác viên': 'ctv' };
  const rk = roleKeyMap[group] || 'gv';
  pendingKeepSearch = true;
  showPage('track-' + rk, null, `Theo dõi tiến độ · ${group}`);
  setTimeout(() => {
    const box = document.getElementById('searchTask');
    if (box) { box.value = name; renderPlanPage(); }
    pendingKeepSearch = false;
  }, 30);
}

function initCharts(taskList = tasks) {
  const roleCtx = document.getElementById('roleChart')?.getContext('2d');
  if (roleCtx) {
    if (window.roleChartObj) window.roleChartObj.destroy();
    const roles = ['Giảng viên', 'Nhân viên', 'Cộng tác viên', 'Đoàn Hội'];
    const dataCounts = roles.map(r => taskList.filter(t => t.targetRole === r).length);
    window.roleChartObj = new Chart(roleCtx, {
      type: 'bar',
      data: { labels: roles, datasets: [{ label: 'Số lượng CV', data: dataCounts, backgroundColor: '#0F7A52', borderRadius: 8, maxBarThickness: 46 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 }, grid:{color:'#EEF2EF'} }, x:{ grid:{display:false} } } }
    });
  }
  const statusCtx = document.getElementById('statusChart')?.getContext('2d');
  if (statusCtx) {
    if (window.statusChartObj) window.statusChartObj.destroy();
    const completed = taskList.filter(t => t.status === 'Hoàn thành').length;
    const doing = taskList.filter(t => t.status === 'Đang thực hiện' && !isOverdue(t)).length;
    const overdue = taskList.filter(isOverdue).length;
    const pending = taskList.filter(t => t.status === 'Chưa hoàn thành' && !isOverdue(t)).length;
    window.statusChartObj = new Chart(statusCtx, {
      type: 'doughnut',
      data: { labels: ['Hoàn thành','Đang thực hiện','Quá hạn','Chưa hoàn thành'], datasets: [{ data: [completed, doing, overdue, pending], backgroundColor: ['#0F7A52','#B87D14','#C0392B','#9AA79E'], borderWidth:0 }] },
      options: { responsive:true, maintainAspectRatio:false, cutout:'62%', plugins:{legend:{position:'bottom', labels:{boxWidth:10, font:{size:11}}}} }
    });
  }
}

function renderPrincipalReport() {
  if (document.getElementById('reportDateText')) {
    document.getElementById('reportDateText').innerText = new Date().toLocaleDateString('vi-VN');
  }
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Hoàn thành').length;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (document.getElementById('reportSummaryBox')) {
    document.getElementById('reportSummaryBox').innerText =
      `- Tổng số nhiệm vụ đã triển khai: ${total} | Đã hoàn thành: ${completed} (${percent}%) | Đang xử lý: ${total - completed - overdue} | Quá hạn: ${overdue}`;
  }

  const generateList = (role) => {
    const list = tasks.filter(t => t.targetRole === role);
    if (list.length === 0) return '<li>Chưa có ghi nhận nhiệm vụ trong kỳ báo cáo.</li>';
    return list.map(t => `<li>[${effectiveStatus(t)}] ${t.content} (Phụ trách: ${t.staff}, ${t.hours}h)</li>`).join('');
  };

  if (document.getElementById('rptGVList')) document.getElementById('rptGVList').innerHTML = generateList('Giảng viên');
  if (document.getElementById('rptNVList')) document.getElementById('rptNVList').innerHTML = generateList('Nhân viên');
  if (document.getElementById('rptCTVList')) document.getElementById('rptCTVList').innerHTML = generateList('Cộng tác viên');
  if (document.getElementById('rptDHList')) document.getElementById('rptDHList').innerHTML = generateList('Đoàn Hội');

  const recEl = document.getElementById('reportRecommend');
  if (recEl) {
    if (overdue > 0) {
      recEl.innerText = `Kính trình Hiệu trưởng xem xét, phê duyệt và có chỉ đạo kịp thời đối với ${overdue} nhiệm vụ đang quá hạn, đồng thời hỗ trợ đơn vị hoàn thành xuất sắc các nhiệm vụ trọng tâm kế tiếp.`;
    } else {
      recEl.innerText = `Kính trình Hiệu trưởng xem xét, phê duyệt và đưa ra chỉ đạo để đơn vị hoàn thành xuất sắc các nhiệm vụ trọng tâm kế tiếp.`;
    }
  }
}

function exportToWord() {
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Báo cáo</title></head><body>";
  const footer = "</body></html>";
  const reportEl = document.querySelector(".report-paper");
  if (!reportEl) return;
  const sourceHTML = header + reportEl.innerHTML + footer;
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = source; a.download = 'Bao_Cao_Trinh_Hieu_Truong.doc'; a.click();
  document.body.removeChild(a);
  toast('Đã xuất báo cáo Word thành công.');
}

function exportCSV() {
  const rows = [['Ngày','Khối','Người thực hiện','Nội dung','Giờ','Hạn chót','Trạng thái']];
  tasks.forEach(t => rows.push([t.date, t.targetRole, t.staff, t.content, t.hours, t.deadline||'', effectiveStatus(t)]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(["\uFEFF" + csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'BDU_CongViec_' + todayStr() + '.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('Đã xuất danh sách công việc ra CSV.');
}

function openTaskModal(id = null) {
  document.getElementById('taskForm').reset();
  const modalTitle = document.getElementById('modalTaskTitle');
  if (id) {
    const task = tasks.find(t => t.id == id);
    if (task) {
      document.getElementById('taskId').value = task.id;
      document.getElementById('taskTargetRole').value = task.targetRole;
      document.getElementById('taskCycle').value = task.cycle;
      document.getElementById('taskDate').value = task.date;
      document.getElementById('taskDeadline').value = task.deadline || '';
      document.getElementById('taskStaff').value = task.staff;
      document.getElementById('taskContent').value = task.content;
      document.getElementById('taskHours').value = task.hours;
      document.getElementById('taskStatus').value = task.status;
      if (modalTitle) modalTitle.innerText = "Chỉnh sửa công việc";
    }
  } else {
    document.getElementById('taskId').value = '';
    document.getElementById('taskDate').value = todayStr();
    if (modalTitle) modalTitle.innerText = "Thêm công việc";
  }
  document.getElementById('taskModal').style.display = 'flex';
}

function saveTask(e) {
  e.preventDefault();
  const id = document.getElementById('taskId').value;
  const data = {
    targetRole: document.getElementById('taskTargetRole').value,
    cycle: document.getElementById('taskCycle').value,
    date: document.getElementById('taskDate').value,
    deadline: document.getElementById('taskDeadline').value || null,
    staff: document.getElementById('taskStaff').value,
    content: document.getElementById('taskContent').value,
    hours: parseFloat(document.getElementById('taskHours').value) || 0,
    status: document.getElementById('taskStatus').value
  };
  if (id) {
    const idx = tasks.findIndex(t => t.id == id);
    if (idx !== -1) tasks[idx] = { ...tasks[idx], ...data };
    toast('Đã cập nhật công việc.');
  } else {
    data.id = Date.now();
    tasks.unshift(data);
    toast('Đã thêm công việc mới.');
  }
  saveData();
  closeModal('taskModal');
  renderPlanPage();
  renderAllPages();
}

function deleteTask(id) {
  if (confirm('Bạn có chắc muốn xóa nhiệm vụ này?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderPlanPage();
    renderAllPages();
    toast('Đã xóa công việc.', 'error');
  }
}

function deleteStaff(id) {
  if (confirm('Xóa nhân sự này khỏi danh sách?')) {
    staffList = staffList.filter(s => s.id !== id);
    saveData();
    renderStaffPage(); 
    updateStaffBadge(); 
    updateStaffDatalist();
    toast('Đã xóa nhân sự.', 'error');
  }
}

function openAssignModal(personName) {
  const staffObj = staffList.find(s => s.name === personName);
  pendingAssignStaff = staffObj || { name: personName, group: 'Giảng viên' };
  document.getElementById('assignForm').reset();
  document.getElementById('assignTargetName').value = personName;
  document.getElementById('taskDeadlineQuick').value = '';
  document.getElementById('assignModal').style.display = 'flex';
}

function handleAssignSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('assignTargetName').value;
  const content = document.getElementById('taskName').value;
  const deadline = document.getElementById('taskDeadlineQuick').value;
  const priority = document.getElementById('taskPriority').value;

  const newTask = {
    id: Date.now(),
    targetRole: pendingAssignStaff ? pendingAssignStaff.group : 'Giảng viên',
    cycle: 'Tuần',
    date: todayStr(),
    deadline: deadline || null,
    staff: name,
    content: `${priority !== 'Bình thường' ? '[' + priority + '] ' : ''}${content}`,
    hours: 1,
    status: 'Đang thực hiện'
  };
  tasks.unshift(newTask);
  saveData();
  closeModal('assignModal');
  renderPlanPage();
  renderAllPages();
  toast(`Đã giao việc "${content}" cho ${name}.`);
}

function closeModal(id) { 
  const el = document.getElementById(id);
  if (el) el.style.display = 'none'; 
}

window.addEventListener('DOMContentLoaded', () => {
  const curDate = document.getElementById('currentDate');
  if (curDate) curDate.innerText = new Date().toLocaleDateString('vi-VN');
  renderAllPages();
});

setInterval(() => { 
  renderAllPages(); 
  if (currentActiveKey.startsWith('plan') || currentActiveKey.startsWith('assign') || currentActiveKey.startsWith('track')) renderPlanPage(); 
}, 5 * 60 * 1000);
/* ==========================================================
   TÍNH NĂNG LIÊN KẾT EXCEL (EXPORT & IMPORT NHÂN SỰ)
   ========================================================== */

// 1. Xuất danh sách nhân sự ra file Excel (.xlsx)
function exportStaffToExcel() {
  if (staffList.length === 0) {
    toast('Chưa có dữ liệu nhân sự để xuất file!', 'error');
    return;
  }

  // Định dạng dữ liệu xuất ra Excel
  const excelData = staffList.map(s => ({
    "Mã NV": s.code || '',
    "Họ và Tên": s.name || '',
    "Phân loại": s.group || '',
    "Học hàm/Học vị": s.degree || '',
    "Chức vụ": s.role || '',
    "Số điện thoại": s.phone || '',
    "Email": s.email || '',
    "Facebook": s.facebook || '',
    "Nhiệm vụ": s.taskDesc || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNhanSu");

  // Tải file về máy
  XLSX.writeFile(workbook, `Danh_Sach_Nhan_Su_BDU_${todayStr()}.xlsx`);
  toast('Đã xuất file Excel danh sách nhân sự thành công!');
}

// 2. Nhập dữ liệu từ file Excel vào phần mềm
function importStaffFromExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast('File Excel không có dữ liệu!', 'error');
        return;
      }

      let count = 0;
      jsonData.forEach((row, index) => {
        // Đọc cột theo tiêu đề file Excel
        const name = row["Họ và Tên"] || row["Họ tên"] || row["Name"];
        if (name) {
          const newStaff = {
            id: Date.now() + index,
            code: row["Mã NV"] || row["Mã nhân viên"] || '',
            name: name.trim(),
            group: row["Phân loại"] || row["Nhóm"] || 'Giảng viên',
            degree: row["Học hàm/Học vị"] || row["Học vị"] || '',
            role: row["Chức vụ"] || '',
            phone: row["Số điện thoại"] || row["SĐT"] || '',
            email: row["Email"] || '',
            facebook: row["Facebook"] || '',
            taskDesc: row["Nhiệm vụ"] || ''
          };
          staffList.push(newStaff);
          count++;
        }
      });

      saveData();
      renderStaffPage();
      updateStaffBadge();
      updateStaffDatalist();
      toast(`Đã nhập thành công ${count} nhân sự từ file Excel!`);
    } catch (err) {
      console.error(err);
      toast('Định dạng file Excel không hợp lệ!', 'error');
    }
    // Reset ô chọn file để chọn lại lần sau nếu cần
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}