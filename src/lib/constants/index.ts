export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "E-Commerce Web";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern e-commerce web application built with Next.js";
export const SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";

export const DEFAULT_REGION = process.env.DEFAULT_REGION || 'en_US'
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD'

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12

export const SIGN_IN_DEFAULT_VALUES = {
  email: '',
  password: ''
};

export const SIGN_UP_DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const PRODUCT_DEFAULT_VALUES = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: 0,
  isFeatured: false,
  banner: null
}

export const CURRENCY_FORMATTER = new Intl.NumberFormat(DEFAULT_REGION.replace('_', '-'), {
  currency: DEFAULT_CURRENCY,
  style: 'currency',
  minimumFractionDigits: 2,
});

export const SHIPPING_ADDRESS_DEFAULT_VALUES = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ['admin', 'user'];