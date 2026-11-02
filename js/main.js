/**
 * THIMPHU AUTO CARE - Core Interactive Engine
 * Handles Native Modals, Booking Workflow, Brand Filter, and Responsive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navLinks');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // 2. Modern Native Dialog Light Dismiss Fallback (as per modern-web-guidance)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const rect = dialog.getBoundingClientRect();
      return e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    };
    document.querySelectorAll('dialog').forEach(dialog => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
      });
    });
  }

  // 3. Modal Triggers
  const bookingModal = document.getElementById('bookingModal');
  const estimateModal = document.getElementById('estimateModal');
  const callModal = document.getElementById('callModal');

  // Open booking modal
  document.querySelectorAll('[data-open-modal="booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Periodic Servicing';
      const select = document.getElementById('modalServiceSelect');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      bookingModal?.showModal();
    });
  });

  // Open estimate modal
  document.querySelectorAll('[data-open-modal="estimate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      estimateModal?.showModal();
    });
  });

  // Open call modal
  document.querySelectorAll('[data-open-modal="call"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      callModal?.showModal();
    });
  });

  // Close modals via buttons with data-close-modal
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const dialog = document.getElementById(modalId);
      dialog?.close();
    });
  });

  // 4. Quick Contact Form Handler
  const quickForm = document.getElementById('quickServiceForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quickName')?.value || 'Valued Customer';
      const service = document.getElementById('quickService')?.value || 'Car Service';
      const phone = document.getElementById('quickPhone')?.value || '+975';
      const date = document.getElementById('quickDate')?.value || 'Selected Date';

      showToast(`🚗 Booking Requested! Thank you ${name}. Our Thimphu workshop will call ${phone} to confirm your appointment for ${date}.`);
      quickForm.reset();
    });
  }

  // 5. Booking Modal Form Handler
  const modalBookingForm = document.getElementById('modalBookingForm');
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookingCustomerName')?.value || 'Customer';
      bookingModal?.close();
      showToast(`✅ Service Confirmed! Thank you ${name}. Booking token #BT-CAR-${Math.floor(1000 + Math.random() * 9000)} issued.`);
      modalBookingForm.reset();
    });
  }

  // 6. Estimate Modal Form Handler
  const estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      estimateModal?.close();
      showToast('📋 Estimate request received! Our body repair & painting specialist in Thimphu will review your details.');
      estimateForm.reset();
    });
  }

  // 7. Brand Filter Notification
  document.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('click', () => {
      const brand = card.getAttribute('data-brand') || 'Brand';
      showToast(`🔍 Showing certified parts & specialized mechanics for ${brand} in Thimphu garage.`);
    });
  });

  // Toast Notification Helper
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
});
