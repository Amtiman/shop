export function getTranslation(translations: Record<string, unknown>, key: string, params: Record<string, string> = {}): string {
  if (!translations || !key) return key;

  let value: unknown;

  if ((translations as Record<string, unknown>)[key]) {
    value = (translations as Record<string, unknown>)[key];
  } else {
    const keys = key.split('.');
    value = keys.reduce((obj, k) => (obj as Record<string, unknown>)?.[k], translations);
  }

  if (value === undefined || value === null) {
    return key;
  }

  if (typeof value === 'string' && params && Object.keys(params).length > 0) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => 
      params[paramKey] !== undefined ? params[paramKey] : match
    );
  }

  return value as string;
}

export function createTranslationHook(translations: Record<string, unknown>) {
  return (key: string, params?: Record<string, string>) => getTranslation(translations, key, params || {});
}

export function flattenTranslations(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value as Record<string, unknown>, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

export function nestTranslations(obj: Record<string, unknown>): Record<string, unknown> {
  const nested: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = nested;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(current as Record<string, unknown>)[k]) (current as Record<string, unknown>)[k] = {};
      current = (current as Record<string, unknown>)[k] as Record<string, unknown>;
    }
    
    (current as Record<string, unknown>)[keys[keys.length - 1]] = value;
  }
  
  return nested;
}

export function createI18nextCompatibleTranslations(translations: Record<string, unknown>) {
  const flat = flattenTranslations(translations);
  const nested = nestTranslations(flat);
  return { ...nested, ...translations };
}

export default {
  getTranslation,
  createTranslationHook,
  flattenTranslations,
  nestTranslations,
  createI18nextCompatibleTranslations
};