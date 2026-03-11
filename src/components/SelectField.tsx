import React, { forwardRef } from 'react';

import { svg } from '../svg';

export interface Option {
    id: number | string;
    name: string;
}

type Props = {
    options: Option[];
    value?: string | number;
    placeholder: string;
    name?: string;
    label?: string;
    containerStyle?: React.CSSProperties;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
};

export const SelectField = forwardRef<HTMLSelectElement, Props>(({
    options,
    placeholder,
    name = "",
    containerStyle,
    onChange,
    value,
    onBlur,
    disabled
}, ref) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderRadius: 10,
                padding: '12px 6px',
                backgroundColor: disabled ? '#f5f5f5' : 'var(--white-color)',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                minHeight: '48px',
                ...containerStyle,
            }}
        >
            <div style={{ flex: 1, position: 'relative' }}>
                <select
                    ref={ref}
                    name={name}
                    disabled={disabled}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: 0,
                        margin: 0,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        color: value ? 'var(--main-dark)' : '#9CA3AF',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        zIndex: 1,
                        position: 'relative'
                    }}
                    value={value || ""}
                    onChange={onChange}
                    onBlur={onBlur}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.name}
                        </option>
                    ))}
                </select>
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '10px',
                        zIndex: 0
                    }}
                >
                    <svg.ArrowDownSvg />
                </div>
            </div>
        </div>
    );
});

SelectField.displayName = 'SelectField';
