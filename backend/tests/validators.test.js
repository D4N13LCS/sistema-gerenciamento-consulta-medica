const { validateCPF, validateCRM, validatePhone, validateEmail, validateDateOfBirth } = require('../src/utils/validators');

describe('Validation Utilities', () => {
  describe('validateCPF', () => {
    it('should validate correct CPFs', () => {
      expect(validateCPF('529.982.247-25')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
      expect(validateCPF('123.456.789-09')).toBe(true);
    });

    it('should reject invalid CPFs', () => {
      expect(validateCPF('111.111.111-11')).toBe(false); // All same digits
      expect(validateCPF('123.456.789-00')).toBe(false); // Invalid check digits
      expect(validateCPF('123.456.789')).toBe(false); // Missing digits
      expect(validateCPF('')).toBe(false); // Empty
      expect(validateCPF('abc.def.ghi-jk')).toBe(false); // Non-numeric
    });
  });

  describe('validateCRM', () => {
    it('should validate correct CRMs', () => {
      expect(validateCRM('12345')).toBe(true);
      expect(validateCRM('CRM-12345')).toBe(true);
      expect(validateCRM('SP12345')).toBe(true);
      expect(validateCRM('CRM/SP 12345')).toBe(true);
    });

    it('should reject invalid CRMs', () => {
      expect(validateCRM('')).toBe(false); // Empty
      expect(validateCRM('123')).toBe(false); // Too short
      expect(validateCRM('abc')).toBe(false); // No numbers
    });
  });

  describe('validatePhone', () => {
    it('should validate correct Brazilian phone numbers', () => {
      expect(validatePhone('(11) 91234-5678')).toBe(true); // Mobile
      expect(validatePhone('11912345678')).toBe(true); // Mobile without formatting
      expect(validatePhone('(11) 1234-5678')).toBe(true); // Landline
      expect(validatePhone('1112345678')).toBe(true); // Landline without formatting
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('')).toBe(false); // Empty
      expect(validatePhone('123456789')).toBe(false); // Too short
      expect(validatePhone('123456789012')).toBe(false); // Too long
      expect(validatePhone('0123456789')).toBe(false); // Starts with 0
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('')).toBe(false); // Empty
      expect(validateEmail('invalid')).toBe(false); // No @
      expect(validateEmail('@example.com')).toBe(false); // No local part
      expect(validateEmail('test@')).toBe(false); // No domain
    });
  });

  describe('validateDateOfBirth', () => {
    it('should validate correct dates of birth', () => {
      expect(validateDateOfBirth('1990-01-01')).toBe(true);
      expect(validateDateOfBirth('2000-12-31')).toBe(true);
      expect(validateDateOfBirth('1950-06-15')).toBe(true);
    });

    it('should reject invalid dates of birth', () => {
      expect(validateDateOfBirth('')).toBe(false); // Empty
      expect(validateDateOfBirth('invalid-date')).toBe(false); // Invalid format
      expect(validateDateOfBirth('2099-01-01')).toBe(false); // Future date
    });
  });
});
