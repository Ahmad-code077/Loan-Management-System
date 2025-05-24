'use client';

import { store } from '@/lib/store/store';
import { Provider } from 'react-redux';
import { Toaster } from '../ui/toaster';

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
