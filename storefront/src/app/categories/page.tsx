'use client';

import { ApolloProvider, useQuery } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';
import { GET_CATEGORIES } from '@/lib/queries';
import Link from 'next/link';

function CategoriesContent() {
  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    variables: { first: 20 },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Categories</h1>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading categories: {error.message}</p>
          </div>
        )}
        
        {data?.categories?.edges && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.categories.edges.map(({ node }: any) => (
              <Link
                key={node.id}
                href={`/categories/${node.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{node.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition">
                    {node.name}
                  </h3>
                  <p className="text-gray-600 mt-2">Browse products in this category</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {data?.categories?.edges?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <CategoriesContent />
    </ApolloProvider>
  );
}
