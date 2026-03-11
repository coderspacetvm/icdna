'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import { svg } from '../../svg';
import { Routes, TabScreens } from '../../routes';
import { stores } from '../../stores';
import { components } from '../../components';
import { items } from '../../items';
import { hooks } from '../../hooks';
import { createApiService } from '@/lib/axios/apiService';
import authClient from '@/lib/axios/authClient';
import { urls } from '@/lib/config/urls';
import Script from 'next/script';

const privateApiService = createApiService(authClient);

export const Checkout: React.FC = () => {
  const router = useRouter();
  // const { goBack } = hooks.useNavigation();
  const { total, discount, delivery, orderType, preOrderDetails, subtotal, walletAmount, getOrderedCartItems, couponDiscount, clearCart } = stores.useCartStore();

  // Carousel state and hooks - exactly like Home screen
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(true); // Start as true to avoid loading state
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const { carousel, carouselLoading } = hooks.useGetCarousel();
  const { getDishes, dishes } = hooks.useGetDishes();

  // Accordion states
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Mobile confirmation before placing order
  const [confirmMobile, setConfirmMobile] = useState('');
  const [confirmMobileError, setConfirmMobileError] = useState('');
  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);

  // Multi-select payment methods
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({
    wallet: walletAmount > 0, // Auto-select wallet if applied
    card: walletAmount === 0 || total > walletAmount // Auto-select card if wallet doesn't cover full amount
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Get wallet store for applying/removing wallet
  const { amount: walletBalance, updateAmount } = stores.useWalletStore();
  const { applyWalletAmount, removeWalletAmount } = stores.useCartStore();

  // Get user data from localStorage (client-side only)
  const getUserData = () => {
    if (typeof window === 'undefined') {
      // Return default values during SSR
      return {
        name: "User",
        address: "",
        pincode: "",
        mobile_number: "",
        state: "",
        city: "",
      };
    }

    return {
      name: localStorage.getItem("name") || "User",
      address: localStorage.getItem("address") || "",
      pincode: localStorage.getItem("pincode") || "",
      mobile_number: localStorage.getItem("mobile_number") || "",
      state: localStorage.getItem("state") || "",
      city: localStorage.getItem("city") || "",
      estimated_delivery_days: localStorage.getItem("estimated_delivery_days") || "0",
    };
  };

  // Address validation logic
  const validateAddress = () => {
    const userData = getUserData();

    if (!userData.name || userData.name.trim() === "") {
      return { isValid: false, error: 'Please add your name to proceed with the order' };
    }

    if (!userData.address || userData.address.trim() === "") {
      return { isValid: false, error: 'Please add your delivery address to proceed with the order' };
    }

    if (!userData.pincode || userData.pincode.trim() === "") {
      return { isValid: false, error: 'Please add your PIN code to proceed with the order' };
    }

    if (!userData.mobile_number || userData.mobile_number.trim() === "") {
      return { isValid: false, error: 'Please add your phone number to proceed with the order' };
    }

    if (!userData.state || userData.state.trim() === "") {
      return { isValid: false, error: 'Please select your state to proceed with the order' };
    }

    if (!userData.city || userData.city.trim() === "") {
      return { isValid: false, error: 'Please select your district to proceed with the order' };
    }

    return { isValid: true, error: null };
  };

  // Prefill confirmation mobile once on client
  useEffect(() => {
    const userData = getUserData();
    if (userData.mobile_number) {
      setConfirmMobile(userData.mobile_number);
    }
  }, []);

  useEffect(() => {
    getDishes(); // Fetch dishes for carousel links
  }, [getDishes]);

  // Auto-update payment methods when wallet amount changes
  useEffect(() => {
    setSelectedPaymentMethods({
      wallet: walletAmount > 0,
      card: walletAmount === 0 || total > walletAmount
    });
  }, [walletAmount, total]);

  useEffect(() => {
    // Fallback: Set Razorpay as loaded after 3 seconds if script doesn't load
    const fallbackTimer = setTimeout(() => {
      if (!isRazorpayLoaded) {
        console.log('Razorpay script fallback: Setting as loaded after timeout');
        setIsRazorpayLoaded(true);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []); // Empty dependency array to run only once

  const handleProceedToPayment = async () => {
    const addressValidation = validateAddress();
    if (!addressValidation.isValid) return;

    setConfirmOrderLoading(true);
    try {
      const userData = getUserData();
      const savedMobile = (userData.mobile_number || '').trim();
      const enteredMobile = confirmMobile.trim();

      if (!enteredMobile) {
        toast.error('Please re-enter your mobile number to confirm your order.');
        return;
      }
      if (savedMobile && enteredMobile !== savedMobile) {
        toast.error('Mobile number does not match your saved number.');
        return;
      }

      const now = new Date();
      const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const scheduledDateValue = orderType === 'Pre-Order'
        ? `${preOrderDetails?.date} ${preOrderDetails?.time}`
        : formattedNow;

      if (orderType === 'Pre-Order' && (!preOrderDetails?.date || !preOrderDetails?.time)) {
        router.push(`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.ORDER}`);
        return;
      }

      const isWalletApplied = walletAmount > 0;
      const isFreeOrder = total === 0;
      const hasRemainingAmount = total > 0;

      let razorpayOrderId = '';
      if (hasRemainingAmount) {
        try {
          const razorpayResponse = await privateApiService.post<{
            status: number;
            razorpay_order_id?: string;
            id?: string;
            error?: string;
          }>(
            urls["create-razorpay-order"],
            {
              amount: total,
              use_wallet: selectedPaymentMethods.wallet ? true : 'false',
              request_type: "create_checkout" // Specify this is a product checkout request
            }
          );
          if (razorpayResponse.razorpay_order_id || razorpayResponse.id || razorpayResponse.status === 1) {
            razorpayOrderId = razorpayResponse.razorpay_order_id || razorpayResponse.id || '';
          } else {
            throw new Error(razorpayResponse.error || 'Failed to generate Razorpay order ID');
          }
          if (!razorpayOrderId && hasRemainingAmount) throw new Error('Received empty Razorpay order ID');
        } catch (error) {
          console.error("Failed to create Razorpay order:", error);
          toast.error("Failed to initiate payment. Please try again.");
          return;
        }
      }

      const processOrderPlacement = async (finalRazorpayOrderId: string) => {
        setIsPlacingOrder(true);
        try {
          const orderResponse = await privateApiService.post<{ status: number; error?: string }>(
            urls["checkout-page"],
            {},
            { params: { order_type: orderType, wallet: isWalletApplied, razorpay_order_id: finalRazorpayOrderId, scheduled_date: scheduledDateValue } }
          );
          if (orderResponse.status === 0) throw new Error(orderResponse.error || 'Failed to create order');

          // Clear cart locally
          clearCart();

          // Refresh wallet balance from backend
          try {
            const profileResponse = await privateApiService.get<any>(urls.profile);
            if (profileResponse.status === 1 && profileResponse.user_data) {
              updateAmount(profileResponse.user_data.wallet?.toString() || "0");
            }
          } catch (error) {
            console.error('Failed to refresh wallet balance:', error);
          }

          router.push(Routes.ORDER_SUCCESSFUL);
        } catch (error) {
          console.error("Order placement failed:", error);
          toast.error("Order placement failed. Please contact support.");
          router.push(Routes.ORDER_FAILED);
          setIsPlacingOrder(false);
        }
      };

      if (isFreeOrder) {
        await processOrderPlacement('');
        return;
      }

      if (hasRemainingAmount) {
        const userName = typeof window !== 'undefined' ? (localStorage.getItem('name') || 'Customer') : 'Customer';
        const userEmail = typeof window !== 'undefined' ? (localStorage.getItem('email') || '') : '';
        const userPhone = typeof window !== 'undefined' ? (localStorage.getItem('mobile_number') || '') : '';
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: 'INR',
          name: 'ICDNA',
          description: isWalletApplied
            ? `Remaining payment for ${getOrderedCartItems().length} items (Wallet: ₹${walletAmount.toFixed(2)} applied)`
            : `Order payment for ${getOrderedCartItems().length} items`,
          order_id: razorpayOrderId,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            await processOrderPlacement(response.razorpay_order_id);
          },
          prefill: { name: userName, email: userEmail, contact: userPhone },
          theme: { color: '#06402B' },
          modal: { ondismiss: () => { } }
        };
        if (!isRazorpayLoaded || !(window as any).Razorpay) {
          toast.error('Razorpay is not loaded. Please try again.');
          return;
        }
        const rzpl = new (window as any).Razorpay(options);
        rzpl.open();
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setConfirmOrderLoading(false);
    }
  };

  const handleSlideChange = (swiper: { realIndex: number }) => {
    setActiveSlide(swiper.realIndex);
  };

  // Carousel render function - exactly like Home screen
  const renderCarousel = () => {
    if (carouselLoading) {
      return (
        <section style={{ marginBottom: 30, position: 'relative', padding: '0 20px' }}>
          <items.SkeletonCarouselItem />
        </section>
      );
    }

    if (!carousel || carousel.length === 0) {
      return null;
    }

    return (
      <section style={{ marginBottom: 30, position: 'relative' }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={'auto'}
          navigation={true}
          mousewheel={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          onSlideChange={handleSlideChange}
          style={{ margin: '0px 0px', height: 'clamp(200px, 30vh, 500px)' }}
        >
          {carousel.map((banner, index) => {
            const dishIdForLink = dishes && dishes[index] ? dishes[index].id : (dishes && dishes[0] ? dishes[0].id : 'fallback-id');
            return (
              <SwiperSlide key={banner.id} style={{ height: 'clamp(200px, 30vh, 400px)' }}>
                <Link href={`${Routes.MENU_ITEM}/${dishIdForLink}`} style={{ display: 'block', height: '100%', position: 'relative' }}>
                  <Image
                    src={banner.image}
                    alt='Banner'
                    fill
                    sizes='100vw'
                    priority={true}
                    className='clickable'
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 27,
            zIndex: 1,
            width: '100%',
            gap: 6,
          }}
        >
          {carousel.map((_, index) => {
            return (
              <div
                key={_.id}
                style={{
                  width: 8,
                  height: activeSlide === index ? 20 : 8,
                  borderRadius: 10,
                  backgroundColor:
                    activeSlide === index
                      ? 'var(--white-color)'
                      : `rgba(255, 255, 255, 0.5)`,
                }}
              />
            );
          })}
        </div>
      </section>
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Checkout'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{ paddingTop: 10, paddingBottom: 120 }}
      >


        {/* SUMMARY */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            border: '1px solid var(--main-turquoise)',
          }}
        >
          <div
            style={{
              paddingBottom: 20,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span
              className='t18'
              style={{ color: 'var(--main-dark)', textTransform: 'capitalize' }}
            >
              Order Summary
            </span>
          </div>

          {/* CART ITEMS */}
          <ul style={{ marginBottom: 16 }}>
            {getOrderedCartItems().map((dish) => {
              return (
                <li
                  key={dish.id}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className='t14'>{dish.product.name}</span>
                  <span className='t14'>
                    {dish.quantity} x ₹{dish.variant.sale_price}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* ESTIMATED DELIVERY */}
          <div
            style={{
              marginBottom: 16,
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '18px' }}>🚚</span>
              <span className='t14' style={{ fontWeight: 500, color: 'var(--main-dark)' }}>Estimated Delivery:</span>
            </div>
            <span className='t14' style={{ color: 'var(--main-dark)', fontWeight: 600 }}>
              {(() => {
                if (orderType === 'Pre-Order' && preOrderDetails?.date && preOrderDetails?.time) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const orderDate = new Date(preOrderDetails.date);
                  orderDate.setHours(0, 0, 0, 0);
                  const diffTime = orderDate.getTime() - today.getTime();
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                  const formattedDate = orderDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                  let datePrefix = '';
                  if (diffDays === 0) datePrefix = `Today (${formattedDate})`;
                  else if (diffDays === 1) datePrefix = `Tomorrow (${formattedDate})`;
                  else datePrefix = `In ${diffDays} days (${formattedDate})`;

                  let parsedTime = preOrderDetails.time;
                  if (preOrderDetails.time.includes(':')) {
                    const [hours, minutes] = preOrderDetails.time.split(':');
                    const h = parseInt(hours, 10);
                    if (!isNaN(h)) {
                      parsedTime = `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
                    }
                  }

                  return `${datePrefix} at ${parsedTime}`;
                }

                const deliveryDaysStr = getUserData().estimated_delivery_days || "0";
                const deliveryDays = parseInt(deliveryDaysStr) || 0;

                if (deliveryDays === 0) {
                  return `Today (${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}), within 45 mins`;
                }

                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + deliveryDays);
                const formattedFutureDate = futureDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

                return `In ${deliveryDays} days (${formattedFutureDate})`;
              })()}
            </span>
          </div>

          {/* PRICING BREAKDOWN */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            {/* SUBTOTAL */}
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className='t14'>Subtotal</span>
              <span className='t14'>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* DISCOUNT */}
            {/* <div
              style={{
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className='t14'>Discount</span>
              <span className='t14' style={{ color: 'var(--main-turquoise)' }}>-₹{discount.toFixed(2)}</span>
            </div> */}

            {/* COUPON DISCOUNT */}
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className='t14'>Coupon Discount</span>
              <span className='t14' style={{ color: 'var(--main-turquoise)' }}>-₹{couponDiscount.toFixed(2)}</span>
            </div>

            {/* DELIVERY */}
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className='t14'>Delivery</span>
              <span className='t14'>₹{delivery.toFixed(2)}</span>
            </div>

            {/* WALLET */}
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className='t14'>Wallet</span>
                <span className='t12' style={{ color: '#666' }}>(Bal: ₹{walletBalance})</span>
              </div>
              {walletAmount > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className='t14' style={{ color: 'var(--main-turquoise)', fontWeight: 600 }}>-₹{walletAmount.toFixed(2)}</span>
                  <button
                    onClick={removeWalletAmount}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => applyWalletAmount(parseFloat(walletBalance))}
                  disabled={parseFloat(walletBalance) <= 0}
                  style={{
                    background: parseFloat(walletBalance) <= 0 ? '#eee' : 'var(--main-turquoise)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: parseFloat(walletBalance) <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Apply
                </button>
              )}
            </div>

            {/* TOTAL TO PAY */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className='t16' style={{ fontWeight: 600, color: 'var(--main-dark)' }}>
                Total to Pay
              </span>
              <span className='t16' style={{ fontWeight: 600, color: 'var(--main-dark)' }}>
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* SHIPPING DETAILS ACCORDION */}
        <section style={{ marginBottom: 14 }}>
          <div
            style={{
              backgroundColor: 'var(--white-color)',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
            }}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setIsShippingOpen(!isShippingOpen)}
              style={{
                width: '100%',
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              className='clickable'
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span
                  className='t14 number-of-lines-1'
                  style={{
                    fontWeight: 500,
                    marginBottom: 8,
                    color: 'var(--main-dark)',
                    textTransform: 'capitalize',
                  }}
                >
                  Shipping details
                </span>
                <span className='t12 number-of-lines-1' style={{ color: '#666' }}>
                  {getUserData().address.length > 30
                    ? `${getUserData().address.substring(0, 30)}...`
                    : getUserData().address}
                </span>
              </div>
              <div
                style={{
                  transform: isShippingOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <svg.RightArrowSvg />
              </div>
            </button>

            {/* Accordion Content */}
            <div
              style={{
                maxHeight: isShippingOpen ? '800px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <div
                style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span className='t12' style={{ color: '#999', fontWeight: 500 }}>
                      Name:
                    </span>
                    <span className='t14' style={{ color: 'var(--main-dark)', marginLeft: 8 }}>
                      {getUserData().name}
                    </span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <span className='t12' style={{ color: '#999', fontWeight: 500 }}>
                      Address:
                    </span>
                    <span className='t14' style={{ color: 'var(--main-dark)', marginLeft: 8 }}>
                      {getUserData().address}
                    </span>
                  </div>
                  {getUserData().pincode && (
                    <div style={{ marginBottom: 12 }}>
                      <span className='t12' style={{ color: '#999', fontWeight: 500 }}>
                        PIN Code:
                      </span>
                      <span className='t14' style={{ color: 'var(--main-dark)', marginLeft: 8 }}>
                        {getUserData().pincode}
                      </span>
                    </div>
                  )}
                  {getUserData().mobile_number && (
                    <div style={{ marginBottom: 12 }}>
                      <span className='t12' style={{ color: '#999', fontWeight: 500 }}>
                        Phone:
                      </span>
                      <span className='t14' style={{ color: 'var(--main-dark)', marginLeft: 8 }}>
                        {getUserData().mobile_number}
                      </span>
                    </div>
                  )}

                  {/* Re-enter mobile number for confirmation */}
                  <div style={{ marginTop: 8 }}>
                    <label
                      className='t12'
                      style={{ color: '#999', fontWeight: 500, display: 'block', marginBottom: 6 }}
                    >
                      Confirm your mobile number
                    </label>
                    <input
                      type="tel"
                      value={confirmMobile}
                      onChange={(e) => {
                        setConfirmMobile(e.target.value);
                        if (confirmMobileError) {
                          setConfirmMobileError('');
                        }
                      }}
                      placeholder="Confirm your mobile number"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: confirmMobileError ? '1px solid #DC2626' : '1px solid #e0e0e0',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                    {confirmMobileError && (
                      <div
                        className='t12'
                        style={{ color: '#DC2626', marginTop: 4 }}
                      >
                        {confirmMobileError}
                      </div>
                    )}
                    <p
                      className='t10'
                      style={{ marginTop: 4, color: '#666' }}
                    >
                      We&apos;ll use this number to contact you about your order.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(Routes.EDIT_PROFILE)}
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      backgroundColor: 'var(--main-turquoise)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    className='clickable'
                  >
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAYMENT METHOD ACCORDION */}
        <section style={{ marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: 'var(--white-color)',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
            }}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setIsPaymentOpen(!isPaymentOpen)}
              style={{
                width: '100%',
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              className='clickable'
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span
                  className='t14 number-of-lines-1'
                  style={{
                    fontWeight: 500,
                    marginBottom: 8,
                    color: 'var(--main-dark)',
                    textTransform: 'capitalize',
                  }}
                >
                  Payment method
                </span>
                <span className='t12 number-of-lines-1' style={{ color: '#666' }}>
                  {selectedPaymentMethods.wallet && selectedPaymentMethods.card
                    ? 'Wallet + UPI Payment'
                    : selectedPaymentMethods.wallet
                      ? 'Wallet Payment'
                      : 'UPI Payment'}
                </span>
              </div>
              <div
                style={{
                  transform: isPaymentOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <svg.RightArrowSvg />
              </div>
            </button>

            {/* Accordion Content */}
            <div
              style={{
                maxHeight: isPaymentOpen ? '500px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <div
                style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <div style={{ marginTop: 16 }}>
                  <h5 style={{ marginBottom: 12, color: 'var(--main-dark)', fontSize: '14px' }}>
                    Choose Payment Methods:
                  </h5>

                  {/* Wallet Option */}
                  <button
                    onClick={() => {
                      const newWalletState = !selectedPaymentMethods.wallet;
                      setSelectedPaymentMethods(prev => ({ ...prev, wallet: newWalletState }));

                      // Apply or remove wallet amount based on checkbox state
                      if (newWalletState) {
                        applyWalletAmount(parseFloat(walletBalance));
                      } else {
                        removeWalletAmount();
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: 12,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      backgroundColor: selectedPaymentMethods.wallet
                        ? 'rgba(79, 209, 199, 0.1)'
                        : 'transparent',
                      border: selectedPaymentMethods.wallet
                        ? '2px solid var(--main-turquoise)'
                        : '1px solid #e0e0e0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    className='clickable'
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: '2px solid var(--main-turquoise)',
                        backgroundColor: selectedPaymentMethods.wallet
                          ? 'var(--main-turquoise)'
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedPaymentMethods.wallet && (
                        <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                      )}
                    </div>
                    <svg.WalletSvg color="var(--main-turquoise)" size={20} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span className='t14' style={{ color: 'var(--main-dark)', fontWeight: 500 }}>
                        Wallet Payment
                      </span>
                      <div className='t12' style={{ color: '#666', marginTop: 2 }}>
                        {walletAmount > 0
                          ? `₹${walletAmount.toFixed(2)} available`
                          : 'Fast and secure payment'}
                      </div>
                    </div>
                  </button>

                  {/* UPI Option */}
                  <button
                    onClick={() => {
                      // Prevent card selection if wallet covers full amount
                      if (selectedPaymentMethods.wallet && walletAmount >= total) {
                        return;
                      }
                      setSelectedPaymentMethods(prev => ({ ...prev, card: !prev.card }));
                    }}
                    disabled={selectedPaymentMethods.wallet && walletAmount >= total}
                    style={{
                      width: '100%',
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      backgroundColor: selectedPaymentMethods.card
                        ? 'rgba(79, 209, 199, 0.1)'
                        : 'transparent',
                      border: selectedPaymentMethods.card
                        ? '2px solid var(--main-turquoise)'
                        : '1px solid #e0e0e0',
                      borderRadius: 8,
                      cursor: (selectedPaymentMethods.wallet && walletAmount >= total) ? 'not-allowed' : 'pointer',
                      opacity: (selectedPaymentMethods.wallet && walletAmount >= total) ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                    }}
                    className='clickable'
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: '2px solid var(--main-turquoise)',
                        backgroundColor: selectedPaymentMethods.card
                          ? 'var(--main-turquoise)'
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedPaymentMethods.card && (
                        <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                      )}
                    </div>
                    {/* Better Card Icon */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--main-turquoise)',
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>₹</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <span className='t14' style={{ color: 'var(--main-dark)', fontWeight: 500 }}>
                        UPI Payment
                      </span>
                      <div className='t12' style={{ color: '#666', marginTop: 2 }}>
                        {selectedPaymentMethods.wallet && walletAmount >= total
                          ? 'No additional amount to pay'
                          : selectedPaymentMethods.wallet && walletAmount > 0
                            ? `Pay remaining ₹${(total - walletAmount).toFixed(2)}`
                            : 'Pay using UPI'}
                      </div>
                    </div>
                  </button>

                  {/* Payment Summary */}
                  {selectedPaymentMethods.wallet && selectedPaymentMethods.card && walletAmount > 0 && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 8,
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <div className='t12' style={{ color: '#666', marginBottom: 4 }}>
                        Payment breakdown:
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span className='t12' style={{ color: 'var(--main-turquoise)' }}>Wallet:</span>
                        <span className='t12' style={{ color: 'var(--main-turquoise)', fontWeight: 600 }}>₹{walletAmount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className='t12' style={{ color: 'var(--main-dark)' }}>UPI:</span>
                        <span className='t12' style={{ color: 'var(--main-dark)', fontWeight: 600 }}>₹{(total - walletAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ADDRESS VALIDATION MESSAGE */}
        {!validateAddress().isValid && (
          <section style={{ marginBottom: 20 }}>
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#FFF5F5',
                border: '1px solid #FEB2B2',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '20px' }}>⚠️</div>
              <div>
                <h5 style={{
                  margin: '0 0 4px 0',
                  color: '#C53030',
                  fontSize: '14px',
                  fontWeight: 'var(--fw-semibold)'
                }}>
                  Address Required
                </h5>
                <p style={{
                  margin: 0,
                  color: '#C53030',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>
                  {validateAddress().error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CAROUSEL */}
        {renderCarousel()}
      </main>
    );
  };

  const renderButton = () => {
    const addressValidation = validateAddress();
    const isCheckoutDisabled = !addressValidation.isValid;

    return (
      <section style={{ padding: 20 }}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => {
            console.log('Razorpay script loaded successfully');
            setIsRazorpayLoaded(true);
          }}
          onError={(e) => {
            console.error('Failed to load Razorpay script:', e);
            setIsRazorpayLoaded(false);
          }}
          onReady={() => {
            console.log('Razorpay script is ready');
            setIsRazorpayLoaded(true);
          }}
        />
        <components.Button
          label={isCheckoutDisabled ? 'Complete Address Required' : (isRazorpayLoaded ? 'Confirm order' : 'Loading payment...')}
          loading={confirmOrderLoading}
          loadingLabel='Confirming...'
          onClick={() => {
            if (isCheckoutDisabled || !isRazorpayLoaded) return;
            setShowPhoneConfirmModal(true);
          }}
          disabled={isCheckoutDisabled || !isRazorpayLoaded}
          style={{
            opacity: isCheckoutDisabled || !isRazorpayLoaded ? 0.5 : 1,
            cursor: isCheckoutDisabled || !isRazorpayLoaded ? 'not-allowed' : 'pointer',
            backgroundColor: isCheckoutDisabled || !isRazorpayLoaded ? '#CCCCCC' : 'var(--main-turquoise)',
            borderColor: isCheckoutDisabled || !isRazorpayLoaded ? '#CCCCCC' : 'var(--main-turquoise)',
            pointerEvents: isCheckoutDisabled || !isRazorpayLoaded ? 'none' : 'auto',
          }}
        />
      </section>
    );
  };

  const renderProcessingOverlay = () => {
    if (!isPlacingOrder) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <style>{`
            @keyframes spin-large {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div
            style={{
              width: 50,
              height: 50,
              border: '4px solid #f3f3f3',
              borderTop: '4px solid var(--main-turquoise)',
              borderRadius: '50%',
              animation: 'spin-large 1s linear infinite',
            }}
          />
        </div>
        <h3 style={{ color: 'var(--main-dark)', marginBottom: 10 }}>Processing your order...</h3>
        <p style={{ color: 'var(--text-color)', textAlign: 'center' }}>Please do not close this window or press back.</p>
      </div>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
      {renderProcessingOverlay()}

      {/* Phone confirmation modal */}
      {showPhoneConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setShowPhoneConfirmModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--white-color)',
              borderRadius: 12,
              padding: 24,
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--main-dark)',
              }}
            >
              Confirm your phone number
            </h3>
            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: 14,
                color: '#666',
              }}
            >
              We&apos;ll use this number to contact you about your order.
            </p>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--main-turquoise)',
                letterSpacing: '0.02em',
              }}
            >
              {getUserData().mobile_number || '—'}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 12,
              }}
            >
              <components.Button
                label="Edit"
                colorScheme="secondary"
                containerStyle={{ flex: 1 }}
                onClick={() => {
                  setShowPhoneConfirmModal(false);
                  router.push(Routes.EDIT_PROFILE);
                }}
              />
              <components.Button
                label="Confirm"
                containerStyle={{ flex: 1 }}
                onClick={() => {
                  setShowPhoneConfirmModal(false);
                  handleProceedToPayment();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </components.Screen>
  );
};
