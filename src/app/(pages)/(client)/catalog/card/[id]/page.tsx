import AddToCartButton from '~/app/components/AddToCartButton';

interface Params {
  params: { id: string };
}

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = (await response.json()) as Product;
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function Card({ params }: Params) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex bg-white p-6 shadow-md">
      <div className="w-1/2 pr-6">
        <h2 className="mb-4 text-2xl font-bold">{product.title}</h2>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-gray-600 mb-1 font-medium">Price: ${product.price}</p>
          </div>
          <div className="text-gray-500 text-sm">
            Rating: {product.rating.rate} ({product.rating.count})
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-800">{product.description}</p>
        </div>
        <div className="text-gray-500 mb-4 text-sm">Category: {product.category}</div>
        <AddToCartButton productId={product.id} price={product.price} />
      </div>
      <div className="mt-6 flex w-1/2 justify-center">
        <img src={product.image} alt={product.title} className="h-60 max-w-sm rounded-lg" />
      </div>
    </div>
  );
}
