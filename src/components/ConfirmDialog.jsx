import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <div>
          <div className="text-white font-semibold text-base mb-1">{title}</div>
          <div className="text-white/50 text-sm">{message}</div>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn-danger flex-1 justify-center">Supprimer</button>
        </div>
      </div>
    </Modal>
  );
}
