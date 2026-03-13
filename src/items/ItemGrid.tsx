import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Or 'next/router' if using Pages Router
import Cookies from 'js-cookie';
import { dish } from '../dish';
import { svg } from '../svg';
import { Routes } from '../routes';
import itemPlaceholder from './../../public/mock/images/item-placeholder.png';
import { ProductType } from '@/types/DishType';
import { stores } from '@/stores';
import { showCartAddedToast } from '@/components/CartToast';

// import { PlusSvg } from './OrderItem'; // MinusSvg no longer needed here
// Assuming HeaderBasketSvg is correctly exported from ../svg or its index
// If not, direct import: import { HeaderBasketSvg } from '../svg/HeaderBasketSvg'; 

type Props = {
  item?: ProductType; // Made item optional for loading state
  isLoading?: boolean;
};

export const ItemGrid: React.FC<Props> = ({ item, isLoading }) => {
  const router = useRouter();
  const { toggleWishlistItem, wishlistedIds } = stores.useWishlistStore();
  const { cart, addToCart, clearItemFromCart } = stores.useCartStore();
  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const isAuthenticated = () => {
    return !!Cookies.get("authToken");
  };
  const userIsAuthenticated = isAuthenticated();

  const productCartItem = item && userIsAuthenticated
    ? cart?.cart_items.find((ci) => ci?.product?.id === item?.id)
    : undefined;
  const currentQuantity = productCartItem ? productCartItem.quantity : 0;

  if (isLoading || !item) {
    // Render Simplified Skeleton: Image and a single line of text
    return (
      <li style={{ backgroundColor: 'var(--white-color)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Skeleton Image placeholder - Now a single block */}
          <div style={{
            width: '100%',
            height: '160px',
            backgroundColor: '#e0e0e0', // Standard skeleton placeholder color
            borderTopLeftRadius: '10px', // Matches the main card's border radius
            borderTopRightRadius: '10px', // Matches the main card's border radius
          }}>
            {/* Inner div removed */}
          </div>

          {/* Skeleton Single Line of Text placeholder */}
          <div style={{ padding: '14px', paddingTop: '6px' }}> {/* Reduced paddingTop from 10px to 6px */}
            <div style={{
              height: '18px', // Approx height for a single line of text (e.g., DishName)
              backgroundColor: '#e0e0e0',
              width: '80%', // Make it reasonably long
              borderRadius: '4px',
              margin: '0 auto' // Center the text line placeholder
            }}></div>
          </div>
          {/* No other placeholders for buttons or price */}
        </div>
      </li>
    );
  }

  // Smart variant selection: Choose first available variant instead of always first
  const getSelectedVariant = () => {
    if (!item.variants || item.variants.length === 0) return null;

    // Handle both array and single variant cases
    const variants = Array.isArray(item.variants) ? item.variants : [item.variants];

    // Find first variant that has stock available
    const availableVariant = variants.find(variant => variant.quantity > 0);

    // If no variant has stock, return first variant (to show out of stock)
    return availableVariant || variants[0];
  };

  const selectedVariant = getSelectedVariant();

  // Check if all variants are out of stock
  const variants = Array.isArray(item.variants) ? item.variants : [item.variants];
  const allVariantsOutOfStock = variants.every(variant => variant.quantity === 0);

  const isInWishlist = userIsAuthenticated ? wishlistedIds.includes(item.id) : false;

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
      if (currentQuantity === 0) {
        // Check if selected variant is out of stock before attempting to add
        if (selectedVariant && selectedVariant.quantity === 0) {
          console.log('Cannot add to cart: Item is out of stock');
          return;
        }

        if (selectedVariant && selectedVariant.id != null) {
          const result = await addToCart(item.id, selectedVariant.id);
          if (result?.success) {
            showCartAddedToast();
          }
        } else {
          console.warn("Cannot add to cart: Variant ID is missing for product", item.id);
        }
      } else {
        // Remove item from cart when it's already in cart
        if (selectedVariant && selectedVariant.id != null) {
          const success = await clearItemFromCart(item.id, selectedVariant.id);
          if (success) {
            console.log('Item removed from cart successfully');
          } else {
            console.error('Failed to remove item from cart');
          }
        } else {
          console.warn("Cannot remove from cart: Variant ID is missing for product", item.id);
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

    // Check authentication first
    if (!userIsAuthenticated) {
      router.push(Routes.SIGN_IN);
      return;
    }

    if (selectedVariant && selectedVariant.id != null) {
      setIsWishlistLoading(true);
      await toggleWishlistItem(item.id, selectedVariant.id);
      setIsWishlistLoading(false);
    } else {
      console.warn("Cannot toggle wishlist: Variant ID is missing for product", item.id);
    }
  };

  return (
    <li style={{ backgroundColor: 'var(--white-color)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
      <Link
        href={`${Routes.MENU_ITEM}/${item.id}`}
        onClick={() => setIsNavigating(true)}
        style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
      >
        <div style={{
          width: '100%',
          height: '160px',
          position: 'relative',
          overflow: 'hidden',
          padding: '50px',
          backgroundColor: 'var(--image-background-color, #FAFAFA)',
          animation: isNavigating ? 'pulse-animation 1s infinite ease-in-out' : 'none'
        }}>
          <Image
            src={selectedVariant?.additional_images?.[0] || itemPlaceholder}
            alt={'dish'}
            fill
            style={{ objectFit: 'cover', borderBottomRightRadius: '14%', borderBottomLeftRadius: '11%', borderTopRightRadius: '11%', borderTopLeftRadius: '11%' }}
          />
        </div>

        <button
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--page-background-color, #f0f0f0)',
            zIndex: 1,
            border: 'none', // Ensure consistent button styling
            cursor: 'pointer'
          }}
          onClick={handleWishlistAction}
          disabled={isWishlistLoading}
        >
          <svg.HeartSvg flag={isInWishlist} isLoading={isWishlistLoading} />
        </button>

        {/* Content below the image */}
        <div style={{ padding: '10px 14px 14px 14px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          {/* Dish Name - takes full width */}
          <div> {/* Wrapper for DishName to control its spacing */}
            <dish.DishName name={item.name} style={{ fontWeight: 500, fontSize: '15px', display: 'block', marginBottom: '8px', color: 'var(--text-color, #333)' }} />
          </div>

          {/* Price, Quantity, and Cart Controls Flex Container */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Left Side: Price and Stock Quantity */}
            <div>
              <div
                style={{ display: 'flex', gap: '5px' }}
              >
                <span
                  className='t16' // Larger text for price
                  style={{ fontWeight: 'bold', color: 'var(--main-dark)', display: 'block', marginBottom: '2px' }}
                >
                  ₹{selectedVariant?.sale_price}
                </span>
                {/* {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.sale_price && (
                  <span
                    className='t12'
                    style={{
                      color: '#868686',
                      textDecoration: 'line-through',
                      fontSize: '14px',
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    ₹{selectedVariant.mrp}
                  </span>
                )}   */}
              </div>
              {!allVariantsOutOfStock && (
                <span className='t12' style={{ color: 'var(--text-light-grey)' }}>Stock: {selectedVariant?.quantity}</span>
              )}
            </div>

            {/* Right Side: Cart Action Button (+ or Cart Icon) or Out of Stock */}
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
                className={currentQuantity > 0 ? "cart-icon-shimmer moving-gradient-btn" : ""}
                style={{
                  padding: '10px 10px',
                  borderRadius: '100%',
                  background: currentQuantity > 0 
                    ? 'linear-gradient(to right, var(--main-turquoise), var(--main-dark), var(--main-turquoise))' 
                    : 'white',
                  color: currentQuantity > 0 ? 'var(--white-color)' : '#0C1D2E',
                  border: currentQuantity > 0 ? 'none' : '1px solid #E5E7EB',
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
                    {currentQuantity === 0 ? (
                      // Show cart icon with + overlay when not in cart (bigger)
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
      </Link>
    </li>
  );
};
