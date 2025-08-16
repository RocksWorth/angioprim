import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  href: string;
  price?: string;
  badge?: string;
}

export function ProductCard({ name, description, image, href, price, badge }: ProductCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-200">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {badge && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {badge}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          {price && (
            <p className="text-blue-600 font-semibold text-lg">
              Starting at {price}
            </p>
          )}
          <div className="mt-3 inline-flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
            Shop Now
            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
