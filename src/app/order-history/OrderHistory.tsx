'use client';

import React, { useState, useEffect } from 'react';

import { hooks } from '../../hooks';
import { Routes } from '../../routes';
import { components } from '../../components';
import { useOrderStore } from '../../stores/useOrderStore';

export const OrderHistory: React.FC = () => {
  const router = hooks.useTrackedRouter();
  const { orders, ordersLoading, error } = hooks.useGetOrders();
  const { setSelectedOrder } = useOrderStore();
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());


  const hasLoaded = React.useRef(false);

  useEffect(() => {
    // Only fire the redirect once, after the very first successful load
    if (ordersLoading) return;
    if (hasLoaded.current) return; // already handled — don't redirect again on re-renders
    hasLoaded.current = true;

    if (!error && orders.length === 0) {
      router.replace(Routes.ORDER_HISTORY_EMPTY);
    }
  }, [orders, ordersLoading, error, router]);

  const handleToggle = (id: number) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      const idStr = id.toString();
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
      } else {
        newSet.add(idStr);
      }
      return newSet;
    });
  };

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order);
    router.push(Routes.TRACK_YOUR_ORDER);
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Order history'
      />
    );
  };

  const renderContent = () => {
    if (ordersLoading) {
      return (
        <main className='container' style={{ padding: 20, textAlign: 'center' }}>
          <p>Loading orders...</p>
        </main>
      );
    }

    if (error) {
      return (
        <main className='container' style={{ padding: 20, textAlign: 'center', color: 'red' }}>
          <p>Error fetching orders: {error}</p>
        </main>
      );
    }

    // Redirect handled by useEffect, but as a fallback or if orders become empty after initial load:
    if (orders.length === 0) {
      // This case should ideally be handled by the useEffect redirecting to ORDER_HISTORY_EMPTY
      // If router.replace hasn't completed, or if orders become empty due to some other action not covered
      return (
        <main className='container' style={{ padding: 20, textAlign: 'center' }}>
          <p>No orders found. </p>
        </main>
      );
    }

    return (
      <main className='scrollable container'>
        <section
          className='accordion'
          style={{ paddingTop: 10 }}
        >
          {orders.map((order) => {
            const idStr = order.id.toString();
            const isOpen = openAccordions.has(idStr);
            return (
              <div key={order.ids}>
                <details
                  open={isOpen}
                  style={{
                    borderRadius: 10,
                    marginBottom: 10,
                    backgroundColor: 'var(--white-color)',
                  }}
                  onToggle={() => handleToggle(order.id)}
                >
                  <summary
                    style={{
                      padding: 20,
                      borderBottom: isOpen ? '1px solid #DBE9F5' : 'none',
                    }}
                  >
                    <section
                      style={{
                        marginBottom: 6,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {/* Date */}
                      <span
                        className='t14'
                        style={{
                          marginRight: 4,
                          fontWeight: 500,
                          color: 'var(--main-dark)',
                        }}
                      >
                        {order.date}
                      </span>
                      {/* Time */}
                      <span
                        className='t10'
                        style={{ marginRight: 'auto', marginTop: 2 }}
                      >
                        at {order.time}
                      </span>
                      <span
                        className='t14'
                        style={{ fontWeight: 500, color: 'var(--main-dark)' }}
                      >
                        ₹{order.total}
                      </span>
                    </section>
                    <section
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span className='t12'>Order ID: {order.ids}</span>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 5,
                          backgroundColor:
                            order.status === 'Delivered'
                              ? '#06402B'
                              : ['Out For Delivery', 'In Transit', 'Delivery Boy Assigned'].includes(order.status)
                                ? '#FFA462'
                                : ['Cancelled', 'Refunded'].includes(order.status)
                                  ? '#FA5555'
                                  : '#FFA462',
                          color: '#fff',
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                        className='t10'
                      >
                        {order.status}
                      </span>
                    </section>
                  </summary>
                  <section style={{ padding: 20 }}>
                    <ul>
                      {order.products.map((product) => {
                        return (
                          <li
                            key={product.id}
                            style={{
                              marginBottom: 8,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span className='t14'>{product.name}</span>
                            <span
                              style={{ marginLeft: 'auto' }}
                              className='t14'
                            >
                              {product.quantity} x ₹{product.price}
                            </span>
                          </li>
                        );
                      })}
                      <li
                        style={{
                          marginBottom: 8,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Discount</span>
                        <span className='t14'>- ₹{order.discount}</span>
                      </li>
                      <li
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Delivery</span>
                        <span className='t14'>₹{order.delivery}</span>
                      </li>
                      <br />
                      <li
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Ordered type</span>
                        <span className='t14'>{order.order_type}</span>
                      </li>
                      {order.order_type?.toLowerCase() === 'pre-order' && <li
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Scheduled Date</span>
                        <span className='t14'>{order.scheduled_date?.split('T')[0]} {order.scheduled_date?.split('T')[1].split('+')[0]}</span>
                      </li>}
                      {order.estimated_delivery_date && (
                        <li
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span className='t14'>Delivered in</span>
                          <span className='t14'>{order.estimated_delivery_date}</span>
                        </li>
                      )}
                    </ul>
                  </section>
                </details>
                {isOpen && (
                  <div
                    className='row-center'
                    style={{
                      marginBottom: 20,
                      gap: 15,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <components.Button
                      label='track order'
                      containerStyle={{ flex: '1 1 auto', minWidth: '120px' }}
                      onClick={() => handleTrackOrder(order)}
                    />
                    {/* <components.Button
                      label='repeat order'
                      colorScheme='secondary'
                      containerStyle={{flex: 1}}
                      href={Routes.TAB_NAVIGATOR}
                    /> */}
                    {order.invoice_pdf && (
                      <components.Button
                        label='Download Invoice'
                        containerStyle={{ flex: '1 1 auto', minWidth: '150px' }}
                        colorScheme='secondary'
                        onClick={() => {
                          window.open(order.invoice_pdf as string, '_blank');
                        }}
                      />
                    )}
                    {order.status === 'Delivered' && (
                      <components.Button
                        label='Leave review'
                        containerStyle={{ flex: '1 1 auto', minWidth: '120px' }}
                        onClick={() => router.push(`${Routes.LEAVE_A_REVIEW}?product=${order.products[0].id}&order=${order.id}`)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
