import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shapla Fashion — Authentic Clothes & Crafts',
    short_name: 'Shapla Fashion',
    description: 'Shop authentic Bangladeshi handloom sarees, panjabi, kurtis and handmade home crafts.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C41E3A',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle', 'fashion'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Track Order',
        url: '/track-order',
        description: 'Track your parcel live',
      },
      {
        name: 'Flash Sale',
        url: '/products?tag=flash-sale',
        description: 'Exclusive limited time discounts',
      },
      {
        name: 'Shopping Cart',
        url: '/cart',
        description: 'View items in your cart',
      },
    ],
  };
}
