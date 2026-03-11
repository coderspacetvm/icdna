import React, { forwardRef } from 'react';

import { svg } from '../svg';

type Props = {
  type?: string;
  value?: string;
  inputType: string;
  placeholder: string;
  autoCapitalize?: string;
  name?: string
  containerStyle?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const InputField = forwardRef<HTMLInputElement, Props>(({
  inputType,
  placeholder,
  type = 'text',
  name = "",
  containerStyle,
  onChange,
  value,
  onBlur,
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
        backgroundColor: 'var(--white-color)',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        minHeight: '48px',
        ...containerStyle,
      }}
    >
      {inputType === 'email' && <svg.EmailSvg />}
      {inputType === 'username' && <svg.UserSvg />}
      {inputType === 'password' && <svg.KeySvg />}
      {inputType === 'code' && <svg.PasswordSvg />}
      {inputType === 'country' && <svg.MapPinSvg />}
      {inputType === 'promocode' && <svg.TagSvg />}
      {inputType === 'amount' && <svg.DollarSvg />}
      {inputType === 'phone' && <svg.PhoneSvg />}
      {inputType === 'beneficiary-bank' && <svg.BriefcaseSvg />}
      {inputType === 'iban-number' && <svg.HashSvg />}
      {inputType === 'date' && <svg.CalendarSvg />}
      {inputType === 'location' && <svg.MapPinSvg />}
      {inputType === 'search' && <svg.SearchSvg />}
      {inputType === 'pin-number' && <svg.PinLocationSvg />}
      {inputType === 'building' && <svg.BuildingSvg />}
      {inputType === 'landmark' && <svg.LandmarkSvg />}
      <input
        ref={ref}
        placeholder={placeholder}
        maxLength={50}
        type={type}
        name={name}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: 16,
          color: 'var(--main-dark)',
        }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {(inputType === 'email' || inputType === 'password') && (
        <div
          className='clickable'
          style={{ padding: '4px' }}
        >
          {inputType === 'email' && <svg.CheckSvg />}
          {inputType === 'password' && <svg.EyeOffSvg />}
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
