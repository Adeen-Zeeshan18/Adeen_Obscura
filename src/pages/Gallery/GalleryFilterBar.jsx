import styles from '../Gallery.module.css'

export default function GalleryFilterBar({
  filterBarRef,
  categories,
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div ref={filterBarRef} className={styles.filterBar}>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
          onClick={() => onSelectCategory(cat)}
          data-hover
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
