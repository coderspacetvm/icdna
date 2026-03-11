import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { svg } from '../svg';
import { Routes } from '../routes';
import { stores } from '../stores';
import { ProductType } from '@/types/DishType';
import Cookies from 'js-cookie';
import { showCartAddedToast } from '@/components/CartToast';

// import { hooks } from '@/hooks';
import itemPlaceholder from './../../public/mock/images/item-placeholder.png'
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';


type Props = {
  dish?: ProductType; // Made dish optional for loading state
  isLast?: boolean;   // Made isLast optional for loading state
  isLoading?: boolean;
};


export const MenuListItem: React.FC<Props> = ({ dish, isLast, isLoading }) => {
  const router = useRouter()
  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const isAuthenticated = () => {
    return !!Cookies.get("authToken");
  };
  const userIsAuthenticated = isAuthenticated();
  if (isLoading || !dish) {
    // Render Skeleton
    const placeholderColor = '#e0e0e0';
    const lighterPlaceholderColor = '#f0f0f0';
    return (
      <li
        style={{
          borderRadius: 10,
          padding: '14px',
          backgroundColor: 'var(--white-color)',
          marginBottom: isLast === false ? 14 : (isLast === true ? 0 : 14), // handle undefined isLast for skeleton too
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #f0f0f0', // Slight border for skeleton visibility
        }}
      >
        {/* Image Placeholder */}
        <div style={{
          width: 97,
          height: 97,
          borderRadius: 14,
          backgroundColor: placeholderColor,
          marginRight: 10,
        }} />

        {/* Text Content Placeholder */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Name */}
          <div style={{ height: 18, width: '70%', backgroundColor: placeholderColor, borderRadius: 4, marginBottom: 8 }} />
          {/* Description line 1 */}
          <div style={{ height: 12, width: '90%', backgroundColor: lighterPlaceholderColor, borderRadius: 4, marginBottom: 6 }} />
          {/* Description line 2 */}
          <div style={{ height: 12, width: '80%', backgroundColor: lighterPlaceholderColor, borderRadius: 4, marginBottom: 8 }} />
          {/* Price */}
          <div style={{ height: 16, width: '40%', backgroundColor: placeholderColor, borderRadius: 4 }} />
        </div>

        {/* Heart Button Placeholder */}
        <div style={{
          width: 24, // Approx size
          height: 24, // Approx size
          backgroundColor: lighterPlaceholderColor,
          borderRadius: 4,
          position: 'absolute',
          right: 14, // Match padding
          top: 14,   // Match padding
        }} />

        {/* Plus/Qty Button Placeholder */}
        <div style={{
          width: 24, // Approx size
          height: 24, // Approx size
          backgroundColor: lighterPlaceholderColor,
          borderRadius: 4, // Or 10.5 for PlusSvg's roundness
          position: 'absolute',
          right: 14,  // Match padding
          bottom: 14, // Match padding
        }} />
      </li>
    );
  }

  const { cart,
    addToCart,
    // removeFromCart, 
    clearItemFromCart,
    // outOfStockErrors, 
    // clearOutOfStockError 
  } = stores.useCartStore();
  const { toggleWishlistItem, wishlistedIds } = stores.useWishlistStore();

  // Ensure dish is defined before accessing its properties and user is authenticated
  const isInWishlist = dish && userIsAuthenticated ? wishlistedIds.includes(dish.id) : false;

  // Smart variant selection: Choose first available variant instead of always first
  const getSelectedVariant = () => {
    if (!dish.variants || dish.variants.length === 0) return null;

    // Find first variant that has stock available
    const availableVariant = dish.variants.find(variant => variant.quantity > 0);

    // If no variant has stock, return first variant (to show out of stock)
    return availableVariant || dish.variants[0];
  };

  const selectedVariant = getSelectedVariant();
  // const selectedVariantIndex = selectedVariant ? dish.variants.findIndex(v => v.id === selectedVariant.id) : 0; // Unused while variant badges are hidden

  // Check if all variants are out of stock
  const allVariantsOutOfStock = dish.variants.every(variant => variant.quantity === 0);

  // Quantity calculation for the selected variant specifically - only if authenticated
  const selectedVariantCartItem = userIsAuthenticated ? cart?.cart_items.find(ci =>
    ci.product?.id === dish?.id && ci.variant?.id === selectedVariant?.id
  ) : null;
  const qty = selectedVariantCartItem ? selectedVariantCartItem.quantity : 0;

  // Quantity validation logic using selected variant
  // const actualVariant = selectedVariant;
  // const isQuantityExceeded = actualVariant && qty > 0 ? qty > actualVariant.quantity : false;

  // Check for API error (out of stock)
  // const errorKey = selectedVariant ? `${dish.id}_${selectedVariant.id}` : '';
  // const apiError = errorKey ? outOfStockErrors[errorKey] : null;

  // Show error only if all variants are out of stock
  // Don't show API errors if other variants are available
  const hasError = allVariantsOutOfStock;
  const errorMessage = allVariantsOutOfStock ? 'Out of stock' : '';

  // Handle add to cart with error handling
  // const handleAddToCart = async () => {
  //   if (isAuthenticated() === false) {
  //     router.push(Routes.SIGN_IN)
  //   }

  //   // Check if variant is out of stock before attempting to add
  //   if (selectedVariant && selectedVariant.quantity === 0) {
  //     console.log('Cannot add to cart: Item is out of stock');
  //     return;
  //   }

  //   if (selectedVariant && selectedVariant.id != null) {
  //     const result = await addToCart(dish.id, selectedVariant.id);
  //     if (!result.success && result.error) {
  //       // Error will be automatically stored in outOfStockErrors by the store
  //       console.log('Add to cart failed:', result.error);
  //     }
  //   } else {
  //     console.warn("Cannot add to cart: Variant ID is missing for product", dish.id);
  //   }
  // };

  // Handle remove from cart and clear errors
  // const handleRemoveFromCart = () => {
  //   if (selectedVariant && selectedVariant.id != null) {
  //     removeFromCart(dish.id, selectedVariant.id);
  //     // Clear any existing error when removing items
  //     if (apiError) {
  //       clearOutOfStockError(dish.id, selectedVariant.id);
  //     }
  //   } else {
  //     console.warn("Cannot remove from cart: Variant ID is missing for product", dish.id);
  //   }
  // };

  // Handle cart action (add/clear) similar to ItemGrid
  const handleCartAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check authentication first
    if (!userIsAuthenticated) {
      router.push(Routes.SIGN_IN);
      return;
    }

    // Don't allow cart actions if all variants are out of stock
    if (allVariantsOutOfStock) {
      return;
    }

    try {
      setIsCartLoading(true);
      if (qty === 0) {
        // Check if selected variant is out of stock before attempting to add
        if (selectedVariant && selectedVariant.quantity === 0) {
          console.log('Cannot add to cart: Item is out of stock');
          return;
        }

        if (selectedVariant && selectedVariant.id != null) {
          const result = await addToCart(dish.id, selectedVariant.id);
          if (result?.success) {
            showCartAddedToast();
          }
        } else {
          console.warn("Cannot add to cart: Variant ID is missing for product", dish.id);
        }
      } else {
        // Remove item from cart when it's already in cart
        if (selectedVariant && selectedVariant.id != null) {
          const success = await clearItemFromCart(dish.id, selectedVariant.id);
          if (success) {
            console.log('Item removed from cart successfully');
          } else {
            console.error('Failed to remove item from cart');
          }
        } else {
          console.warn("Cannot remove from cart: Variant ID is missing for product", dish.id);
        }
      }
    } catch (error) {
      console.error('Error handling cart action:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);
  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userIsAuthenticated) {
      router.push(Routes.SIGN_IN);
      return;
    }

    if (selectedVariant && selectedVariant.id != null) {
      setIsWishlistLoading(true);
      await toggleWishlistItem(dish.id, selectedVariant.id);
      setIsWishlistLoading(false);
    } else {
      console.warn("Cannot toggle wishlist: Variant ID is missing for product", dish.id);
    }
  };

  return (
    <li
      style={{
        borderRadius: 10,
        padding: '14px', // Standardized padding
        backgroundColor: 'var(--white-color)',
        marginBottom: isLast ? 0 : 14, // isLast should be defined now
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        border: hasError ? '2px solid #DC2626' : '1px solid transparent', // Red border when error
      }}
    >
      <Link
        href={`${Routes.MENU_ITEM}/${dish.id}`}
        onClick={() => setIsNavigating(true)}
        style={{ display: 'block', marginRight: 10 }}
      >
        <div style={{
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: 'var(--image-background-color, #FAFAFA)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: isNavigating ? 'pulse-animation 1s infinite ease-in-out' : 'none'
        }}>
          <Image
            src={selectedVariant?.additional_images[0] || itemPlaceholder || ""}
            alt={selectedVariant?.variants || 'product_image'}
            width={97}  // Adjusted width: 117 (container) - 20 (padding)
            height={97} // Adjusted height: 117 (container) - 20 (padding)
            style={{
              objectFit: 'cover',
              // borderRadius: 5, // Optional: slight rounding for the image itself
            }}
          />
        </div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Link href={`${Routes.MENU_ITEM}/${dish.id}`} style={{ textDecoration: 'none' }}>
          <span
            className='t14'
            style={{
              marginBottom: 4,
              display: 'block',
              color: 'var(--main-dark)',
              textTransform: 'capitalize',
            }}
          >
            {dish.name}
          </span>
          <p
            className='number-of-lines-2 t10'
            style={{
              fontSize: 10,
              color: 'var(--text-color)',
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            {dish.product_description?.replace(/<[^>]+>/g, '') || ''}
          </p>
        </Link>
        <span
          className='t10'
          style={{ marginBottom: 8 }}
        >
          {/* {dish.kcal} kcal - {dish.weight}g */}
        </span>

        {/* Variants Display - commented for listing page, uncomment if needed
        {dish.variants && dish.variants.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '8px'
          }}>
            {dish.variants.map((variant, index) => {
              const isSelected = index === selectedVariantIndex;
              const isOutOfStock = variant.quantity === 0;

              return (
                <span
                  key={variant.id}
                  className='t10'
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: '500',
                    backgroundColor: isSelected && !isOutOfStock ? 'var(--main-turquoise)' : '#f5f5f5',
                    color: isSelected && !isOutOfStock ? 'white' : '#666',
                    border: isOutOfStock ? '1px solid #DC2626' : (isSelected ? 'none' : '1px solid #e0e0e0'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '20px',
                    lineHeight: '1',
                  }}
                >
                  {variant.variants}
                </span>
              );
            })}
          </div>
        )}
        */}

        {/* Price and Quantity Controller Row */}
        <div
          className="price-quantity-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <div
            style={{ display: "flex", gap: "5px" }}
          >
            <span
              className="t14"
              style={{
                color: "var(--main-dark)",
              }}
            >
              ₹{selectedVariant?.sale_price || dish.variants[0]?.sale_price}
            </span>
            {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.sale_price && (
              <span
                className="t14"
                style={{
                  color: "#868686",
                  textDecoration: "line-through",
                  fontSize: "14px",
                }}
              >
                ₹{selectedVariant.mrp}
              </span>
            )}
          </div>

          {/* Quantity Controller */}
          {/* {qty === 0 ? (
            <button
              style={{
                padding: '4px',
                borderRadius: 4,
                background: 'transparent',
                border: 'none',
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <div style={{ position: 'relative' }}>
                    <svg.ShoppingCartSvg style={{ height: '16px', width: '16px' }} />
                    <div style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--white-color)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>+</span>
                    </div>
                  </div>
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: hasError ? '#FEB2B2' : 'var(--main-turquoise)',
                borderRadius: 20,
                padding: '0px',
                border: hasError ? '2px solid #C53030' : 'none',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemoveFromCart();
                }}
                style={{ background: 'transparent', border: 'none', padding: '6px', color: 'white' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><rect width="21" height="21" fill="#E6F3F8" rx="10.5"></rect><path stroke="#0C1D2E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M6.125 10.5h8.75"></path></svg>
              </button>
              <span
                className='t14'
                style={{ color: 'var(--white-color)', padding: '0 6px', fontWeight: 'bold' }}
              >
                {qty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddToCart();
                }}
                style={{ background: 'transparent', border: 'none', padding: '6px', color: 'white' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><rect width="21" height="21" fill="#E6F3F8" rx="10.5"></rect><path stroke="#0C1D2E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M10.5 6.125v8.75M6.125 10.5h8.75"></path></svg>
              </button>
            </div>
          )} */}

          {/* New Cart Action Button (Add/Clear) - Similar to ItemGrid */}
          {allVariantsOutOfStock ? (
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className='t12 out-of-stock-text'
                style={{
                  color: '#DC2626',
                  fontWeight: '600',
                  fontSize: '10px',
                }}
              >
                Out of Stock
              </span>
            </div>
          ) : (
            <button
              onClick={handleCartAction}
              className={qty > 0 ? "cart-icon-shimmer moving-gradient-btn" : ""}
              style={{
                padding: '10px 10px',
                borderRadius: '100%',
                background: qty > 0 
                  ? 'linear-gradient(to right, var(--main-turquoise), var(--main-dark), var(--main-turquoise))' 
                  : 'white',
                color: qty > 0 ? 'var(--white-color)' : '#0C1D2E',
                border: qty > 0 ? 'none' : '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isCartLoading ? 'wait' : 'pointer',
                opacity: isCartLoading ? 0.8 : 1,
                transition: 'all 0.2s ease'
              }}
              disabled={isCartLoading}
            >
              <>
                <div style={isCartLoading ? { animation: 'pulse-animation 1s infinite ease-in-out' } : {}}>
                  {qty === 0 ? (
                    // Show cart icon with + overlay when not in cart
                    <div style={{ position: 'relative' }}>
                      <svg.ShoppingCartSvg style={{ height: '16px', width: '16px' }} />
                      <div style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'var(--white-color)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>+</span>
                      </div>
                    </div>
                  ) : (
                    // Show cart icon with green stroke when item is in cart
                    <svg.ShoppingCartSvg style={{ height: '16px', width: '16px', stroke: 'white' }} />
                  )}
                </div>
              </>
            </button>
          )}
        </div>
      </div>

      {/* Heart Button - Keep as absolute positioned */}
      <button
        style={{
          padding: 14,
          position: 'absolute',
          right: 0,
          top: 0,
          borderRadius: 4,
        }}
        onClick={handleWishlistAction}
        disabled={isWishlistLoading}
      >
        <div style={isWishlistLoading ? { animation: 'pulse-animation 1s infinite ease-in-out' } : {}}>
          <svg.HeartSvg flag={isInWishlist} />
        </div>
      </button>

      {/* Red tag overlay spanning full width of image */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            width: '97px', // Same as image width
            backgroundColor: '#DC2626',
            color: 'white',
            padding: '6px 4px',
            borderRadius: '4px 4px 0 0', // Rounded top corners only
            fontSize: '9px',
            fontWeight: '600',
            zIndex: 15,
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
            lineHeight: '1.3',
            textAlign: 'center',
            wordWrap: 'break-word',
            hyphens: 'auto',
          }}
        >
          {errorMessage}
        </div>
      )}
    </li>
  );
};
