document.addEventListener('DOMContentLoaded', async () => {
    const statusBanner = document.getElementById('dashboard-status');
    const leadsStatus = document.getElementById('leads-status');
    const leadsList = document.getElementById('leads-list');
    const leadsEmpty = document.getElementById('leads-empty');
    const saveButton = document.getElementById('save-config-button');
    const resetButton = document.getElementById('reset-config-button');
    const logoutButton = document.getElementById('logout-button');
    const refreshLeadsButton = document.getElementById('refresh-leads-button');
    const uploadButtons = {
        hero_video_url: document.getElementById('upload-hero-video-button'),
        portfolio1: document.getElementById('upload-p1-button'),
        portfolio2: document.getElementById('upload-p2-button'),
        portfolio3: document.getElementById('upload-p3-button'),
        portfolio4: document.getElementById('upload-p4-button'),
        video_src: document.getElementById('upload-showcase-video-button')
    };
    const fileInputs = {
        hero_video_url: document.getElementById('heroVideoFileInput'),
        portfolio1: document.getElementById('p1FileInput'),
        portfolio2: document.getElementById('p2FileInput'),
        portfolio3: document.getElementById('p3FileInput'),
        portfolio4: document.getElementById('p4FileInput'),
        video_src: document.getElementById('showcaseVideoFileInput')
    };

    const fields = {
        page_title: document.getElementById('pageTitleInput'),
        meta_description: document.getElementById('metaDescriptionInput'),
        phone: document.getElementById('phoneInput'),
        email: document.getElementById('emailInput'),
        footer_text: document.getElementById('footerTextInput'),
        hero_badge: document.getElementById('heroBadgeInput'),
        hero_title: document.getElementById('heroTitleInput'),
        hero_subtitle: document.getElementById('heroSubtitleInput'),
        hero_primary_cta_label: document.getElementById('heroPrimaryCtaLabelInput'),
        hero_primary_cta_url: document.getElementById('heroPrimaryCtaUrlInput'),
        hero_secondary_cta_label: document.getElementById('heroSecondaryCtaLabelInput'),
        hero_secondary_cta_url: document.getElementById('heroSecondaryCtaUrlInput'),
        hero_video_url: document.getElementById('heroVideoUrlInput'),
        eco_badge: document.getElementById('ecoBadgeInput'),
        eco_title: document.getElementById('ecoTitleInput'),
        eco_card1_title: document.getElementById('ecoCard1TitleInput'),
        eco_card1_desc: document.getElementById('ecoCard1DescInput'),
        eco_card2_title: document.getElementById('ecoCard2TitleInput'),
        eco_card2_desc: document.getElementById('ecoCard2DescInput'),
        eco_card3_title: document.getElementById('ecoCard3TitleInput'),
        eco_card3_desc: document.getElementById('ecoCard3DescInput'),
        portfolio_title: document.getElementById('portfolioTitleInput'),
        portfolio1: document.getElementById('p1'),
        portfolio2: document.getElementById('p2'),
        portfolio3: document.getElementById('p3'),
        portfolio4: document.getElementById('p4'),
        showcase_title: document.getElementById('showcaseTitleInput'),
        video_src: document.getElementById('videoInput'),
        contact_badge: document.getElementById('contactBadgeInput'),
        contact_title: document.getElementById('contactTitleInput'),
        contact_description: document.getElementById('contactDescriptionInput')
    };

    const setStatus = (message, type) => {
        statusBanner.textContent = message;
        statusBanner.className = `status-banner ${type} mb-8`;
    };

    const setDisabledState = (disabled) => {
        [saveButton, resetButton, logoutButton, refreshLeadsButton].forEach((button) => {
            button.disabled = disabled;
            button.classList.toggle('opacity-60', disabled);
            button.classList.toggle('cursor-not-allowed', disabled);
        });

        Object.values(uploadButtons).forEach((button) => {
            if (!button) {
                return;
            }
            button.disabled = disabled;
            button.classList.toggle('opacity-60', disabled);
            button.classList.toggle('cursor-not-allowed', disabled);
        });
    };

    const setLeadsStatus = (message, type) => {
        leadsStatus.textContent = message;
        leadsStatus.className = `status-banner ${type} mt-0 mb-6`;
    };

    const fillForm = (config) => {
        Object.entries(fields).forEach(([key, input]) => {
            input.value = config[key] || '';
        });
    };

    const readForm = () => {
        const result = {};
        Object.entries(fields).forEach(([key, input]) => {
            result[key] = input.value.trim();
        });
        return result;
    };

    const formatLeadDate = (value) => {
        if (!value) {
            return 'Sin fecha';
        }

        return new Intl.DateTimeFormat('es-DO', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(value));
    };

    const renderLeads = (leads) => {
        leadsList.innerHTML = '';

        if (!leads.length) {
            leadsEmpty.classList.remove('hidden');
            return;
        }

        leadsEmpty.classList.add('hidden');

        leads.forEach((lead) => {
            const article = document.createElement('article');
            article.className = 'rounded-3xl border border-white/10 bg-black/50 p-6';
            article.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h3 class="text-xl font-semibold text-white">${lead.name}</h3>
                        <p class="text-sm text-[#FFCC00] mt-1">${lead.business_type}</p>
                    </div>
                    <p class="text-xs text-gray-400">${formatLeadDate(lead.created_at)}</p>
                </div>
                <div class="grid md:grid-cols-2 gap-3 mt-5 text-sm">
                    <p><span class="text-gray-400">Telefono:</span> ${lead.phone}</p>
                    <p><span class="text-gray-400">Email:</span> ${lead.email}</p>
                </div>
                <p class="text-sm text-gray-300 mt-4 leading-6">${lead.message}</p>
            `;
            leadsList.appendChild(article);
        });
    };

    const loadLeads = async () => {
        setLeadsStatus('Cargando leads desde Supabase...', 'info');

        try {
            const leads = await window.YomanSupabase.listLeads();
            renderLeads(leads);
            setLeadsStatus(`Leads cargados: ${leads.length}`, 'success');
        } catch (error) {
            leadsList.innerHTML = '';
            leadsEmpty.classList.add('hidden');
            setLeadsStatus(error.message, 'error');
        }
    };

    const uploadFieldFile = async (fieldKey, folder) => {
        const input = fileInputs[fieldKey];
        const button = uploadButtons[fieldKey];
        const file = input?.files?.[0];

        if (!file) {
            setStatus('Selecciona un archivo antes de subirlo.', 'error');
            return;
        }

        button.disabled = true;
        button.classList.add('opacity-60', 'cursor-not-allowed');
        setStatus(`Subiendo archivo para ${fieldKey}...`, 'info');

        try {
            const url = await window.YomanSupabase.uploadMedia(file, folder);
            fields[fieldKey].value = url;
            input.value = '';
            setStatus(`Archivo subido correctamente en ${fieldKey}. Guarda los cambios para publicarlo.`, 'success');
        } catch (error) {
            setStatus(error.message, 'error');
        } finally {
            button.disabled = false;
            button.classList.remove('opacity-60', 'cursor-not-allowed');
        }
    };

    if (!window.YomanSupabase.isConfigured()) {
        setStatus('Completa assets/js/supabase-config.js para usar el dashboard.', 'error');
        setDisabledState(true);
        return;
    }

    try {
        const session = await window.YomanSupabase.requireSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        const config = await window.YomanSupabase.loadPublicSiteConfig();
        fillForm(config);
        setStatus('Configuracion cargada desde Supabase.', 'success');
        await loadLeads();
    } catch (error) {
        setStatus(error.message, 'error');
        setDisabledState(true);
        return;
    }

    saveButton.addEventListener('click', async () => {
        setDisabledState(true);
        setStatus('Guardando cambios en Supabase...', 'info');

        try {
            await window.YomanSupabase.saveSiteConfig(readForm());
            setStatus('Todos los cambios de la pagina fueron guardados.', 'success');
        } catch (error) {
            setStatus(error.message, 'error');
        } finally {
            setDisabledState(false);
        }
    });

    resetButton.addEventListener('click', async () => {
        if (!window.confirm('Restaurar toda la pagina a los valores por defecto?')) {
            return;
        }

        setDisabledState(true);
        setStatus('Restaurando configuracion...', 'info');

        try {
            const defaultConfig = { ...window.YomanSupabase.defaultSiteConfig };
            fillForm(defaultConfig);
            await window.YomanSupabase.saveSiteConfig(defaultConfig);
            setStatus('Valores por defecto restaurados.', 'success');
        } catch (error) {
            setStatus(error.message, 'error');
        } finally {
            setDisabledState(false);
        }
    });

    logoutButton.addEventListener('click', async () => {
        setDisabledState(true);
        setStatus('Cerrando sesion...', 'info');

        try {
            await window.YomanSupabase.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            setStatus(error.message, 'error');
            setDisabledState(false);
        }
    });

    refreshLeadsButton.addEventListener('click', async () => {
        refreshLeadsButton.disabled = true;
        refreshLeadsButton.classList.add('opacity-60', 'cursor-not-allowed');

        try {
            await loadLeads();
        } finally {
            refreshLeadsButton.disabled = false;
            refreshLeadsButton.classList.remove('opacity-60', 'cursor-not-allowed');
        }
    });

    uploadButtons.hero_video_url.addEventListener('click', async () => uploadFieldFile('hero_video_url', 'hero-videos'));
    uploadButtons.portfolio1.addEventListener('click', async () => uploadFieldFile('portfolio1', 'portfolio'));
    uploadButtons.portfolio2.addEventListener('click', async () => uploadFieldFile('portfolio2', 'portfolio'));
    uploadButtons.portfolio3.addEventListener('click', async () => uploadFieldFile('portfolio3', 'portfolio'));
    uploadButtons.portfolio4.addEventListener('click', async () => uploadFieldFile('portfolio4', 'portfolio'));
    uploadButtons.video_src.addEventListener('click', async () => uploadFieldFile('video_src', 'showcase-videos'));
});
