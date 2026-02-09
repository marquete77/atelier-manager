import React from 'react';
import styles from './InputMeasure.module.css';

interface InputMeasureProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const InputMeasure: React.FC<InputMeasureProps> = ({ label, value, onChange, placeholder = "0.0" }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder={placeholder}
        />
        <span className={styles.unit}>
          cm
        </span>
      </div>
    </div>
  );
};