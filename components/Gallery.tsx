'use client';

import { SectionHeading } from './SectionHeading';

const GALLERY = [
  {
    src: '/images/VIP_FADES_PIC.jpeg',
    alt: 'VIP FADES barbershop front',
    span: 'sm:col-span-2 sm:row-span-2',
    tall: true,
  },
  {
    src: '/images/IN-SHOP_PIC.jpeg',
    alt: 'VIP FADES interior detail',
    span: '',
    tall: false,
  },
  {
    src: '/images/VIP_FADES_LOGO.jpeg',
    alt: 'VIP FADES branded logo',
    span: '',
    tall: false,
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section-padding bg-ink-900 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Space"
          title="Gallery"
          description="A look inside VIP FADES — where the work happens."
          light
        />

        <div className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {GALLERY.map((item, i) => (
            <div
              key={item.src + i}
              className={`reveal ${item.span} group relative overflow-hidden rounded-3xl`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
