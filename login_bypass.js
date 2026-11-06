// ==========================================
// LUANING - LOGIN_BYPASS.JS (v1 - O Dedo do Meio)
// Esconde telas de login e força a leitura
// ==========================================

window.LoginBypass = {
    processar: function(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Palavras que indicam que o site quer te bloquear
        const palavrasBloqueio = [
            "sign in", "log in", "login", "entrar", "faça login", "criar conta",
            "create account", "sign up", "cadastre-se", "assine", "subscribe",
            "continue reading", "continue lendo", "welcome back"
        ];

        let bloqueiosRemovidos = 0;

        // 1. Remove Overlays e Modais de Login
        const divs = doc.querySelectorAll("div, section, aside");
        divs.forEach(el => {
            const texto = el.innerText ? el.innerText.toLowerCase() : "";
            const idClass = (el.id + " " + el.className).toLowerCase();
            
            // Se o elemento tem cara de modal de login ou paywall, a gente esconde
            if (
                idClass.includes("login") || 
                idClass.includes("modal") || 
                idClass.includes("paywall") || 
                idClass.includes("signup") ||
                (texto.length < 300 && palavrasBloqueio.some(p => texto.includes(p)))
            ) {
                el.style.display = "none";
                bloqueiosRemovidos++;
            }
        });

        // 2. Tenta remover o "Blur" (efeito embaçado) dos textos bloqueados
        const blurElements = doc.querySelectorAll('[style*="blur"], [class*="blur"]');
        blurElements.forEach(el => {
            el.style.filter = "none";
            el.style.opacity = "1";
            el.style.userSelect = "auto";
            bloqueiosRemovidos++;
        });

        // 3. Tenta remover a trava do Scroll (quando o site trava a tela pra você não descer)
        doc.body.style.overflow = "auto";
        doc.documentElement.style.overflow = "auto";

        console.log(`🖕 LoginBypass: ${bloqueiosRemovidos} bloqueios ignorados. Passando direto!`);

        return doc.documentElement.outerHTML;
    }
};

console.log("✅ LoginBypass.js carregado. O dedo do meio tá afiado.");