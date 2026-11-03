import * as XLSX from 'xlsx';
import { OzonProduct } from '../types/ozon';

export function exportProductsToExcel(
  products: OzonProduct[],
  filename = 'ozon_data_platform_catalog.xlsx',
  multiSheet = true
) {
  if (!products || products.length === 0) {
    throw new Error('Нет данных для выгрузки в Excel');
  }

  const workbook = XLSX.utils.book_new();
  const maxPhotos = Math.max(...products.map(p => p.photos.length), 1);

  // -------------------------------------------------------------
  // ЛИСТ 1: ВСЕ ДАННЫЕ (Всё в одном — полная сводная таблица)
  // Название, Описание, Характеристики, Комплектация, Цены, Ссылки на фото (каждая отдельно)
  // -------------------------------------------------------------
  const allInOneRows = products.map((item, index) => {
    const charsSummary = Object.entries(item.characteristics || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const packageSummary = (item.packageContents || []).join('; ');

    const rowObj: Record<string, string | number> = {
      '№': index + 1,
      'Артикул / SKU': item.sku || item.id,
      'Название': item.title,
      'Цена (₽)': item.price,
      'Старая цена (₽)': item.oldPrice || '',
      'Скидка (%)': item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0,
      'Ценовой диапазон': item.tier || '',
      'Цвет': item.color || '',
      'Размеры (ШхГхВ)': item.dimensions || '',
      'Описание': item.description || '',
      'Комплектация (полный состав)': packageSummary,
      'Характеристики (все)': charsSummary,
      'Бренд': item.characteristics['Бренд'] || 'Титан-GS',
      'Материал': item.characteristics['Материал'] || 'Конструкционная сталь',
      'Максимальная нагрузка': item.characteristics['Максимальная нагрузка'] || item.characteristics['Нагрузка'] || '',
      'Страна производства': item.characteristics['Страна производства'] || 'Россия',
      'Рейтинг': item.rating || '',
      'Отзывов': item.reviewsCount || '',
      'Количество фото': item.photos.length,
      'Ссылка на Ozon': item.url
    };

    // Каждая ссылка на фото в отдельную колонку (Фото 1, Фото 2, ...)
    for (let i = 0; i < maxPhotos; i++) {
      rowObj[`Фото ${i + 1}`] = item.photos[i] || '';
    }

    // Дополнительно: все фото в одну ячейку через перенос строки
    rowObj['Все фото (списком)'] = item.photos.join('\n');

    return rowObj;
  });

  const wsAllInOne = XLSX.utils.json_to_sheet(allInOneRows);
  const allInOneCols = [
    { wch: 5 },   // №
    { wch: 18 },  // SKU
    { wch: 45 },  // Название
    { wch: 12 },  // Цена
    { wch: 14 },  // Старая цена
    { wch: 12 },  // Скидка
    { wch: 22 },  // Диапазон
    { wch: 18 },  // Цвет
    { wch: 22 },  // Размеры
    { wch: 60 },  // Описание
    { wch: 60 },  // Комплектация
    { wch: 50 },  // Характеристики
    { wch: 16 },  // Бренд
    { wch: 25 },  // Материал
    { wch: 22 },  // Нагрузка
    { wch: 20 },  // Страна
    { wch: 10 },  // Рейтинг
    { wch: 10 },  // Отзывов
    { wch: 15 },  // Кол-во фото
    { wch: 45 }   // Ссылка Ozon
  ];
  for (let i = 0; i < maxPhotos; i++) {
    allInOneCols.push({ wch: 48 });
  }
  allInOneCols.push({ wch: 60 }); // Все фото списком
  wsAllInOne['!cols'] = allInOneCols;

  // Добавляем главным первым листом:
  XLSX.utils.book_append_sheet(workbook, wsAllInOne, 'Все данные (Всё в одном)');

  // -------------------------------------------------------------
  // ЛИСТ 2: ТОВАРЫ (Краткая витрина с ценами и фото)
  // -------------------------------------------------------------
  const mainProductsRows = products.map((item, index) => {
    const rowObj: Record<string, string | number> = {
      '№': index + 1,
      'Артикул / SKU': item.sku || item.id,
      'Название': item.title,
      'Цена (₽)': item.price,
      'Старая цена (₽)': item.oldPrice || '',
      'Скидка (%)': item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0,
      'Ценовой диапазон': item.tier || '',
      'Цвет': item.color || '',
      'Размеры (ШхГхВ)': item.dimensions || '',
      'Рейтинг': item.rating || '',
      'Отзывов': item.reviewsCount || '',
      'Количество фото': item.photos.length,
      'Элементов в комплекте': item.packageContents.length,
      'Ссылка на Ozon': item.url,
      'Источник данных': item.source === 'seller_api' ? 'Ozon Seller API' : 'Публичный каталог Ozon'
    };

    // Добавляем каждую ссылку на фото в отдельную колонку
    for (let i = 0; i < maxPhotos; i++) {
      rowObj[`Фото ${i + 1}`] = item.photos[i] || '';
    }

    return rowObj;
  });

  const wsProducts = XLSX.utils.json_to_sheet(mainProductsRows);
  const productsCols = [
    { wch: 5 },   // №
    { wch: 18 },  // SKU
    { wch: 45 },  // Название
    { wch: 12 },  // Цена
    { wch: 14 },  // Старая цена
    { wch: 12 },  // Скидка
    { wch: 22 },  // Диапазон
    { wch: 22 },  // Цвет
    { wch: 22 },  // Размеры
    { wch: 10 },  // Рейтинг
    { wch: 10 },  // Отзывов
    { wch: 16 },  // Кол-во фото
    { wch: 20 },  // Элементов в комплекте
    { wch: 45 },  // Ссылка
    { wch: 22 }   // Источник
  ];
  for (let i = 0; i < maxPhotos; i++) {
    productsCols.push({ wch: 48 });
  }
  wsProducts['!cols'] = productsCols;
  XLSX.utils.book_append_sheet(workbook, wsProducts, 'Товары (Витрина)');

  if (multiSheet) {
    // -------------------------------------------------------------
    // ЛИСТ 2: ОПИСАНИЯ (ТЗ Раздел 8: Полные описания)
    // -------------------------------------------------------------
    const descriptionsRows = products.map((item, index) => ({
      '№': index + 1,
      'Артикул / SKU': item.sku,
      'Название': item.title,
      'Полное описание товара': item.description,
      'Ссылка на товар': item.url
    }));
    const wsDescriptions = XLSX.utils.json_to_sheet(descriptionsRows);
    wsDescriptions['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 40 },
      { wch: 90 },
      { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(workbook, wsDescriptions, 'Описания');

    // -------------------------------------------------------------
    // ЛИСТ 3: ХАРАКТЕРИСТИКИ (ТЗ Раздел 8: Все характеристики)
    // -------------------------------------------------------------
    const characteristicsRows = products.map((item, index) => {
      const charsText = Object.entries(item.characteristics || {})
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');

      return {
        '№': index + 1,
        'Артикул / SKU': item.sku,
        'Название': item.title,
        'Цвет': item.color || '',
        'Размеры': item.dimensions || '',
        'Бренд': item.characteristics['Бренд'] || 'Титан-GS',
        'Страна-изготовитель': item.characteristics['Страна производства'] || 'Россия',
        'Материал': item.characteristics['Материал'] || 'Конструкционная сталь',
        'Максимальная нагрузка': item.characteristics['Максимальная нагрузка'] || item.characteristics['Нагрузка'] || '',
        'Все характеристики (список)': charsText
      };
    });
    const wsCharacteristics = XLSX.utils.json_to_sheet(characteristicsRows);
    wsCharacteristics['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 38 },
      { wch: 22 },
      { wch: 22 },
      { wch: 16 },
      { wch: 20 },
      { wch: 32 },
      { wch: 22 },
      { wch: 55 }
    ];
    XLSX.utils.book_append_sheet(workbook, wsCharacteristics, 'Характеристики');

    // -------------------------------------------------------------
    // ЛИСТ 4: КОМПЛЕКТАЦИЯ (ТЗ Раздел 8: Детализированный состав)
    // -------------------------------------------------------------
    const packageRows = products.map((item, index) => ({
      '№': index + 1,
      'Артикул / SKU': item.sku,
      'Название': item.title,
      'Количество компонентов': item.packageContents.length,
      'Полный состав комплектации': item.packageContents.join('\n')
    }));
    const wsPackage = XLSX.utils.json_to_sheet(packageRows);
    wsPackage['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 40 },
      { wch: 22 },
      { wch: 80 }
    ];
    XLSX.utils.book_append_sheet(workbook, wsPackage, 'Комплектация');

    // -------------------------------------------------------------
    // ЛИСТ 5: ФОТОГРАФИИ (ТЗ Раздел 8.1: Реестр фото 1 строка = 1 фото)
    // -------------------------------------------------------------
    const photoRegistryRows: any[] = [];
    let photoCounter = 1;

    products.forEach((product) => {
      product.photos.forEach((photoUrl, photoIdx) => {
        photoRegistryRows.push({
          '№ п/п': photoCounter++,
          'Артикул / SKU': product.sku,
          'Название товара': product.title,
          'Позиция фото': photoIdx === 0 ? 'Главное (Cover)' : `Фото ${photoIdx + 1}`,
          'Индекс фото': photoIdx + 1,
          'Прямая ссылка на фото (CDN)': photoUrl,
          'Разрешение / Сервер': photoUrl.includes('wc1200') ? 'Оригинал 1200px (wc1200)' : 'Ozon Multimedia'
        });
      });
    });

    const wsPhotos = XLSX.utils.json_to_sheet(photoRegistryRows);
    wsPhotos['!cols'] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 38 },
      { wch: 18 },
      { wch: 12 },
      { wch: 55 },
      { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(workbook, wsPhotos, 'Фотографии (Реестр)');
  }

  // Генерация и скачивание книги Excel
  XLSX.writeFile(workbook, filename);
}

export function exportProductsToCsv(products: OzonProduct[], filename = 'ozon_products.csv') {
  if (!products || products.length === 0) return;

  const maxPhotos = Math.max(...products.map(p => p.photos.length), 1);
  const headers = [
    '№',
    'Артикул',
    'Название',
    'Цена',
    'Старая цена',
    'Ценовой диапазон',
    'Цвет',
    'Размеры',
    'Ссылка на товар',
    'Комплектация',
    'Характеристики',
    'Описание'
  ];

  for (let i = 0; i < maxPhotos; i++) {
    headers.push(`Фото ${i + 1}`);
  }

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCsv).join(';'));

  products.forEach((item, index) => {
    const chars = Object.entries(item.characteristics || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const pack = (item.packageContents || []).join('\n');

    const row = [
      index + 1,
      item.sku || item.id,
      item.title,
      item.price,
      item.oldPrice || '',
      item.tier || '',
      item.color || '',
      item.dimensions || '',
      item.url,
      pack,
      chars,
      item.description
    ];

    for (let i = 0; i < maxPhotos; i++) {
      row.push(item.photos[i] || '');
    }

    csvRows.push(row.map(escapeCsv).join(';'));
  });

  const bom = '\uFEFF';
  const csvContent = bom + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
