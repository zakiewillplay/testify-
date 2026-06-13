/* ============================================
   IMPRIMIS IVF SRINAGAR – MAIN SCRIPTS
   Vanilla JS, accessible, production-ready
   ============================================ */

(function () {
    'use strict';

    // --- DOM READY ---
    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initAccordion();
        initCalculator();
        initChatModal();
        initCallbackModal();
        initProactivePopup();
        initForms();
        initMultiStepForm();
        initDownloadChecklist();
        initSmoothScroll();
    });

    // --- MOBILE NAVIGATION ---
    function initMobileNav() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('active');
            document.body.style.overflow = expanded ? '' : 'hidden';
        });

        // Close on nav link click
        menu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // --- FAQ ACCORDION ---
    function initAccordion() {
        const triggers = document.querySelectorAll('.accordion-trigger');
        triggers.forEach(function (trigger, index) {
            trigger.addEventListener('click', function () {
                const expanded = trigger.getAttribute('aria-expanded') === 'true';
                // Close all
                triggers.forEach(function (t) {
                    t.setAttribute('aria-expanded', 'false');
                    const panel = t.nextElementSibling;
                    if (panel) panel.classList.remove('open');
                });
                // Open clicked
                if (!expanded) {
                    trigger.setAttribute('aria-expanded', 'true');
                    const panel = trigger.nextElementSibling;
                    if (panel) panel.classList.add('open');
                }
            });
        });
        // Open first by default
        if (triggers.length > 0) {
            triggers[0].setAttribute('aria-expanded', 'true');
            const firstPanel = triggers[0].nextElementSibling;
            if (firstPanel) firstPanel.classList.add('open');
        }
    }

    // --- IVF SUCCESS CALCULATOR ---
    function initCalculator() {
        const slider = document.getElementById('age-slider');
        const ageDisplay = document.getElementById('calc-age-display');
        const resultPercentage = document.getElementById('result-percentage');
        const resultDescription = document.getElementById('result-description');
        if (!slider || !ageDisplay || !resultPercentage || !resultDescription) return;

        function updateCalculator(age) {
            const ageNum = parseInt(age, 10);
            const rawSuccess = 65 - (ageNum - 25) * 1.5;
            const successRate = Math.max(rawSuccess, 25);
            const roundedRate = Math.round(successRate * 10) / 10;

            ageDisplay.textContent = ageNum;
            resultPercentage.textContent = roundedRate + '%';
            resultDescription.innerHTML =
                'At age <strong>' +
                ageNum +
                '</strong>, our estimated success rate is <strong>~' +
                roundedRate +
                '%</strong> — approximately <strong>1.5× higher</strong> than the national average.';
            slider.setAttribute('aria-valuenow', ageNum);
        }

        slider.addEventListener('input', function () {
            updateCalculator(slider.value);
        });

        // Initialize
        updateCalculator(slider.value);
    }

    // --- CHAT MODAL ---
    function initChatModal() {
        const modal = document.getElementById('chat-modal');
        const openButtons = document.querySelectorAll('.open-chat-modal');
        const closeBtn = modal ? modal.querySelector('.chat-close') : null;
        const backdrop = modal ? modal.querySelector('.chat-modal-backdrop') : null;
        const chatBody = document.getElementById('chat-body');
        const chatButtons = document.getElementById('chat-buttons');
        const chatForm = document.getElementById('chat-form');
        const chatYes = document.getElementById('chat-yes');
        const chatNo = document.getElementById('chat-no');

        if (!modal) return;

        function openModal() {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            // Reset state
            if (chatButtons) chatButtons.classList.remove('hidden');
            if (chatForm) chatForm.classList.add('hidden');
            if (chatForm) chatForm.reset();
        }

        function closeModal() {
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }

        openButtons.forEach(function (btn) {
            btn.addEventListener('click', openModal);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        if (chatYes) {
            chatYes.addEventListener('click', function () {
                if (chatButtons) chatButtons.classList.add('hidden');
                if (chatForm) chatForm.classList.remove('hidden');
            });
        }

        if (chatNo) {
            chatNo.addEventListener('click', function () {
                closeModal();
            });
        }

        if (chatForm) {
            chatForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Thank you! We will send the IVF cost guide to your phone shortly. Expect a call within 24 hours.');
                chatForm.reset();
                closeModal();
            });
        }

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }

    // --- CALLBACK MODAL ---
    function initCallbackModal() {
        const modal = document.getElementById('callback-modal');
        const openButtons = document.querySelectorAll('.open-callback-modal');
        const closeBtn = modal ? modal.querySelector('.callback-close') : null;
        const backdrop = modal ? modal.querySelector('.callback-modal-backdrop') : null;
        const form = document.getElementById('callback-form');

        if (!modal) return;

        function openModal() {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            if (form) form.reset();
        }

        function closeModal() {
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }

        openButtons.forEach(function (btn) {
            btn.addEventListener('click', openModal);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alert("Request received. We'll contact you within 24 hours.");
                form.reset();
                closeModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }

    // --- PROACTIVE CHAT POPUP (30s on homepage) ---
    function initProactivePopup() {
        const popup = document.getElementById('proactive-popup');
        if (!popup || !document.body.classList.contains('page-home')) return;

        const closeBtn = popup.querySelector('.proactive-close');
        const yesBtn = document.getElementById('proactive-yes');
        const noBtn = document.getElementById('proactive-no');

        let timer = setTimeout(function () {
            popup.classList.remove('hidden');
        }, 30000);

        function hidePopup() {
            popup.classList.add('hidden');
            clearTimeout(timer);
        }

        if (closeBtn) closeBtn.addEventListener('click', hidePopup);
        if (noBtn) {
            noBtn.addEventListener('click', hidePopup);
        }
        if (yesBtn) {
            yesBtn.addEventListener('click', function () {
                hidePopup();
                // Open chat modal
                const chatModal = document.getElementById('chat-modal');
                if (chatModal) {
                    chatModal.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                    const chatButtons = document.getElementById('chat-buttons');
                    const chatForm = document.getElementById('chat-form');
                    if (chatButtons) chatButtons.classList.add('hidden');
                    if (chatForm) chatForm.classList.remove('hidden');
                }
            });
        }
    }

    // --- GENERIC FORMS (newsletter, etc.) ---
    function initForms() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Check your inbox! You have been subscribed successfully.');
                newsletterForm.reset();
            });
        }
    }

    // --- MULTI-STEP FORM (Contact page) ---
    function initMultiStepForm() {
        const formContainer = document.querySelector('.multi-step-form');
        if (!formContainer) return;

        const steps = formContainer.querySelectorAll('.form-step');
        const progressSteps = formContainer.querySelectorAll('.progress-step');
        const progressFill = formContainer.querySelector('.progress-bar-fill');
        const nextBtns = formContainer.querySelectorAll('.btn-next');
        const prevBtns = formContainer.querySelectorAll('.btn-prev');
        const submitBtn = formContainer.querySelector('.btn-submit');
        let currentStep = 0;

        function showStep(index) {
            steps.forEach(function (s, i) {
                s.classList.toggle('active', i === index);
            });
            progressSteps.forEach(function (ps, i) {
                ps.classList.remove('active', 'done');
                if (i < index) ps.classList.add('done');
                if (i === index) ps.classList.add('active');
            });
            if (progressFill) {
                progressFill.style.width = ((index + 1) / steps.length) * 100 + '%';
            }
            currentStep = index;
        }

        nextBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const currentStepEl = steps[currentStep];
                const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
                let valid = true;
                inputs.forEach(function (inp) {
                    if (!inp.value.trim()) {
                        valid = false;
                        inp.style.borderColor = '#e74c3c';
                        inp.addEventListener('input', function () {
                            inp.style.borderColor = '';
                        }, { once: true });
                    }
                });
                if (valid && currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                } else if (!valid) {
                    alert('Please fill in all required fields before proceeding.');
                }
            });
        });

        prevBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            });
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const currentStepEl = steps[currentStep];
                const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
                let valid = true;
                inputs.forEach(function (inp) {
                    if (!inp.value.trim()) {
                        valid = false;
                        inp.style.borderColor = '#e74c3c';
                    }
                });
                if (valid) {
                    alert("Request received. We'll contact you within 24 hours.");
                    formContainer.querySelector('form') ? formContainer.querySelector('form').reset() : null;
                    showStep(0);
                } else {
                    alert('Please fill in all required fields before submitting.');
                }
            });
        }

        // Initialize
        showStep(0);
    }

    // --- DOWNLOAD CHECKLIST ---
    function initDownloadChecklist() {
        const btn = document.getElementById('download-checklist');
        if (!btn) return;
        btn.addEventListener('click', function () {
            alert('Your IVF Pre-Treatment Checklist is ready! (Simulated download — in production, a PDF would be served.)');
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

})();