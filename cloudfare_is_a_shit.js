// ==========================================
// LUANING - CLOUDFLARE_IS_A_SHIT.JS (v2)
// Ataque de Distração e Fuga
// ==========================================

window.CloudflareBuster = {
    proxies: [
        (url) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
        (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    ],

    // NOVA FUNÇÃO: Joga as iscas pro Cloudflare se distrair
    ataqueDeDistracao: function(urlBase) {
        console.log("🥷 Iniciando Ataque de Distração no Cloudflare...");
        
        try {
            // Tenta pegar o domínio base (ex: https://zombo.com)
            const urlObj = new URL(urlBase);
            const dominio = urlObj.origin;

            // Lista de "iscas" que deixam o Cloudflare doido
            const iscas = [
                "/admin", 
                "/wp-login.php", 
                "/.env", 
                "/api/hack", 
                "/config"
            ];

            // Dispara as requisições falsas todas de uma vez (Fire and Forget)
            iscas.forEach(caminho => {
                fetch(dominio + caminho, { 
                    method: 'GET',
                    mode: 'no-cors', // Não liga pra resposta, só quer que chegue lá
                    cache: 'no-store'
                }).catch(() => {});
            });

            console.log("💥 Iscas enviadas! O Cloudflare tá ocupado.");
        } catch(e) {
            console.log("⚠️ Não foi possível montar o ataque de distração.");
        }
    },

    baixarCssComFuria: async function(urlAlvo) {
        // Antes de baixar, joga a distração!
        this.ataqueDeDistracao(urlAlvo);
        
        // Espera 500ms pro Cloudflare se distrair com as iscas
        await new Promise(r => setTimeout(r, 500));

        console.log(`😡 Tentando baixar agora: ${urlAlvo}`);
        
        for (let i = 0; i < this.proxies.length; i++) {
            const urlProxy = this.proxies[i](urlAlvo);
            
            try {
                const res = await fetch(urlProxy, {
                    headers: {
                        "Accept": "text/css,*/*;q=0.1",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Referer": "https://www.google.com/"
                    }
                });

                if (res.ok) {
                    const texto = await res.text();
                    if (texto.includes("{") && texto.includes("}") && !texto.includes("Cloudflare")) {
                        console.log(`✅ Sucesso no Proxy ${i + 1}! O Cloudflare caiu no truque.`);
                        return texto;
                    }
                }
            } catch (e) {
                console.warn(`Proxy ${i + 1} falhou.`);
            }
        }
        
        console.log("❌ O Cloudflare não caiu no truque dessa vez.");
        return null;
    }
};

console.log("✅ CloudflareBuster v2 (Ataque de Distração) ativado!");