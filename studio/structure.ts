import type {StructureResolver} from 'sanity/structure'

// Singletons (homePage, aboutPage, contactPage, navSettings) get a fixed document
// id and a dedicated menu item with no "create new" option — there's only ever one.
const SINGLETONS: Array<{id: string; type: string; title: string}> = [
  {id: 'homePage', type: 'homePage', title: 'Home page'},
  {id: 'aboutPage', type: 'aboutPage', title: 'About page'},
  {id: 'contactPage', type: 'contactPage', title: 'Contact page'},
  {id: 'navSettings', type: 'navSettings', title: 'Navigation & site name'},
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Galleries')
        .schemaType('collection')
        .child(S.documentTypeList('collection').title('Galleries')),
      S.divider(),
      ...SINGLETONS.map(({id, type, title}) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(type).documentId(id)),
      ),
    ])
