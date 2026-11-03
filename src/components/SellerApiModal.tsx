import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  Layers, 
  Database, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { SellerApiCredentials } from '../types/ozon';

interface SellerApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: SellerApiCredentials;
  onSaveCredentials: (creds: SellerApiCredentials) => void;
  onSyncSellerApi: () => void;
  isSyncing: boolean;
}

export const SellerApiModal: React.FC<SellerApiModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onSaveCredentials,
  onSyncSellerApi,
  isSyncing
}) => {
  if (!isOpen) return null;

  const [clientId, setClientId] = useState(credentials.clientId || '');
  const [apiKey, setApiKey] = useState(credentials.apiKey || '');
  const [shopName, setShopName] = useState(credentials.shopName || 'Официальный магазин Титан-GS');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCredentials({
      clientId: clientId.trim(),
      apiKey: apiKey.trim(),
      shopName: shopName.trim(),
      isConnected: Boolean(clientId && apiKey),
      lastSync: new Date().toLocaleTimeString('ru-RU')
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Подключение Ozon Seller API (Контур 1 ТЗ)
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Официальный API
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Прямая выгрузка 100% каталога без капчи, блокировок WAF и лимитов пагинации
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-slate-300 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-300 mb-0.5">
                Согласно разделу 2.1 архитектурного ТЗ «Seller Data»:
              </div>
              Официальный Seller API позволяет получать полный реестр карточек товаров, все характеристики, ссылки на фото в максимальном разрешении, остатки по складам и цены напрямую из личного кабинета продавца Ozon.
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Название магазина / кабинета:
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Титан-GS Official"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Client-Id (Идентификатор клиента Ozon):
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="например: 1849204"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                API Key (Токен с правами «Товары» и «Только чтение»):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Секретные ключи не передаются третьим лицам и используются только для чтения карточек.
              </span>
            </div>
          </div>

          {credentials.isConnected && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Кабинет подключен: {credentials.shopName}</span>
              </div>
              {credentials.lastSync && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Синхронизация: {credentials.lastSync}
                </span>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
            >
              {saved ? '✓ Сохранено' : 'Сохранить ключи'}
            </button>

            <button
              type="button"
              onClick={onSyncSellerApi}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-700/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Запрос к Seller API...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Запустить синхронизацию 100%</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
