'use client';

interface ModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'info';
    confirmText?: string;
    cancelText?: string;
}

export default function Modal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {type === 'danger' ? '⚠️' : 'ℹ️'}
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors shadow-lg ${type === 'danger'
                                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                                : 'bg-primary hover:bg-primary-glow shadow-primary/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
