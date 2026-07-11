import React, { useState } from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  hint = '',
  required = false,
  disabled = false,
  prefix = null,
  suffix = null,
  success = false,
  className = '',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const stateClass = error ? 'error' : success ? 'success' : '';

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`input-wrapper${prefix ? ' has-prefix' : ''}${suffix || isPassword ? ' has-suffix' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}

        <input
          id={id}
          type={inputType}
          className={`input-field${stateClass ? ` ${stateClass}` : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className="input-suffix clickable"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
        {!isPassword && suffix && (
          <span className="input-suffix">{suffix}</span>
        )}
      </div>

      {error && (
        <span className="input-error-msg">
          <span>⚠</span> {error}
        </span>
      )}
      {!error && hint && (
        <span className="input-hint">{hint}</span>
      )}
    </div>
  );
};

export default Input;
