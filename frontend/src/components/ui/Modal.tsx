// ui/Modal.tsx
import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode; // Contenu informatif uniquement
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-dark-card border border-blue-950 rounded-xl w-full max-w-md p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-200 font-semibold text-lg">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Contenu informatif */}
                    <div className="text-slate-400 text-sm">{children}</div>

                    {/* Un seul bouton pour fermer */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-blue-950 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
