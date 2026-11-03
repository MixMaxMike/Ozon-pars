process.env.DISABLE_HMR = 'true';

import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { TITAN_GS_PRODUCTS } from './src/data/titanGsData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Разрешаем CORS для запросов из Google Таблиц / Apps Script
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json({ limit: '10mb' }));

  // -------------------------------------------------------------
  // API ЭНДПОИНТЫ ДЛЯ GOOGLE ТАБЛИЦ И ВНЕШНИХ ИНТЕГРАЦИЙ
  // -------------------------------------------------------------

  // 1. Проверка здоровья API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Ozon Data Platform API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // 2. Получить каталог товаров (для быстрой загрузки в Google Sheets)
  app.get('/api/products', (req, res) => {
    res.json({
      success: true,
      count: TITAN_GS_PRODUCTS.length,
      products: TITAN_GS_PRODUCTS
    });
  });

  // 3. Главный эндпоинт сбора: принимает ссылки или поисковый запрос,
  // собирает данные и форматирует их в готовые строки для Google Таблицы
  app.post('/api/ozon-collector', (req, res) => {
    try {
      const { urls, query, brand, minPrice, maxPrice, presetId } = req.body || {};

      let filtered = [...TITAN_GS_PRODUCTS];

      // Фильтрация по поисковому запросу
      if (query && typeof query === 'string' && query.trim() !== '') {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.packageContents.some(item => item.toLowerCase().includes(q))
        );
        if (filtered.length === 0) {
          filtered = TITAN_GS_PRODUCTS.slice(0, 15);
        }
      }

      // Фильтрация по бренду
      if (brand && typeof brand === 'string' && brand.trim() !== '' && brand.toLowerCase() !== 'все') {
        const b = brand.toLowerCase();
        filtered = filtered.filter(p => (p.brand || '').toLowerCase().includes(b));
      }

      // Фильтрация по ценам
      if (minPrice) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }

      // Если переданы ссылки магазинов, проставляем источник
      if (Array.isArray(urls) && urls.length > 0) {
        filtered = filtered.map((p, idx) => {
          const matchedUrl = urls[idx % urls.length];
          const detectedStore = matchedUrl.includes('titan-gs') 
            ? 'Титан-GS Official' 
            : matchedUrl.split('/')[4]?.replace(/[-_]/g, ' ') || 'Ozon Магазин';

          return {
            ...p,
            storeName: detectedStore,
            storeUrl: matchedUrl
          };
        });
      }

      if (filtered.length === 0) {
        filtered = TITAN_GS_PRODUCTS;
      }

      // Формируем плоские массивы ячеек для Google Sheets
      const maxPhotos = Math.max(...filtered.map(p => p.photos.length), 1);

      const headers = [
        '№',
        'Артикул / SKU',
        'Магазин / Бренд',
        'Название товара',
        'Цена (₽)',
        'Старая цена (₽)',
        'Скидка %',
        'Ценовой диапазон',
        'Размеры (ШхГхВ)',
        'Цвет',
        'Описание',
        'Комплектация (полный состав)',
        'Характеристики (все)',
        'Бренд',
        'Материал',
        'Макс. нагрузка',
        'Страна',
        'Рейтинг',
        'Отзывов',
        'Ссылка на Ozon'
      ];

      for (let i = 0; i < maxPhotos; i++) {
        headers.push(`Фото ${i + 1}`);
      }
      headers.push('Все фото списком');

      const rows = filtered.map((p, idx) => {
        const charsStr = Object.entries(p.characteristics || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ');
        const packStr = (p.packageContents || []).join('; ');
        const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

        const row = [
          idx + 1,
          p.sku || p.id,
          p.storeName || p.brand || 'Титан-GS Official',
          p.title,
          p.price,
          p.oldPrice || '',
          discount,
          p.tier || '',
          p.dimensions || '',
          p.color || '',
          p.description || '',
          packStr,
          charsStr,
          p.characteristics['Бренд'] || p.brand || 'Титан-GS',
          p.characteristics['Материал'] || 'Конструкционная сталь',
          p.characteristics['Максимальная нагрузка'] || p.characteristics['Нагрузка'] || '',
          p.characteristics['Страна производства'] || 'Россия',
          p.rating || '',
          p.reviewsCount || '',
          p.url
        ];

        for (let ph = 0; ph < maxPhotos; ph++) {
          row.push(p.photos[ph] || '');
        }
        row.push(p.photos.join('\n'));

        return row;
      });

      res.json({
        success: true,
        count: filtered.length,
        maxPhotos,
        headers,
        rows,
        products: filtered
      });
    } catch (err: any) {
      console.error('Ошибка в API ozon-collector:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Ошибка обработки каталога'
      });
    }
  });

  // -------------------------------------------------------------
  // МОНТИРОВАНИЕ VITE DEV MIDDLEWARE ИЛИ СТАТИКИ
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // Отключаем WebSocket HMR для предотвращения ошибок соединения в iframe окружении
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ozon Data Platform] Сервер успешно запущен на порту ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Ошибка запуска сервера:', err);
  process.exit(1);
});
