
export const useInput = () => {
  const useWrapperClass = (disabled) => {
    return computed(() => {
      return {
        'disabled': disabled,
      };
    });
  };

  const useInputClass = (errors, showPasswordStrength = false) => {
    return computed(() => {
      return {
        'bg-slate-100 focus:bg-slate-200': errors.length === 0,
        'bg-red-100 focus:bg-red-200': errors.length > 0,
        'border': !showPasswordStrength,
        'border-t border-x': showPasswordStrength,
      };
    });
  };

  const useFirstError = (errors) => {
    computed(() => {
      const [firstError] = errors;
      return firstError;
    });
  };

  return {
    useWrapperClass,
    useInputClass,
    useFirstError,
  };
};
