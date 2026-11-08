/**
 * Site public — page d'accueil, vitrine produits, à propos et formulaire de
 * demande de démo (qualification du besoin).
 *
 * Toute demande de démo mène au formulaire de contact (plus à l'inscription) :
 * l'équipe rappelle le prospect avec une démo adaptée à son activité.
 * Animations : apparition au défilement, compteurs, défilement de la bande de
 * fonctionnalités, rotation de la vitrine — toutes désactivées si l'utilisateur
 * préfère réduire les animations (prefers-reduced-motion).
 */
(function () {
    'use strict';

    const esc = (v) => String(v ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    /** Coordonnées de l'éditeur (js/legal-pages.js), avec repli. */
    const legal = () => (typeof FLENOVA_LEGAL !== 'undefined' && FLENOVA_LEGAL)
        || { brand: 'Flenova', company: '', email: 'support@flenova.fr', phone: '' };

    const reducedMotion = () => typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────────────────────────────────────────────────────
    // Contenus
    // ─────────────────────────────────────────────────────────────

    const CAPABILITIES = [
        ['fa-route', 'Ordres de transport'],
        ['fa-calendar-week', 'Planning glisser-déposer'],
        ['fa-mobile-screen-button', 'Application chauffeur'],
        ['fa-handshake', 'Affrètement & marges'],
        ['fa-file-invoice', 'Factur-X EN 16931'],
        ['fa-file-signature', 'CMR et preuves de livraison'],
        ['fa-shield-halved', 'Documents RC Pro & URSSAF'],
        ['fa-location-dot', 'Suivi client en ligne'],
        ['fa-file-csv', 'Export comptable'],
        ['fa-leaf', 'Bilan CO₂ par transport'],
        ['fa-pallet', 'Palettes Europe'],
        ['fa-building', 'Multi-agences']
    ];

    const AUDIENCES = [
        {
            activity: 'transporteur',
            icon: 'fa-truck',
            title: 'Transporteur <strong>PME</strong>',
            text: 'De 1 à 20 véhicules : sortez du tableur sans changer vos habitudes.',
            points: ['Planning de la semaine en un écran', 'Missions envoyées sur le téléphone du chauffeur', 'Facture prête dès la livraison validée']
        },
        {
            activity: 'transporteur_multi_agences',
            icon: 'fa-building',
            title: 'Transporteur <strong>multi-agences</strong>',
            text: 'Chaque agence exploite, la direction pilote l’ensemble.',
            points: ['Agences, rôles et droits par utilisateur', 'Tableau de bord consolidé et marges', 'Numérotation des factures continue et conforme']
        },
        {
            activity: 'commissionnaire',
            icon: 'fa-handshake',
            title: 'Commissionnaire <strong>& affréteur</strong>',
            text: 'Confiez, suivez et refacturez vos affrètements sans ressaisie.',
            points: ['Prix d’achat, prix de vente et marge par transport', 'Attestations sous-traitants suivies et alertes', 'Facture d’achat générée à chaque affrètement']
        }
    ];

    const SHOWCASE = [
        {
            key: 'planning',
            tab: 'Planning',
            icon: 'fa-calendar-week',
            title: 'Toute la semaine d’un coup d’œil',
            text: 'Chaque ordre de transport avec son chauffeur, son trajet et son prix.',
            points: ['Glissez un OT vers un autre jour pour le replanifier', 'Vue semaine ou jour par chauffeur', 'Affrètements repérés en un clin d’œil'],
            src: 'assets/screens/planning.webp',
            width: 2880, height: 1800,
            alt: 'Planning hebdomadaire Flenova : ordres de transport du lundi au vendredi avec chauffeur, trajet et prix'
        },
        {
            key: 'affretement',
            tab: 'Affrètement',
            icon: 'fa-handshake',
            title: 'Vos sous-traitants dans le même outil',
            text: 'Confiez un transport à un affréteur en deux clics, sans tableur à côté.',
            points: ['Prix d’achat et marge suivis par transport', 'Confirmation d’affrètement en PDF', 'Blocage si une attestation est expirée'],
            src: 'assets/screens/affretement.webp',
            width: 2880, height: 940,
            alt: 'Liste des transports affrétés Flenova : client, sous-traitant, trajet et statut'
        },
        {
            key: 'factures',
            tab: 'Facturation',
            icon: 'fa-file-invoice-dollar',
            title: 'Encaissements et relances maîtrisés',
            text: 'Vous savez à tout moment qui vous doit quoi.',
            points: ['Numérotation continue, factures non modifiables une fois émises', 'Paiements partiels, relances et avoirs', 'Export CSV pour votre expert-comptable'],
            src: 'assets/screens/factures.webp',
            width: 2880, height: 1400,
            alt: 'Liste des factures Flenova : numéros, clients, montants TTC, statuts validée ou payée'
        },
        {
            key: 'facturx',
            tab: 'Factur-X',
            icon: 'fa-file-circle-check',
            title: 'Prêt pour la facturation électronique',
            text: 'Chaque facture est un PDF lisible qui embarque ses données structurées.',
            points: ['Format Factur-X conforme EN 16931', 'Mentions légales vérifiées avant validation', 'Transmission à une plateforme agréée'],
            src: 'assets/screens/facture-apercu.webp',
            width: 2880, height: 1800,
            alt: 'Aperçu d’une facture électronique Factur-X dans Flenova : émetteur, destinataire, montants et lignes'
        }
    ];

    const FIGURES = [
        { value: 5, suffix: '', label: 'étapes de l’ordre de transport à la facture' },
        { value: 30, suffix: ' j', label: 'd’essai Premium, toutes fonctionnalités incluses' },
        { value: 24, suffix: ' h', label: 'pour vous rappeler après votre demande' },
        { value: 129, suffix: ' €', label: 'HT par mois pour démarrer, sans engagement' }
    ];

    const ACTIVITY_OPTIONS = [
        ['transporteur', 'Transporteur routier'],
        ['transporteur_multi_agences', 'Transporteur multi-agences'],
        ['commissionnaire', 'Commissionnaire / affréteur'],
        ['chargeur', 'Chargeur / expéditeur'],
        ['autre', 'Autre']
    ];
    const FLEET_OPTIONS = [['1-5', '1 à 5'], ['6-20', '6 à 20'], ['21-50', '21 à 50'], ['51+', 'Plus de 50']];
    const NEED_OPTIONS = [
        ['planning', 'Planning & OT'],
        ['affretement', 'Affrètement'],
        ['facturation', 'Facturation Factur-X'],
        ['app_chauffeur', 'App chauffeur'],
        ['suivi_client', 'Suivi client / GPS'],
        ['documents', 'Documents & conformité'],
        ['reporting', 'Tableau de bord & marges']
    ];
    const TOOL_OPTIONS = [['excel', 'Excel / papier'], ['autre_tms', 'Un autre TMS'], ['aucun', 'Aucun outil'], ['autre', 'Autre']];

    // ─────────────────────────────────────────────────────────────
    // Sections
    // ─────────────────────────────────────────────────────────────

    function renderHero() {
        return `
        <section class="pl-hero" aria-labelledby="pl-hero-title">
            <div class="pl-hero-glow pl-hero-glow--a" aria-hidden="true"></div>
            <div class="pl-hero-glow pl-hero-glow--b" aria-hidden="true"></div>
            <div class="pl-container pl-hero-grid">
                <div class="pl-hero-copy">
                    <p class="pl-eyebrow pl-enter" style="--d:0ms"><span class="pl-eyebrow-dot" aria-hidden="true"></span>TMS pour le transport routier · France</p>
                    <h1 id="pl-hero-title" class="pl-hero-title pl-enter" style="--d:80ms">
                        Pilotez votre transport,<br><span class="pl-gradient-text">de l’ordre à la facture.</span>
                    </h1>
                    <p class="pl-hero-lead pl-enter" style="--d:160ms">
                        Planning, chauffeurs, affrètement et facturation électronique réunis dans un seul outil,
                        pensé pour les PME du transport. Moins de ressaisie, plus de marge.
                    </p>
                    <div class="pl-hero-actions pl-enter" style="--d:240ms">
                        <button type="button" class="pl-btn pl-btn--primary" onclick="openPublicDemo()">
                            Demander une démo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="pl-btn pl-btn--ghost" onclick="publicScrollTo('produits')">
                            <i class="fa-solid fa-play" aria-hidden="true"></i> Découvrir le produit
                        </button>
                    </div>
                    <ul class="pl-hero-trust pl-enter" style="--d:320ms">
                        <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Démo adaptée à votre activité</li>
                        <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Sans engagement</li>
                        <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Rappel sous 24 h</li>
                    </ul>
                </div>
                <div class="pl-hero-visual pl-enter" style="--d:200ms">
                    <figure class="pl-browser">
                        <div class="pl-browser-bar" aria-hidden="true"><span></span><span></span><span></span><em>app.flenova.fr</em></div>
                        <img src="assets/screens/planning.webp" width="2880" height="1800" alt="Planning hebdomadaire Flenova avec les ordres de transport de la semaine" fetchpriority="high" decoding="async">
                    </figure>
                    <div class="pl-float pl-float--a" aria-hidden="true">
                        <span class="pl-float-icon pl-float-icon--violet"><i class="fa-solid fa-handshake"></i></span>
                        <div><strong>CMD-2026-015 affrété</strong><small>Marge +470 € · Brest → Lyon</small></div>
                    </div>
                    <div class="pl-float pl-float--b" aria-hidden="true">
                        <span class="pl-float-icon pl-float-icon--green"><i class="fa-solid fa-check"></i></span>
                        <div><strong>Facture payée</strong><small>8 280,00 € · virement reçu</small></div>
                    </div>
                    <div class="pl-float pl-float--c" aria-hidden="true">
                        <span class="pl-float-icon pl-float-icon--blue"><i class="fa-solid fa-location-dot"></i></span>
                        <div><strong>Arrivé au chargement</strong><small>Sarah K. · Quimper</small></div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    function renderCapabilities() {
        const items = CAPABILITIES.map(([icon, label]) =>
            `<li><i class="fa-solid ${icon}" aria-hidden="true"></i>${esc(label)}</li>`).join('');
        // Liste dupliquée pour un défilement continu ; la copie est masquée
        // aux lecteurs d'écran.
        return `
        <section class="pl-marquee" aria-label="Fonctionnalités incluses">
            <div class="pl-marquee-track">
                <ul>${items}</ul>
                <ul aria-hidden="true">${items}</ul>
            </div>
        </section>`;
    }

    function renderAudiences() {
        const cards = AUDIENCES.map((a, i) => `
            <article class="pl-card pl-audience pl-reveal" style="--d:${i * 90}ms">
                <span class="pl-audience-icon"><i class="fa-solid ${a.icon}" aria-hidden="true"></i></span>
                <h3>${a.title}</h3>
                <p>${esc(a.text)}</p>
                <ul>${a.points.map((p) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(p)}</li>`).join('')}</ul>
                <button type="button" class="pl-link" onclick="openPublicDemo({ activity: '${a.activity}' })">
                    Voir une démo pour ce métier <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
            </article>`).join('');
        return `
        <section class="pl-section" aria-labelledby="pl-audiences-title">
            <div class="pl-container">
                <header class="pl-head pl-reveal">
                    <p class="pl-kicker">Pour qui ?</p>
                    <h2 id="pl-audiences-title" class="pl-title">Un outil, <strong>trois façons de travailler</strong></h2>
                </header>
                <div class="pl-grid-3">${cards}</div>
            </div>
        </section>`;
    }

    function renderShowcase() {
        const first = SHOWCASE[0];
        const tabs = SHOWCASE.map((s, i) => `
            <button type="button" role="tab" id="pl-tab-${s.key}" aria-controls="pl-showcase-panel"
                aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"
                class="pl-tab${i === 0 ? ' is-active' : ''}" data-key="${s.key}"
                onclick="selectPublicShowcase('${s.key}', true)" onkeydown="publicShowcaseKey(event, ${i})">
                <span class="pl-tab-icon"><i class="fa-solid ${s.icon}" aria-hidden="true"></i></span>
                <span class="pl-tab-text"><strong>${esc(s.tab)}</strong><small>${esc(s.title)}</small></span>
                <span class="pl-tab-progress" aria-hidden="true"></span>
            </button>`).join('');
        return `
        <section class="pl-section pl-section--tint" id="produits" aria-labelledby="pl-products-title">
            <div class="pl-container">
                <header class="pl-head pl-reveal">
                    <p class="pl-kicker">Le produit</p>
                    <h2 id="pl-products-title" class="pl-title">Tout votre transport, <strong>dans un seul écran</strong></h2>
                    <p class="pl-lead">Captures de l’application avec les données d’une société de démonstration.</p>
                </header>
                <div class="pl-showcase pl-reveal">
                    <div class="pl-tabs" role="tablist" aria-label="Modules Flenova">${tabs}</div>
                    <div id="pl-showcase-panel" class="pl-showcase-panel" role="tabpanel" aria-labelledby="pl-tab-${first.key}">
                        <div class="pl-showcase-copy">
                            <h3 id="pl-showcase-title">${esc(first.title)}</h3>
                            <p id="pl-showcase-text">${esc(first.text)}</p>
                            <ul id="pl-showcase-points">${first.points.map((p) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(p)}</li>`).join('')}</ul>
                        </div>
                        <figure class="pl-browser pl-browser--showcase">
                            <div class="pl-browser-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                            <a id="pl-showcase-link" href="${first.src}" target="_blank" rel="noopener" title="Voir en taille réelle">
                                <img id="pl-showcase-img" src="${first.src}" alt="${esc(first.alt)}" width="${first.width}" height="${first.height}" loading="lazy" decoding="async">
                            </a>
                        </figure>
                    </div>
                </div>
            </div>
        </section>`;
    }

    function renderFigures() {
        const items = FIGURES.map((f, i) => `
            <div class="pl-figure pl-reveal" style="--d:${i * 80}ms">
                <strong><span class="pl-count" data-target="${f.value}">${f.value}</span>${esc(f.suffix)}</strong>
                <span>${esc(f.label)}</span>
            </div>`).join('');
        return `
        <section class="pl-figures" aria-label="Flenova en chiffres">
            <div class="pl-container pl-figures-grid">${items}</div>
        </section>`;
    }

    function renderAbout() {
        const company = legal().company || '';
        const values = [
            ['fa-road', 'Le terrain d’abord', 'Chaque écran part d’une tâche réelle : affecter un chauffeur, prouver une livraison, relancer un client.'],
            ['fa-feather', 'Simple par défaut', 'Une prise en main en quelques heures, sans intégrateur ni formation de plusieurs jours.'],
            ['fa-scale-balanced', 'Conforme sans effort', 'Factur-X, numérotation continue, mentions légales et RGPD intégrés dès la conception.']
        ];
        return `
        <section class="pl-section" id="a-propos" aria-labelledby="pl-about-title">
            <div class="pl-container pl-about">
                <div class="pl-about-copy pl-reveal">
                    <p class="pl-kicker">À propos</p>
                    <h2 id="pl-about-title" class="pl-title pl-title--left">Le TMS que les <strong>PME du transport</strong> méritent</h2>
                    <p>Les grands groupes ont des logiciels taillés pour eux. Les PME, elles, jonglent encore entre tableurs, SMS et ressaisies pour facturer.</p>
                    <p>Flenova est né pour combler cet écart : un outil complet, du planning à la facture électronique, au prix d’un abonnement et sans projet informatique.</p>
                    ${company ? `<p class="pl-about-editor">Flenova est conçu et édité en France par ${esc(company)}.</p>` : ''}
                    <button type="button" class="pl-btn pl-btn--primary" onclick="openPublicDemo()">Parler à l’équipe <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                </div>
                <div class="pl-values">
                    ${values.map(([icon, title, text], i) => `
                        <article class="pl-card pl-value pl-reveal" style="--d:${i * 90}ms">
                            <span class="pl-value-icon"><i class="fa-solid ${icon}" aria-hidden="true"></i></span>
                            <div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
                        </article>`).join('')}
                </div>
            </div>
        </section>`;
    }

    // ─────────────────────────────────────────────────────────────
    // Formulaire de demande de démo / contact
    // ─────────────────────────────────────────────────────────────

    const opts = (list, placeholder) => `<option value="">${esc(placeholder)}</option>`
        + list.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');

    function renderDemoForm() {
        return `
        <form id="pd-form" class="pd-form" novalidate onsubmit="submitPublicDemo(event)">
            <div class="pd-type" role="radiogroup" aria-label="Type de demande">
                <label><input type="radio" name="pd-type" value="demo" checked onchange="setPublicDemoType('demo')"><span><i class="fa-solid fa-display" aria-hidden="true"></i>Demander une démo</span></label>
                <label><input type="radio" name="pd-type" value="question" onchange="setPublicDemoType('question')"><span><i class="fa-solid fa-comment" aria-hidden="true"></i>Poser une question</span></label>
            </div>

            <div class="pd-grid">
                <div class="pd-field" data-demo-only>
                    <label for="pd-company">Société <span aria-hidden="true">*</span></label>
                    <input id="pd-company" name="company" autocomplete="organization" maxlength="255" data-required-demo>
                </div>
                <div class="pd-field">
                    <label for="pd-name">Nom et prénom <span aria-hidden="true">*</span></label>
                    <input id="pd-name" name="name" autocomplete="name" maxlength="255" required>
                </div>
                <div class="pd-field">
                    <label for="pd-email">E-mail professionnel <span aria-hidden="true">*</span></label>
                    <input id="pd-email" name="email" type="email" autocomplete="email" maxlength="255" required>
                </div>
                <div class="pd-field">
                    <label for="pd-phone">Téléphone <span data-demo-only aria-hidden="true">*</span></label>
                    <input id="pd-phone" name="phone" type="tel" autocomplete="tel" maxlength="50" placeholder="06 12 34 56 78" data-required-demo>
                </div>
                <div class="pd-field" data-demo-only>
                    <label for="pd-activity">Votre activité</label>
                    <select id="pd-activity" name="activity">${opts(ACTIVITY_OPTIONS, 'Choisir…')}</select>
                </div>
                <div class="pd-field" data-demo-only>
                    <label for="pd-fleet">Taille de flotte</label>
                    <select id="pd-fleet" name="fleet_size">${opts(FLEET_OPTIONS, 'Nombre de véhicules…')}</select>
                </div>
            </div>

            <fieldset class="pd-needs" data-demo-only>
                <legend>Ce qui vous intéresse</legend>
                <div class="pd-chips">
                    ${NEED_OPTIONS.map(([v, l]) => `<label class="pd-chip"><input type="checkbox" name="needs" value="${v}"><span>${esc(l)}</span></label>`).join('')}
                </div>
            </fieldset>

            <div class="pd-field" data-demo-only>
                <label for="pd-tool">Vous gérez aujourd’hui avec…</label>
                <select id="pd-tool" name="current_tool">${opts(TOOL_OPTIONS, 'Choisir…')}</select>
            </div>

            <div class="pd-field" data-question-only hidden>
                <label for="pd-subject">Sujet <span aria-hidden="true">*</span></label>
                <input id="pd-subject" name="subject" maxlength="255" data-required-question>
            </div>
            <div class="pd-field">
                <label for="pd-message"><span data-demo-only>Précisez votre besoin <small>(facultatif)</small></span><span data-question-only hidden>Message <span aria-hidden="true">*</span></span></label>
                <textarea id="pd-message" name="message" rows="4" maxlength="10000" data-required-question></textarea>
            </div>

            <p id="pd-error" class="pd-error" role="alert" hidden></p>
            <button type="submit" class="pl-btn pl-btn--primary pd-submit">
                <span data-demo-only>Être rappelé pour une démo</span><span data-question-only hidden>Envoyer le message</span>
                <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
            <p class="pd-legal">Vos coordonnées servent uniquement à répondre à votre demande.
                <a href="#" onclick="publicRouter('privacy'); return false;">Politique de confidentialité</a>.</p>
        </form>
        <div id="pd-success" class="pd-success" hidden tabindex="-1">
            <span class="pd-success-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
            <h3>Merci, c’est bien reçu !</h3>
            <p id="pd-success-text">Un conseiller vous rappelle sous 24 h ouvrées.</p>
        </div>`;
    }

    function renderDemoAside(compact) {
        return `
            <div class="pd-aside">
                <p class="pl-kicker pl-kicker--light">${compact ? 'Démo personnalisée' : 'Contact'}</p>
                <h2 class="pd-aside-title">Voyons ensemble <strong>ce que Flenova change pour vous</strong></h2>
                <ul class="pd-promise">
                    <li><i class="fa-solid fa-user-tie" aria-hidden="true"></i><div><strong>Une démo à votre image</strong><span>Sur vos cas : vos trajets, vos clients, vos sous-traitants.</span></div></li>
                    <li><i class="fa-solid fa-clock" aria-hidden="true"></i><div><strong>Rappel sous 24 h ouvrées</strong><span>Un conseiller vous contacte pour fixer le créneau.</span></div></li>
                    <li><i class="fa-solid fa-lock-open" aria-hidden="true"></i><div><strong>Sans engagement</strong><span>Ni installation, ni carte bancaire.</span></div></li>
                </ul>
                <div class="pd-direct">
                    <a href="mailto:${esc(legal().email)}"><i class="fa-solid fa-envelope" aria-hidden="true"></i>${esc(legal().email)}</a>
                    ${legal().phone ? `<a href="tel:${esc(legal().phone.replace(/\s+/g, ''))}"><i class="fa-solid fa-phone" aria-hidden="true"></i>${esc(legal().phone)} · lun–ven 9h–18h</a>` : ''}
                </div>
                <p class="pd-selfserve">Vous préférez tester seul ? <a href="register.html">Créer un compte d’essai</a></p>
            </div>`;
    }

    function renderDemoSection() {
        return `
        <section class="pl-demo" id="demo" aria-label="Demander une démo">
            <div class="pl-container pl-demo-grid pl-reveal">
                ${renderDemoAside(true)}
                <div class="pd-card">${renderDemoForm()}</div>
            </div>
        </section>`;
    }

    function renderFooter() {
        const L = legal();
        const link = (label, js) => `<li><a href="#" onclick="${js}; return false;">${esc(label)}</a></li>`;
        return `
        <footer class="pl-footer">
            <div class="pl-container pl-footer-grid">
                <div class="pl-footer-brand">
                    <span class="pl-footer-logo"><img src="assets/flenova_icon_512.jpg" alt="" width="32" height="32">${esc(L.brand || 'Flenova')}</span>
                    <p>Le TMS des PME du transport routier : planning, chauffeurs, affrètement et facturation électronique.</p>
                    <button type="button" class="pl-btn pl-btn--primary pl-btn--sm" onclick="openPublicDemo()">Demander une démo</button>
                </div>
                <nav aria-label="Produit">
                    <h3>Produit</h3>
                    <ul>
                        ${link('Fonctionnalités', "publicRouter('fonctionnalites')")}
                        ${link('Tarifs', "publicRouter('tarifs')")}
                        ${link('Suivre un transport', "publicRouter('tracking')")}
                        <li><a href="login.html">Se connecter</a></li>
                    </ul>
                </nav>
                <nav aria-label="Entreprise">
                    <h3>Entreprise</h3>
                    <ul>
                        ${link('À propos', "publicScrollTo('a-propos')")}
                        ${link('Contact', "publicRouter('contact')")}
                        <li><a href="mailto:${esc(L.email)}">${esc(L.email)}</a></li>
                        ${L.phone ? `<li><a href="tel:${esc(L.phone.replace(/\s+/g, ''))}">${esc(L.phone)}</a></li>` : ''}
                    </ul>
                </nav>
                <nav aria-label="Informations légales">
                    <h3>Légal</h3>
                    <ul>
                        ${link('Mentions légales', "openLegalPage('legal')")}
                        ${link('Confidentialité', "openLegalPage('privacy')")}
                        ${link('CGU', "openLegalPage('terms')")}
                        ${link('CGV', "openLegalPage('cgv')")}
                        ${link('Cookies', "openLegalPage('cookies')")}
                    </ul>
                </nav>
            </div>
            <div class="pl-container pl-footer-bottom">
                <p>© ${new Date().getFullYear()} ${esc(L.brand || 'Flenova')}${L.company ? ` — un service édité par ${esc(L.company)}` : ''}${L.rcs ? `, ${esc(L.rcs)}` : ''}.</p>
            </div>
        </footer>`;
    }

    function renderCtaBand(title, text) {
        return `
        <section class="pl-cta">
            <div class="pl-container pl-cta-inner pl-reveal">
                <div>
                    <h2>${title}</h2>
                    <p>${esc(text)}</p>
                </div>
                <div class="pl-cta-actions">
                    <button type="button" class="pl-btn pl-btn--light" onclick="openPublicDemo()">Demander une démo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                    <button type="button" class="pl-btn pl-btn--outline-light" onclick="publicRouter('tarifs')">Voir les tarifs</button>
                </div>
            </div>
        </section>`;
    }

    const FEATURE_MODULES = [
        {
            id: 'f-exploitation',
            nav: 'Exploitation',
            icon: 'fa-calendar-week',
            kicker: 'Exploitation',
            title: 'Commandes et planning <strong>sans tableur</strong>',
            lead: 'Créez vos ordres de transport, affectez chauffeurs et véhicules, et suivez chaque statut en temps réel.',
            points: [
                'Ordres de transport : client, trajet, marchandise, prix HT',
                'Planning hebdomadaire par glisser-déposer, vue jour par chauffeur',
                'Kilométrage et CO₂ calculés automatiquement',
                'Statuts suivis du brouillon à la livraison validée'
            ],
            src: 'assets/screens/planning.webp', width: 2880, height: 1800, frame: true,
            alt: 'Planning hebdomadaire Flenova avec ordres de transport, chauffeurs et prix'
        },
        {
            id: 'f-affretement',
            nav: 'Affrètement',
            icon: 'fa-handshake',
            kicker: 'Affrètement & sous-traitants',
            title: 'Vos affrètements, <strong>marge comprise</strong>',
            lead: 'Confiez un transport à un sous-traitant en deux clics et gardez la main sur la rentabilité.',
            points: [
                'Prix d’achat, prix de vente et marge par transport',
                'Confirmation d’affrètement générée en PDF',
                'Attestations RC Pro et URSSAF suivies, alertes avant expiration',
                'Facture d’achat préremplie à chaque affrètement'
            ],
            src: 'assets/screens/affretement.webp', width: 2880, height: 940, frame: true,
            alt: 'Liste des transports affrétés Flenova : client, sous-traitant, trajet et statut'
        },
        {
            id: 'f-mobile',
            nav: 'App chauffeur',
            icon: 'fa-mobile-screen-button',
            kicker: 'Mobile chauffeur',
            title: 'Le terrain <strong>connecté au bureau</strong>',
            lead: 'Vos chauffeurs reçoivent leurs missions sur leur téléphone et remontent tout, en direct.',
            points: [
                'Missions assignées avec adresses et consignes',
                'Arrivée au chargement et à la livraison géolocalisée',
                'Signature et preuve de livraison sur le téléphone',
                'Photos et documents remontés instantanément'
            ],
            src: 'assets/screens/mobile-chauffeur.webp', width: 1536, height: 1024, frame: false,
            alt: 'Illustration de l’application chauffeur Flenova : missions, carte, signature et preuve de livraison'
        },
        {
            id: 'f-facturation',
            nav: 'Facturation',
            icon: 'fa-file-invoice-dollar',
            kicker: 'Facturation & comptabilité',
            title: 'De la livraison à la facture, <strong>sans ressaisie</strong>',
            lead: 'Le transport validé devient une facture conforme, prête à envoyer et à exporter.',
            points: [
                'Préfacturation depuis les transports validés',
                'Factures Factur-X EN 16931, numérotation continue',
                'Paiements, relances et avoirs suivis',
                'Export comptable CSV pour votre expert-comptable'
            ],
            src: 'assets/screens/factures.webp', width: 2880, height: 1400, frame: true,
            alt: 'Liste des factures Flenova : numéros, clients, montants et statuts de paiement'
        }
    ];

    const FEATURE_EXTRAS = [
        ['fa-chart-pie', 'Tableau de bord', 'Chiffre d’affaires, marges, transports en cours et alertes.'],
        ['fa-truck', 'Gestion de flotte', 'Véhicules, maintenance, assurance et kilométrage.'],
        ['fa-building-user', 'Clients', 'Fiches clients, contacts et historique des transports.'],
        ['fa-pallet', 'Palettes Europe', 'Échanges et retours de palettes suivis par client.'],
        ['fa-location-dot', 'Suivi client', 'Un lien de suivi en ligne pour vos clients, sans compte.'],
        ['fa-users-gear', 'Multi-utilisateurs', 'Rôles exploitant, comptable, lecture : chacun voit ce qu’il doit voir.']
    ];

    function renderFeaturesPage() {
        const nav = FEATURE_MODULES.map((m) => `
            <a href="#${m.id}" class="pl-subnav-link" data-target="${m.id}" onclick="publicScrollTo('${m.id}'); return false;">
                <i class="fa-solid ${m.icon}" aria-hidden="true"></i>${esc(m.nav)}
            </a>`).join('');
        const modules = FEATURE_MODULES.map((m, i) => `
            <section class="pl-feature${i % 2 ? ' pl-feature--reverse' : ''}" id="${m.id}" aria-labelledby="${m.id}-title">
                <div class="pl-container pl-feature-grid">
                    <div class="pl-feature-copy pl-reveal">
                        <p class="pl-kicker"><i class="fa-solid ${m.icon}" aria-hidden="true"></i> ${esc(m.kicker)}</p>
                        <h2 id="${m.id}-title" class="pl-title pl-title--left">${m.title}</h2>
                        <p class="pl-lead">${esc(m.lead)}</p>
                        <ul class="pl-checklist">${m.points.map((p) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(p)}</li>`).join('')}</ul>
                        <button type="button" class="pl-link" onclick="openPublicDemo()">Voir ce module en démo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                    <div class="pl-feature-visual pl-reveal" style="--d:120ms">
                        ${m.frame
                            ? `<figure class="pl-browser"><div class="pl-browser-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                                <a href="${m.src}" target="_blank" rel="noopener" title="Voir en taille réelle"><img src="${m.src}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" decoding="async"></a></figure>`
                            : `<img class="pl-illustration" src="${m.src}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" decoding="async">`}
                    </div>
                </div>
            </section>`).join('');
        const extras = FEATURE_EXTRAS.map(([icon, title, text], i) => `
            <article class="pl-card pl-extra pl-reveal" style="--d:${(i % 3) * 80}ms">
                <span class="pl-audience-icon"><i class="fa-solid ${icon}" aria-hidden="true"></i></span>
                <h3>${esc(title)}</h3>
                <p>${esc(text)}</p>
            </article>`).join('');
        const mvp = typeof renderPublicMvpCycle === 'function' ? renderPublicMvpCycle(true) : '';
        const faq = typeof renderPublicFaq === 'function' ? renderPublicFaq() : '';
        return `<div class="pl-page pl-page--features">
            <section class="pl-page-hero">
                <div class="pl-hero-glow pl-hero-glow--a" aria-hidden="true"></div>
                <div class="pl-container">
                    <p class="pl-kicker pl-enter" style="--d:0ms">Fonctionnalités</p>
                    <h1 class="pl-page-title pl-enter" style="--d:80ms">Tout votre transport,<br><span class="pl-gradient-text">une seule plateforme.</span></h1>
                    <p class="pl-lead pl-enter" style="--d:160ms">De la prise de commande à la facture électronique : exploitation, chauffeurs, sous-traitants et comptabilité réunis dans un TMS pensé pour les PME.</p>
                    <div class="pl-hero-actions pl-enter" style="--d:240ms">
                        <button type="button" class="pl-btn pl-btn--primary" onclick="openPublicDemo()">Demander une démo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                        <button type="button" class="pl-btn pl-btn--ghost" onclick="publicRouter('tarifs')">Voir les tarifs</button>
                    </div>
                </div>
            </section>
            <nav class="pl-subnav" aria-label="Modules"><div class="pl-container pl-subnav-inner">${nav}</div></nav>
            ${modules}
            <section class="pl-section pl-section--tint" aria-labelledby="pl-extras-title">
                <div class="pl-container">
                    <header class="pl-head pl-reveal">
                        <p class="pl-kicker">Et aussi</p>
                        <h2 id="pl-extras-title" class="pl-title">Tout ce qu’il faut <strong>au quotidien</strong></h2>
                    </header>
                    <div class="pl-grid-3">${extras}</div>
                </div>
            </section>
            <div class="pl-reveal">${mvp}</div>
            ${faq}
            ${renderCtaBand('Voyons Flenova <strong>sur vos propres transports</strong>', 'Une démo personnalisée avec un conseiller, sans engagement. Rappel sous 24 h ouvrées.')}
            ${renderFooter()}
        </div>`;
    }

    // ─────────────────────────────────────────────────────────────
    // Pages
    // ─────────────────────────────────────────────────────────────

    window.renderPublicFeaturesPage = renderFeaturesPage;

    window.renderPublicLandingHome = function () {
        const mvp = typeof renderPublicMvpCycle === 'function' ? renderPublicMvpCycle(false) : '';
        const reviews = typeof renderPublicReviewsLoading === 'function' ? renderPublicReviewsLoading() : '';
        const faq = typeof renderPublicFaq === 'function' ? renderPublicFaq() : '';
        return `<div class="pl-page">
            ${renderHero()}
            ${renderCapabilities()}
            ${renderAudiences()}
            ${renderShowcase()}
            <div class="pl-reveal">${mvp}</div>
            ${renderFigures()}
            ${renderAbout()}
            ${reviews}
            ${faq}
            ${renderDemoSection()}
            ${renderFooter()}
        </div>`;
    };

    window.renderPublicContactPage = function () {
        return `<div class="pl-page pl-page--contact">
            <section class="pl-demo pl-demo--page" aria-label="Contact et demande de démo">
                <div class="pl-container pl-demo-grid">
                    ${renderDemoAside(false)}
                    <div class="pd-card pl-enter" style="--d:120ms">${renderDemoForm()}</div>
                </div>
            </section>
            ${renderFooter()}
        </div>`;
    };

    // ─────────────────────────────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────────────────────────────

    /** Défile vers une section de l'accueil (y compris depuis une autre page). */
    window.publicScrollTo = function (id) {
        const go = () => {
            const el = document.getElementById(id);
            if (!el) return;
            el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        };
        if (!document.getElementById(id) && typeof publicRouter === 'function') {
            publicRouter('home');
            setTimeout(go, 60);
        } else {
            go();
        }
    };

    /**
     * Point d'entrée unique des demandes de démo : page contact, formulaire
     * en mode « démo », champs préremplis (activité, forfait consulté).
     */
    window.openPublicDemo = function (prefill = {}) {
        window.__publicDemoPrefill = { type: 'demo', ...prefill };
        if (typeof publicRouter === 'function') publicRouter('contact');
    };

    // ─────────────────────────────────────────────────────────────
    // Formulaire : comportement
    // ─────────────────────────────────────────────────────────────

    window.setPublicDemoType = function (type) {
        const form = document.getElementById('pd-form');
        if (!form) return;
        form.dataset.type = type;
        form.querySelectorAll('[data-demo-only]').forEach((el) => { el.hidden = type !== 'demo'; });
        form.querySelectorAll('[data-question-only]').forEach((el) => { el.hidden = type !== 'question'; });
        form.querySelectorAll('[data-required-demo]').forEach((el) => { el.required = type === 'demo'; });
        form.querySelectorAll('[data-required-question]').forEach((el) => { el.required = type === 'question'; });
        const radio = form.querySelector(`input[name="pd-type"][value="${type}"]`);
        if (radio) radio.checked = true;
    };

    function applyDemoPrefill() {
        const form = document.getElementById('pd-form');
        if (!form) return;
        // Conservé tant qu'on reste sur la page contact : le changement
        // d'ancre (#contact) relance le rendu une seconde fois.
        const p = window.__publicDemoPrefill || {};
        setPublicDemoType(p.type === 'question' ? 'question' : 'demo');
        if (p.activity) form.elements.activity.value = p.activity;
        if (p.plan) form.dataset.plan = p.plan;
        if (p.subject) form.elements.subject.value = p.subject;
        if (p.message) form.elements.message.value = p.message;
    }

    function showFormError(message, field) {
        const el = document.getElementById('pd-error');
        if (el) {
            el.textContent = message;
            el.hidden = !message;
        }
        if (field) field.focus();
    }

    window.submitPublicDemo = async function (event) {
        event.preventDefault();
        const form = event.target;
        const type = form.dataset.type === 'question' ? 'question' : 'demo';
        showFormError('');
        const invalid = Array.from(form.elements).find((el) => el.willValidate && !el.hidden && !el.closest('[hidden]') && !el.checkValidity());
        if (invalid) {
            const label = form.querySelector(`label[for="${invalid.id}"]`)?.textContent.replace('*', '').trim() || 'Ce champ';
            showFormError(invalid.validity.typeMismatch ? `${label} : adresse invalide.` : `${label} est obligatoire.`, invalid);
            return;
        }
        const v = (name) => form.elements[name]?.value?.trim() || '';
        const body = {
            request_type: type,
            name: v('name'),
            email: v('email'),
            phone: v('phone') || undefined,
            message: v('message') || undefined
        };
        if (type === 'demo') {
            Object.assign(body, {
                company: v('company'),
                activity: v('activity') || undefined,
                fleet_size: v('fleet_size') || undefined,
                current_tool: v('current_tool') || undefined,
                needs: Array.from(form.querySelectorAll('input[name="needs"]:checked')).map((c) => c.value),
                plan: form.dataset.plan || undefined
            });
        } else {
            body.subject = v('subject');
        }

        const btn = form.querySelector('.pd-submit');
        btn.disabled = true;
        btn.classList.add('is-loading');
        try {
            const res = await fetch('/api/contact/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                showFormError(data.error || data.message || 'Envoi impossible, réessayez dans un instant.');
                return;
            }
            form.hidden = true;
            window.__publicDemoPrefill = null;
            const ok = document.getElementById('pd-success');
            const text = document.getElementById('pd-success-text');
            if (text) text.textContent = data.message || 'Message envoyé.';
            if (ok) {
                ok.hidden = false;
                ok.focus();
            }
        } catch {
            showFormError('Serveur injoignable — vérifiez votre connexion et réessayez.');
        } finally {
            btn.disabled = false;
            btn.classList.remove('is-loading');
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Vitrine produits
    // ─────────────────────────────────────────────────────────────

    const SHOWCASE_INTERVAL_MS = 7000;
    let showcaseTimer = null;

    function stopShowcase() {
        clearInterval(showcaseTimer);
        showcaseTimer = null;
        document.querySelector('.pl-showcase')?.classList.remove('is-playing');
    }

    window.selectPublicShowcase = function (key, byUser) {
        const shot = SHOWCASE.find((s) => s.key === key);
        if (!shot) return;
        if (byUser) stopShowcase();
        SHOWCASE.forEach((s) => {
            const tab = document.getElementById(`pl-tab-${s.key}`);
            if (!tab) return;
            const active = s.key === key;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        const panel = document.getElementById('pl-showcase-panel');
        if (!panel) return;
        panel.setAttribute('aria-labelledby', `pl-tab-${key}`);
        panel.classList.remove('is-swapping');
        void panel.offsetWidth; // relance l'animation de transition
        panel.classList.add('is-swapping');
        const img = document.getElementById('pl-showcase-img');
        if (img) {
            img.src = shot.src;
            img.alt = shot.alt;
            img.width = shot.width;
            img.height = shot.height;
        }
        document.getElementById('pl-showcase-link')?.setAttribute('href', shot.src);
        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        set('pl-showcase-title', esc(shot.title));
        set('pl-showcase-text', esc(shot.text));
        set('pl-showcase-points', shot.points.map((p) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(p)}</li>`).join(''));
    };

    window.publicShowcaseKey = function (event, index) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
        const next = SHOWCASE[(index + step + SHOWCASE.length) % SHOWCASE.length];
        selectPublicShowcase(next.key, true);
        document.getElementById(`pl-tab-${next.key}`)?.focus();
    };

    function startShowcase() {
        stopShowcase();
        const box = document.querySelector('.pl-showcase');
        if (!box || reducedMotion()) return;
        // Préchargement des captures pour des transitions sans saut.
        SHOWCASE.slice(1).forEach((s) => { const i = new Image(); i.src = s.src; });
        box.classList.add('is-playing');
        box.style.setProperty('--pl-interval', `${SHOWCASE_INTERVAL_MS}ms`);
        showcaseTimer = setInterval(() => {
            if (!document.body.contains(box)) { stopShowcase(); return; }
            if (box.matches(':hover') || box.contains(document.activeElement)) return;
            const current = SHOWCASE.findIndex((s) => document.getElementById(`pl-tab-${s.key}`)?.classList.contains('is-active'));
            const next = SHOWCASE[(current + 1) % SHOWCASE.length];
            selectPublicShowcase(next.key, false);
        }, SHOWCASE_INTERVAL_MS);
    }

    // ─────────────────────────────────────────────────────────────
    // Animations au défilement
    // ─────────────────────────────────────────────────────────────

    function animateCount(el) {
        const target = Number(el.dataset.target) || 0;
        if (reducedMotion()) { el.textContent = target.toLocaleString('fr-FR'); return; }
        const start = performance.now();
        const duration = 1200;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
            if (t < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0';
        requestAnimationFrame(tick);
    }

    function initReveal(root) {
        const items = root.querySelectorAll('.pl-reveal, .pl-count');
        if (!('IntersectionObserver' in window) || reducedMotion()) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        root.classList.add('pl-js');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.classList.contains('pl-count')) animateCount(el);
                else el.classList.add('is-visible');
                io.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
        items.forEach((el) => io.observe(el));
    }

    function initSubnav(root) {
        const links = root.querySelectorAll('.pl-subnav-link');
        if (!links.length || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((l) => {
                    const active = l.dataset.target === entry.target.id;
                    l.classList.toggle('is-active', active);
                    if (active) {
                        l.setAttribute('aria-current', 'true');
                        // Mobile : garder l'onglet actif visible dans la barre (défilement horizontal seul).
                        const bar = l.parentElement;
                        const left = l.offsetLeft - (bar.clientWidth - l.offsetWidth) / 2;
                        bar.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? 'auto' : 'smooth' });
                    } else {
                        l.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        links.forEach((l) => { const t = document.getElementById(l.dataset.target); if (t) io.observe(t); });
    }

    /** Appelée par publicRouter après le rendu d'une page publique. */
    window.initPublicLandingPage = function (route) {
        const root = document.querySelector('.pl-page');
        if (route !== 'contact') window.__publicDemoPrefill = null;
        if (!root) { stopShowcase(); return; }
        initReveal(root);
        initSubnav(root);
        if (route === 'home') startShowcase();
        else stopShowcase();
        applyDemoPrefill();
        if (route === 'contact') {
            document.getElementById('pd-company')?.focus({ preventScroll: true });
        }
    };
}());
