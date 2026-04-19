const API_BASE = window.location.origin + window.location.pathname.replace(/\/$/,'');
const DATA_PATH = `${API_BASE}/data`;

const VALID_CATEGORIES = {
    sfw: ['waifu','kiss','neko'],
    nsfw: ['waifu','kiss','neko','futa']
};

let cache = {};

async function getImage(type,category,all=false){
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
        if(all){
            return{success:true,type,category,count:data.images.length,images:data.images};
        }
        const random=data.images[Math.floor(Math.random()*data.images.length)];
        return{success:true,url:random,type,category};
    }catch(error){
        return{success:false,error:error.message};
    }
}

async function handleApiRequest(){
    const params=new URLSearchParams(window.location.search);
    const type=params.get('type');
    const category=params.get('category');
    const all=params.get('all')==='true';
    if(!type||!category){
        return{
            success:false,
            message:'Waifu API - GitHub Pages',
            usage:'/api?type={sfw|nsfw}&category={nombre}[&all=true]',
            categories:VALID_CATEGORIES
        };
    }
    return await getImage(type,category,all);
}

if(window.location.pathname.includes('/api')){
    handleApiRequest().then(result=>{
        document.body.innerHTML=`<pre style="background:#1e1e1e;color:#d4d4d4;padding:20px;font-family:monospace;font-size:14px;white-space:pre-wrap;word-break:break-all">${JSON.stringify(result,null,2)}</pre>`;
    });
}

async function testApi(type,category){
    const resultDiv=document.getElementById('result');
    const jsonDiv=document.getElementById('json-result');
    const img=document.getElementById('preview-img');
    resultDiv.style.display='block';
    jsonDiv.textContent='Cargando...';
    img.style.display='none';
    const result=await getImage(type,category);
    jsonDiv.textContent=JSON.stringify(result,null,2);
    if(result.success&&result.url){
        img.src=result.url;
        img.style.display='block';
    }
}

window.waifuApi={getImage,handleApiRequest,VALID_CATEGORIES};
window.testApi=testApi;
