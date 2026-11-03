import React, { useState } from 'react';
import { OzonProduct } from '../types/ozon';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Package, 
  Layers, 
  FileSpreadsheet, 
  Image as ImageIcon,
  CheckCircle,
  Tag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: OzonProduct | null;
  onClose: () => void;
  onExportProductExcel: (product: OzonProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onExportProductExcel
}) => {
  if (!product) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок модального окна */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800/50">
                {product.sku}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {product.tier}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Тело карточки */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Секция: Фотогалерея и быстрые параметры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Левая колонка: Галерея фото */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                {product.photos[activePhotoIdx] ? (
                  <img
                    src={product.photos[activePhotoIdx]}
                    alt={`Фото ${activePhotoIdx + 1}`}
                    className="w-full h-full object-contain p-2"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector('.modal-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'modal-fallback flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-2';
                        fallback.innerHTML = '<div class="w-16 h-16 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg mb-2">GS 450</div><span class="font-medium text-slate-200">Оригинальное изображение Ozon CDN</span><span class="text-xs text-slate-500 font-mono break-all max-w-sm">' + product.photos[activePhotoIdx] + '</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-800" />
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/90 text-slate-200 text-xs rounded-md font-mono">
                  Фото {activePhotoIdx + 1} из {product.photos.length}
                </div>
              </div>

              {/* Миниатюры всех фото */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-14 h-14 rounded-xl bg-slate-950 border overflow-hidden shrink-0 transition-all flex items-center justify-center font-mono text-[11px] ${
                      activePhotoIdx === idx
                        ? 'border-blue-500 ring-2 ring-blue-500/30 text-blue-400 bg-blue-950/40'
                        : 'border-slate-800 hover:border-slate-700 text-slate-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span>#{idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Список прямых ссылок на все фото */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Ссылки на все фото ({product.photos.length} шт):</span>
                  <span className="text-[10px] text-slate-500">Кликните чтобы скопировать</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {product.photos.map((url, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="truncate flex-1">
                        <strong>Фото {idx + 1}:</strong> {url}
                      </span>
                      <button
                        onClick={() => handleCopy(url)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 text-[10px] shrink-0"
                      >
                        {copiedLink === url ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400" />
                        )}
                        <span>{copiedLink === url ? 'Скопировано' : 'Копия'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка: Цены, комплектация и быстрые атрибуты */}
            <div className="space-y-4">
              {/* Блок цены */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Актуальная цена на Ozon:</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                  {product.oldPrice && (
                    <div className="text-xs text-slate-500 line-through font-mono">
                      {product.oldPrice.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all text-center justify-center"
                  >
                    <span>Открыть на Ozon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Комплектация */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  Комплектация ({product.packageContents.length} компонентов)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {product.packageContents.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Описание */}
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-400" />
                  Описание товара
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Секция: Таблица характеристик */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Все технические характеристики
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(product.characteristics).map(([key, value]) => (
                <div 
                  key={key} 
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start justify-between gap-2"
                >
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-slate-200 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Футер модального окна */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => handleCopy(product.url)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Скопировать ссылку Ozon</span>
          </button>

          <button
            onClick={() => onExportProductExcel(product)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Выгрузить эту позицию в Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
