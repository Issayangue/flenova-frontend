/**
 * Register Logic — création entreprise + choix forfait
 */

const VALID_PLANS = ['independant', 'pme', 'premium'];

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast border-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-500`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const icon = document.createElement('i');
    icon.className = `fa-solid ${icons[type] || icons.info} text-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-500 text-xl mr-3`;
    const span = document.createElement('span');
    span.className = 'text-sm text-gray-700';
    span.textContent = String(message || '');
    toast.append(icon, span);
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/**
 * Remplace le formulaire par une invitation à confirmer l'adresse.
 * Le compte existe mais reste inaccessible jusque-là : sans cet écran,
 * l'utilisateur ne comprendrait pas pourquoi sa connexion est refusée.
 */
function showVerificationNotice(email, trialDays) {
    const form = document.getElementById('register-form');
    if (!form) return;

    const panel = document.createElement('div');
    panel.className = 'p-5 rounded-lg bg-green-50 border border-green-200 space-y-3';

    const title = document.createElement('p');
    title.className = 'text-sm font-semibold text-green-900';
    title.textContent = 'Compte créé. Une dernière étape.';

    const body = document.createElement('p');
    body.className = 'text-sm text-green-800';
    // textContent : l'adresse vient d'une saisie utilisateur.
    body.textContent = `Nous avons envoyé un lien de confirmation à ${email}. `
        + `Cliquez-le pour activer votre compte et votre essai de ${trialDays} jours.`;

    const hint = document.createElement('p');
    hint.className = 'text-xs text-green-700';
    hint.textContent = 'Pensez à consulter votre dossier de courriers indésirables. Le lien est valable 24 heures.';

    const resend = document.createElement('button');
    resend.type = 'button';
    resend.className = 'text-sm font-medium text-green-900 underline hover:text-green-700';
    resend.textContent = 'Renvoyer le lien';

    const feedback = document.createElement('p');
    feedback.className = 'text-xs text-green-800 hidden';

    resend.addEventListener('click', async () => {
        resend.disabled = true;
        try {
            const response = await apiFetch('auth/resend-verification', {
                method: 'POST',
                body: { email }
            });
            const result = await response.json().catch(() => ({}));
            if (response.status === 429) {
                showToast(result.error || 'Trop de demandes. Réessayez plus tard.', 'error');
                return;
            }
            feedback.textContent = result.message || 'Un nouveau lien vient d\'être envoyé.';
            feedback.classList.remove('hidden');
            resend.classList.add('hidden');
        } catch (err) {
            showToast('Impossible de contacter le serveur', 'error');
        } finally {
            resend.disabled = false;
        }
    });

    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.className = 'block text-sm text-blue-600 hover:text-blue-800 font-medium';
    loginLink.textContent = 'J\'ai confirmé — aller à la connexion';

    panel.append(title, body, hint, resend, feedback, loginLink);
    form.replaceWith(panel);
}

function getSelectedPlan() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get('plan') || '').trim().toLowerCase();
    const input = document.getElementById('reg-plan');
    const fromInput = input?.value || 'pme';
    if (VALID_PLANS.includes(fromUrl)) return fromUrl;
    return VALID_PLANS.includes(fromInput) ? fromInput : 'pme';
}

function initPlanSelector() {
    const hiddenInput = document.getElementById('reg-plan');
    if (!hiddenInput) return;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get('plan') || '').trim().toLowerCase();
    const initial = VALID_PLANS.includes(fromUrl) ? fromUrl : 'pme';

    function activateCard(plan) {
        hiddenInput.value = plan;
        document.querySelectorAll('.plan-card').forEach(card => {
            const active = card.dataset.plan === plan;
            card.classList.toggle('border-blue-500', active);
            card.classList.toggle('bg-blue-50', active);
            card.classList.toggle('border-gray-200', !active);
            card.classList.toggle('bg-white', !active);
        });
        const url = new URL(window.location.href);
        url.searchParams.set('plan', plan);
        window.history.replaceState({}, '', url);
    }

    activateCard(initial);

    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', () => activateCard(card.dataset.plan));
    });

    const chargeurCheckbox = document.getElementById('reg-chargeur');
    const chargeurBlock = document.getElementById('chargeur-block');
    if (chargeurCheckbox && chargeurBlock) {
        function updateChargeurStyle() {
            const checked = chargeurCheckbox.checked;
            chargeurBlock.classList.toggle('border-indigo-400', checked);
            chargeurBlock.classList.toggle('bg-indigo-50', checked);
            chargeurBlock.classList.toggle('border-indigo-200', !checked);
            chargeurBlock.classList.toggle('bg-white', !checked);
        }
        chargeurCheckbox.addEventListener('change', updateChargeurStyle);
        updateChargeurStyle();
    }
}

initPlanSelector();

const registerForm = document.getElementById('register-form');
if (registerForm) registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Création...';

    const companyName = document.getElementById('reg-company').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const plan = getSelectedPlan();

    if (password !== passwordConfirm) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
    }

    if (password.length < 8) {
        showToast('Le mot de passe doit contenir au moins 8 caractères', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
    }

    const privacyAccepted = document.getElementById('reg-privacy')?.checked;
    if (!privacyAccepted) {
        showToast('Veuillez accepter les CGU, les CGV et la politique de confidentialité', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
    }

    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        // ignore
    }
    localStorage.removeItem('user');

    try {
        const turnstile_token = typeof getTurnstileToken === 'function' ? getTurnstileToken() : undefined;
        const chargeurEnabled = document.getElementById('reg-chargeur')?.checked ?? false;
        const body = { company_name: companyName, name, email, password, plan, privacy_accepted: true, chargeur_enabled: chargeurEnabled };
        if (turnstile_token) body.turnstile_token = turnstile_token;

        const response = await apiFetch('auth/register', {
            method: 'POST',
            body
        });

        let result = {};
        try { result = await response.json(); } catch (e) { result = { error: 'Erreur serveur inattendue' }; }

        if (response.ok && result.success) {
            const days = result.demo?.trialDays || 30;
            if (result.emailVerificationRequired) {
                showToast(`Compte créé ! Essai Premium ${days} jours activé.`, 'success');
                showVerificationNotice(email, days);
            } else {
                showToast(`Compte créé. Essai Premium ${days} jours — vous pouvez vous connecter.`, 'success');
                window.location.href = `login.html?registered=1&email=${encodeURIComponent(email)}`;
            }
        } else {
            showToast(result.error || result.message || 'Erreur lors de l\'inscription', 'error');
        }
    } catch (err) {
        showToast('Impossible de contacter le serveur', 'error');
    } finally {
        if (typeof resetTurnstileWidget === 'function') resetTurnstileWidget();
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});
