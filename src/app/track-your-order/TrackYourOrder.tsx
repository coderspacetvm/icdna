'use client'
import React, { useEffect, useState } from 'react';

import { svg } from '../../svg';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useOrderStore } from '../../stores/useOrderStore';
import { formatDate } from '@/utility/utils';
import { createApiService } from '@/lib/axios/apiService';
import { authClient } from '@/lib/axios/apiClient';
import { urls } from '@/lib/config/urls';
// import { components } from '@/components';

// Define all possible progress steps with proper typing
type ProgressStep = {
  id: number;
  title: string;
  description: string;
};

const allProgressSteps: Record<string, ProgressStep> = {
  'Waiting Confirmation': { id: 1, title: 'Waiting Confirmation', description: 'Waiting for confirmation' },
  'Order Confirmed': { id: 2, title: 'Order Confirmed', description: 'Your order has been confirmed' },
  'Delivery Boy Assigning': { id: 3, title: 'Delivery Boy Assigning', description: 'Assigning delivery partner' },
  'Delivery Boy Assigned': { id: 4, title: 'Delivery Boy Assigned', description: 'Delivery partner assigned' },
  'In Transit': { id: 5, title: 'In Transit', description: 'Order is on the way' },
  'Out For Delivery': { id: 6, title: 'Out For Delivery', description: 'Order is out for delivery' },
  'Delivered': { id: 7, title: 'Delivered', description: 'Order has been delivered' },
  'Cancelled': { id: 8, title: 'Cancelled', description: 'Order has been cancelled' },
  'Refunded': { id: 9, title: 'Refunded', description: 'Amount has been refunded' },
  'Delivery Boy Rejected': { id: 10, title: 'Delivery Boy Rejected', description: 'Delivery partner rejected' },
};

// Function to get progress steps based on order status
const getProgressSteps = (orderStatus: string) => {
  const normalFlow = ['Waiting Confirmation', 'Order Confirmed', 'Delivery Boy Assigned', 'Out For Delivery', 'Delivered'];
  const cancelledFlow = ['Waiting Confirmation', 'Order Confirmed', 'Cancelled', 'Refunded'];

  // Define the progression hierarchy - which display steps should be marked as done for each possible status
  const statusProgressionMap: Record<string, number> = {
    'Waiting Confirmation': 0,
    'Order Confirmed': 1,
    'Delivery Boy Assigning': 1, // Same as Order Confirmed
    'Delivery Boy Assigned': 2,
    'Delivery Boy Rejected': 1, // Back to Order Confirmed level
    'In Transit': 2, // Same as Delivery Boy Assigned
    'Out For Delivery': 3,
    'Delivered': 4,
    'Cancelled': 2, // For cancelled flow
    'Refunded': 3, // For cancelled flow
  };

  // Determine which flow to use based on order status
  const isCancelledFlow = ['Cancelled', 'Refunded'].includes(orderStatus);
  const flow = isCancelledFlow ? cancelledFlow : normalFlow;

  // Get the progression level for the current status
  const currentProgressionLevel = statusProgressionMap[orderStatus] ?? 0;

  return flow.map((step, index) => ({
    ...allProgressSteps[step],
    status: index <= currentProgressionLevel ? 'done' : 'pending'
  }));
};

export const TrackYourOrder: React.FC = () => {
  const { selectedOrder, setSelectedOrder } = useOrderStore();
  const [isLoading, setIsLoading] = useState(false);

  // Create private API service for authenticated requests
  const privateApiService = createApiService(authClient);

  useEffect(() => {
    console.log('Stored order from order history:', selectedOrder);
  }, [selectedOrder]);

  const renderHeader = () => {
    return (
      <Header
        showGoBack={true}
        title='Track your order'
      />
    );
  };

  const renderContent = () => {
    // Get progress steps based on the selected order's status
    const progress = selectedOrder ? getProgressSteps(selectedOrder.status) : [];

    return (
      <main className='scrollable container'>
        <section
          style={{
            padding: 20,
            marginTop: 10,
            borderRadius: 10,
            marginBottom: 10,
            border: '1px solid #06402B',
          }}
        >
          <div
            style={{
              gap: 14,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <span className='t14'>Your order:</span>
            <span
              className='t14'
              style={{ fontWeight: 500, color: 'var(--main-turquoise)' }}
            >
              {selectedOrder?.ids || 'N/A'}
            </span>
          </div>
          <div
            style={{
              gap: 14,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <span className='t14'>Date:</span>
            <span
              className='t14'
              style={{ fontWeight: 500, color: 'var(--main-turquoise)' }}
            >
              {selectedOrder ? `${formatDate(selectedOrder.date)} ${selectedOrder.time}` : 'N/A'}
            </span>
          </div>
        </section>
        <section
          style={{
            borderRadius: 10,
            padding: 30,
            backgroundColor: 'var(--white-color)',
          }}
        >
          {progress.map((item, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <div
                style={{ display: 'flex' }}
                key={item.id}
              >
                <section
                  style={{
                    marginRight: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: isLast ? 0 : 7,
                      backgroundColor:
                        item.status === 'done'
                          ? '#06402B'
                          : 'var(--white-color)',
                      border: '1px solid #06402B',
                    }}
                  >
                    {item.status === 'done' && <svg.StatusCheckSvg />}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        height: 30,
                        marginBottom: 6,
                        borderRadius: 1,
                        backgroundColor: '#06402B',
                      }}
                    />
                  )}
                </section>
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    className='t14'
                    style={{
                      marginBottom: 6,
                      color: 'var(--main-dark)',
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <span className='t14'>{item.description}</span>
                </section>
              </div>
            );
          })}
        </section>
      </main>
    );
  };

  const renderFooter = () => {
    // Check if order is already cancelled
    const isCancelled = selectedOrder && ['Cancelled', 'Refunded'].includes(selectedOrder.status);

    // Check if cancellation is allowed (before 'Out For Delivery')
    const canCancelOrder = selectedOrder &&
      !['Out For Delivery', 'Delivered', 'Cancelled', 'Refunded'].includes(selectedOrder.status);

    const handleCancelOrder = async () => {
      if (!canCancelOrder || !selectedOrder || isLoading) return;

      setIsLoading(true);

      try {
        console.log('Cancelling order:', selectedOrder.ids);

        const response = await privateApiService.post<any>(urls['cancel-order'], {
          order_id: selectedOrder.id
        });

        if (response.status === 1) {
          // Update the order status in the store
          const updatedOrder = {
            ...selectedOrder,
            status: 'Cancelled' as any
          };
          setSelectedOrder(updatedOrder);

          console.log('Order cancelled successfully');
        } else {
          console.error('Failed to cancel order:', response.message);
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <footer style={{ padding: 20 }}>
        {/* Show different content based on order status */}
        {isCancelled ? (
          // Show cancelled order message instead of button
          <div
            style={{
              backgroundColor: '#FFEBEE',
              border: '1px solid #FFCDD2',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
            }}
          >
            <span
              className='t14'
              style={{
                color: '#C62828',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Order is cancelled
            </span>
          </div>
        ) : (
          // Show cancel button and policy message for active orders
          <>
            {/* Cancellation policy message */}
            <div
              style={{
                backgroundColor: '#FFF3CD',
                border: '1px solid #FFEAA7',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <span
                className='t12'
                style={{
                  color: '#856404',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                ℹ️ Order cancellation is allowed only before the status reaches 'Out For Delivery'
              </span>
            </div>

            <Button
              label={isLoading ? 'Cancelling...' : 'Cancel Order'}
              onClick={handleCancelOrder}
              // disabled={!canCancelOrder || isLoading}
              containerStyle={{
                opacity: canCancelOrder && !isLoading ? 1 : 0.5,
                cursor: canCancelOrder && !isLoading ? 'pointer' : 'not-allowed',
              }}
            />
          </>
        )}
      </footer>
    );
  };

  return (
    <Screen>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </Screen>
  );
};
