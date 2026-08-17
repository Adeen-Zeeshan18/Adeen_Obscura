export const COLLECTIONS_QUERY = /* groq */ `
*[_type == "collection"] | order(orderRank asc) {
  "id": slug.current,
  title,
  year,
  category,
  coverImage,
  description,
  "count": worksCount,
  exif,
  images[]{
    "id": _key,
    image,
    caption,
    year,
    exif
  }
}
`

export const HOME_PAGE_QUERY = /* groq */ `*[_type == "homePage"][0]`
export const ABOUT_PAGE_QUERY = /* groq */ `*[_type == "aboutPage"][0]`
export const CONTACT_PAGE_QUERY = /* groq */ `*[_type == "contactPage"][0]`
export const NAV_SETTINGS_QUERY = /* groq */ `*[_type == "navSettings"][0]`
