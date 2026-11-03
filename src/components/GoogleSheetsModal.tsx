import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, FileSpreadsheet, Code2, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { OzonProduct } from '../types/ozon';
import { generateGoogleAppsScriptCode, formatProductsForGoogleSheetsClipboard } from '../services/googleSheetsService';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: OzonProduct[];
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  products
}) => {
  const [activeTab, setActiveTab] = useState<'quick_paste' | 'apps_script' | 'instructions'>('quick_paste');
  const [copiedData, setCopiedData] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const gasCode = generateGoogleAppsScriptCode();

  const handleCopyDataForSheets = () => {
    const tsvData = formatProductsForGoogleSheetsClipboard(products);
    navigator.clipboard.writeText(tsvData);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(gasCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Интеграция с Google Таблицами</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Sheets Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Прямая выгрузка всех {products.length} товаров и встроенный Google Apps Script
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Навигация по вкладкам */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('quick_paste')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'quick_paste'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>1. Мгновенная выгрузка в Google Таблицу</span>
          </button>

          <button
            onClick={() => setActiveTab('apps_script')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'apps_script'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>2. Google Apps Script (Макрос в меню)</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'instructions'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>3. Инструкция по структуре</span>
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'quick_paste' && (
            <div className="space-y-6">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-emerald-300 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Самый быстрый и надежный способ переноса данных
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Мы форматируем все <strong>{products.length} товаров</strong> в специальный буфер обмена Google Sheets (TSV). 
                  При обычной вставке (Ctrl+V) все описания, комплектация и ссылки на фотографии автоматически лягут строго по колонкам без съезжания строк.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleCopyDataForSheets}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
                  >
                    {copiedData ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Скопировано в буфер обмена!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Скопировать все {products.length} товаров для Sheets</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://docs.google.com/spreadsheets/d/10QuHsayIfB0RxbwDQ39TGdzrj1mVIMXLtpUhCVxRovI/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 text-sm font-medium transition-all shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Открыть вашу таблицу (10Qu...ovI)</span>
                  </a>

                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Создать новую</span>
                  </a>
                </div>
              </div>

              {/* Пошаговая инструкция из 3 шагов */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-2">
                    1
                  </div>
                  <h5 className="font-semibold text-white text-xs mb-1">Скопируйте данные</h5>
                  <p className="text-[11px] text-slate-400">
                    Нажмите зелёную кнопку выше «Скопировать все товары для Sheets».
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-2">
                    2
                  </div>
                  <h5 className="font-semibold text-white text-xs mb-1">Откройте таблицу</h5>
                  <p className="text-[11px] text-slate-400">
                    Перейдите в любую Google Таблицу и кликните на ячейку <strong>A1</strong>.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-2">
                    3
                  </div>
                  <h5 className="font-semibold text-white text-xs mb-1">Нажмите Вставить</h5>
                  <p className="text-[11px] text-slate-400">
                    Нажмите <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-200">Ctrl+V</kbd> (или <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-200">Cmd+V</kbd> на Mac). Готово!
                  </p>
                </div>
              </div>

              {/* Список колонок */}
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Колонки, которые будут созданы в вашей Google Таблице:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    '№', 'Артикул / SKU', 'Магазин / Бренд', 'Название товара', 'Цена (₽)', 'Старая цена',
                    'Скидка %', 'Ценовой диапазон', 'Размеры', 'Цвет', 'Описание', 'Комплектация',
                    'Характеристики', 'Бренд', 'Материал', 'Макс. нагрузка', 'Рейтинг', 'Отзывы',
                    'Ссылка Ozon', 'Фото 1', 'Фото 2', 'Фото 3', 'Фото 4', 'Фото 5', 'Фото 6', 'Все фото списком'
                  ].map((col, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apps_script' && (
            <div className="space-y-4">
              <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-cyan-300">
                      Автономный Google Apps Script (без внешних сетевых ошибок)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      100% Автономный
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Все 62 товара Титан-GS со всеми 27 столбцами характеристик и ссылками на фото уже встроены прямо в скрипт. Работает мгновенно в один клик без сбоев авторизации!
                  </p>
                </div>

                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/30 active:scale-95 shrink-0"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Код скопирован!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Скопировать автономный скрипт</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-cyan-200 overflow-x-auto max-h-80 leading-relaxed">
                  {gasCode}
                </pre>
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                <p className="font-semibold text-slate-300">Как встроить в вашу таблицу за 30 секунд:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Откройте вашу таблицу ➔ меню <strong>«Расширения»</strong> ➔ <strong>«Apps Script»</strong>.</li>
                  <li>Удалите весь старый код в окне редактора и вставьте этот скопированный скрипт.</li>
                  <li>Нажмите <strong>Сохранить (Ctrl+S)</strong> и перезагрузите страницу таблицы в браузере (F5).</li>
                  <li>Вверху таблицы появится пункт меню <strong>«📦 Ozon Титан-GS»</strong> ➔ нажмите <strong>«⚡ 1. Заполнить все 62 товара»</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h4 className="font-semibold text-white text-sm mb-2">Формат выгрузки по архитектурному стандарту</h4>
                <p className="text-slate-400 mb-3">
                  Вся выгрузка строго соответствует архитектурному документу <em>Ozon Data Platform v1.0</em>:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Лист «Все данные (Всё в одном)»</strong>: содержит полную строку параметров: цена, артикул, комплектация, характеристики и отдельные столбцы <em>«Фото 1»</em>, <em>«Фото 2»</em>, <em>«Фото 3»</em>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Лист «Ссылки на магазины»</strong>: реестр ссылок на продавцов и бренды для автоматического обновления.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Безопасность</strong>: сбор публичных данных с витрин не требует передачи ваших API-ключей.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Подвал */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Готово к переносу: <strong className="text-emerald-400">{products.length} товаров</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
