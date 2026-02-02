export const slugify = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const buildProductUrl = (product) => {
  if (!product) return '/products';
  const id = product.id || product._id || '';
  const name = product.name || product.title || '';
  const slug = slugify(name);
  if (!id) return `/products/${slug || 'product'}`;
  if (!slug) return `/products/${id}`;
  return `/products/${slug}-${id}`;
};

export const getProductIdFromParam = (param) => {
  if (!param) return '';
  const value = String(param);
  const parts = value.split('-');
  if (parts.length === 1) return value;
  const last = parts[parts.length - 1];
  return last || value;
};
