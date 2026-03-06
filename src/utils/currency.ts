/**
 * Formatea un número como moneda (EUR por defecto).
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
