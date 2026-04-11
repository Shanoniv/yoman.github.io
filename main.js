window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.getElementById('scroll-progress');

    if (progressBar) {
        progressBar.style.setProperty('--scroll', `${scrollPercent}%`);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cYoman Publicidad listo', 'color:#FFCC00; font-size:16px; font-weight:700');

    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');

    const setContactStatus = (message, type) => {
        if (!contactStatus) {
            return;
        }

        contactStatus.textContent = message;
        contactStatus.className = `status-banner ${type}`;
    };

    const applySiteConfig = (config) => {
        document.title = config.page_title;

        const metaDescription = document.getElementById('page-meta-description');
        if (metaDescription) {
            metaDescription.setAttribute('content', config.meta_description);
        }

        const textMap = [
            ['hero-badge', config.hero_badge, false],
            ['hero-title', config.hero_title, true],
            ['hero-subtitle', config.hero_subtitle, false],
            ['eco-badge', config.eco_badge, false],
            ['eco-title', config.eco_title, false],
            ['eco-card1-title', config.eco_card1_title, false],
            ['eco-card1-desc', config.eco_card1_desc, false],
            ['eco-card2-title', config.eco_card2_title, false],
            ['eco-card2-desc', config.eco_card2_desc, false],
            ['eco-card3-title', config.eco_card3_title, false],
            ['eco-card3-desc', config.eco_card3_desc, false],
            ['portfolio-title', config.portfolio_title, false],
            ['showcase-title', config.showcase_title, false],
            ['contact-badge', config.contact_badge, false],
            ['contact-title', config.contact_title, false],
            ['contact-description', config.contact_description, false],
            ['footer-text', config.footer_text, true]
        ];

        textMap.forEach(([id, value, allowHtml]) => {
            const element = document.getElementById(id);
            if (!element || !value) {
                return;
            }

            if (allowHtml) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        });

        const primaryCta = document.getElementById('hero-primary-cta');
        if (primaryCta) {
            primaryCta.textContent = config.hero_primary_cta_label;
            primaryCta.href = config.hero_primary_cta_url;
        }

        const secondaryCta = document.getElementById('hero-secondary-cta');
        if (secondaryCta) {
            secondaryCta.textContent = config.hero_secondary_cta_label;
            secondaryCta.href = config.hero_secondary_cta_url;
        }

        const whatsappLink = document.getElementById('nav-whatsapp-link');
        if (whatsappLink && config.phone) {
            whatsappLink.href = `https://wa.me/${config.phone}`;
        }

        ['portfolio1', 'portfolio2', 'portfolio3', 'portfolio4'].forEach((key, index) => {
            const image = document.getElementById(`portfolio-img-${index + 1}`);
            if (image && config[key]) {
                image.src = config[key];
            }
        });

        const showcaseSource = document.getElementById('video-source');
        const showcaseVideo = document.getElementById('demo-video');
        if (showcaseSource && config.video_src) {
            showcaseSource.src = config.video_src;
            if (showcaseVideo) {
                showcaseVideo.load();
            }
        }

        const heroSource = document.getElementById('hero-video-source');
        const heroVideo = document.getElementById('hero-video');
        if (heroSource && config.hero_video_url) {
            heroSource.src = config.hero_video_url;
            if (heroVideo) {
                heroVideo.load();
            }
        }
    };

    if (!window.YomanSupabase || !window.YomanSupabase.isConfigured()) {
        if (contactForm) {
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                setContactStatus('Completa primero la configuracion de Supabase para guardar mensajes.', 'error');
            });
        }
        return;
    }

    window.YomanSupabase.loadPublicSiteConfig()
        .then((config) => {
            if (config) {
                applySiteConfig(config);
            }
        })
        .catch((error) => {
            console.error('No se pudo cargar la configuracion desde Supabase.', error);
        });

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-60', 'cursor-not-allowed');
            setContactStatus('Enviando tu solicitud...', 'info');

            const formData = new FormData(contactForm);
            const payload = {
                name: String(formData.get('name') || '').trim(),
                phone: String(formData.get('phone') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                business_type: String(formData.get('business_type') || '').trim(),
                message: String(formData.get('message') || '').trim()
            };

            try {
                await window.YomanSupabase.createLead(payload);
                contactForm.reset();
                setContactStatus('Mensaje enviado. Te contactaremos pronto.', 'success');
            } catch (error) {
                console.error('No se pudo guardar el lead.', error);
                setContactStatus(`No se pudo enviar: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-60', 'cursor-not-allowed');
            }
        });
    }
});
