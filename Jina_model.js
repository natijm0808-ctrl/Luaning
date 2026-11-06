// ==========================================
// LUANING - JINA_MODEL.JS
// Contorna login e bloqueios via Jina Reader (IA)
// ==========================================

window.JinaModel = {
    // Baixa o conteúdo de um site usando o Jina Reader
    baixarConteudoViaJina: async function(urlAlvo) {
        console.log(`🕵️ Jina ativado para: ${urlAlvo}`);
        const urlJina = `https://r.jina.ai/${urlAlvo}`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout para IA
            
            // Faz a requisição usando cabeçalhos de navegador para não ser bloqueado
            const res = await fetch(urlJina, {
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error("Jina falhou");

            let textoJina = await res.text();
            
            // O Jina às vezes devolve Markdown, mas a gente quer HTML
            // Se o site retornar texto puro, a gente embrulha num HTML básico
            if (!textoJina.trim().startsWith("<!DOCTYPE") && !textoJina.trim().startsWith("<html")) {
                textoJina = `<html><head><meta charset="utf-8"></head><body><div style="white-space: pre-wrap; font-family: sans-serif; padding: 20px;">${textoJina}</div></body></html>`;
            }

            return textoJina;

        } catch (e) {
            console.error("❌ O Jina Reader não conseguiu ler o site:", e);
            return null;
        }
    }
};

console.log("✅ JinaModel.js carregado. Pronto para invadir o Reddit!");