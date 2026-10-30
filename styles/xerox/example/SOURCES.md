# Источники примера

## Изображения

Все три прогнаны через копию с копии с копии (команда — в `../README.md`, раздел «Картинки»). Параметры: кадр в пикселях исходника, длинная сторона, ручка, seed.

| Файл | Работа | Автор | Год | Лицензия | Источник | Обработка |
|---|---|---|---|---|---|---|
| `img/handshake-1922-copy3.jpg` | [Tut Jackson (left) and Jack Johnson shaking hands] | фото W. E. Palmer (надпись на негативе; LOC: copyright by Underwood & Underwood и W. E. Palmer) | 1922 | No known restrictions on publication | https://www.loc.gov/item/92510475/ (TIFF 3268×4096) | `2000x2250+600+980`, 1600, ручка 0.85, seed 7 — лица вне кадра |
| `img/vallotton-poker-1896-copy3.jpg` | Poker («Le Poker»), деталь | Félix Vallotton | 1896 | CC0 | https://clevelandart.org/art/1959.303 (3400 px) | `1430x1040+490+1060`, 1500, ручка 1.0, seed 11 — руки и стол без лиц |
| `img/vallotton-manifestation-1893-copy3.jpg` | The Protest («La Manifestation») | Félix Vallotton | 1893 | CC0 | https://clevelandart.org/art/1999.323 (3400 px) | `3287x2104+58+92` (доска без полей), 1600, ручка 1.0, seed 13 |

Исходники в уменьшенном виде лежат в `../material/`.

## Зин

Рисунок «This is a chord. This is another. This is a third. Now form a band» — Тони Мун, Sideburns № 1, январь 1977. Только вторичные источники:

- Wikipedia, «Sniffin' Glue»: рисунок впервые вышел в январе 1977 в Sideburns, позже перепечатан в Strangled; со ссылкой на Mark Perry, The Independent, 31 мая 2000 — https://en.wikipedia.org/wiki/Sniffin%27_Glue
- Punk 77, «Sideburns Punk Fanzine»: Sideburns начат Тони Муном в январе 1977, рисунок сделан в первом номере, чтобы заполнить страницу; цитата Перри из The Independent — https://punk77.co.uk/?p=24598
- afka.net (описание Paddle8): первый номер, январь 1977, слова рисунка — https://afka.net/Mags/Sideburns.htm
- Интервью Тони Муна, сайт The Stranglers, 2013: Sideburns делал Мун, Stranglers на обложке первого номера — https://thestranglers.co.uk/the-birth-of-strangled-tony-moon-interview/
- Слова сверены по репродукции `../refs/works/moon-now-form-a-band-1977.jpg`. Оригинал журнала и статью The Independent открыть не удалось.

## TCP

- **RFC 9293**, Transmission Control Protocol, STD 7, август 2022, W. Eddy, Ed. — https://www.rfc-editor.org/rfc/rfc9293
  - §3.1, рисунок 1: порядок флагов CWR, ECE, URG, ACK, PSH, RST, SYN, FIN; «If SYN is set, the sequence number is the initial sequence number (ISN) and the first data octet is ISN+1»; ACK — «the next sequence number the sender of the segment is expecting to receive».
  - §3.4: пространство номеров 0…2³² − 1, арифметика по модулю 2³²; SYN занимает номер в последовательности.
  - §3.4.1: ISN = M + F(localip, localport, remoteip, remoteport, secretkey), счётчик «roughly 4 microseconds», круг «approximately every 4.55 hours»; четыре сообщения, второе и третье объединены — «three-way (or three message) handshake».
  - §3.5, рисунок 6: SEQ=100 / ACK=101 / ACK=301; «the ACK does not occupy sequence number space (if it did, we would wind up ACKing ACKs!)».
  - §3.3.2: состояния LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED. Obsoletes RFC 793.
- **RFC 793**, сентябрь 1981 — https://www.rfc-editor.org/rfc/rfc793
- **RFC 6528**, Defending against Sequence Number Attacks, февраль 2012: Morris, «A Weakness in the 4.2BSD UNIX TCP/IP Software», CSTR 117, AT&T Bell Laboratories, 1985; Berkeley-ядра прибавляли постоянную каждую секунду и на каждое соединение; Shimomura, 1995 — https://www.rfc-editor.org/rfc/rfc6528
- **RFC 4987**, TCP SYN Flooding Attacks and Common Mitigations, август 2007: Cheswick и Bellovin, 1994; Phrack, 1996; атаки к сентябрю 1996, CERT CA-96.21; backlog «from a half-dozen to several dozen»; SYN cookies — https://www.rfc-editor.org/rfc/rfc4987
- **D. J. Bernstein, SYN cookies**: Panix, флуд с 6 сентября 1996; идея 16 сентября 1996, детали с Eric Schenk; разность ISN сервера и клиента: 5 бит t mod 32 (t растёт раз в 64 с), 3 бита MSS, 24 бита секретной функции — https://cr.yp.to/syncookies.html. Таблица восьми значений MSS в примере своя: её выбирает сервер.
- **RFC 9768**, AccECN, апрель 2026: бит AE; реестр IANA «TCP Header Flags», запись от 24.04.2026 — https://www.rfc-editor.org/rfc/rfc9768, https://www.iana.org/assignments/tcp-parameters/
- **RFC 5737** — адреса для документации 192.0.2.0/24 и 198.51.100.0/24; **RFC 6335** — динамические порты 49152–65535.
- **tcpdump(1)**: «Tcpflags are some combination of S (SYN), F (FIN), P (PSH), R (RST), U (URG), W (CWR), E (ECE), e (AE) or `.' (ACK)»; `-S` — «Print absolute, rather than relative, TCP sequence numbers» — https://www.tcpdump.org/manpages/tcpdump.1.html
- Снимок tcpdump на странице снят на этой машине 30.10.2026 в 02:34 UTC: Linux, tcpdump 4.99.4, `python3 -m http.server` на 127.0.0.1:8765 и `curl`. Без `-S` третий сегмент показан как `ack 1`. Следующее соединение через 4 секунды началось с номера 812720183.

## Шрифты

Arimo и Courier Prime — Google Fonts. Кириллица проверена 30.10.2026 по `unicode-range`: у Arimo есть, у Courier Prime нет, поэтому Courier Prime набирает только цифры и латиницу.
