import { gql } from '@apollo/client';

export const ARTICLES_QUERY = gql`
  query Articles {
    articles {
      id
      created_at
      updated_at
      title
      description
      content
      slug
      category {
        id
        created_at
        updated_at
        name
        slug
      }
      image {
        id
        created_at
        updated_at
        name
        alternativeText
        caption
        width
        height
        formats
        hash
        ext
        mime
        size
        url
        previewUrl
        provider
        provider_metadata
      }
      author {
        id
        created_at
        updated_at
        name
        email
      }
      published_at
    }
  }
`;