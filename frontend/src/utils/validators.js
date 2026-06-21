/**
 * CPF Validation (Brazilian format)
 * Validates CPF format and check digits
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder >= 10 ? 0 : remainder;
  
  if (digit1 !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder >= 10 ? 0 : remainder;
  
  if (digit2 !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * CRM Validation
 * Validates CRM format (basic validation)
 */
export const validateCRM = (crm) => {
  if (!crm || crm.trim() === '') return false;
  
  // Remove spaces and special characters, keep letters and numbers
  const cleanCRM = crm.replace(/[^a-zA-Z0-9]/g, '');
  
  // CRM must have at least 4 characters
  if (cleanCRM.length < 4) return false;
  
  // CRM must have at least 2 numbers
  if (!/\d{2,}/.test(cleanCRM)) return false;
  
  return true;
};

/**
 * Phone Validation (Brazilian format)
 * Validates phone number format
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') return false;
  
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian phone numbers: 10 or 11 digits (landline: 10, mobile: 11)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
  
  // Area code (first 2 digits) must start with 1-9 (valid Brazilian DDD codes, excluding 0)
  if (!/^[1-9]/.test(cleanPhone)) return false;
  
  return true;
};

/**
 * Email Validation
 * Validates email format
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Date of Birth Validation
 * Validates that date is not in the future
 */
export const validateDateOfBirth = (dateString) => {
  if (!dateString || dateString.trim() === '') return false;
  
  const birthDate = new Date(dateString);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) return false;
  
  // Check if date is in the future
  if (birthDate > today) return false;
  
  // Check if date is too old (more than 150 years)
  const maxAge = 150 * 365 * 24 * 60 * 60 * 1000;
  if (today - birthDate > maxAge) return false;
  
  return true;
};

/**
 * Format CPF for display
 */
export const formatCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return cpf;
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Format phone for display
 */
export const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};
