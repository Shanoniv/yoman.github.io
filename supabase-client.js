(function () {
    const DEFAULT_SITE_CONFIG = {
        page_title: 'Yoman Publicidad',
        meta_description: 'Yoman Publicidad. Automatizacion de ventas y marketing digital para inmobiliarias, hoteles y construccion en RD.',
        footer_text: '&copy; 2026 Yoman Publicidad',
        hero_badge: 'ECO YOMAN 2026',
        hero_title: "Tus ventas<br>que <span class='text-[#FFCC00]'>funcionan solas</span>",
        hero_subtitle: 'Automatizacion inteligente para inmobiliarias, hoteles y construccion.',
        hero_primary_cta_label: 'Activar Eco Yoman',
        hero_primary_cta_url: '#eco-yoman',
        hero_secondary_cta_label: 'Ver portafolio',
        hero_secondary_cta_url: '#portafolio',
        hero_video_url: 'https://assets.mixkit.co/videos/preview/1234/1234-small.mp4',
        eco_badge: 'Eco Yoman',
        eco_title: 'Tu ecosistema digital que vende 24/7',
        eco_card1_title: 'Captacion Inteligente',
        eco_card1_desc: 'Meta Ads, Google Ads y YouTube hipersegmentados.',
        eco_card2_title: 'Automatizacion Total',
        eco_card2_desc: 'WhatsApp Bots, CRM y funnels inteligentes.',
        eco_card3_title: 'Cierre y Fidelizacion',
        eco_card3_desc: 'Reservas automaticas y remarketing 24/7.',
        portfolio_title: 'Portafolio',
        portfolio1: 'https://picsum.photos/id/1015/600/600',
        portfolio2: 'https://picsum.photos/id/201/600/600',
        portfolio3: 'https://picsum.photos/id/301/600/600',
        portfolio4: 'https://picsum.photos/id/401/600/600',
        showcase_title: 'Nuestro trabajo en movimiento',
        video_src: 'https://assets.mixkit.co/videos/preview/1234/1234-small.mp4',
        contact_badge: 'Contacto',
        contact_title: 'Solicita tu propuesta',
        contact_description: 'Cuentanos que tipo de negocio tienes y te ayudamos a montar una captacion automatizada con seguimiento real.',
        phone: '8294840202',
        email: 'yomanpublicidad@gmail.com'
    };

    const rawConfig = window.YomanSupabaseConfig || {};
    const hasValidConfig =
        typeof rawConfig.url === 'string' &&
        typeof rawConfig.anonKey === 'string' &&
        rawConfig.url.trim() &&
        rawConfig.anonKey.trim() &&
        rawConfig.url !== 'TU_SUPABASE_URL' &&
        rawConfig.anonKey !== 'TU_SUPABASE_ANON_KEY';

    const supabase = hasValidConfig
        ? window.supabase.createClient(rawConfig.url, rawConfig.anonKey)
        : null;

    async function loadPublicSiteConfig() {
        if (!supabase) {
            return { ...DEFAULT_SITE_CONFIG };
        }

        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || { ...DEFAULT_SITE_CONFIG };
    }

    async function saveSiteConfig(config) {
        if (!supabase) {
            throw new Error('Supabase no esta configurado.');
        }

        const payload = {
            id: 1,
            updated_at: new Date().toISOString(),
            ...config
        };

        const { data, error } = await supabase
            .from('site_config')
            .upsert(payload, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async function createLead(lead) {
        if (!supabase) {
            throw new Error('Supabase no esta configurado.');
        }

        const payload = {
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            business_type: lead.business_type,
            message: lead.message
        };

        const { data, error } = await supabase
            .from('leads')
            .insert(payload)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async function listLeads() {
        if (!supabase) {
            throw new Error('Supabase no esta configurado.');
        }

        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    }

    async function uploadMedia(file, folder) {
        if (!supabase) {
            throw new Error('Supabase no esta configurado.');
        }

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const path = `${folder}/${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from('yoman-media')
            .upload(path, file, { upsert: false });

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('yoman-media')
            .getPublicUrl(path);

        return data.publicUrl;
    }

    async function getSession() {
        if (!supabase) {
            return { session: null, error: null };
        }

        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    }

    window.YomanSupabase = {
        client: supabase,
        defaultSiteConfig: DEFAULT_SITE_CONFIG,
        isConfigured() {
            return Boolean(supabase);
        },
        async requireSession() {
            const { session, error } = await getSession();
            if (error) {
                throw error;
            }
            return session;
        },
        async signInWithPassword(email, password) {
            if (!supabase) {
                throw new Error('Configura tu URL y anon key de Supabase antes de iniciar sesion.');
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            return data;
        },
        async signOut() {
            if (!supabase) {
                return;
            }

            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
        },
        loadPublicSiteConfig,
        saveSiteConfig,
        createLead,
        listLeads,
        uploadMedia
    };
})();
