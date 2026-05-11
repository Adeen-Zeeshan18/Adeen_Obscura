import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm]         = useState({ name:'', email:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused]   = useState(null)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = (e) => { e.preventDefault(); if (form.name && form.email) setSubmitted(true) }

  if (submitted) {
    return (
      <main className={styles.page}>
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
    <main className={styles.page}>
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
                active={focused==='name'||!!form.name} placeholder="Your full name" />

              <Field label="EMAIL ADDRESS" id="email" name="email" type="email"
                value={form.email} onChange={handle}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                active={focused==='email'||!!form.email} placeholder="hello@example.com" />

              <Field label="PROJECT DETAILS / MESSAGE" id="message" name="message"
                type="textarea" value={form.message} onChange={handle}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                active={focused==='message'||!!form.message}
                placeholder="Briefly describe your vision" />

              <div className={styles.formBottom}>
                <div className={styles.formDivider} />
                <button type="submit" className={styles.submitBtn} data-hover>
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>

          {/* Right — info panel */}
          <div className={styles.infoSide}>
            <div className={styles.cameraWrap}>
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=85"
                alt="Camera" className={styles.cameraImg} />
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
                <span className={styles.infoText}>42nd Creative District<br/>Warsaw, Poland</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>SOCIAL</span>
                <div className={styles.socials}>
                  <span className={styles.social}>Instagram — @obscura.film</span>
                  <span className={styles.social}>Behance — archive_obscura</span>
                  <span className={styles.social}>Vimeo — Obscura_Films</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer className={styles.footer}>
        <span className={styles.footerCopy}>© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.</span>
        <div className={styles.footerLinks}>
          {['INSTAGRAM','BEHANCE','VIMEO'].map(s => (
            <button key={s} className={styles.footerLink} data-hover>{s}</button>
          ))}
        </div>
      </footer>
    </main>
  )
}

function Field({ label, id, name, type, value, onChange, onFocus, onBlur, active, placeholder }) {
  return (
    <div className={`${styles.field} ${active ? styles.fieldActive : ''}`}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      {type === 'textarea'
        ? <textarea id={id} name={name} className={`${styles.fieldInput} ${styles.fieldTextarea}`}
            value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
            placeholder={placeholder} rows={4} />
        : <input id={id} name={name} type={type}
            className={styles.fieldInput} value={value} onChange={onChange}
            onFocus={onFocus} onBlur={onBlur} placeholder={placeholder} />
      }
      <div className={styles.fieldLine} />
    </div>
  )
}