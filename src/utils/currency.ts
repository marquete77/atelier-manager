/**
 * Formatea un número como moneda (USD por defecto).
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
