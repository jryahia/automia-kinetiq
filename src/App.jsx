import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUpRight, Check, Shield, Zap, Code2, Gauge, Sparkles, Clock, BadgeCheck, Rocket, Palette, Package } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ================= SMOOTH SCROLL ================= */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop()
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
}

/* ================= KINETIC SPLIT TEXT (scroll) ================= */
const SplitWords = ({ text, className = '', as: Tag = 'h2' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 60%'] })
  const words = text.split(' ')
  const springs = words.map((w, i) => useTransform(scrollYProgress, [i / words.length, (i + 1.2) / words.length], ['118%', '0%'], { clamp: true }))
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="wmask" aria-hidden="true">
          <motion.span style={{ y: springs[i], display: 'inline-block', willChange: 'transform' }}>{w}</motion.span>
          {'\u00A0'}
        </span>
      ))}
    </Tag>
  )
}

/* ================= MAGNETIC ================= */
const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current, r = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`
  }
  const onLeave = () => { ref.current && (ref.current.style.transform = 'translate(0,0)') }
  return <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: 'transform .4s cubic-bezier(.22,1,.36,1)' }}>{children}</motion.div>
}

/* ================= REVEAL ================= */
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 65%'] })
  const y = useTransform(scrollYProgress, [0, 1], [48, 0])
  const o = useTransform(scrollYProgress, [0, 0.35], [0, 1])
  return <motion.div ref={ref} style={{ y, opacity: o, transition: `opacity .1s linear ${delay}s` }}>{children}</motion.div>
}

/* ================= HEADER ================= */
const Header = () => (
  <header className="site-header">
    <div className="header-inner">
      <a href="#" className="logo">Kinetiq<span>.</span></a>
      <nav>
        <a href="#work">Work</a><a href="#results">Results</a><a href="#pricing">Pricing</a><a href="#process">Process</a>
        <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.05 }} className="btn-cta">Get a quote</motion.a></Magnetic>
      </nav>
    </div>
  </header>
)

/* ================= HERO ================= */
const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '26%'])
  const o = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-inner" style={{ y, opacity: o }}>
        <p className="kicker">Editorial motion studio — dev & design, one team</p>
        <h1>
          <motion.span className="hero-word" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .3 }}>Websites</motion.span>
          <motion.span className="hero-word accent" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .42 }}>that move</motion.span>
          <motion.span className="hero-word" initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1], delay: .54 }}>business.</motion.span>
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}>Design that sells, code that performs. We build kinetic brand sites that rank, load fast and convert — because great design is only half the job.</motion.p>
        <motion.div className="hero-ctas" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .95 }}>
          <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.06 }} className="btn-primary">Get a free quote <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.a></Magnetic>
          <Magnetic><motion.a href="#work" whileHover={{ scale: 1.06 }} className="btn-ghost">View portfolio</motion.a></Magnetic>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ================= MARQUEE ================= */
const Marquee = ({ items }) => (
  <div className="marquee"><div className="marquee-track">
    {[...items, ...items, ...items].map((it, i) => <div className="marquee-item" key={i}>{it} <span>✦</span></div>)}
  </div></div>
)

/* ================= TRUST / STACK: shows dev + business skill ================= */
const Stack = () => {
  const stack = ['React', 'Three.js', 'GSAP', 'framer-motion', 'TypeScript', 'Vite', 'Node.js', 'Figma']
  const metrics = [
    { icon: <Gauge size={18} />, n: '0.9s', l: 'Avg LCP load' },
    { icon: <Zap size={18} />, n: '100', l: 'Core Web Vitals (PWA)' },
    { icon: <Code2 size={18} />, n: '8+', l: 'Modern tech stack' },
    { icon: <BadgeCheck size={18} />, n: 'AA', l: 'Accessibility ready' },
  ]
  return (
    <section className="stackband">
      <div className="wrap">
        <Reveal><p className="stack-label">Built with a serious, performance-first stack</p></Reveal>
        <Reveal delay={0.1}><div className="stack-row">{stack.map(s => <span key={s}>{s}</span>)}</div></Reveal>
        <div className="tech-grid">
          {metrics.map((m, i) => (
            <Reveal key={i} delay={i * 0.08}><div className="tech-metric">{m.icon}<div><b>{m.n}</b><span>{m.l}</span></div></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= RESULTS ================= */
const RESULTS = [
  { n: '+212%', l: 'Organic traffic after rebuild', tag: 'case: SaaS editorial' },
  { n: '3.4×', l: 'Time-on-page increase', tag: 'average across projects' },
  { n: '-38%', l: 'Bounce rate reduction', tag: 'portfolio & product sites' },
  { n: '10k+', l: 'Hours of manual work automated', tag: 'automation wins' },
]
const Results = () => (
  <section className="results" id="results">
    <div className="wrap">
      <Reveal><SplitWords text="Results you can put on a KPI." className="sec-title" /></Reveal>
      <p className="sec-sub">Pretty is not enough — our work is measured in the numbers that matter to your business.</p>
      <div className="results-grid">
        {RESULTS.map((r, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="result-card">
              <div className="result-n">{r.n}</div>
              <div className="result-l">{r.l}</div>
              <div className="result-tag">{r.tag}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

/* ================= PINNED SHOWCASE ================= */
const PinnedShowcase = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.45])
  const spin = useTransform(scrollYProgress, [0, 1], [0, -12])
  const o = useTransform(scrollYProgress, [0, 0.65], [1, 0.1])
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '-70%'])
  return (
    <section ref={ref} className="pinned" id="showcase">
      <div className="pinned-sticky">
        <motion.div className="pinned-bg" style={{ scale, rotate: spin, opacity: o }}><div className="pinned-grid" /></motion.div>
        <motion.h2 className="pinned-word" style={{ y: wordY }}>KINETIQ<span>®</span></motion.h2>
        <motion.div className="pinned-chip" style={{ opacity: o }}><span>↕ scroll-driven showcase — 300vh choreography</span></motion.div>
      </div>
    </section>
  )
}

/* ================= SERVICES ================= */
const SERVICES = [
  { icon: <Palette size={22} />, num: '01', title: 'Brand identity', desc: 'Logo, type system & visual language that make you unmistakable.', price: 'from €2,900', time: '2-3 wks' },
  { icon: <Rocket size={22} />, num: '02', title: 'Editorial websites', desc: 'Kinetic React sites built for conversion, speed & SEO.', price: 'from €4,500', time: '3-5 wks' },
  { icon: <Sparkles size={22} />, num: '03', title: 'Motion identity', desc: 'Logo animation, kinetic type & micro-motion that bring the brand alive.', price: 'from €1,800', time: '1-2 wks' },
  { icon: <Package size={22} />, num: '04', title: 'Automation & AI', desc: 'Automate the copy, workflows & scaling so the site drives itself.', price: 'from €2,400', time: '2-4 wks' },
]
const Services = () => (
  <section className="services">
    <div className="wrap">
      <Reveal><SplitWords text="What we build." className="sec-title" /></Reveal>
      <p className="sec-sub">Fixed project pricing, clear timeline, no surprises. Design + development in one engaged team.</p>
      <div className="svc-grid">
        {SERVICES.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <motion.div className="service-card" whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}>
              <div className="svc-top"><span className="num">{s.num}</span>{s.icon}</div>
              <h3>{s.title}</h3><p>{s.desc}</p>
              <div className="svc-meta"><span className="price">{s.price}</span><span className="time"><Clock size={13} /> {s.time}</span></div>
              <a href="#contact" className="svc-link">Start this →</a>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

/* ================= PRICING ================= */
const PLANS = [
  { name: 'Launch', price: '€2,400', for: 'Small sites & landing pages', feats: ['Kinetic landing page', 'React + Vite, 100% CWV', '1 revision round', 'SEO + analytics setup', 'Delivered in 2 weeks'] },
  { name: 'Grow', price: '€4,900', for: 'Full editorial brand sites', feats: ['Multi-section kinetic site', 'Motion + micro-interactions', 'Contact & booking flow', '3 revision rounds', 'Performance + a11y report', '30 days support'] },
  { name: 'Scale', price: '€8,900', for: 'Complex products + automation', feats: ['Everything in Grow', 'Custom CMS / dashboard', 'Workflow automation', 'A/B ready, analytics deep-dive', 'Priority support, 90 days', 'Dedicated team'] },
]
const Pricing = () => {
  const [sel, setSel] = useState(1)
  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <Reveal><SplitWords text="Simple, fixed pricing." className="sec-title" /></Reveal>
        <p className="sec-sub">No hourly billing games. A clear scope, a fixed price, a date we hit.</p>
        <div className="plan-grid">
          {PLANS.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div className={`plan ${i === sel ? 'plan-feat' : ''}`} whileHover={{ y: -6 }} onClick={() => setSel(i)}>
                {i === sel && <span className="plan-pop">Most chosen</span>}
                <h3>{p.name}</h3>
                <div className="plan-price">{p.price}</div>
                <div className="plan-for">{p.for}</div>
                <ul>{p.feats.map((f, k) => <li key={k}><Check size={15} /> {f}</li>)}</ul>
                <motion.a href="#contact" className={i === sel ? 'btn-primary plan-btn' : 'btn-ghost plan-btn'} whileHover={{ scale: 1.04 }}>Choose {p.name}</motion.a>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal><div className="guarantee"><Shield size={18} /> Every project ships with a <b>30-day satisfaction guarantee</b> and a <b>written delivery date</b> — we sign to both.</div></Reveal>
      </div>
    </section>
  )
}

/* ================= WORK ================= */
const WORK = [
  { title: 'The Weight of Words', tag: 'Brand · 2026', desc: 'Variable font system shifting 400→900 on hover.', n: '12' },
  { title: 'Outlined & Alive', tag: 'Campaign · 2026', desc: 'Stroke type revealed word-by-word for a fashion house.', n: '14' },
  { title: 'Infinite Ticker', tag: 'Museum · 2025', desc: 'Marquee editorial bands in a digital exhibition.', n: '07' },
  { title: 'Letter Reveal', tag: 'Launch · 2025', desc: 'Global launch site, logotype rising from clipped masks.', n: '03' },
]
const Work = () => (
  <section className="work" id="work">
    <div className="wrap">
      <Reveal><SplitWords text="Selected work." className="sec-title" /></Reveal>
      <div className="work-grid">
        {WORK.map((p, i) => (
          <Reveal key={i} delay={(i % 2) * 0.1}>
            <motion.a href="#contact" className="work-card" whileHover={{ y: -6 }}>
              <div className="work-num">{p.n}</div>
              <div className="work-thumb">{p.title.split(' ')[0].toUpperCase()}</div>
              <div className="work-body"><div className="tag">{p.tag}</div><h3>{p.title}</h3><p>{p.desc}</p></div>
              <ArrowUpRight className="work-arrow" />
            </motion.a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

/* ================= PROCESS ================= */
const PROCESS = [
  { n: '01', t: 'Discover', d: 'Audit, goals, audience & scope. Fixed quote before we start.', icon: '🔍' },
  { n: '02', t: 'Design', d: 'Direction + a clickable prototype you approve. No guesswork.', icon: '🎨' },
  { n: '03', t: 'Build', d: 'Kinetic React dev in 1-week sprints. You see it working.', icon: '⚙️' },
  { n: '04', t: 'Launch', d: 'Ship, measure, report. Performance + SEO + support.', icon: '🚀' },
]
const Process = () => (
  <section className="process" id="process">
    <div className="wrap">
      <Reveal><SplitWords text="A process built on trust." className="sec-title" /></Reveal>
      <p className="sec-sub">Milestones you approve, updates every week, a guarantee at the end. This is how we keep a 4.9★ rating.</p>
      <div className="proc-grid">
        {PROCESS.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <motion.div className="proc-step" whileHover={{ y: -6 }}>
              <div className="proc-num">{p.n}<span>{p.icon}</span></div>
              <h4>{p.t}</h4><p>{p.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

/* ================= TESTIMONIALS ================= */
const QUOTES = [
  { q: 'Kinetiq rebuilt our brand site. Organic traffic +212% and the scroll motion got shared on LinkedIn. They delivered early, on a fixed price.', n: 'Laura R.', r: 'CMO, Rowen Publishing' },
  { q: 'Rare combo — a designer who ships fast, performant code. Our bounce rate dropped 38% and the dev team could maintain it.', n: 'David S.', r: 'CTO, Stride Studio' },
  { q: 'They handled strategy, design and dev as one team. Clear milestones, weekly updates, real results. Best agency process we\'ve had.', n: 'Anna C.', r: 'Director, Femme Collective' },
]
const Testimonials = () => (
  <section className="quotes">
    <div className="wrap">
      <Reveal><SplitWords text="What clients say." className="sec-title" /></Reveal>
      <div className="quotes-grid">
        {QUOTES.map((q, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure className="quote">
              <div className="stars">★★★★★</div>
              <blockquote>{q.q}</blockquote>
              <figcaption><b>{q.n}</b><span>{q.r}</span></figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

/* ================= CONTACT / CTA ================= */
const CTA = () => {
  const [sent, setSent] = useState(false)
  return (
    <section className="cta" id="contact">
      <div className="wrap cta-inner">
        <Reveal><SplitWords text="Ready to build something that moves?" className="sec-title" /></Reveal>
        <p className="sec-sub">Tell us your goal. Within one business day you'll get a scope, a fixed quote and a delivery date — or a clear why-not.</p>
        {!sent ? (
          <motion.form className="cta-form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div className="form-row">
              <input required placeholder="Your name" aria-label="Your name" />
              <input required type="email" placeholder="Work email" aria-label="Work email" />
            </div>
            <textarea rows="3" placeholder="Tell us about the project (2-3 sentences is plenty)" aria-label="Project details" />
            <Magnetic><motion.button whileHover={{ scale: 1.05 }} className="btn-primary" type="submit" style={{ border: 'none', cursor: 'pointer' }}>Send project brief <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></motion.button></Magnetic>
            <p className="form-note"><Shield size={13} /> Free quote · no obligation · reply within 1 business day</p>
          </motion.form>
        ) : (
          <motion.div className="cta-done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <BadgeCheck size={44} />
            <h3>Brief received 🎉</h3>
            <p>We'll reply within one business day with your scope and quote.</p>
          </motion.div>
        )}
        <div className="cta-contact"><span>Prefer email?</span> <a href="mailto:hello@kinetiq.studio">hello@kinetiq.studio</a></div>
      </div>
    </section>
  )
}

/* ================= FOOTER ================= */
const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-inner">
      <span>© 2026 Kinetiq — design & development, one team.</span>
      <span><a href="#work">Work</a> · <a href="#pricing">Pricing</a> · <a href="#process">Process</a> · <a href="mailto:hello@kinetiq.studio">hello@kinetiq.studio</a></span>
    </div>
  </footer>
)

/* ================= APP ================= */
export default function App() {
  useSmoothScroll()
  return (
    <>
      <Header />
      <Hero />
      <Marquee items={['design', 'development', 'kinetic', 'performance', 'conversion', 'SEO']} />
      <Stack />
      <Results />
      <PinnedShowcase />
      <Services />
      <Pricing />
      <Work />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
