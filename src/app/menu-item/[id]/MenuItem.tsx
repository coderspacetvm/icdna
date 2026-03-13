'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Cookies from 'js-cookie';


import { svg } from '../../../svg';
import { components } from '../../../components';
import { ProductType, VariantExtended } from '@/types/DishType';

import itemPlaceholder from '../../../../public/mock/images/item-placeholder.png'
import { hooks } from '@/hooks';
import { stores } from '@/stores';
import { useRouter } from 'next/navigation';
import { Routes, TabScreens } from '@/routes';
import { showCartAddedToast } from '@/components/CartToast';
import { createApiService } from '@/lib/axios/apiService';
import { authClient } from '@/lib/axios/apiClient';
import { urls } from '@/lib/config/urls';
// import { Routes } from '@/routes';
import { toast } from 'react-hot-toast';


type Props = {
  product: ProductType | null
};

// Helper to sort variants from smaller to larger quantity based on the label,
// e.g. "50g", "100g", "1 Kg". We normalize everything to grams.
const parseVariantSize = (label?: string): number => {
  if (!label) return Number.POSITIVE_INFINITY;
  const lower = label.toLowerCase();
  const match = lower.match(/([\d.]+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  const value = parseFloat(match[1]);
  if (Number.isNaN(value)) return Number.POSITIVE_INFINITY;

  // Treat kg as 1000g, otherwise assume grams.
  if (lower.includes('kg')) {
    return value * 1000;
  }
  return value;
};

const sortVariantsBySize = (variants: VariantExtended[]): VariantExtended[] => {
  return [...variants].sort(
    (a, b) => parseVariantSize(a.variants) - parseVariantSize(b.variants)
  );
};

// const MinusSvg = () => {
//   return (
//     <svg
//       xmlns='http://www.w3.org/2000/svg'
//       width={14}
//       height={14}
//       fill='none'
//     >
//       <path
//         stroke='#0C1D2E'
//         strokeLinecap='round'
//         strokeLinejoin='round'
//         strokeWidth={1.2}
//         d='M2.898 7h8.114'
//       />
//     </svg>
//   );
// };

const PlusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
    >
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.955 2.917v8.166M2.898 7h8.114'
      />
    </svg>
  );
};

export const MenuItem: React.FC<Props> = ({ product }) => {
  // Smart initial variant selection: Choose first available variant instead of always first
  const getInitialVariant = () => {
    if (!product?.variants || product.variants.length === 0) return undefined;

    const sorted = sortVariantsBySize(product.variants);

    // Find first variant that has stock available
    const availableVariant = sorted.find((variant) => variant.quantity > 0);

    // If no variant has stock, return first variant (to show out of stock)
    return availableVariant || sorted[0];
  };

  const [choosenVarient, setChoosenVarient] = useState<VariantExtended | undefined>(getInitialVariant())
  const [addToCartLoading, setAddToCartLoading] = useState(false)
  const [viewCartLoading, setViewCartLoading] = useState(false)
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<number | null>(null)
  const [showDeliveryBanner, setShowDeliveryBanner] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [addCounterLoading, setAddCounterLoading] = useState(false)
  const isCounterLoading = removeLoading || addCounterLoading
  const [showSplash, setShowSplash] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const router = useRouter()

  // const {updateWishlistWithItem} = hooks.useManageWishList()
  const { cart, addToCart, removeFromCart } = stores.useCartStore(); // Added cart
  const { wishlistedIds, toggleWishlistItem } = stores.useWishlistStore()
  const { goBack } = hooks.useNavigation()
  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareData = {
      title: product?.name || 'Check out this product!',
      text: `Take a look at ${product?.name} at ICDNA`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  const isInWishlist = wishlistedIds.includes(product?.id || 0);

  // Calculate quantity for the chosen variant directly instead of using state
  const quantityInCart = React.useMemo(() => {
    if (!product || !choosenVarient || !cart?.cart_items) return 0;

    const productCartItem = cart.cart_items.find((ci) =>
      ci?.variant.id === choosenVarient?.id && ci.product.id === product.id
    );

    return productCartItem ? productCartItem.quantity : 0;
  }, [choosenVarient, cart, product]);

  // Update initial variant selection when product changes
  useEffect(() => {
    if (product && (!choosenVarient || !product.variants.find(v => v.id === choosenVarient.id))) {
      setChoosenVarient(getInitialVariant());
    }
  }, [product]);

  // Fetch estimated delivery days from user profile
  useEffect(() => {
    const isAuthenticated = () => !!Cookies.get('authToken');
    if (!isAuthenticated()) return;

    // Show banner for authenticated users (with or without days)
    setShowDeliveryBanner(true);

    const privateApiService = createApiService(authClient);
    privateApiService.get<{ status: number; user_data: { estimated_delivery_days: number | null } }>(urls['profile'])
      .then((res) => {
        if (res.status === 1) {
          setEstimatedDeliveryDays(res.user_data?.estimated_delivery_days ?? null);
        }
      })
      .catch(() => {
        // silently fail — not critical
      });
  }, []);




  // const currentQuantity = productCartItem ? productCartItem.quantity : 0;

  if (!product || !choosenVarient) {
    return (
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <p>Not found</p>
        </div>
      </section>
    );
  }

  // const renderHeader = () => {
  //   return (
  //     <components.Header
  //       showGoBack={true}
  //       showBasket={true}
  //     />
  //   );
  // };

  const renderImage = () => {
    const images = choosenVarient.additional_images || [];
    const videos = choosenVarient.additional_videos || [];

    // Combine images and videos into a single media array (videos first)
    const media = [
      ...videos.map(url => ({ type: 'video' as const, url })),
      ...images.map(url => ({ type: 'image' as const, url }))
    ];

    const hasMultipleItems = media.length > 1;

    return (
      <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
        {hasMultipleItems ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={media.some(m => m.type === 'video') ? false : {
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            style={{ width: '100%', height: '100%' }}
            className="menu-item-image-swiper" // For potential custom global Swiper styles
          >
            {media.map((item, index) => (
              <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', boxSizing: 'border-box', background: 'transparent' }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', border: 'none', background: 'transparent' }}>
                  {item.type === 'image' ? (
                    <Image
                      src={item.url || itemPlaceholder}
                      alt={`${product?.name || 'Product image'} ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover', border: 'none' }}
                      sizes="(max-width: 765px) 100vw, 50vw" // Keep existing sizes or adjust as needed
                    />
                  ) : (
                    <video
                      src={item.url}
                      playsInline
                      autoPlay
                      muted
                      loop
                      style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none', backgroundColor: 'transparent' }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Single item or placeholder
          <div style={{ width: '100%', height: '100%', position: 'relative', padding: '0', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', border: 'none' }}>
            {media.length > 0 ? (
              media[0].type === 'image' ? (
                <Image
                  src={media[0].url || itemPlaceholder}
                  alt={product?.name || 'Product image'}
                  layout="fill"
                  objectFit="cover"
                  style={{ border: 'none' }}
                  sizes="(max-width: 758px) 100vw, 50vw"
                />
              ) : (
                <video
                  src={media[0].url}
                  playsInline
                  autoPlay
                  muted
                  loop
                  style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none', backgroundColor: 'transparent' }}
                />
              )
            ) : (
              <Image
                src={itemPlaceholder}
                alt={product?.name || 'Product image'}
                layout="fill"
                objectFit="cover"
                style={{ border: 'none' }}
                sizes="(max-width: 758px) 100vw, 50vw"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFloatingButtons = () => {
    return (
      <>
        <button
          style={{
            position: 'absolute',
            top: 25,
            left: 23,
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: 'var(--page-background-color, #f0f0f0)',
            zIndex: 1,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            goBack();
          }}
        >
          <svg.GoBackSvg />
        </button>

        <button
          style={{
            position: 'absolute',
            top: 25,
            right: 23,
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: 'var(--page-background-color, #f0f0f0)',
            zIndex: 1,
            pointerEvents: 'auto'
          }}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (choosenVarient?.id != null) {
              const newStatus = !isInWishlist;
              setIsWishlistLoading(true);
              await toggleWishlistItem(product?.id, choosenVarient?.id);
              setIsWishlistLoading(false);
              if (newStatus) {
                setShowSplash(true);
                setTimeout(() => setShowSplash(false), 500);
              }
            }
          }}
          disabled={isWishlistLoading}
        >
          {showSplash && <div className="heart-splash-circle" />}
          <div className={showSplash ? 'heart-pop-animation' : ''} style={{ display: 'flex', zIndex: 1, opacity: isWishlistLoading ? 0.7 : 1 }}>
            <svg.HeartBigSvg flag={isInWishlist} isLoading={isWishlistLoading} />
          </div>
        </button>

        <button
          style={{
            position: 'absolute',
            top: 75,
            right: 23,
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: 'var(--page-background-color, #f0f0f0)',
            zIndex: 1,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleShare();
          }}
        >
          <svg.ShareSvg />
        </button>
      </>
    );
  };

  // renderDetails function is now removed, its content is integrated below.

  const renderOptionsSelector = () => {
    // className='container' removed from section
    // White background and internal padding will be handled by the wrapper div in the main return
    return (
      <section
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap', // Allow items to wrap
          // Padding will be applied by the wrapper div to control background extent
        }}
      >
        {sortVariantsBySize(product.variants).map((varient) => {
          const isSelected = choosenVarient?.id === varient?.id;
          const isOutOfStock = varient.quantity === 0;

          return (
            <div key={varient?.id} style={{ position: 'relative' }}>
              <components.Button
                label={`${varient?.variants || ''}`}
                // href={Routes.REVIEWS}
                onClick={() => {
                  setChoosenVarient(varient)
                }}
                style={{
                  width: 'fit-content', // Button takes width of its content
                  padding: '10px 15px', // Adjusted padding for better appearance
                  height: 'fit-content',
                  textWrap: 'nowrap',
                  border: isOutOfStock ? '2px solid #DC2626' : undefined,
                  opacity: isOutOfStock ? 0.7 : 1,
                  position: 'relative',
                }}
                // containerStyle prop is removed to avoid fixed width constraints
                colorScheme={isSelected ? 'primary' : 'secondary'}
              />



              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: 'var(--border-radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                  }}
                >
                  {/* <span
                    style={{
                      color: '#DC2626',
                      fontSize: '8px',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                    }}
                  ></span> */}
                </div>
              )}
            </div>
          )
        })}

      </section>
    )
  }

  const renderPriceWithCounter = () => {
    // currentQuantity is now calculated in the component's main scope

    // className='container' removed from section.
    // The outer div in the main return will handle background, border-radius, and alignment padding.
    // This inner div will just manage layout of price and counter.
    return (
      <section style={{}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0px",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "var(--fw-bold)",
                  fontFamily: "DM Sans",
                }}
              >
                ₹{choosenVarient.sale_price}
              </span>
              {choosenVarient.mrp && choosenVarient.mrp > choosenVarient.sale_price && (
                <>
                  <span
                    style={{
                      color: "#868686",
                      textDecoration: "line-through",
                      fontSize: "18px",
                    }}
                  >
                    ₹{choosenVarient.mrp}
                  </span>
                  <span
                    style={{
                      color: "#15803d",
                      fontSize: "12px",
                      fontWeight: "800",
                      backgroundColor: "#f0fdf4",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid #bcf0da"
                    }}
                  >
                    {choosenVarient.discount_percentage}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {quantityInCart === 0 && (
              <button
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  padding: 14,
                  borderRadius: 4,
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (choosenVarient && choosenVarient.quantity === 0) {
                    console.log("Cannot add to cart: Item is out of stock");
                    return;
                  }
                  if (choosenVarient && choosenVarient.id != null) {
                    const result = await addToCart(product?.id, choosenVarient.id);
                    if (result?.success) {
                      showCartAddedToast();
                    }
                  } else {
                    console.warn("Cannot add to cart: Variant ID is missing for product", product?.id);
                  }
                }}
              >
                <PlusSvg />
              </button>
            )}
            {quantityInCart > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--main-turquoise)",
                  borderRadius: 20,
                  padding: "0px",
                  opacity: isCounterLoading ? 0.75 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (choosenVarient && choosenVarient.id != null) {
                      setRemoveLoading(true);
                      try {
                        await removeFromCart(product?.id, choosenVarient.id);
                      } finally {
                        setRemoveLoading(false);
                      }
                    } else {
                      console.warn("Cannot remove from cart: Variant ID is missing for product", product?.id);
                    }
                  }}
                  disabled={isCounterLoading}
                  style={{ background: "transparent", border: "none", padding: "8px", color: "white", cursor: isCounterLoading ? 'wait' : 'pointer' }}
                >
                  {removeLoading ? (
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><rect width="21" height="21" fill="#E6F3F8" rx="10.5"></rect><path stroke="#0C1D2E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M6.125 10.5h8.75"></path></svg>
                  )}
                </button>
                <span
                  className="t14"
                  style={{ color: "var(--white-color)", padding: "0 8px", fontWeight: "bold" }}
                >
                  {quantityInCart}
                </span>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (choosenVarient && choosenVarient.quantity === 0) {
                      console.log("Cannot add to cart: Item is out of stock");
                      return;
                    }
                    if (choosenVarient && choosenVarient.id != null) {
                      setAddCounterLoading(true);
                      try {
                        const result = await addToCart(product?.id, choosenVarient.id);
                        if (result?.success) {
                          showCartAddedToast();
                        }
                      } finally {
                        setAddCounterLoading(false);
                      }
                    } else {
                      console.warn("Cannot add to cart: Variant ID is missing for product", product?.id);
                    }
                  }}
                  disabled={isCounterLoading}
                  style={{ background: "transparent", border: "none", padding: "8px", color: "white", cursor: isCounterLoading ? 'wait' : 'pointer' }}
                >
                  {addCounterLoading ? (
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><rect width="21" height="21" fill="#E6F3F8" rx="10.5"></rect><path stroke="#0C1D2E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M10.5 6.125v8.75M6.125 10.5h8.75"></path></svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderButton = () => {
    const isOutOfStock = choosenVarient && choosenVarient.quantity === 0;

    return (
      <section
        className='container'
        style={{ paddingTop: 0, paddingBottom: 10 }}
      >
        {quantityInCart === 0 && (
          <>
            {isOutOfStock ? (
              <components.Button
                label='Out of Stock'
                onClick={() => {
                  // Do nothing when out of stock
                }}
                style={{
                  backgroundColor: '#DC2626',
                  borderColor: '#DC2626',
                  opacity: 0.8,
                  cursor: 'not-allowed',
                }}
                containerStyle={{ marginBottom: 10 }}
              />
            ) : (
              <components.Button
                label='+ Add to cart'
                loading={addToCartLoading}
                loadingLabel='Adding...'
                className="moving-gradient-btn"
                style={{ 
                  background: 'white',
                  border: '1px solid var(--main-turquoise)',
                  color: '#0C1D2E'
                }}
                onClick={async () => {
                  const isAuthenticated = () => !!Cookies.get('authToken')
                  if (!isAuthenticated()) {
                    router.push(Routes.SIGN_IN)
                    return;
                  }
                  if (product && choosenVarient && choosenVarient?.id != null) {
                    setAddToCartLoading(true);
                    try {
                      const result = await addToCart(product?.id, choosenVarient?.id);
                      if (result?.success) {
                        showCartAddedToast();
                      }
                    } finally {
                      setAddToCartLoading(false);
                    }
                  } else {
                    console.warn("Cannot add to cart: Product or Chosen Variant ID is missing.");
                  }
                }}
                containerStyle={{ marginBottom: 10 }}
              />
            )}
          </>
        )}
        {quantityInCart > 0 && (
          <components.Button
            label='View Cart'
            loading={viewCartLoading}
            loadingLabel='Loading...'
            onClick={() => {
              setViewCartLoading(true);
              router.push(`${Routes.TAB_NAVIGATOR}?screen=${TabScreens.ORDER}`);
            }}
            className="moving-gradient-btn"
            containerStyle={{ marginBottom: 10 }}
            style={{ 
              background: 'linear-gradient(to right, var(--main-turquoise), var(--main-dark), var(--main-turquoise))',
              border: 'none',
              color: 'white'
            }}
          />
        )}
      </section>
    );
  };

  return (
    <components.Screen>
      {/* Scrollable content area with padding for fixed button */}
      <div
        style={{
          paddingBottom: 'max(120px, env(safe-area-inset-bottom, 0px) + 100px)', // Space for fixed button + iOS safe area
          minHeight: '100vh', // Ensure content can scroll
          overflowY: 'auto'
        }}
      >
        {/* Image Section */}
        <div style={{ position: 'relative' }}>
          <components.ImageZoom
            src={choosenVarient?.additional_images?.[0] || ''}
            height='clamp(260px, 33vh, 350px)'
            zoom={8}
            boxSize={130}
            offset={15}
            containerStyle={{ backgroundColor: 'transparent' }}
          >
            {renderImage()}
          </components.ImageZoom>
          {renderFloatingButtons()}
        </div>

        {/* Content Section */}
        <div
          style={{
            padding: '30px 20px 20px 20px', // Top, right, bottom, left padding
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Product Name & Kcal */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <h3
              className='number-of-lines-1'
              style={{ textTransform: 'capitalize', marginRight: '10px' }}
            >
              {product?.name}
            </h3>
          </div>

          {/* Product Description */}
          <div
            className='t16'
            dangerouslySetInnerHTML={{ __html: product?.product_description ?? '' }}
          />

          {/* Estimated Delivery */}
          {showDeliveryBanner && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '10px',
                padding: '12px 16px',
              }}
            >
              <div 
                style={{ 
                  backgroundColor: 'var(--main-turquoise)', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}
              >
                <div className="delivery-move-animation" style={{ display: 'flex' }}>
                  <svg.DeliverySvg />
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#15803d',
                    display: 'block',
                  }}
                >
                  Estimated Delivery
                </span>
                <span style={{ fontSize: '12px', color: '#166534' }}>
                  {estimatedDeliveryDays != null
                    ? estimatedDeliveryDays === 1
                      ? 'Delivers in 1 day'
                      : `Delivers in ${estimatedDeliveryDays} days`
                    : 'Delivery time will be confirmed'}
                </span>
              </div>
            </div>
          )}


          {/* Options and Price Section */}
          <div
            style={{
              backgroundColor: 'var(--white-color)',
              borderRadius: 'var(--border-radius)',
              padding: '15px',
              marginBlockEnd: '2rem'
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              {renderOptionsSelector()}
            </div>

            {/* Quantity display for selected variant */}
            <div style={{ marginBottom: '10px' }}>
              <span
                className='t12'
                style={{
                  color: 'var(--text-light-grey)',
                  fontSize: '12px'
                }}
              >
                Stocks: {choosenVarient?.quantity || 0}
              </span>
            </div>

            <div>
              {renderPriceWithCounter()}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Add to Cart Button at Bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--white-color)',
          borderTop: '1px solid var(--border-color, #EEE)',
          zIndex: 100,
          maxWidth: 'inherit',
          marginInline: 'auto',
          padding: '0', // Remove padding to let renderButton handle it
          paddingBottom: 'env(safe-area-inset-bottom, 0px)', // iOS safe area padding
        }}
      >
        {renderButton()}
      </div>
    </components.Screen>
  );
};