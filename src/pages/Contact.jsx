import { useState } from 'react'
import styles from './Contact.module.css'

const inquiryTypes = [
  'Editorial Commission',
  'Commercial Project',
  'Print Purchase',
  'Exhibition',
  'Press & Media',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="rgba(201,169,110,0.4)" strokeWidth="1" />
                <path d="M10 16L14 20L22 12" stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Message received.</h2>
            <p className={styles.successText}>
              Thank you, {form.name}. I'll be in touch within 2–3 business days.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className="container">

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>Get in touch</span>
          </div>
          <h1 className={styles.title}>Contact</h1>
        </header>

        <div className={styles.layout}>

          {/* Left info */}
          <aside className={styles.info}>
            <p className={styles.infoText}>
              Available for editorial commissions, commercial collaborations,
              and fine art print inquiries.
            </p>
            <div className={styles.infoItems}>
              {[
                { label: 'Email', value: 'hello@obscura.com', href: 'mailto:hello@obscura.com' },
                { label: 'Based', value: 'Warsaw / London' },
                { label: 'Response time', value: '2–3 business days' },
                { label: 'Instagram', value: '@obscura.film', href: '#' },
              ].map((item, i) => (
                <div key={i} className={styles.infoItem}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.href
                    ? <a href={item.href} className={styles.infoValue} data-hover>{item.value}</a>
                    : <span className={styles.infoValuePlain}>{item.value}</span>
                  }
                </div>
              ))}
            </div>

            <div className={styles.availability}>
              <span className={styles.availDot} />
              <span className={styles.availText}>Currently accepting commissions for Q3 2025</span>
            </div>
          </aside>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            <div className={styles.row}>
              <div className={`${styles.field} ${focused === 'name' || form.name ? styles.active : ''}`}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  autoComplete="name"
                />
                <span className={styles.fieldLine} />
              </div>

              <div className={`${styles.field} ${focused === 'email' || form.email ? styles.active : ''}`}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  autoComplete="email"
                />
                <span className={styles.fieldLine} />
              </div>
            </div>

            {/* Inquiry type */}
            <div className={styles.typeLabel}>Type of Inquiry</div>
            <div className={styles.types}>
              {inquiryTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeBtn} ${form.type === type ? styles.typeSelected : ''}`}
                  onClick={() => setForm({ ...form, type })}
                  data-hover
                >
                  {type}
                </button>
              ))}
            </div>

            <div className={`${styles.field} ${focused === 'message' || form.message ? styles.active : ''}`}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className={`${styles.input} ${styles.textarea}`}
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={6}
              />
              <span className={styles.fieldLine} />
            </div>

            <div className={styles.formFooter}>
              <p className={styles.formNote}>
                All fields marked are required. Your information will never be shared.
              </p>
              <button type="submit" className={styles.submitBtn} data-hover>
                <span>Send Message</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}
