const API_BASE = window.location.origin + window.location.pathname.replace(/\/$/,'');
const DATA_PATH = `${API_BASE}/data`;

const VALID_CATEGORIES = {
    sfw: ['waifu','kiss','neko'],
    nsfw: ['waifu','kiss','neko','futa']
};

let cache = {};

// Obtener imagen aleatoria
async function getImage(type,category){
    if(!VALID_CATEGORIES[type]){
        return{success:false,error:'Tipo inválido. Usa: sfw, nsfw'};
    }
    if(!VALID_CATEGORIES[type].includes(category)){
        return{success:false,error:`Categoría inválida. Disponibles: ${VALID_CATEGORIES[type].join(', ')}`};
    }
    try{
        const cacheKey=`${type}-${category}`;
        if(!cache[cacheKey]){
            const response=await fetch(`${DATA_PATH}/${type}-${category}.json`);
            if(!response.ok) throw new Error('No se encontraron datos');
            cache[cacheKey]=await response.json();
        }
        const data=cache[cacheKey];
        if(data.images.length===0){
            return{success:false,error:'No hay imágenes en esta categoría'};
        }
        const random=data.images[Math.floor(Math.random()*data.images.length)];
        return{
            success:true,
            url:random,
            type,
            category
        };
    }catch(error){
        return{success:false,error:error.message};
    }
}

// Manejar ruta actual
async function handleRoute(){
    const hash=location.hash.replace('#','')||'/';
    const parts=hash.split('/').filter(p=>p);
    
    // Si no hay ruta o es API
    if(parts.length>=2){
        const type=parts[0];
        const category=parts[1];
        
        const result=await getImage(type,category);
        
        // Si es llamada directa a API (no desde la página), mostrar solo JSON
        if(document.getElementById('result')&&document.getElementById('json-result')){
            // Estamos en la página principal
            const resultDiv=document.getElementById('result');
            const jsonDiv=document.getElementById('json-result');
            const img=document.getElementById('preview-img');
            
            resultDiv.style.display='block';
            jsonDiv.textContent=JSON.stringify(result,null,2);
            
            if(result.success&&result.url){
                img.src=result.url;
                img.style.display='block';
                img.scrollIntoView({behavior:'smooth'});
            }else{
                img.style.display='none';
            }
        }else{
            // Modo API puro - solo JSON
            document.body.innerHTML=`<pre style="background:#1e1e1e;color:#d4d4d4;padding:20px;font-family:monospace;font-size:14px;margin:0;min-height:100vh">${JSON.stringify(result,null,2)}</pre>`;
        }
        return;
    }
    
    // Ruta inválida
    if(parts.length>0){
        const result={success:false,error:'Formato inválido. Usa: /#/tipo/categoria'};
        if(document.getElementById('json-result')){
            document.getElementById('result').style.display='block';
            document.getElementById('json-result').textContent=JSON.stringify(result,null,2);
        }else{
            document.body.innerHTML=`<pre style="background:#1e1e1e;color:#ff6b6b;padding:20px;font-family:monospace;font-size:14px;margin:0;min-height:100vh">${JSON.stringify(result,null,2)}</pre>`;
        }
    }
}

// Escuchar cambios de hash
window.addEventListener('hashchange',handleRoute);

// Al cargar la página
if(location.hash){
    handleRoute();
}

// Exponer globalmente
window.waifuApi={getImage,VALID_CATEGORIES};
window.handleRoute=handleRoute;
