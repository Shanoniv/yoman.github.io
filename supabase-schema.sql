create table if not exists public.site_config (
    id bigint primary key,
    page_title text not null,
    meta_description text not null,
    footer_text text not null,
    hero_badge text not null,
    hero_title text not null,
    hero_subtitle text not null,
    hero_primary_cta_label text not null,
    hero_primary_cta_url text not null,
    hero_secondary_cta_label text not null,
    hero_secondary_cta_url text not null,
    hero_video_url text not null,
    eco_badge text not null,
    eco_title text not null,
    eco_card1_title text not null,
    eco_card1_desc text not null,
    eco_card2_title text not null,
    eco_card2_desc text not null,
    eco_card3_title text not null,
    eco_card3_desc text not null,
    portfolio_title text not null,
    portfolio1 text not null,
    portfolio2 text not null,
    portfolio3 text not null,
    portfolio4 text not null,
    showcase_title text not null,
    video_src text not null,
    contact_badge text not null,
    contact_title text not null,
    contact_description text not null,
    phone text not null,
    email text not null,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.site_config
    add column if not exists page_title text not null default 'Yoman Publicidad',
    add column if not exists meta_description text not null default 'Yoman Publicidad. Automatizacion de ventas y marketing digital para inmobiliarias, hoteles y construccion en RD.',
    add column if not exists footer_text text not null default '&copy; 2026 Yoman Publicidad',
    add column if not exists hero_badge text not null default 'ECO YOMAN 2026',
    add column if not exists hero_primary_cta_label text not null default 'Activar Eco Yoman',
    add column if not exists hero_primary_cta_url text not null default '#eco-yoman',
    add column if not exists hero_secondary_cta_label text not null default 'Ver portafolio',
    add column if not exists hero_secondary_cta_url text not null default '#portafolio',
    add column if not exists hero_video_url text not null default 'https://assets.mixkit.co/videos/preview/1234/1234-small.mp4',
    add column if not exists eco_badge text not null default 'Eco Yoman',
    add column if not exists eco_title text not null default 'Tu ecosistema digital que vende 24/7',
    add column if not exists eco_card1_title text not null default 'Captacion Inteligente',
    add column if not exists eco_card1_desc text not null default 'Meta Ads, Google Ads y YouTube hipersegmentados.',
    add column if not exists eco_card2_title text not null default 'Automatizacion Total',
    add column if not exists eco_card2_desc text not null default 'WhatsApp Bots, CRM y funnels inteligentes.',
    add column if not exists eco_card3_title text not null default 'Cierre y Fidelizacion',
    add column if not exists eco_card3_desc text not null default 'Reservas automaticas y remarketing 24/7.',
    add column if not exists portfolio_title text not null default 'Portafolio',
    add column if not exists showcase_title text not null default 'Nuestro trabajo en movimiento',
    add column if not exists contact_badge text not null default 'Contacto',
    add column if not exists contact_title text not null default 'Solicita tu propuesta',
    add column if not exists contact_description text not null default 'Cuentanos que tipo de negocio tienes y te ayudamos a montar una captacion automatizada con seguimiento real.';

insert into public.site_config (
    id,
    page_title,
    meta_description,
    footer_text,
    hero_badge,
    hero_title,
    hero_subtitle,
    hero_primary_cta_label,
    hero_primary_cta_url,
    hero_secondary_cta_label,
    hero_secondary_cta_url,
    hero_video_url,
    eco_badge,
    eco_title,
    eco_card1_title,
    eco_card1_desc,
    eco_card2_title,
    eco_card2_desc,
    eco_card3_title,
    eco_card3_desc,
    portfolio_title,
    portfolio1,
    portfolio2,
    portfolio3,
    portfolio4,
    showcase_title,
    video_src,
    contact_badge,
    contact_title,
    contact_description,
    phone,
    email
)
values (
    1,
    'Yoman Publicidad',
    'Yoman Publicidad. Automatizacion de ventas y marketing digital para inmobiliarias, hoteles y construccion en RD.',
    '&copy; 2026 Yoman Publicidad',
    'ECO YOMAN 2026',
    'Tus ventas<br>que <span class=''text-[#FFCC00]''>funcionan solas</span>',
    'Automatizacion inteligente para inmobiliarias, hoteles y construccion.',
    'Activar Eco Yoman',
    '#eco-yoman',
    'Ver portafolio',
    '#portafolio',
    'https://assets.mixkit.co/videos/preview/1234/1234-small.mp4',
    'Eco Yoman',
    'Tu ecosistema digital que vende 24/7',
    'Captacion Inteligente',
    'Meta Ads, Google Ads y YouTube hipersegmentados.',
    'Automatizacion Total',
    'WhatsApp Bots, CRM y funnels inteligentes.',
    'Cierre y Fidelizacion',
    'Reservas automaticas y remarketing 24/7.',
    'Portafolio',
    'https://picsum.photos/id/1015/600/600',
    'https://picsum.photos/id/201/600/600',
    'https://picsum.photos/id/301/600/600',
    'https://picsum.photos/id/401/600/600',
    'Nuestro trabajo en movimiento',
    'https://assets.mixkit.co/videos/preview/1234/1234-small.mp4',
    'Contacto',
    'Solicita tu propuesta',
    'Cuentanos que tipo de negocio tienes y te ayudamos a montar una captacion automatizada con seguimiento real.',
    '8294840202',
    'yomanpublicidad@gmail.com'
)
on conflict (id) do nothing;

alter table public.site_config enable row level security;

drop policy if exists "Public can read site config" on public.site_config;
drop policy if exists "Authenticated users can insert site config" on public.site_config;
drop policy if exists "Authenticated users can update site config" on public.site_config;

create policy "Public can read site config"
on public.site_config
for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert site config"
on public.site_config
for insert
to authenticated
with check (true);

create policy "Authenticated users can update site config"
on public.site_config
for update
to authenticated
using (true)
with check (true);

create table if not exists public.leads (
    id bigint generated always as identity primary key,
    name text not null,
    phone text not null,
    email text not null,
    business_type text not null,
    message text not null,
    created_at timestamptz not null default timezone('utc', now())
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
drop policy if exists "Authenticated users can read leads" on public.leads;

create policy "Anyone can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can read leads"
on public.leads
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('yoman-media', 'yoman-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view yoman media" on storage.objects;
drop policy if exists "Authenticated can upload yoman media" on storage.objects;
drop policy if exists "Authenticated can update yoman media" on storage.objects;

create policy "Public can view yoman media"
on storage.objects
for select
to public
using (bucket_id = 'yoman-media');

create policy "Authenticated can upload yoman media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'yoman-media');

create policy "Authenticated can update yoman media"
on storage.objects
for update
to authenticated
using (bucket_id = 'yoman-media')
with check (bucket_id = 'yoman-media');
