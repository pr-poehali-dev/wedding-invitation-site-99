import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/43ea5717-9b70-406b-b133-9531b1275363/files/3404de04-a10f-4118-8917-77aca42e86c7.jpg';

const leaves = ['🌿', '🍃', '☘️', '🌱', '🍀'];

function Leaf({ id }: { id: number }) {
  const style: React.CSSProperties = {
    left: `${(id * 9.1) % 100}%`,
    animationDuration: `${9 + (id * 1.3) % 7}s`,
    animationDelay: `${(id * 1.1) % 9}s`,
    fontSize: `${0.7 + (id % 3) * 0.25}rem`,
    position: 'fixed',
    top: '-20px',
    pointerEvents: 'none',
    zIndex: 5,
    opacity: 0,
    animation: `leaf-fall ${9 + (id * 1.3) % 7}s linear ${(id * 1.1) % 9}s infinite`,
  };
  return <div style={style}>{leaves[id % leaves.length]}</div>;
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

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-lg">🌿</span>
        {subtitle && <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--wedding-rose)' }}>{subtitle}</p>}
        <span className="text-lg">🌿</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-light" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{children}</h2>
      <div className="flex items-center justify-center gap-2 mt-5">
        <div className="h-px w-10" style={{ background: 'var(--wedding-gold)' }} />
        <span style={{ color: 'var(--wedding-gold)' }}>🍃</span>
        <div className="h-px w-10" style={{ background: 'var(--wedding-gold)' }} />
      </div>
    </div>
  );
}

function Countdown() {
  const weddingDate = new Date('2026-08-15T14:00:00');
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
    <div className="flex gap-6 md:gap-12 justify-center mt-12">
      {[
        { val: timeLeft.days, label: 'дней' },
        { val: timeLeft.hours, label: 'часов' },
        { val: timeLeft.minutes, label: 'минут' },
        { val: timeLeft.seconds, label: 'секунд' },
      ].map(({ val, label }) => (
        <div key={label} className="text-center">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: 'var(--wedding-gold)', background: 'white' }}
          >
            <span className="text-2xl md:text-3xl font-light tabular-nums" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>
              {String(val).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs tracking-widest uppercase mt-2" style={{ color: 'var(--wedding-rose)' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

const programItems = [
  { time: '14:30', icon: '🌿', title: 'Сбор гостей', desc: 'г. Кирово-Чепецк' },
  { time: '15:00', icon: '🍃', title: 'Фуршет', desc: 'Кирово-Чепецкий район, д. Каркино, ул. Центральная, 27' },
  { time: '16:00', icon: '☘️', title: 'Торжественная роспись', desc: 'Бракосочетание молодожёнов' },
  { time: '16:30', icon: '🌱', title: 'Праздничный банкет', desc: 'Торжественный ужин для гостей' },
];

const gifts = [
  { icon: '🌿', title: 'Денежный эквивалент', desc: 'Если вы хотите сделать нам приятное — денежный подарок будет очень кстати' },
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

      {/* Falling leaves */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => <Leaf key={i} id={i} />)}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(244,247,240,0.92)', borderColor: 'var(--wedding-blush)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="text-xl font-light tracking-widest transition-colors"
            style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}
          >
            🌿 Д & В
          </button>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-xs tracking-[0.2em] uppercase transition-colors"
                style={{ color: activeSection === l.id ? 'var(--wedding-dark)' : 'var(--wedding-rose)' }}
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
          <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{ background: 'rgba(244,247,240,0.98)', borderColor: 'var(--wedding-blush)' }}>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-widest uppercase text-left transition-colors py-1"
                style={{ color: 'var(--wedding-text)' }}
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(244,247,240,0.3), rgba(244,247,240,0.5), rgba(232,240,228,0.93))' }} />

        {/* Corner leaf decorations */}
        <div className="absolute top-24 left-6 text-5xl opacity-40 hidden md:block" style={{ transform: 'rotate(-30deg)' }}>🌿</div>
        <div className="absolute top-24 right-6 text-5xl opacity-40 hidden md:block" style={{ transform: 'rotate(30deg) scaleX(-1)' }}>🌿</div>
        <div className="absolute bottom-16 left-8 text-3xl opacity-30 hidden md:block">🍃</div>
        <div className="absolute bottom-16 right-8 text-3xl opacity-30 hidden md:block" style={{ transform: 'scaleX(-1)' }}>🍃</div>

        <div className="relative z-10 text-center px-6 pt-20" style={{ animation: 'fade-up 1s ease-out both' }}>
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: 'var(--wedding-rose)' }}>
            🌱 Приглашаем вас разделить с нами это радостное событие 🌱
          </p>
          <div>
            <h1 className="text-7xl md:text-9xl font-light leading-none" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>Дарья</h1>
            <p className="text-4xl md:text-5xl font-light my-4" style={{ color: 'var(--wedding-gold)' }}>🌿 & 🌿</p>
            <h1 className="text-7xl md:text-9xl font-light leading-none" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>Владислав</h1>
          </div>
          <p className="text-xs tracking-[0.4em] uppercase mt-10" style={{ color: 'var(--wedding-rose)' }}>15 августа 2026</p>
          <button
            onClick={() => scrollTo('date')}
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full transition-all duration-300 border"
            style={{ borderColor: 'var(--wedding-gold)', color: 'var(--wedding-dark)', background: 'white' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--wedding-dark)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--wedding-dark)'; }}
          >
            Узнать подробнее
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-2xl opacity-50" style={{ animation: 'float 2.5s ease-in-out infinite' }}>🍃</div>
      </section>

      {/* Date & Location */}
      <Section id="date" style={{ background: 'white' } as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Место и время">Дата свадьбы</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { leaf: '🗓️', title: '15 августа 2026', sub: 'Суббота', extra: 'Начало в 14:30' },
              { leaf: '📍', title: 'Кирово-Чепецкий район', sub: 'д. Каркино, ул. Центральная, 27', extra: 'Усадьба' },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-10 text-center border" style={{ background: 'var(--wedding-cream)', borderColor: 'var(--wedding-blush)' }}>
                <div className="text-4xl mb-4">{card.leaf}</div>
                <h3 className="text-2xl font-light mb-2" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{card.title}</h3>
                <p className="text-sm" style={{ color: 'var(--wedding-rose)' }}>{card.sub}</p>
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--wedding-blush)' }}>
                  <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--wedding-text)' }}>{card.extra}</p>
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
          style={{ border: 0, filter: 'hue-rotate(60deg) saturate(60%) brightness(1.05)' }}
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
          style={{ background: 'var(--wedding-dark)' }}
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
                className="flex items-start gap-5 rounded-2xl p-6 border transition-all hover:-translate-y-0.5 duration-300"
                style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border" style={{ background: 'var(--wedding-cream)', borderColor: 'var(--wedding-blush)' }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--wedding-rose)' }}>{item.time}</span>
                    <h3 className="text-base font-medium" style={{ color: 'var(--wedding-dark)' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--wedding-text)', opacity: 0.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gifts */}
      <Section id="gifts" style={{ background: 'white' } as React.CSSProperties}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Пожелания">Подарки</SectionTitle>
          <p className="text-center text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', opacity: 0.8 }}>
            Лучший подарок для нас — ваше присутствие и радость!
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {gifts.map((g, i) => (
              <div key={i} className="rounded-2xl p-8 text-center border" style={{ background: 'var(--wedding-cream)', borderColor: 'var(--wedding-blush)' }}>
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{g.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--wedding-text)', opacity: 0.8 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts" style={{ background: 'var(--wedding-cream)' } as React.CSSProperties}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Свяжитесь с нами">Контакты</SectionTitle>
          <p className="text-sm mb-12 -mt-6" style={{ color: 'var(--wedding-text)', opacity: 0.8 }}>
            Пожалуйста, подтвердите своё присутствие до 15 июня 2026 года.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Дарья', role: 'Невеста', phone: '+7 (901) 449-60-09' },
              { name: 'Владислав', role: 'Жених', phone: '+7 (991) 792-32-07' },
            ].map((person) => (
              <div key={person.name} className="rounded-2xl p-10 border" style={{ background: 'white', borderColor: 'var(--wedding-blush)' }}>
                <h3 className="text-2xl font-light mb-1" style={{ color: 'var(--wedding-dark)', fontFamily: 'Georgia, serif' }}>{person.name}</h3>
                <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--wedding-rose)' }}>{person.role}</p>
                <a
                  href={`tel:${person.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: 'var(--wedding-text)' }}
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
        <div className="text-3xl mb-3">🌿</div>
        <p className="text-2xl font-light text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Дарья & Владислав</p>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>15 августа 2026</p>
        <div className="text-2xl mt-4 opacity-40">🍃</div>
      </footer>

      <style>{`
        @keyframes leaf-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          5% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(180deg) translateX(30px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
