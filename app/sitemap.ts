import type { MetadataRoute } from 'next';

const SITE_URL = 'https://vip-fades.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
