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
    {
      url: `${SITE_URL}/artikel`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/artikel/skin-fade-koblenz`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/artikel/skin-fade-vs-taper-fade`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/artikel/wie-oft-zum-barber`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/artikel/herrenhaarschnitt-gesichtsform`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/artikel/bart-richtig-pflegen`,
      lastModified: new Date('2026-09-18T00:00:00Z'),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];
}
