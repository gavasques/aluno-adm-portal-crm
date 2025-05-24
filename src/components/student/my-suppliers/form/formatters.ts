
export const formatCNPJ = (value: string): string => {
  // Permitir apenas números
  const numericValue = value.replace(/\D/g, '');
  
  // Formatar o CNPJ
  let formattedValue = numericValue;
  if (numericValue.length > 2) formattedValue = numericValue.substring(0, 2) + '.' + numericValue.substring(2);
  if (numericValue.length > 5) formattedValue = formattedValue.substring(0, 6) + '.' + numericValue.substring(5);
  if (numericValue.length > 8) formattedValue = formattedValue.substring(0, 10) + '/' + numericValue.substring(8);
  if (numericValue.length > 12) formattedValue = formattedValue.substring(0, 15) + '-' + numericValue.substring(12, 14);
  
  return formattedValue;
};
