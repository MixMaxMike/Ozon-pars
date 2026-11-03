import React, { useState } from 'react';
import { OzonProduct } from '../types/ozon';
import { 
  Search, 
  ExternalLink, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Eye, 
  FileSpreadsheet, 
  Package, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProductTableProps {
  products: OzonProduct[];
  onSelectProduct: (product: OzonProduct) => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onOpenGoogleSheets?: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSelectProduct,
  onExportExcel,
  onExportCsv,
  onOpenGoogleSheets
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.packageContents.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesColor = 
      selectedColor === 'all' || 
      (product.color && product.color.toLowerCase().includes(selectedColor.toLowerCase()));

    return matchesSearch && matchesColor;
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md flex flex-col">
      {/* Панель фильтров и поиска */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/50">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, артикулу или комплектации..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Фильтр по цвету */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="py-2 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Все цвета</option>
            <option value="бел">Белый глянец (RAL 9016)</option>
            <option value="черн">Черный муар (RAL 9005)</option>
          </select>
        </div>

        {/* Быстрые действия экспорта */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">
            Найдено: <strong className="text-slate-100 font-semibold">{filteredProducts.length}</strong>
          </span>

          {onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
              title="Открыть мастер экспорта в Google Таблицы"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Таблицы</span>
            </button>
          )}

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-700/30 transition-all active:scale-95"
            title="Выгрузить найденные товары в Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Сама таблица товаров */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 w-28">Фото</th>
              <th className="py-3 px-4 min-w-[240px]">Название & Артикул</th>
              <th className="py-3 px-4 min-w-[120px]">Цена</th>
              <th className="py-3 px-4 min-w-[220px]">Комплектация</th>
              <th className="py-3 px-4 min-w-[200px]">Характеристики</th>
              <th className="py-3 px-4 min-w-[160px]">Фотографии (Ссылки)</th>
              <th className="py-3 px-4 w-24 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredProducts.map((product, idx) => (
              <tr
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                {/* Номер */}
                <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                  {idx + 1}
                </td>

                {/* Главное фото */}
                <td className="py-3.5 px-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group/img flex items-center justify-center p-1">
                    {product.photos[0] ? (
                      <img
                        src={product.photos[0]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover/img:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Заменяем на красивый стилизованный svg плейсхолдер при блокировке хотлинка
                          (e.target as HTMLElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-icon flex flex-col items-center justify-center text-slate-500 text-[10px] font-mono text-center';
                            fallback.innerHTML = '<span class="text-xs text-blue-400 font-bold mb-0.5">GS</span><span>Титан</span>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-700" />
                    )}
                    <span className="absolute bottom-1 right-1 bg-slate-900/90 text-[10px] text-slate-300 px-1 rounded font-mono">
                      {product.photos.length}ф
                    </span>
                  </div>
                </td>

                {/* Название и Артикул */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {product.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                      {product.sku}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-medium bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                      {product.storeName || product.brand || 'Титан-GS'}
                    </span>
                    <span className="text-[10px] text-blue-300 font-medium bg-blue-900/30 border border-blue-800/40 px-1.5 py-0.5 rounded">
                      {product.tier}
                    </span>
                  </div>
                </td>

                {/* Цена */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                  {product.oldPrice && (
                    <div className="text-[11px] text-slate-500 line-through font-mono">
                      {product.oldPrice.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </td>

                {/* Комплектация */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 mb-1">
                    <Package className="w-3 h-3 text-amber-400" />
                    <span>{product.packageContents.length} элементов:</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {product.packageContents.join(' • ')}
                  </div>
                </td>

                {/* Характеристики */}
                <td className="py-3.5 px-4">
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    {product.dimensions && (
                      <div><strong className="text-slate-400 font-normal">Размеры:</strong> {product.dimensions}</div>
                    )}
                    {product.color && (
                      <div><strong className="text-slate-400 font-normal">Цвет:</strong> {product.color}</div>
                    )}
                    {product.characteristics['Максимальная нагрузка'] && (
                      <div><strong className="text-slate-400 font-normal">Нагрузка:</strong> {product.characteristics['Максимальная нагрузка']}</div>
                    )}
                  </div>
                </td>

                {/* Фотографии: ссылки отдельно */}
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.photos.slice(0, 3).map((photoUrl, pIndex) => (
                      <button
                        key={pIndex}
                        onClick={(e) => handleCopyLink(photoUrl, e)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700/60 font-mono flex items-center gap-1 transition-all"
                        title={`Скопировать ссылку на Фото ${pIndex + 1}: ${photoUrl}`}
                      >
                        {copiedUrl === photoUrl ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400" />
                        )}
                        <span>Фото {pIndex + 1}</span>
                      </button>
                    ))}
                    {product.photos.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{product.photos.length - 3} ещё
                      </span>
                    )}
                  </div>
                </td>

                {/* Действия */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Подробный просмотр"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded-lg transition-colors"
                      title="Открыть страницу на Ozon"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm">
          По вашему запросу ничего не найдено. Попробуйте изменить фильтры или сбросить поиск.
        </div>
      )}
    </div>
  );
};
