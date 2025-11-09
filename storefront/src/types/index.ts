export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  thumbnail?: {
    url: string;
    alt?: string;
  };
  pricing?: {
    priceRange: {
      start: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  backgroundImage?: {
    url: string;
  };
}

export interface CartItem {
  variantId: string;
  quantity: number;
  product: Product;
}
