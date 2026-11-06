// ==========================================
// LUANING - CSS_INSPECTOR.JS (v15 - Resgate)
// ==========================================

window.CssInspector = {
    cache: {},

    fetchComTimeout: async function(url, timeoutMs = 4000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return res;
        } catch (e) { clearTimeout(timeoutId); throw e; }
    },

    reescreverUrlsCss: function(cssTexto, urlBase) {
        return cssTexto.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, p1) => {
            if (p1.startsWith('data:') || p1.startsWith('http')) return match;
            try {
                const urlAbsoluta = new URL(p1, urlBase).href;
                return `url('${urlAbsoluta}')`;
            } catch (e) { return match; }
        });
    },

    processar: async function(html, urlBase) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        let cssInterno = "";

        let base = doc.querySelector("base");
        if (!base) { base = doc.createElement("base"); doc.head.appendChild(base); }
        base.href = urlBase;

        const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
        
        for (const link of links) {
            let href = link.getAttribute("href");
            if (!href) continue;
            
            if (!href.startsWith("http")) {
                try { 
                    href = new URL(href, urlBase).href; 
                    link.setAttribute("href", href);
                } catch(e) {}
            }

            // Tenta baixar em background pro cache
            if (!this.cache[href]) {
                try {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(href)}`;
                    const res = await this.fetchComTimeout(proxyUrl);
                    if (res.ok) {
                        let textoCss = await res.text();
                        textoCss = this.reescreverUrlsCss(textoCss, urlBase);
                        this.cache[href] = textoCss;
                    }
                } catch (e) {}
            }
            if (this.cache[href]) cssInterno += `\n/* --- CACHE (${href}) --- */\n` + this.cache[href] + "\n";
        }

        const styleTags = Array.from(doc.querySelectorAll('style'));
        styleTags.forEach(tag => { cssInterno += tag.textContent + "\n"; });

        const styleAjuste = doc.createElement("style");
        styleAjuste.textContent = `img { max-width: 100%; height: auto; }`;
        doc.head.appendChild(styleAjuste);

        // Injeta os espiões
        let htmlFinalComEspiao = doc.documentElement.outerHTML;
        
        if (window.DomInspector) {
            htmlFinalComEspiao = window.DomInspector.injetar(htmlFinalComEspiao);
        }
        
        if (window.FingerprintSpoofer) {
            htmlFinalComEspiao = window.FingerprintSpoofer.injetar(htmlFinalComEspiao);
        }

        if (window.LoginBypass) {
            htmlFinalComEspiao = window.LoginBypass.processar(htmlFinalComEspiao);
        }

        const relatorio = `[ CssInspector v15 - Resgate ]\n` + 
                          `URL: ${urlBase}\n` +
                          `Links: ${links.length}\n`;

        return {
            htmlFinal: htmlFinalComEspiao,
            cssExtraido: relatorio + "\n/* --- CSS --- */\n" + (cssInterno || "/* Vazio */")
        };
    }
};