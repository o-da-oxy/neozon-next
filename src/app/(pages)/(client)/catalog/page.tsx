import React from 'react';
import Link from 'next/link';
import AddToCartButton from '~/app/components/AddToCartButton';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type Products = Product[];

async function getCatalog(): Promise<Products> {
  const response = await fetch('https://fakestoreapi.com/products', {
    cache: 'force-cache',
  });
  const json = (await response.json()) as unknown;
  if (Array.isArray(json)) {
    return json as Products;
  } else {
    throw new Error('Invalid data from API: data not an Array');
  }
}

export default async function Catalog() {
  const catalog = await getCatalog();

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Каталог</h1>
      <div className="flex flex-wrap justify-center">
        {catalog.map((product) => (
          <div
            key={product.id}
            className="border-gray-300 m-2 aspect-square w-60 cursor-pointer rounded-lg border bg-white p-4 text-center shadow-md"
          >
            <Link href={`/catalog/card/${product.id}`}>
              <div className="relative mb-2 flex h-40 items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-2 truncate text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Price:</strong> ${product.price}
              </p>
              <p className="text-gray-700 mb-2 truncate text-sm">
                {product.description.substring(0, 80)}...
              </p>
              <div className="text-gray-500 mt-2 flex justify-between text-xs">
                <span>Category: {product.category}</span>
                <span>
                  Rating: {product.rating.rate} ({product.rating.count})
                </span>
              </div>
            </Link>
            <AddToCartButton productId={product.id} price={product.price} />
          </div>
        ))}
      </div>
    </div>
  );
}
