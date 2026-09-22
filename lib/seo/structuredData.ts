import { VIP_PACKAGE_DEFINITIONS, VIP_PACKAGE_SLUGS } from '@/lib/booking/vipPackages';
import { BUSINESS, SERVICES } from '@/lib/data';

export const SITE_URL = 'https://vip-fades.com';

export const BUSINESS_ID = `${SITE_URL}/#business`;

export const businessStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS.name,
      description: BUSINESS.description,
      inLanguage: 'de-DE',
      publisher: {
        '@id': BUSINESS_ID,
      },
    },
    {
      '@type': 'HairSalon',
      '@id': BUSINESS_ID,
      name: BUSINESS.name,
      description: BUSINESS.description,
      url: SITE_URL,
      image: `${SITE_URL}/images/og-image.jpg`,
      logo: `${SITE_URL}/images/vip-favicon.png`,
      telephone: BUSINESS.phoneFormatted,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'An der Moselbrücke 9',
        postalCode: '56068',
        addressLocality: 'Koblenz',
        addressCountry: 'DE',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'https://schema.org/Monday',
            'https://schema.org/Tuesday',
            'https://schema.org/Wednesday',
            'https://schema.org/Thursday',
          ],
          opens: '10:00',
          closes: '19:00',
        },
      ],
      sameAs: [BUSINESS.instagramUrl],
    },
  ],
};

const serviceOffers = SERVICES.map((service) => ({
  '@type': 'Offer',
  url: `${SITE_URL}/booking?service=${encodeURIComponent(service.slug ?? service.id)}`,
  price: service.price,
  priceCurrency: 'EUR',
  itemOffered: {
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@id': BUSINESS_ID,
    },
  },
}));

const vipPackageOffers = VIP_PACKAGE_SLUGS.map((slug) => {
  const vipPackage = VIP_PACKAGE_DEFINITIONS[slug];

  return {
    '@type': 'Offer',
    url: `${SITE_URL}/booking?service=${encodeURIComponent(vipPackage.slug)}`,
    price: vipPackage.price,
    priceCurrency: 'EUR',
    itemOffered: {
      '@type': 'Service',
      name: vipPackage.name,
      provider: {
        '@id': BUSINESS_ID,
      },
    },
  };
});

export const serviceCatalogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  '@id': `${SITE_URL}/leistungen#offer-catalog`,
  name: 'Leistungen & Preise von VIP FADES BY ANAS',
  url: `${SITE_URL}/leistungen`,
  itemListElement: [...vipPackageOffers, ...serviceOffers],
};

export function buildFaqPageStructuredData(
  items: Array<{ question: string; answer: string }>,
  pageUrl = SITE_URL,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}


export function buildArticleStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'de-DE',
    datePublished,
    dateModified,
    author: {
      '@id': BUSINESS_ID,
    },
    publisher: {
      '@id': BUSINESS_ID,
    },
    image: `${SITE_URL}/images/og-image.jpg`,
  };
}

export function buildBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
