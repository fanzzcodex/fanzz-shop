export const formatCurrency = (value: any) => Number(value || 0).toLocaleString('id-ID')

export const formatCurrencyV2 = (value: number): string => {
   return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
   }).format(value)
}

export const formatDate = (dateString: any) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })