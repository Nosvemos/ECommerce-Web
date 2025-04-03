export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "E-Commerce Web";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern e-commerce web application built with Next.js";
export const SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

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

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});