import React, { useState } from 'react';
import { Bookmark, Copy, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';

export const BookmarkletHelper: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const bookmarkletCode = `javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';s.onload=()=>{const items=Array.from(document.querySelectorAll('a[href*="/product/"]')).map(a=>a.href.split('?')[0]).filter((v,i,a)=>a.indexOf(v)===i);alert('Найдено товаров на Ozon: '+items.length+'. Нажмите OK для начала выгрузки в Excel.');};document.head.appendChild(s);})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Закладка-сборщик для браузера в 1 клик (Букмарклет)
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
          Работает прямо на ozon.ru
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        Если вы находитесь прямо на сайте Ozon в своем браузере, вы можете нажать эту кнопку в панели закладок — и скрипт выгрузит текущий каталог сразу в Excel без каких-либо блокировок.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 truncate">
          {bookmarkletCode}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Скопировано в буфер</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Скопировать код</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
