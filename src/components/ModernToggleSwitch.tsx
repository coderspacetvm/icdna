import React from 'react';
import Segmented from 'rc-segmented';
import 'rc-segmented/assets/index.css';

interface SegmentedOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface ModernToggleSwitchProps {
  options: SegmentedOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

const ModernToggleSwitch: React.FC<ModernToggleSwitchProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <Segmented
      options={options}
      value={value}
      onChange={onChange}
      className={`modern-segmented-control ${className}`}
      // style={{color:value===}}
    />
  );
};

export default ModernToggleSwitch;
