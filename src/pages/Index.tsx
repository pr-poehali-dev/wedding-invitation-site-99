import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/43ea5717-9b70-406b-b133-9531b1275363/files/3404de04-a10f-4118-8917-77aca42e86c7.jpg';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <section id={id} className={`section-reveal py-24 px-4 ${className}`} ref={ref}>
      {children}
    </section>
  );
}

function GoldLine() {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(to right, transparent, var(--wedding-gold))' }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ background: 'var(--wedding-gold)' }} />
      <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(to left, transparent, var(--wedding-gold))' }} />
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      {subtitle && <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif' }}>{subtitle}</p>}
      <h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}>{children}</h2>
      <GoldLine />
    </div>
  );
}

function Countdown() {
  const weddingDate = new Date('2026-06-06T14:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = weddingDate.getTime() - new Date().getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-10 justify-center mt-14">
      {[
        { val: timeLeft.days, label: 'дней' },
        { val: timeLeft.hours, label: 'часов' },
        { val: timeLeft.minutes, label: 'минут' },
        { val: timeLeft.seconds, label: 'секунд' },
      ].map(({ val, label }, i) => (
        <div key={label} className="text-center flex items-center gap-4 md:gap-10">
          <div>
            <div className="text-4xl md:text-5xl font-light tabular-nums" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif' }}>
              {String(val).padStart(2, '0')}
            </div>
            <p className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif' }}>{label}</p>
          </div>
          {i < 3 && <div className="text-xl" style={{ color: 'var(--wedding-gold)', opacity: 0.4 }}>·</div>}
        </div>
      ))}
    </div>
  );
}

const programItems = [
  { time: '14:30', title: 'Сбор гостей', desc: 'г. Кирово-Чепецк' },
  { time: '15:00', title: 'Фуршет', desc: 'Кирово-Чепецкий район, д. Каркино, ул. Центральная, 27' },
  { time: '16:00', title: 'Торжественная роспись', desc: 'Бракосочетание молодожёнов' },
  { time: '16:30', title: 'Праздничный банкет', desc: 'Торжественный ужин для гостей' },
];

const gifts = [
  { title: 'Денежный эквивалент', desc: 'Если вы хотите сделать нам приятное — денежный подарок будет очень кстати' },
  { title: 'Винные напитки', desc: 'Бутылка хорошего вина или шампанского — отличный способ поздравить нас' },
  { title: 'Подарок на выбор', desc: 'Любой подарок, выбранный с любовью, будет дорог нам' },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: 'date', label: 'Дата' },
    { id: 'program', label: 'Программа' },
    { id: 'gifts', label: 'Подарки' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--wedding-cream)', color: 'var(--wedding-text)' }}>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(13,13,13,0.95)', borderColor: 'rgba(212,175,90,0.2)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="text-lg tracking-[0.3em] uppercase transition-colors"
            style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif' }}
          >
            В & С
          </button>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-xs tracking-[0.3em] uppercase transition-colors"
                style={{ color: activeSection === l.id ? 'var(--wedding-gold)' : 'rgba(200,192,176,0.6)', fontFamily: 'Georgia, serif' }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="md:hidden" style={{ color: 'var(--wedding-gold)' }} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{ background: '#0d0d0d', borderColor: 'rgba(212,175,90,0.2)' }}>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-[0.25em] uppercase text-left transition-colors py-1"
                style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif' }}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7), rgba(13,13,13,0.97))' }} />

        {/* Geometric corner lines */}
        <div className="absolute top-24 left-8 hidden md:block">
          <div className="w-16 h-px" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
          <div className="w-px h-16" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
        </div>
        <div className="absolute top-24 right-8 hidden md:block">
          <div className="w-16 h-px ml-auto" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
          <div className="w-px h-16 ml-auto" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
        </div>
        <div className="absolute bottom-20 left-8 hidden md:block">
          <div className="w-px h-16" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
          <div className="w-16 h-px" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
        </div>
        <div className="absolute bottom-20 right-8 hidden md:block">
          <div className="w-px h-16 ml-auto" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
          <div className="w-16 h-px ml-auto" style={{ background: 'var(--wedding-gold)', opacity: 0.5 }} />
        </div>

        <div className="relative z-10 text-center px-6 pt-20" style={{ animation: 'fade-up 1s ease-out both' }}>
          <p className="text-xs tracking-[0.5em] uppercase mb-10" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif' }}>
            Приглашаем вас разделить с нами это радостное событие
          </p>
          <div>
            <h1 className="text-7xl md:text-9xl font-light tracking-widest uppercase" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}>Валерия</h1>
            <div className="flex items-center justify-center gap-6 my-4">
              <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, var(--wedding-gold))' }} />
              <span className="text-2xl" style={{ color: 'var(--wedding-gold)' }}>&</span>
              <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, var(--wedding-gold))' }} />
            </div>
            <h1 className="text-7xl md:text-9xl font-light tracking-widest uppercase" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}>Сергей</h1>
          </div>
          <p className="text-xs tracking-[0.5em] uppercase mt-10" style={{ color: 'rgba(212,175,90,0.7)', fontFamily: 'Georgia, serif' }}>06 июня 2026</p>
          <button
            onClick={() => scrollTo('date')}
            className="mt-10 inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300"
            style={{ border: '1px solid var(--wedding-gold)', color: 'var(--wedding-gold)', background: 'transparent', fontFamily: 'Georgia, serif' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--wedding-gold)'; (e.currentTarget as HTMLButtonElement).style.color = '#0d0d0d'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--wedding-gold)'; }}
          >
            Узнать подробнее
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>
      </section>

      {/* Date & Location */}
      <Section id="date" style={{ background: 'var(--wedding-blush)' } as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Место и время">Дата свадьбы</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '06 июня 2026', sub: 'Суббота', extra: 'Начало в 14:30' },
              { title: 'Кирово-Чепецкий район', sub: 'д. Каркино, ул. Центральная, 27', extra: 'Усадьба' },
            ].map((card) => (
              <div key={card.title} className="p-10 text-center relative border" style={{ background: 'var(--wedding-cream)', borderColor: 'rgba(212,175,90,0.2)' }}>
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <h3 className="text-2xl font-light tracking-wide mb-2" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{card.title}</h3>
                <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif', opacity: 0.8 }}>{card.sub}</p>
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(212,175,90,0.2)' }}>
                  <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif' }}>{card.extra}</p>
                </div>
              </div>
            ))}
          </div>
          <Countdown />
        </div>
      </Section>

      {/* Map */}
      <div className="h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d49.9766!3d58.5463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JrQuNGA0L7QstC-LdCn0LXQv9C10YbQutC40Lkg0YDQsNC50L7QvSwg0LQuINCa0LDRgNC60LjQvdC-LCDRg9C7LiDQptC10L3RgtGA0LDQu9GM0L3QsNGPLCAyNw!5e0!3m2!1sru!2sru!4v1700000000000"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(30%) brightness(0.85)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Место проведения"
        />
        <a
          href="https://maps.google.com/?q=Кирово-Чепецкий+район,+д.+Каркино,+ул.+Центральная,+27"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 text-xs tracking-[0.25em] uppercase px-6 py-3 flex items-center gap-2 transition-all"
          style={{ background: 'var(--wedding-gold)', color: '#0d0d0d', fontFamily: 'Georgia, serif' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--wedding-dark)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--wedding-gold)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--wedding-gold)'; (e.currentTarget as HTMLAnchorElement).style.color = '#0d0d0d'; }}
        >
          <Icon name="Navigation" size={14} />
          Маршрут
        </a>
      </div>

      {/* Program */}
      <Section id="program" style={{ background: 'var(--wedding-cream)' } as React.CSSProperties}>
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Расписание дня">Программа</SectionTitle>
          <div className="space-y-3">
            {programItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-6 transition-all duration-300 border"
                style={{ background: 'var(--wedding-blush)', borderColor: 'rgba(212,175,90,0.15)', borderLeft: '2px solid var(--wedding-gold)' }}
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="text-sm font-medium" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}>{item.time}</span>
                </div>
                <div className="w-px h-8 opacity-30" style={{ background: 'var(--wedding-gold)' }} />
                <div className="flex-1">
                  <h3 className="text-base tracking-wide uppercase mb-1" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif', fontSize: '0.9rem', letterSpacing: '0.15em' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--wedding-text)', opacity: 0.7, fontFamily: 'Georgia, serif' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gifts */}
      <Section id="gifts" style={{ background: 'var(--wedding-blush)' } as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Пожелания">Подарки</SectionTitle>
          <p className="text-center text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif', opacity: 0.7, letterSpacing: '0.05em' }}>
            Лучший подарок для нас — ваше присутствие и радость!
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {gifts.map((g, i) => (
              <div key={i} className="p-8 text-center relative border" style={{ background: 'var(--wedding-cream)', borderColor: 'rgba(212,175,90,0.2)' }}>
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="w-8 h-px mx-auto mb-6" style={{ background: 'var(--wedding-gold)' }} />
                <h3 className="text-base uppercase tracking-widest mb-4" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif', fontSize: '0.8rem', letterSpacing: '0.2em' }}>{g.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--wedding-text)', opacity: 0.7, fontFamily: 'Georgia, serif' }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts" style={{ background: 'var(--wedding-cream)' } as React.CSSProperties}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Свяжитесь с нами">Контакты</SectionTitle>
          <p className="text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif', opacity: 0.7, letterSpacing: '0.05em' }}>
            Пожалуйста, подтвердите своё присутствие до 15 июня 2026 года.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: 'Валерия', role: 'Невеста', phone: '+7 (901) 449-60-09' },
              { name: 'Сергей', role: 'Жених', phone: '+7 (991) 792-32-07' },
            ].map((person) => (
              <div key={person.name} className="p-10 relative border" style={{ background: 'var(--wedding-blush)', borderColor: 'rgba(212,175,90,0.2)' }}>
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: 'var(--wedding-gold)' }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: 'var(--wedding-gold)' }} />
                <h3 className="text-2xl font-light tracking-widest uppercase mb-1" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{person.name}</h3>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif', opacity: 0.8 }}>{person.role}</p>
                <a
                  href={`tel:${person.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif' }}
                >
                  <Icon name="Phone" size={14} />
                  {person.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-14 text-center" style={{ background: '#080808', borderTop: '1px solid rgba(212,175,90,0.2)' }}>
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--wedding-gold))', opacity: 0.5 }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: 'var(--wedding-gold)', opacity: 0.6 }} />
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--wedding-gold))', opacity: 0.5 }} />
        </div>
        <p className="text-2xl font-light tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>Валерия & Сергей</p>
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--wedding-gold)', fontFamily: 'Georgia, serif', opacity: 0.5 }}>06 июня 2026</p>
      </footer>
    </div>
  );
}