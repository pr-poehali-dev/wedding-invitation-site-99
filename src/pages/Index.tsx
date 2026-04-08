import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/43ea5717-9b70-406b-b133-9531b1275363/files/3404de04-a10f-4118-8917-77aca42e86c7.jpg';

const floatingItems = ['🌸', '💜', '🌿', '🪻', '🌸'];

function FloatingPetal({ id }: { id: number }) {
  const style: React.CSSProperties = {
    left: `${(id * 11.3) % 100}%`,
    position: 'fixed',
    top: '-20px',
    pointerEvents: 'none',
    zIndex: 5,
    opacity: 0,
    fontSize: `${0.8 + (id % 3) * 0.2}rem`,
    animation: `leaf-fall ${10 + (id * 1.4) % 8}s linear ${(id * 1.2) % 8}s infinite`,
  };
  return <div style={style}>{floatingItems[id % floatingItems.length]}</div>;
}

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

function LavenderDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-px flex-1 max-w-12" style={{ background: 'var(--wedding-rose)', opacity: 0.3 }} />
      <span style={{ fontSize: '1rem' }}>🪻</span>
      <div className="h-px flex-1 max-w-12" style={{ background: 'var(--wedding-rose)', opacity: 0.3 }} />
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      {subtitle && <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--wedding-rose)', fontFamily: '"Palatino Linotype", Palatino, serif' }}>{subtitle}</p>}
      <h2 className="text-4xl md:text-5xl" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic', fontWeight: 400 }}>{children}</h2>
      <LavenderDivider />
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
    <div className="flex gap-4 md:gap-8 justify-center mt-12">
      {[
        { val: timeLeft.days, label: 'дней' },
        { val: timeLeft.hours, label: 'часов' },
        { val: timeLeft.minutes, label: 'минут' },
        { val: timeLeft.seconds, label: 'секунд' },
      ].map(({ val, label }) => (
        <div key={label} className="text-center">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: 'var(--wedding-rose)', background: 'white', borderStyle: 'dashed' }}
          >
            <span className="text-2xl md:text-3xl font-light tabular-nums" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif' }}>
              {String(val).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs tracking-widest uppercase mt-2" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

const programItems = [
  { time: '14:30', icon: '🌸', title: 'Сбор гостей', desc: 'г. Кирово-Чепецк' },
  { time: '15:00', icon: '🥂', title: 'Фуршет', desc: 'Кирово-Чепецкий район, д. Каркино, ул. Центральная, 27' },
  { time: '16:00', icon: '🪻', title: 'Торжественная роспись', desc: 'Бракосочетание молодожёнов' },
  { time: '16:30', icon: '🍽️', title: 'Праздничный банкет', desc: 'Торжественный ужин для гостей' },
];

const gifts = [
  { icon: '💜', title: 'Денежный эквивалент', desc: 'Если вы хотите сделать нам приятное — денежный подарок будет очень кстати' },
  { icon: '🍷', title: 'Винные напитки', desc: 'Бутылка хорошего вина или шампанского — отличный способ поздравить нас' },
  { icon: '🎁', title: 'Подарок на выбор', desc: 'Любой подарок, выбранный с любовью, будет дорог нам' },
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

      {/* Floating petals */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => <FloatingPetal key={i} id={i} />)}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md" style={{ background: 'rgba(249,246,255,0.92)', borderColor: 'var(--wedding-blush)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="text-xl tracking-wider transition-colors"
            style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}
          >
            🪻 В & С
          </button>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-xs tracking-[0.2em] uppercase transition-colors"
                style={{ color: activeSection === l.id ? 'var(--wedding-dark)' : 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="md:hidden" style={{ color: 'var(--wedding-dark)' }} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{ background: 'rgba(249,246,255,0.98)', borderColor: 'var(--wedding-blush)' }}>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-widest uppercase text-left transition-colors py-1"
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(249,246,255,0.4), rgba(237,232,245,0.6), rgba(249,246,255,0.95))' }} />

        {/* Provence corner decor */}
        <div className="absolute top-24 left-6 text-4xl opacity-30 hidden md:block" style={{ transform: 'rotate(-20deg)' }}>🌸</div>
        <div className="absolute top-28 left-14 text-2xl opacity-20 hidden md:block" style={{ transform: 'rotate(10deg)' }}>🪻</div>
        <div className="absolute top-24 right-6 text-4xl opacity-30 hidden md:block" style={{ transform: 'rotate(20deg)' }}>🌸</div>
        <div className="absolute top-28 right-14 text-2xl opacity-20 hidden md:block" style={{ transform: 'rotate(-10deg)' }}>🪻</div>
        <div className="absolute bottom-20 left-8 text-3xl opacity-25 hidden md:block">💜</div>
        <div className="absolute bottom-20 right-8 text-3xl opacity-25 hidden md:block">💜</div>

        <div className="relative z-10 text-center px-6 pt-20" style={{ animation: 'fade-up 1s ease-out both' }}>
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>
            Приглашаем вас разделить с нами это радостное событие
          </p>
          <div>
            <h1 className="text-7xl md:text-9xl font-light leading-none" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>Валерия</h1>
            <div className="flex items-center justify-center gap-4 my-4">
              <span className="text-2xl">🌸</span>
              <span className="text-3xl font-light" style={{ color: 'var(--wedding-rose)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>&</span>
              <span className="text-2xl">🌸</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-light leading-none" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>Сергей</h1>
          </div>
          <LavenderDivider />
          <p className="text-sm tracking-[0.3em] uppercase" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>06 июня 2026</p>
          <button
            onClick={() => scrollTo('date')}
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full transition-all duration-300 border"
            style={{ borderColor: 'var(--wedding-rose)', color: 'var(--wedding-dark)', background: 'white', fontFamily: 'Georgia, serif' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--wedding-rose)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--wedding-dark)'; }}
          >
            Узнать подробнее
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-2xl opacity-40" style={{ animation: 'float 2.5s ease-in-out infinite' }}>🪻</div>
      </section>

      {/* Date & Location */}
      <Section id="date" style={{ background: 'var(--wedding-blush)' } as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Место и время">Дата свадьбы</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: '🗓️', title: '06 июня 2026', sub: 'Суббота', extra: 'Начало в 14:30' },
              { icon: '🌸', title: 'Кирово-Чепецкий район', sub: 'д. Каркино, ул. Центральная, 27', extra: 'Усадьба' },
            ].map((card) => (
              <div key={card.title} className="rounded-3xl p-10 text-center border-2" style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-2xl mb-2" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>{card.title}</h3>
                <p className="text-sm" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>{card.sub}</p>
                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--wedding-blush)' }}>
                  <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--wedding-text)', fontFamily: 'Georgia, serif' }}>{card.extra}</p>
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
          style={{ border: 0, filter: 'hue-rotate(240deg) saturate(40%) brightness(1.1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Место проведения"
        />
        <a
          href="https://maps.google.com/?q=Кирово-Чепецкий+район,+д.+Каркино,+ул.+Центральная,+27"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 text-white text-xs tracking-wider uppercase px-5 py-2 rounded-full flex items-center gap-2 transition-colors"
          style={{ background: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}
        >
          <Icon name="Navigation" size={14} />
          Маршрут
        </a>
      </div>

      {/* Program */}
      <Section id="program" style={{ background: 'var(--wedding-cream)' } as React.CSSProperties}>
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Расписание дня">Программа</SectionTitle>
          <div className="space-y-4">
            {programItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5 rounded-3xl p-6 border-2 transition-all hover:-translate-y-0.5 duration-300"
                style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2" style={{ background: 'var(--wedding-blush)', borderColor: 'var(--wedding-blush)' }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>{item.time}</span>
                    <h3 className="text-base" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic', fontSize: '1.1rem' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--wedding-text)', opacity: 0.8, fontFamily: 'Georgia, serif' }}>{item.desc}</p>
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
          <p className="text-center text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic', fontSize: '1.05rem' }}>
            Лучший подарок для нас — ваше присутствие и радость!
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {gifts.map((g, i) => (
              <div key={i} className="rounded-3xl p-8 text-center border-2 hover:-translate-y-1 transition-all duration-300" style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}>
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="text-lg mb-3" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>{g.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--wedding-text)', opacity: 0.8, fontFamily: 'Georgia, serif' }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts" style={{ background: 'var(--wedding-cream)' } as React.CSSProperties}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Свяжитесь с нами">Контакты</SectionTitle>
          <p className="text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic', fontSize: '1.05rem' }}>
            Пожалуйста, подтвердите своё присутствие до 15 июня 2026 года.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Валерия', role: 'Невеста', phone: '+7 (901) 449-60-09' },
              { name: 'Сергей', role: 'Жених', phone: '+7 (991) 792-32-07' },
            ].map((person) => (
              <div key={person.name} className="rounded-3xl p-10 border-2" style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}>
                <h3 className="text-2xl mb-1" style={{ color: 'var(--wedding-dark)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic' }}>{person.name}</h3>
                <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--wedding-rose)', fontFamily: 'Georgia, serif' }}>{person.role}</p>
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
      <footer className="py-12 text-center" style={{ background: 'var(--wedding-dark)' }}>
        <div className="text-2xl mb-3 opacity-60">🪻 🌸 🪻</div>
        <p className="text-2xl mb-2" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: '"Palatino Linotype", Palatino, serif', fontStyle: 'italic', fontWeight: 400 }}>Валерия & Сергей</p>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Georgia, serif' }}>06 июня 2026</p>
        <div className="text-xl mt-3 opacity-30">🌸</div>
      </footer>

      <style>{`
        @keyframes leaf-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          5% { opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(100vh) rotate(200deg) translateX(25px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
