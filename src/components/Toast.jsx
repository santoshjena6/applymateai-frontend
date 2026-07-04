'use client';

// Toast — fixed bottom-right notification with auto-dismiss after 3 seconds
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Per-type styles: left border color, background, icon color, icon component
const TYPE_CONFIG = {
    success: {
        border:  '#10B981',
        bg:      '#F0FDF4',
        color:   '#059669',
        Icon:    CheckCircleIcon,
    },
    error: {
        border:  '#EF4444',
        bg:      '#FEF2F2',
        color:   '#DC2626',
        Icon:    XCircleIcon,
    },
    info: {
        border:  '#4F46E5',
        bg:      '#EEF2FF',
        color:   '#4F46E5',
        Icon:    InformationCircleIcon,
    },
};

const Toast = ({ message, type = 'info', onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in on mount
        const showTimer = setTimeout(() => setVisible(true), 10);

        // Auto-dismiss after 3 seconds: fade out then call onClose
        const hideTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // allow fade-out transition to complete
        }, 3000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [onClose]);

    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex items-start space-x-3 px-4 py-3.5 rounded-xl max-w-sm w-full shadow-lg transition-all duration-300"
            style={{
                backgroundColor: cfg.bg,
                borderLeft: `4px solid ${cfg.border}`,
                border: `1px solid ${cfg.border}`,
                borderLeftWidth: '4px',
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateY(0)' : 'translateY(12px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            role="alert"
        >
            {/* Type icon */}
            <cfg.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: cfg.color }} />

            {/* Message text */}
            <p className="flex-1 text-sm font-medium" style={{ color: '#111827' }}>{message}</p>

            {/* Manual close button */}
            <button
                onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
                className="shrink-0 p-0.5 rounded transition-colors hover:bg-black/5"
                style={{ color: '#9CA3AF' }}
                aria-label="Close"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
