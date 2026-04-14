interface ConfirmAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmAlert({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: ConfirmAlertProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0f1115] p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)]">
                <h2 className="text-lg font-semibold text-white">{title}</h2>

                <p className="mt-3 text-sm text-gray-400">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10 transition"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}