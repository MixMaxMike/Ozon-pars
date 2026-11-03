import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, Sparkles, Tag, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { SearchFilter } from '../types/ozon';

interface SearchParserProps {
  onSearch: (filter: SearchFilter) => void;
  isParsing: boolean;
}

export const SearchParser: React.FC<SearchParserProps> = ({
  onSearch,
  isParsing
}) => {
  const [query, setQuery] = useState<string>('Гардеробная система Титан-GS');
  const [brand, setBrand] = useState<string>('Титан-GS');
  const [minPrice, setMinPrice] = useState<string>('15000');
  const [maxPrice, setMaxPrice] = useState<string>('47000');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onSearch({
      query: query.trim(),
      brand: brand.trim() || undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      sortBy
    });
  };

  // Пример формируемой поисковой ссылки Ozon
  const generatedOzonSearchUrl = `https://www.ozon.ru/search/?text=${encodeURIComponent(query)}${minPrice || maxPrice ? `&currency_price=${minPrice || 0}.000%3B${maxPrice || 100000}.000` : ''}&from_global=true`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          <span>Поисковый сборщик Ozon (по названию, бренду и параметрам)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Ищет товары в поиске Ozon, фильтрует по бренду, диапазону цен и выгружает полные карточки со всеми фото и характеристиками.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Главная поисковая строка */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите название товара или категорию (например: Гардеробная система Титан-GS 2400)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        {/* Сетка фильтров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Бренд */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-400" />
              <span>Бренд (фильтр):</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Титан-GS / Любой"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Цена от */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Цена от (₽):</span>
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="15000"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Цена до */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Цена до (₽):</span>
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="47000"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Сортировка */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-blue-400" />
              <span>Сортировка:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="rating">Высокий рейтинг</option>
            </select>
          </div>
        </div>

        {/* Предпросмотр формируемого URL Ozon */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2 truncate">
            <span className="text-blue-400 font-semibold shrink-0">Поисковый URL Ozon:</span>
            <span className="text-slate-500 truncate">{generatedOzonSearchUrl}</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
            Готов к парсингу
          </span>
        </div>

        {/* Кнопка запуска */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {['Титан-GS 1200', 'Титан-GS 1800', 'Титан-GS 2400', 'Стеллаж Титан'].map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(sample)}
                className="hidden sm:inline-block text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 px-2 py-0.5 rounded-md transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isParsing || !query.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Поиск и сбор карточек...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-white" />
                <span>Найти и спарсить карточки</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
