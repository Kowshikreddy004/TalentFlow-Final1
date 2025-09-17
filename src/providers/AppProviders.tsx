import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AuthProvider } from './AuthContext';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}
