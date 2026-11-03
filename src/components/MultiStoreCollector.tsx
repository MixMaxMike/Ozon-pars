import React, { useState } from 'react';
import { Store, Plus, Trash2, Globe, Play, CheckCircle2, AlertCircle, Sparkles, Layers } from 'lucide-react';

interface MultiStoreCollectorProps {
  onCollectStores: (urls: string[]) => void;
  isParsing: boolean;
}

export const MultiStoreCollector: React.FC<MultiStoreCollectorProps> = ({
  onCollectStores,
  isParsing
}) => {
  const [urlsText, setUrlsText] = useState<string>(
`https://www.ozon.ru/brand/titan-gs-87366809/?currency_price=15000.000%3B20000.000&type=65345
https://www.ozon.ru/brand/titan-gs-87366809/?currency_price=20000.000%3B25000.000&type=65345
https://www.ozon.ru/brand/titan-gs-87366809/?currency_price=25000.000%3B30000.000&type=65345
https://www.ozon.ru/brand/titan-gs-87366809/?currency_price=30000.000%3B35000.000&type=65345
https://www.ozon.ru/brand/titan-gs-87366809/?currency_price=35000.000%3B47000.000&type=65345`
  );

  const parsedUrls = urlsText
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.startsWith('http'));

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedUrls.length === 0) return;
    onCollectStores(parsedUrls);
  };

  const detectType = (url: string) => {
    if (url.includes('/brand/')) return { label: 'Бренд', color: 'text-purple-300 bg-purple-500/20 border-purple-500/30' };
    if (url.includes('/seller/')) return { label: 'Магазин (Seller)', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30' };
    if (url.includes('/category/')) return { label: 'Категория', color: 'text-blue-300 bg-blue-500/20 border-blue-500/30' };
    if (url.includes('/search/')) return { label: 'Поисковая выдача', color: 'text-amber-300 bg-amber-500/20 border-amber-500/30' };
    return { label: 'Каталог Ozon', color: 'text-slate-300 bg-slate-500/20 border-slate-500/30' };
  };

  const handleClear = () => {
    setUrlsText('');
  };

  const handleAddSampleSeller = () => {
    setUrlsText(prev => prev ? prev + '\nhttps://www.ozon.ru/seller/titan-gs-official-87366809/' : 'https://www.ozon.ru/seller/titan-gs-official-87366809/');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Мульти-ввод ссылок на магазины и витрины Ozon</span>
          </h3>
          <p className="text-xs text-slate-400">
            Вставьте одну или несколько ссылок (по одной в каждой строке) на магазины, бренды или каталоги. Ключи API не требуются!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddSampleSeller}
            className="text-[11px] text-blue-300 hover:text-blue-200 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 px-2.5 py-1 rounded-lg transition-colors"
          >
            + Добавить пример магазина
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-slate-400 hover:text-rose-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleStart} className="space-y-3">
        <div className="relative">
          <textarea
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            rows={5}
            placeholder="Вставьте ссылки на магазины Ozon, по одной на строку...&#10;https://www.ozon.ru/brand/titan-gs-87366809/&#10;https://www.ozon.ru/seller/magazin-mebeli-12345/&#10;https://www.ozon.ru/category/garderobnye-sistemy-12345/"
            className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-slate-100 text-xs font-mono leading-relaxed placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
            Распознано ссылок: <strong className="text-emerald-400">{parsedUrls.length}</strong>
          </div>
        </div>

        {/* Список распознанных ссылок с бейджами */}
        {parsedUrls.length > 0 && (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {parsedUrls.map((url, idx) => {
              const meta = detectType(url);
              return (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}.</span>
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-300 font-mono truncate">{url}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border shrink-0 ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Без лимитов на количество товаров и магазинов</span>
          </div>

          <button
            type="submit"
            disabled={isParsing || parsedUrls.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Сбор со всех ссылок...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Собрать со всех {parsedUrls.length} ссылок в единую таблицу</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
