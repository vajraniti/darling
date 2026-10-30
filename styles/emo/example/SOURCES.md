# Источники примера

## Изображения (открытый доступ, CC0)

| Файл | Работа | Автор | Год | Источник | Обработка |
|---|---|---|---|---|---|
| `img/hawarden-window-1860s.jpg` | Photographic Study. Альбуминовый отпечаток | Clementina Hawarden | начало 1860-х | The Met, https://www.metmuseum.org/art/collection/search/286598 | кроп внутри скруглённых углов `2130x3000+310+320`, `-colorspace Gray -level 3%,97%`, 1600 px |
| `img/medallion-1850.jpg` | Medallion Portrait of a Woman. Дагеротип, целая пластина | Albert Sands Southworth, Josiah Johnson Hawes | около 1850 | Cleveland Museum of Art, https://clevelandart.org/art/2002.30 | кроп пластины `1467x1885+742+742` из версии 2942×3400, `-colorspace Gray -level 6%,96%`, 1100 px |
| `img/stereo-ghost-1856.jpg` | The Ghost in the Stereoscope. Альбуминовые отпечатки, подкраска | London Stereoscopic Company | около 1856 | The Met, https://www.metmuseum.org/art/collection/search/302466 | `-colorspace Gray -level 4%,96%`, 1600 px |
| `img/vallotton-cancellation-1898.jpg` | Cancellation sheet, fragments of ten woodblocks from Intimacies. Ксилография | Félix Vallotton | 1898 | Art Institute of Chicago, https://www.artic.edu/artworks/62168 | кроп по оттиску `1200x993+241+127`, `-colorspace Gray -level 4%,96%`, 1100 px |
| `img/van-de-velde-sign-1605.jpg` | Spieghel der Schryfkonste, лист с росчерками. Офорт | Jan van de Velde I | 1605 | The Met, https://www.metmuseum.org/art/collection/search/358328 (восьмое изображение записи) | `-colorspace Gray -negate -level 18%,80%`, кроп `3640x2000+80+220`, 1100 px |

Все пять — те же работы, что в `../material/`; здесь — обработанные под страницу копии.

## Факты

- Peter Marshall, «Trash talk: the Orinoco garbage collector», 3 января 2019: https://v8.dev/blog/trash-talk
- Ulan Degenbaev, Michael Lippautz, Hannes Payer, «Concurrent marking in V8», 11 июня 2018: https://v8.dev/blog/concurrent-marking
- Ulan Degenbaev, Michael Lippautz, Hannes Payer, «Orinoco: young generation garbage collection», 29 ноября 2017: https://v8.dev/blog/orinoco-parallel-scavenger
- Sathya Gunasekaran, Mathias Bynens, Shu-yu Guo, Leszek Swirski, «Weak references and finalizers», 9 июля 2019: https://v8.dev/features/weak-references
- MDN, «Memory management» (mark-and-sweep и циклы): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management
- V8, `src/heap/gc-tracer.cc` (что печатает `--trace-gc`): https://github.com/v8/v8/blob/main/src/heap/gc-tracer.cc

## Лог

- `young.js` — скрипт: создаёт объекты три секунды и оставляет себе каждый тысячный.
- `trace-gc.txt` — полный вывод `node --trace-gc young.js`, Node.js v22.22.0, V8 12.4.254.21-node.33, 30 октября 2026.
