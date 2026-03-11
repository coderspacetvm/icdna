'use client';

import React from 'react';
import { Coupon, AppliedCoupon } from '@/types/CartDataType';
import { svg } from '@/svg';

interface CouponPopupProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  onSelectCoupon: (coupon: Coupon) => void;
  appliedCoupon: AppliedCoupon | null;
}

export const CouponPopup: React.FC<CouponPopupProps> = ({
  isOpen,
  onClose,
  coupons,
  onSelectCoupon,
  appliedCoupon,
}) => {
  if (!isOpen) {
    return null;
  }

  const validCoupons = coupons.filter(c => c.is_valid && c.public_display);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(30, 37, 56, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="coupon-popup-container"
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: '0',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          transform: 'scale(1)',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="coupon-popup-header" style={{
          background: 'var(--main-turquoise)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div> */}
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>Available Coupons</h3>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                  {validCoupons.length} coupon{validCoupons.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: '5px 9px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                color: '#fff',
                fontSize: '1rem'
              }}
              className='clickable'
            >
              x
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="coupon-popup-content" style={{ padding: '24px' }}>
          {validCoupons.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {validCoupons.map((coupon, index) => {
                const isApplied = appliedCoupon?.code === coupon.code;
                return (
                  <li
                    key={coupon.id}
                    onClick={() => onSelectCoupon(coupon)}
                    style={{
                      padding: '0',
                      marginBottom: index === validCoupons.length - 1 ? 0 : 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: 'translateY(0)',
                    }}
                    className='clickable'
                    onMouseEnter={(e) => {
                      if (!isApplied) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="coupon-item" style={{
                      background: isApplied
                        ? 'linear-gradient(135deg, #f0fff4, #e6fffa)'
                        : 'linear-gradient(135deg, #f8fdff, #f0f9ff)',
                      border: `2px solid ${isApplied ? 'var(--main-turquoise)' : '#e1f0f5'}`,
                      borderRadius: 16,
                      padding: '20px',
                      position: 'relative',
                      boxShadow: isApplied
                        ? '0 8px 25px rgba(79, 209, 199, 0.15)'
                        : '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                      {/* Applied badge */}
                      {isApplied && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'var(--main-turquoise)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <svg.CheckSvg />
                          APPLIED
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        {/* Coupon Icon */}
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: isApplied
                            ? 'var(--main-turquoise)'
                            : 'linear-gradient(135deg, var(--main-turquoise), #0c9261)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(79, 209, 199, 0.3)'
                        }}>
                          <span style={{ fontSize: '24px' }}>🎟️</span>
                        </div>

                        {/* Coupon Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span className="coupon-code" style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              // color: 'var(--main-dark)',
                              fontFamily: 'monospace',
                              background: isApplied ? 'var(--main-turquoise)' : '#e1f0f5',
                              color: isApplied ? 'white' : 'var(--main-turquoise)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              letterSpacing: '1px'
                            }}>
                              {coupon.code}
                            </span>
                          </div>

                          <h4 className="coupon-title" style={{
                            margin: '0 0 6px 0',
                            fontSize: '16px',
                            color: 'var(--main-dark)',
                            fontWeight: '600',
                            lineHeight: '1.3'
                          }}>
                            {coupon.discount_text}
                          </h4>

                          <p className="coupon-description" style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#666',
                            lineHeight: '1.4'
                          }}>
                            {coupon.discount_summary}
                          </p>

                          {/* Savings highlight */}
                          {coupon.discount_value && (
                            <div style={{
                              marginTop: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: isApplied ? 'rgba(79, 209, 199, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              padding: '6px 10px',
                              borderRadius: '20px',
                              border: `1px solid ${isApplied ? 'rgba(79, 209, 199, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`
                            }}>
                              <span style={{ fontSize: '12px' }}>💰</span>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: isApplied ? 'var(--main-turquoise)' : '#f39c12'
                              }}>
                                Save ₹{coupon.discount_text}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f8f9fa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '32px', opacity: 0.5 }}>🎫</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--main-dark)' }}>No Coupons Available</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Check back later for exciting offers!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
