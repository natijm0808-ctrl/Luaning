// ==========================================
// LUANING - DOM_INSPECTOR.JS
// Injeta um espião que lê o Storage e desenha no site
// ==========================================

window.DomInspector = {
    injetar: function(html) {
        const scriptEspiao = `
            <script>
                // Espera a página carregar um pouquinho
                setTimeout(() => {
                    try {
                        let dados = "";
                        
                        // 1. Lê o LocalStorage
                        dados += "=== LOCAL STORAGE ===\\n";
                        if (window.localStorage.length === 0) dados += "(Vazio)\\n";
                        for (let i = 0; i < window.localStorage.length; i++) {
                            let key = window.localStorage.key(i);
                            dados += key + ": " + window.localStorage.getItem(key) + "\\n";
                        }
                        
                        // 2. Lê o SessionStorage
                        dados += "\\n=== SESSION STORAGE ===\\n";
                        if (window.sessionStorage.length === 0) dados += "(Vazio)\\n";
                        for (let i = 0; i < window.sessionStorage.length; i++) {
                            let key = window.sessionStorage.key(i);
                            dados += key + ": " + window.sessionStorage.getItem(key) + "\\n";
                        }

                        // 3. Lê os Cookies
                        dados += "\\n=== COOKIES ===\\n" + (document.cookie || "(Vazio)");

                        // Cria uma caixa invisível no site para guardar os dados
                        let caixa = document.createElement("div");
                        caixa.id = "luaning-storage-hack";
                        caixa.style.display = "none"; 
                        caixa.innerText = dados;
                        document.body.appendChild(caixa);

                    } catch(e) {
                        let caixa = document.createElement("div");
                        caixa.id = "luaning-storage-hack";
                        caixa.style.display = "none";
                        caixa.innerText = "Erro ao ler storage: " + e.message;
                        if (document.body) document.body.appendChild(caixa);
                    }
                }, 1000);
            <\/script>
        `;

        if (html.includes("<body>")) {
            return html.replace("<body>", "<body>" + scriptEspiao);
        } else {
            return scriptEspiao + html;
        }
    },

    // Função para o Luaning ler os dados de volta
    lerDados: function() {
        const frame = document.getElementById("frame");
        try {
            const caixa = frame.contentDocument.getElementById("luaning-storage-hack");
            if (caixa) {
                return caixa.innerText;
            }
            return "Aguardando o site carregar os dados... (Se demorar, é porque o site bloqueou a injeção).";
        } catch (e) {
            return "Acesso negado: O navegador bloqueou a leitura do iframe (Cross-Origin).";
        }
    }
};

console.log("✅ DomInspector.js carregado. O espião tá pronto!");