// Allocates a million small objects per round; keeps one in a thousand in a long-lived array.
const kept = [];
let made = 0;
const t0 = Date.now();
while (Date.now() - t0 < 3000) {
  for (let i = 0; i < 1e6; i++) {
    const o = { i, name: 'объект ' + i, at: Date.now() };
    made++;
    if (i % 1000 === 0) kept.push(o);
  }
  if (kept.length > 20000) kept.splice(0, 10000);
}
console.log(`made ${made} objects, kept ${kept.length}`);
