import { useMemo, useCallback } from "react";

export const useNameValidation = (items, currentItemId = null, nameKey = "name") => {
  const existingNames = useMemo(() => {
    return new Set(
      items
        .filter(item => !currentItemId || item.id !== currentItemId)
        .map(item => item[nameKey].toLowerCase())
    );
  }, [items, currentItemId, nameKey]);

  const validate = useCallback((name) => {
    const trimmed = name.trim();
    const isDuplicate = existingNames.has(trimmed.toLowerCase());
    const isEmpty = trimmed.length === 0;
    
    return {
      isValid: !isEmpty && !isDuplicate,
      isEmpty,
      isDuplicate,
      errorMessage: isDuplicate 
        ? "A name with this value already exists" 
        : isEmpty 
        ? "Name cannot be empty" 
        : null,
    };
  }, [existingNames]);

  return { validate, existingNames };
};

