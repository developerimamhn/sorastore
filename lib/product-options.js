export const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

export function productSizes(product) {
  return Array.isArray(product?.available_sizes) && product.available_sizes.length
    ? product.available_sizes.map((size) => String(size))
    : DEFAULT_SIZES;
}

export function discountPercent(product) {
  const original = Number(product?.compare_at_price) || 0;
  const current = Number(product?.price) || 0;
  return original > current ? Math.round(((original - current) / original) * 100) : 0;
}