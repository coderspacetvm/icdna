import React from 'react';
import type { Metadata } from 'next';

import { TabNavigator } from './TabNavigator';

export const metadata: Metadata = {
  title: 'ICDNA',
  description:
    'Discover delicious food and explore our menu at ICDNA. Order your favorite dishes with ease.',
};

export default async function TabNavigatorPage() {
  return <TabNavigator />;
}
