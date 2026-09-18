import type { MetadataRoute } from 'next';

import { ARTICLES } from '@/lib/articles';

const SITE_URL = 'https://vip-fades.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${SITE_URL}/artikel/${article.slug}`,
    lastModified: new Date(`${article.updatedAt}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const latestArticleUpdate = ARTICLES.reduce<string | undefined>(
    (latest, article) =>
      !latest || article.updatedAt > latest ? article.updatedAt : latest,
    undefined,
  );

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/leistungen`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ueber-uns`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/booking`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/artikel`,
      ...(latestArticleUpdate
        ? { lastModified: new Date(`${latestArticleUpdate}T00:00:00Z`) }
        : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
