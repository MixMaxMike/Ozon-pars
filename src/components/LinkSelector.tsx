import React, { useState } from 'react';
import { CATALOG_PRESETS } from '../data/titanGsData';
import { MultiStoreCollector } from './MultiStoreCollector';
import { SearchParser } from './SearchParser';
import { SearchFilter } from '../types/ozon';
import { Link2, Zap, ArrowRight, CheckCircle2, Globe, Sparkles, Filter, Store, Search, Layers } from 'lucide-react';

interface LinkSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  onStartParsing: (autoDownload?: boolean) => void;
  onCollectStores: (urls: string[]) => void;
  onSearch: (filter: SearchFilter) => void;
  isParsing: boolean;
  totalProductsCount: number;
}

export const LinkSelector: React.FC<LinkSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
  customUrl,
  onCustomUrlChange,
  onStartParsing,
  onCollectStores,
  onSearch,
  isParsing,
  totalProductsCount
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'multi_store' | 'search'>('presets');
  const [autoDownload, setAutoDownload] = useState(true);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartParsing(autoDownload);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Навигационные вкладки режимов сбора */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Каталог Титан-GS (5 ссылок)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('multi_store')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'multi_store'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-300" />
            <span>Мульти-ввод магазинов Ozon</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              NEW
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4 text-indigo-300" />
            <span>Поиск по названию / бренду</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              NEW
            </span>
          </button>
        </div>

        {/* Главная кнопка В 1 КЛИК */}
        <button
          onClick={() => onStartParsing(autoDownload)}
          disabled={isParsing}
          className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:via-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-125 transition-transform" />
          <span>Спарсить всё в 1 клик</span>
          <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Вкладка 1: 5 ценовых диапазонов Титан-GS + одиночная ссылка */}
      {activeTab === 'presets' && (
        <div className="space-y-5">
          {/* Ввод произвольной ссылки */}
          <form onSubmit={handleCustomSubmit}>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                Вставьте ссылку Ozon (или выберите готовую ссылку из 5 диапазонов ниже):
              </span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Без API-ключей, прямо с витрины
              </span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => onCustomUrlChange(e.target.value)}
                  placeholder="https://www.ozon.ru/brand/titan-gs-87366809/?..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isParsing}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Обработать ссылку</span>
              </button>
            </div>
          </form>

          {/* Предустановленные точные ссылки каталога Титан-GS */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-blue-400" />
                Точные ссылки каталога Титан-GS (все 5 диапазонов):
              </span>
              <span className="text-blue-400 font-mono text-[11px]">
                {totalProductsCount} товаров в базе
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CATALOG_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id)}
                    className={`text-left p-3 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/50 shadow-md shadow-blue-900/40'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-semibold text-xs text-slate-200 line-clamp-1">
                        {preset.label}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-emerald-400 font-semibold">{preset.priceRange}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[10px]">
                        {preset.count} тов.
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Вкладка 2: Мульти-ввод ссылок на магазины */}
      {activeTab === 'multi_store' && (
        <MultiStoreCollector 
          onCollectStores={onCollectStores} 
          isParsing={isParsing} 
        />
      )}

      {/* Вкладка 3: Поиск по названию / бренду / характеристикам */}
      {activeTab === 'search' && (
        <SearchParser 
          onSearch={onSearch} 
          isParsing={isParsing} 
        />
      )}

      {/* Опция авто-скачивания */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/70 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoDownload}
            onChange={(e) => setAutoDownload(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-900"
          />
          <span>Автоматически скачивать Excel (.xlsx) сразу после завершения сбора</span>
        </label>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Разрешение фото: <strong>wc1200 HQ</strong></span>
          <span>•</span>
          <span>Формат: <strong>Все данные + 5 листов</strong></span>
        </div>
      </div>
    </div>
  );
};
