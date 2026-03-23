import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/43ea5717-9b70-406b-b133-9531b1275363/files/3404de04-a10f-4118-8917-77aca42e86c7.jpg';

const petalEmojis = ['🌸', '🌺', '🌷', '✿', '❀'];

function Petal({ id }: { id: number }) {
  const style: React.CSSProperties = {
    left: `${(id * 8.3) % 100}%`,
    animationDuration: `${6 + (id * 1.7) % 8}s`,
    animationDelay: `${(id * 0.8) % 8}s`,
    fontSize: `${0.8 + (id % 3) * 0.3}rem`,
  };
  return (
    <div className="petal" style={style}>
      {petalEmojis[id % petalEmojis.length]}
    </div>
  );
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
    <section id={id} className={`section-reveal py-20 px-4 ${className}`} ref={ref}>
      {children}
    </section>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="font-cormorant text-5xl md:text-6xl font-light text-wedding-dark mb-3">{children}</h2>
      {subtitle && <p className="font-montserrat text-sm tracking-[0.25em] uppercase text-wedding-rose mt-2">{subtitle}</p>}
      <div className="flex items-center justify-center gap-4 mt-6 max-w-xs mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-wedding-gold opacity-50" />
        <span className="font-caveat text-2xl text-wedding-gold">✦</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-wedding-gold opacity-50" />
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
    <div className="flex gap-4 md:gap-8 justify-center mt-10">
      {[
        { val: timeLeft.days, label: 'дней' },
        { val: timeLeft.hours, label: 'часов' },
        { val: timeLeft.minutes, label: 'минут' },
        { val: timeLeft.seconds, label: 'секунд' },
      ].map(({ val, label }) => (
        <div key={label} className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-wedding-gold flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="font-cormorant text-2xl md:text-3xl font-semibold text-wedding-dark">
              {String(val).padStart(2, '0')}
            </span>
          </div>
          <p className="font-montserrat text-xs tracking-widest uppercase text-wedding-rose mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}

const programItems = [
  { time: '14:30', icon: '👥', title: 'Сбор гостей', desc: 'г. Кирово-Чепецк' },
  { time: '15:00', icon: '🥂', title: 'Фуршет', desc: 'Кирово-Чепецкий район, д. Каркино, ул. Центральная, 27' },
  { time: '16:00', icon: '💍', title: 'Торжественная роспись', desc: 'Бракосочетание молодожёнов' },
  { time: '16:30', icon: '🍽️', title: 'Праздничный банкет', desc: 'Торжественный ужин для гостей' },
];


const gifts = [
  { icon: '💵', title: 'Денежный эквивалент', desc: 'Если вы хотите сделать нам приятное — денежный подарок будет очень кстати', account: '' },
  { icon: '🍷', title: 'Винные напитки', desc: 'Бутылка хорошего вина или шампанского — отличный способ поздравить нас', account: '' },
  { icon: '🎁', title: 'Подарок на выбор', desc: 'Любой подарок, выбранный с любовью, будет дорог нам', account: '' },
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
    <div className="min-h-screen bg-wedding-cream relative overflow-x-hidden">
      {/* Falling petals */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => <Petal key={i} id={i} />)}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#c9a96e]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="font-cormorant text-2xl font-light text-wedding-dark tracking-wider hover:text-wedding-rose transition-colors"
          >
            Д & В
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors ${
                  activeSection === l.id ? 'text-wedding-rose' : 'text-wedding-text hover:text-wedding-rose'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="md:hidden text-wedding-dark" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white/95 border-t border-[#c9a96e]/20 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="font-montserrat text-sm tracking-widest uppercase text-wedding-text text-left hover:text-wedding-rose transition-colors py-1"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.35), rgba(253,246,236,0.92))' }} />
        <div className="relative z-10 text-center px-6 pt-20" style={{ animation: 'fade-up 1s ease-out both' }}>
          <p className="font-caveat text-2xl text-wedding-rose mb-6">
            Приглашаем вас разделить с нами это радостное событие
          </p>
          <div>
            <h1 className="font-cormorant text-7xl md:text-9xl font-light text-wedding-dark leading-none">Дарья</h1>
            <p className="font-caveat text-5xl md:text-6xl text-wedding-rose my-2">&</p>
            <h1 className="font-cormorant text-7xl md:text-9xl font-light text-wedding-dark leading-none">Владислав</h1>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: '#c9a96e' }} />
            <p className="font-montserrat text-sm tracking-[0.3em] uppercase text-wedding-gold">15 августа 2026</p>
            <div className="h-px w-16" style={{ background: '#c9a96e' }} />
          </div>
          <p className="font-cormorant text-xl italic text-wedding-text mt-4 opacity-80 max-w-lg mx-auto">
            «Любовь — это не смотреть друг на друга, а смотреть вместе в одном направлении»
          </p>
          <button
            onClick={() => scrollTo('date')}
            className="mt-10 inline-flex items-center gap-2 font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full transition-all duration-300"
            style={{ border: '1px solid #c9a96e', color: '#c9a96e' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#c9a96e'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#c9a96e'; }}
          >
            Узнать подробнее
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" style={{ animation: 'float 2s ease-in-out infinite' }}>
          <Icon name="ChevronsDown" size={20} className="opacity-60" style={{ color: '#c9a96e' } as React.CSSProperties} />
        </div>
      </section>

      {/* Date & Location */}
      <Section id="date" className="bg-white/50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Место и время">Дата свадьбы</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: '', title: '15 августа 2026', sub: 'Суббота', extra: 'Начало в 14:30' },
              { emoji: '📍', title: 'Кирово-Чепецкий район', sub: 'д. Каркино, ул. Центральная, 27', extra: 'Усадьба' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-8 shadow-sm border text-center hover:shadow-md transition-shadow" style={{ borderColor: '#f9d5d8' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ background: '#fff1f2', borderColor: 'rgba(212,116,138,0.2)' }}>
                  <span className="text-3xl">{card.emoji}</span>
                </div>
                <h3 className="font-cormorant text-3xl font-medium text-wedding-dark mb-2">{card.title}</h3>
                <p className="font-montserrat text-sm tracking-wide" style={{ color: 'rgba(107,58,69,0.7)' }}>{card.sub}</p>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#f9d5d8' }}>
                  <p className="font-caveat text-xl text-wedding-rose">{card.extra}</p>
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
          style={{ border: 0, filter: 'sepia(20%) saturate(80%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Место проведения"
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-md" style={{ border: '1px solid rgba(201,169,110,0.3)' }}>
          <p className="font-montserrat text-xs tracking-widest uppercase text-wedding-dark">Место проведения</p>
        </div>
        <a
          href="https://maps.google.com/?q=Кирово-Чепецкий+район,+д.+Каркино,+ул.+Центральная,+27"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 text-white font-montserrat text-xs tracking-wider uppercase px-5 py-2 rounded-full flex items-center gap-2 transition-colors shadow-md"
          style={{ background: '#d4748a' }}
        >
          <Icon name="Navigation" size={14} />
          Маршрут
        </a>
      </div>

      {/* Program */}
      <Section id="program" className="bg-white/40">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Расписание дня">Программа</SectionTitle>
          <div className="space-y-4">
            {programItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-300"
                style={{ border: '1px solid #f9d5d8' }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border" style={{ background: '#fff1f2', borderColor: 'rgba(212,116,138,0.2)' }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-caveat text-2xl text-wedding-gold">{item.time}</span>
                    <h3 className="font-cormorant text-xl font-medium text-wedding-dark">{item.title}</h3>
                  </div>
                  <p className="font-montserrat text-sm" style={{ color: 'rgba(107,58,69,0.7)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* Gifts */}
      <Section id="gifts" className="bg-white/50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Пожелания">Подарки</SectionTitle>
          <p className="text-center font-cormorant text-xl italic mb-10 -mt-4" style={{ color: 'rgba(107,58,69,0.8)' }}>
            Лучший подарок для нас — ваше присутствие и радость!<br />
            Если вы хотите сделать нам что-то особенное, мы будем благодарны.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {gifts.map((g, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300"
                style={{ border: '1px solid #f9d5d8' }}
              >
                <div className="text-5xl mb-4">{g.icon}</div>
                <h3 className="font-cormorant text-2xl font-medium text-wedding-dark mb-2">{g.title}</h3>
                <p className="font-montserrat text-sm leading-relaxed" style={{ color: 'rgba(107,58,69,0.7)' }}>{g.desc}</p>
                {g.account && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#f9d5d8' }}>
                    <p className="font-caveat text-lg text-wedding-gold">{g.account}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts" className="bg-[#f9d5d8]/20">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Свяжитесь с нами">Контакты</SectionTitle>
          <p className="font-cormorant text-xl italic mb-10" style={{ color: 'rgba(107,58,69,0.8)' }}>
            Если у вас есть вопросы, мы рады ответить!<br />
            Пожалуйста, подтвердите своё присутствие до 15 июня 2026 года.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { name: 'Дарья', role: 'Невеста', phone: '+7 (901) 449-60-09', emoji: '' },
              { name: 'Владислав', role: 'Жених', phone: '+7 (991) 792-32-07', emoji: '' },
            ].map((person) => (
              <div key={person.name} className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid #f9d5d8' }}>
                <h3 className="font-cormorant text-2xl font-medium text-wedding-dark">{person.name}</h3>
                <p className="font-montserrat text-xs tracking-widest uppercase text-wedding-rose mb-4">{person.role}</p>
                <a
                  href={`tel:${person.phone.replace(/\D/g, '')}`}
                  className="flex items-center justify-center gap-2 font-montserrat text-sm text-wedding-text hover:text-wedding-rose transition-colors"
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
      <footer className="py-10 text-center" style={{ background: '#4a2d35' }}>
        <p className="font-cormorant text-3xl font-light text-white/80 mb-2">Дарья & Владислав</p>
        <p className="font-caveat text-xl text-wedding-rose mb-4">15 августа 2026</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16" style={{ background: 'rgba(201,169,110,0.3)' }} />
          <span className="font-caveat text-xl" style={{ color: 'rgba(201,169,110,0.5)' }}>❀</span>
          <div className="h-px w-16" style={{ background: 'rgba(201,169,110,0.3)' }} />
        </div>
        <p className="font-montserrat text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>С любовью ждём вас</p>
      </footer>
    </div>
  );
}