// GREBY Marketplace - App Logic

function showScreen(id) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  // Show target
  const target = document.getElementById('screen-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Close demo menu
  document.getElementById('demoMenu')?.classList.remove('open');

  // Init charts if dashboard
  if (id === '19') initSellerChart();
  if (id === '20') initAdminChart();
}

function selectLang(el) {
  document.querySelectorAll('.lang-item').forEach(i => {
    i.classList.remove('active');
    const check = i.querySelector('.fa-check-circle');
    if (check) check.remove();
  });
  el.classList.add('active');
  if (!el.querySelector('.fa-check-circle')) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle text-primary ms-auto';
    el.appendChild(icon);
  }
}

function toggleDemoNav() {
  document.getElementById('demoMenu').classList.toggle('open');
}

// Charts
let sellerChartInstance = null;
let adminChartInstance = null;

function initSellerChart() {
  const ctx = document.getElementById('sellerChart');
  if (!ctx) return;
  if (sellerChartInstance) sellerChartInstance.destroy();

  sellerChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales (₦)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: '#6C2CFF',
        backgroundColor: 'rgba(108, 44, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6C2CFF'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#94A3B8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94A3B8' }
        }
      }
    }
  });
}

function initAdminChart() {
  const ctx = document.getElementById('adminChart');
  if (!ctx) return;
  if (adminChartInstance) adminChartInstance.destroy();

  adminChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        label: 'This Year',
        data: [45, 52, 38, 65, 72, 58, 80, 90],
        backgroundColor: '#6C2CFF',
        borderRadius: 6
      }, {
        label: 'Last Year',
        data: [30, 40, 28, 50, 55, 45, 60, 70],
        backgroundColor: '#94A3B8',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#94A3B8' }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#94A3B8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94A3B8' }
        }
      }
    }
  });
}

// Close demo menu on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('demoNav');
  if (nav && !nav.contains(e.target)) {
    document.getElementById('demoMenu')?.classList.remove('open');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showScreen('01');
});
