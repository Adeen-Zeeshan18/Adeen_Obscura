import { useRef, useState } from 'react'
import styles from './Contact.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSectionReveal } from '../hooks/useSectionReveal'

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SOCIAL_LINKS = [
  { label: 'Instagram — @obscura.film', href: 'https://instagram.com/obscura.film' },
  { label: 'Behance — archive_obscura',  href: 'https://behance.net/archive_obscura' },
  { label: 'Vimeo — Obscura_Films',      href: 'https://vimeo.com/Obscura_Films' },
]

const FOOTER_LINKS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com/obscura.film' },
  { label: 'BEHANCE',   href: 'https://behance.net/archive_obscura' },
  { label: 'VIMEO',     href: 'https://vimeo.com/Obscura_Films' },
]

export default function Contact() {
  useMeta('contact')
  const [form, setForm]           = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [focused, setFocused]     = useState(null)

  const pageRef = useRef(null)
  const infoSideRef = useRef(null)
  const footerRef = useRef(null)

  // Form side already has its own on-load fadeUp entrance (Contact.module.css)
  // since it's always visible immediately — only scroll-reveal the info panel
  // (which stacks below the form on narrow viewports) and the footer.
  useSectionReveal(pageRef, [
    { ref: infoSideRef, targets: `.${styles.cameraWrap}, .${styles.infoBlock}` },
    // A short footer at the very end of the page has little scroll room past
    // it, so the usual bottom-=12% margin can be mathematically unreachable.
    { ref: footerRef, start: 'top bottom' },
  ])

  const handle = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(fe => ({ ...fe, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)
    setError('')
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Submission failed')
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main ref={pageRef} className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.success}>
            <div className={styles.successLine} />
            <h2 className={styles.successTitle}>Message sent.</h2>
            <p className={styles.successSub}>Thank you, {form.name}. We'll be in touch shortly.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main ref={pageRef} className={styles.page}>
      <div className={styles.inner}>

        <div className={styles.layout}>
          {/* Left — form */}
          <div className={styles.formSide}>
            <div className={styles.eyebrow}>CONNECT / INQUIRY</div>
            <h1 className={styles.title}>CONTACT</h1>

            <form className={styles.form} onSubmit={submit} noValidate>
              <Field label="NAME" id="name" name="name" type="text"
                value={form.name} onChange={handle}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                active={focused === 'name' || !!form.name}
                placeholder="Your full name"
                error={fieldErrors.name} />

              <Field label="EMAIL ADDRESS" id="email" name="email" type="email"
                value={form.email} onChange={handle}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                active={focused === 'email' || !!form.email}
                placeholder="hello@example.com"
                error={fieldErrors.email} />

              <Field label="PROJECT DETAILS / MESSAGE" id="message" name="message"
                type="textarea" value={form.message} onChange={handle}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                active={focused === 'message' || !!form.message}
                placeholder="Briefly describe your vision"
                error={fieldErrors.message} />

              {error && <p className={styles.formError} role="alert">{error}</p>}

              <div className={styles.formBottom}>
                <div className={styles.formDivider} />
                <button type="submit" className={styles.submitBtn} data-hover disabled={loading}>
                  {loading ? 'SENDING…' : 'SEND MESSAGE'}
                </button>
              </div>
            </form>
          </div>

          {/* Right — info panel */}
          <div ref={infoSideRef} className={styles.infoSide}>
            <div className={styles.cameraWrap}>
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=85"
                alt="Camera on a surface" className={styles.cameraImg} />
            </div>

            <div className={styles.infoBlocks}>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>INQUIRIES</span>
                <a href="mailto:hello@obscura.com" className={styles.infoVal} data-hover>
                  hello@obscura.com
                </a>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>STUDIO LOCATION</span>
                <span className={styles.infoText}>42nd Creative District<br />Warsaw, Poland</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>SOCIAL</span>
                <div className={styles.socials}>
                  {SOCIAL_LINKS.map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social}
                      data-hover
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer ref={footerRef} className={styles.footer}>
        <span className={styles.footerCopy}>© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.</span>
        <div className={styles.footerLinks}>
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
              data-hover
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  )
}

function Field({ label, id, name, type, value, onChange, onFocus, onBlur, active, placeholder, error }) {
  const errorId = `${id}-error`
  return (
    <div className={`${styles.field} ${active ? styles.fieldActive : ''}`}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      {type === 'textarea'
        ? <textarea id={id} name={name} className={`${styles.fieldInput} ${styles.fieldTextarea}`}
            value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
            placeholder={placeholder} rows={4}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined} />
        : <input id={id} name={name} type={type}
            className={styles.fieldInput} value={value} onChange={onChange}
            onFocus={onFocus} onBlur={onBlur} placeholder={placeholder}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined} />
      }
      <div className={styles.fieldLine} />
      {error && <p id={errorId} className={styles.fieldError} role="alert">{error}</p>}
    </div>
  )
}
