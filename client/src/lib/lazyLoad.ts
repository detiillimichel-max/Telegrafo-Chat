import { lazy, ComponentType } from 'react';

/**
 * Utilitário para lazy loading de componentes
 * Implementa code splitting automático
 */
export function lazyLoadComponent<P extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>
): ComponentType<P> {
  return lazy(importFunc);
}

/**
 * Pré-carregar componente antes de renderizar
 * Útil para melhorar UX em navegação
 */
export function preloadComponent(
  importFunc: () => Promise<{ default: ComponentType<any> }>
): void {
  void importFunc();
}

/**
 * Lazy load com retry em caso de erro
 */
export function lazyLoadComponentWithRetry<P extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  maxRetries = 3
): ComponentType<P> {
  return lazy(async () => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await importFunc();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError;
  });
}
