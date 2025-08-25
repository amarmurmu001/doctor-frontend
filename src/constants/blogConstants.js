export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

export const BLOG_CATEGORIES = {
  HEALTH: 'health',
  LIFESTYLE: 'lifestyle',
  MEDICAL: 'medical',
  WELLNESS: 'wellness'
};

export const BLOG_CATEGORIES_OPTIONS = [
  { value: BLOG_CATEGORIES.HEALTH, label: 'Health' },
  { value: BLOG_CATEGORIES.LIFESTYLE, label: 'Lifestyle' },
  { value: BLOG_CATEGORIES.MEDICAL, label: 'Medical' },
  { value: BLOG_CATEGORIES.WELLNESS, label: 'Wellness' }
];

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10
};

export const BLOG_SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc'
};
