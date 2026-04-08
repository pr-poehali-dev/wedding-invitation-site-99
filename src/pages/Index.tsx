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

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      {subtitle && <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">{subtitle}</p>}
      <h2 className="text-4xl md:text-5xl font-light text-gray-900">{children}</h2>
      <div className="w-12 h-px bg-gray-300 mx-auto mt-6" />
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
          <div className="text-4xl md:text-5xl font-light text-gray-900 tabular-nums">
            {String(val).padStart(2, '0')}
          </div>
          <p className="text-xs tracking-widest uppercase text-gray-400 mt-2">{label}</p>
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
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="text-xl font-light text-gray-900 tracking-widest hover:text-gray-500 transition-colors"
          >
            Д & В
          </button>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                  activeSection === l.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="md:hidden text-gray-900" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-widest uppercase text-gray-600 text-left hover:text-gray-900 transition-colors py-1"
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
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 text-center px-6 pt-20" style={{ animation: 'fade-up 1s ease-out both' }}>
          <p className="text-xs tracking-[0.4em] uppercase text-gray-500 mb-10">
            Приглашаем вас разделить с нами это радостное событие
          </p>
          <div>
            <h1 className="text-7xl md:text-9xl font-light text-gray-900 leading-none">Дарья</h1>
            <p className="text-4xl md:text-5xl text-gray-400 font-light my-4">&</p>
            <h1 className="text-7xl md:text-9xl font-light text-gray-900 leading-none">Владислав</h1>
          </div>
          <p className="text-xs tracking-[0.4em] uppercase text-gray-500 mt-10">15 августа 2026</p>
          <button
            onClick={() => scrollTo('date')}
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-8 py-3 border border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
          >
            Узнать подробнее
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>
      </section>

      {/* Date & Location */}
      <Section id="date" className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Место и время">Дата свадьбы</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '15 августа 2026', sub: 'Суббота', extra: 'Начало в 14:30' },
              { title: 'Кирово-Чепецкий район', sub: 'д. Каркино, ул. Центральная, 27', extra: 'Усадьба' },
            ].map((card) => (
              <div key={card.title} className="bg-white border border-gray-100 p-10 text-center">
                <h3 className="text-2xl font-light text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.sub}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500">{card.extra}</p>
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
          style={{ border: 0, filter: 'grayscale(100%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Место проведения"
        />
        <a
          href="https://maps.google.com/?q=Кирово-Чепецкий+район,+д.+Каркино,+ул.+Центральная,+27"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-gray-900 text-white font-light text-xs tracking-wider uppercase px-5 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          <Icon name="Navigation" size={14} />
          Маршрут
        </a>
      </div>

      {/* Program */}
      <Section id="program">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Расписание дня">Программа</SectionTitle>
          <div className="space-y-px">
            {programItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-8 bg-white border border-gray-100 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 text-xs tracking-widest text-gray-400 pt-1 w-12">{item.time}</div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gifts */}
      <Section id="gifts" className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Пожелания">Подарки</SectionTitle>
          <p className="text-center text-gray-500 text-sm mb-12 -mt-6">
            Лучший подарок для нас — ваше присутствие и радость!
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-gray-100">
            {gifts.map((g, i) => (
              <div key={i} className="bg-white p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{g.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Свяжитесь с нами">Контакты</SectionTitle>
          <p className="text-gray-500 text-sm mb-12 -mt-6">
            Пожалуйста, подтвердите своё присутствие до 15 июня 2026 года.
          </p>
          <div className="grid md:grid-cols-2 gap-px bg-gray-100">
            {[
              { name: 'Дарья', role: 'Невеста', phone: '+7 (901) 449-60-09' },
              { name: 'Владислав', role: 'Жених', phone: '+7 (991) 792-32-07' },
            ].map((person) => (
              <div key={person.name} className="bg-white p-10">
                <h3 className="text-2xl font-light text-gray-900">{person.name}</h3>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-6">{person.role}</p>
                <a
                  href={`tel:${person.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
      <footer className="py-12 text-center bg-gray-900">
        <p className="text-2xl font-light text-white mb-2">Дарья & Владислав</p>
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">15 августа 2026</p>
      </footer>
    </div>
  );
}
