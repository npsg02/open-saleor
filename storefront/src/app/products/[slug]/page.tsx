'use client';

import { ApolloProvider, useQuery } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';
import { GET_PRODUCT_DETAILS } from '@/lib/queries';
import Image from 'next/image';
import { useParams } from 'next/navigation';

function ProductDetailsContent() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { slug, channel: 'default-channel' },
  });

  const product = data?.product;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Product not found or error loading product details</p>
          </div>
        </div>
      </div>
    );
  }

  const price = product.pricing?.priceRange?.start?.gross;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {product.media?.[0]?.url ? (
                <Image
                  src={product.media[0].url}
                  alt={product.media[0].alt || product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {price && (
                <div className="text-3xl font-bold text-primary-600 mb-6">
                  {price.currency} {price.amount.toFixed(2)}
                </div>
              )}
              
              <div className="prose prose-sm text-gray-600 mb-6">
                <p>{product.description}</p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Available Options:</h3>
                  <div className="space-y-2">
                    {product.variants.map((variant: any) => (
                      <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{variant.name}</span>
                        <span className="font-semibold">
                          {variant.pricing?.price?.gross?.currency} {variant.pricing?.price?.gross?.amount?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <ProductDetailsContent />
    </ApolloProvider>
  );
}
