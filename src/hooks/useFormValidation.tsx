import { useState } from 'react';

type ValidationRule = {
  required?: boolean;
  validator?: (value: any) => boolean;
  errorMessage?: string;
};

type ValidationRules = {
  [field: string]: ValidationRule;
};

type FormErrors = {
  [field: string]: string;
};

export default function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (validationRules[field as string]) {
      const rule = validationRules[field as string];

      if (rule.required && value.trim && value.trim() !== '') {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }

      if (rule.validator && rule.validator(value)) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const validate = (fieldsToValidate?: Array<keyof T>): boolean => {
    const fields = fieldsToValidate || Object.keys(validationRules);
    const newErrors: FormErrors = { ...errors };
    let isValid = true;

    fields.forEach(field => {
      const value = values[field];
      const rule = validationRules[field as string];

      if (!rule) return;

      if (rule.required && (!value || (value.trim && value.trim() === ''))) {
        newErrors[field as string] = rule.errorMessage || `${field} is required`;
        isValid = false;
      }

      else if (rule.validator && !rule.validator(value)) {
        newErrors[field as string] = rule.errorMessage || `${field} is invalid`;
        isValid = false;
      }
      else {
        newErrors[field as string] = '';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
    setValues
  };
}
