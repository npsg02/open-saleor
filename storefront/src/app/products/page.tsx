'use client';

import { ApolloProvider, useQuery } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';
import { GET_PRODUCTS } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { first: 20, channel: 'default-channel' },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Products</h1>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading products: {error.message}</p>
            <p className="text-sm mt-2">Make sure the Saleor API is running at http://localhost:8000</p>
          </div>
        )}
        
        {data?.products?.edges && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.edges.map(({ node }: any) => (
              <ProductCard key={node.id} product={node} />
            ))}
          </div>
        )}
        
        {data?.products?.edges?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Please add products through the Saleor Dashboard at http://localhost:9000
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <ProductsContent />
    </ApolloProvider>
  );
}
