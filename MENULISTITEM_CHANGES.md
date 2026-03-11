# MenuListItem.tsx Changes Documentation

## Overview
This document tracks the changes made to `src/items/MenuListItem.tsx` to implement the same add/clear cart functionality as `ItemGrid.tsx` while preserving the original quantity controller code for future use.

## Date: November 13, 2025

## Changes Made

### 1. Store Import Updates
**Before:**
```typescript
const { cart, addToCart, removeFromCart, outOfStockErrors, clearOutOfStockError } = stores.useCartStore();
```

**After:**
```typescript
const { cart, 
  addToCart, 
  // removeFromCart, 
  clearItemFromCart, 
  // outOfStockErrors, 
  // clearOutOfStockError 
} = stores.useCartStore();
```

**Changes:**
- Added `clearItemFromCart` import for complete item removal
- Commented out unused imports: `removeFromCart`, `outOfStockErrors`, `clearOutOfStockError`
- Maintained imports as comments for future reference

### 2. Handler Functions - Commented Out
The following handler functions were commented out but preserved:

#### `handleAddToCart` (Lines ~120-140)
- Original function for adding single items to cart
- Includes authentication check and stock validation
- Preserved for potential future quantity controller implementation

#### `handleRemoveFromCart` (Lines ~142-155)
- Original function for removing single items from cart
- Includes error clearing logic
- Preserved for potential future quantity controller implementation

### 3. New Cart Action Handler
**Added new function:**
```typescript
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

  if (qty === 0) {
    // Add to cart logic
    if (selectedVariant && selectedVariant.quantity === 0) {
      console.log('Cannot add to cart: Item is out of stock');
      return;
    }

    if (selectedVariant && selectedVariant.id != null) {
      addToCart(dish.id, selectedVariant.id);
    } else {
      console.warn("Cannot add to cart: Variant ID is missing for product", dish.id);
    }
  } else {
    // Clear from cart logic
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
};
```

**Features:**
- Handles both add and clear cart actions in one function
- Authentication validation
- Stock availability checks
- Complete item removal using `clearItemFromCart`
- Comprehensive error handling and logging

### 4. UI Changes - Quantity Controller Section

#### Original Quantity Controller (Lines ~327-398)
The entire quantity controller section was commented out but preserved:
- Increment/decrement buttons with quantity display
- Error state styling with red background
- Plus/minus SVG icons
- Quantity validation logic

#### New Cart Action Button (Lines ~400-450)
**Added new UI section:**
```typescript
{/* New Cart Action Button (Add/Clear) - Similar to ItemGrid */}
{allVariantsOutOfStock ? (
  <div style={{ /* Out of stock badge styling */ }}>
    <span>Out of Stock</span>
  </div>
) : (
  <button onClick={handleCartAction} style={{ /* Cart button styling */ }}>
    {qty === 0 ? (
      // Cart icon with + overlay (not in cart)
      <div style={{ position: 'relative' }}>
        <svg.ShoppingCartSvg />
        <div style={{ /* Plus overlay styling */ }}>
          <span>+</span>
        </div>
      </div>
    ) : (
      // Cart icon with white stroke (in cart)
      <svg.ShoppingCartSvg style={{ stroke: 'white' }} />
    )}
  </button>
)}
```

**Features:**
- Circular button design matching ItemGrid
- Dynamic background color based on cart state
- Shopping cart icon with visual indicators
- Out of stock badge when all variants unavailable

### 5. Commented Code Sections
The following sections were commented out for future reference:

#### Error Handling Variables (Lines ~105-115)
```typescript
// const errorKey = selectedVariant ? `${dish.id}_${selectedVariant.id}` : '';
// const apiError = errorKey ? outOfStockErrors[errorKey] : null;
```

#### Quantity Validation (Lines ~100-105)
```typescript
// const actualVariant = selectedVariant;
// const isQuantityExceeded = actualVariant && qty > 0 ? qty > actualVariant.quantity : false;
```

## Behavioral Changes

### Before
- Quantity controller with increment/decrement buttons
- Shows current quantity in cart
- Individual add/remove operations
- Complex error state management

### After
- Simple add/clear toggle button
- Visual cart state indication through icon changes
- Complete item removal on second click
- Simplified error handling focused on stock availability

## Preserved for Future Use
1. **Quantity Controller UI** - Complete increment/decrement interface
2. **Individual Cart Operations** - `handleAddToCart` and `handleRemoveFromCart`
3. **Error State Management** - API error handling and display logic
4. **Quantity Validation** - Stock limit checking

## Benefits of Changes
1. **Consistency** - Matches ItemGrid.tsx behavior
2. **Simplicity** - Cleaner user experience with add/clear actions
3. **Maintainability** - Single handler for cart operations
4. **Future-Proof** - Original code preserved for potential restoration
5. **Visual Clarity** - Clear cart state indication through button styling

## Files Affected
- `src/items/MenuListItem.tsx` - Primary changes
- Related to `src/items/ItemGrid.tsx` - Behavior alignment
- Uses `src/stores/useCartStore.tsx` - Cart state management

## Testing Considerations
- Verify add to cart functionality
- Test clear cart behavior
- Confirm authentication flow
- Validate out of stock handling
- Check visual state changes