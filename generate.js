const fs = require('fs');
const path = require('path');

// ✅ TU URL REAL (V3)
const BASE_URL = 'https://rezemd56-hash.github.io/Api-curv-V3';

const categories = {
    sfw: ['waifu', 'kiss', 'neko'],
    nsfw: ['waifu', 'kiss', 'neko', 'futa']
};

if (!fs.existsSync('data')) fs.mkdirSync('data');

Object.entries(categories).forEach(([type, cats]) => {
    cats.forEach(cat => {
        const folderPath = path.join('images', type, cat);
        let files = [];
        
        if (fs.existsSync(folderPath)) {
            files = fs.readdirSync(folderPath)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
                .sort((a, b) => {
                    const numA = parseInt(a.match(/^\d+/) || 0);
                    const numB = parseInt(b.match(/^\d+/) || 0);
                    return numA - numB;
                });
        }
        
        const data = {
            type,
            category: cat,
            count: files.length,
            images: files.map(f => `${BASE_URL}/images/${type}/${cat}/${f}`)
        };
        
        fs.writeFileSync(`data/${type}-${cat}.json`, JSON.stringify(data, null, 2));
        console.log(`${type}-${cat}: ${files.length} imágenes`);
    });
});

console.log('\n✅ JSONs generados. Sube a GitHub.');
