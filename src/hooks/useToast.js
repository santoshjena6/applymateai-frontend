'use client';

// useToast — hook to show/hide a Toast notification
import { useState, useCallback } from 'react';
import Toast from '@/components/Toast';

export function useToast() {
    const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

    // Call showToast(message, type) to trigger a notification
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type, visible: true });
    }, []);

    // Rendered Toast component — render this in your JSX wherever needed
    const ToastComponent = toast.visible ? (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
    ) : null;

    return { toast, showToast, ToastComponent };
}
