// ==========================================
// LUANING - CATCH_IMAGE.JS (v4 - Imagens Visíveis)
// ==========================================

window.CatchImage = {
    processar: function(html, urlBase) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        let imgsExtraidas = "";

        let base = doc.querySelector("base");
        if (!base) { base = doc.createElement("base"); doc.head.appendChild(base); }
        base.href = urlBase;

        const imgs = doc.querySelectorAll("img");
        imgs.forEach(img => {
            let src = img.getAttribute("src");
            if (!src || src.includes("data:image") || src.includes("base64") || src === "") {
                const lazySrc = img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("data-lazy-src") || img.getAttribute("data-url");
                if (lazySrc) src = lazySrc;
            }

            if (src && !src.startsWith("http") && !src.startsWith("data:")) {
                try { src = new URL(src, urlBase).href; img.setAttribute("src", src); } catch(e) {}
            }

            if (src && !src.includes("base64")) imgsExtraidas += src + "\n";

            // Burlador de Hotlink
            img.setAttribute("referrerpolicy", "no-referrer");

            img.setAttribute("onerror", `this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style="display:inline-block; padding:8px 12px; background:#e2e8f0; color:#64748b; font-size:12px; border-radius:6px; border:1px dashed #cbd5e1; margin:5px 0;">🖼️ Imagem indisponível</div>');`);
            
            img.style.setProperty("max-width", "100%", "important");
            img.style.setProperty("height", "auto", "important");
            img.style.setProperty("border-radius", "8px", "important");
        });

        if (!imgsExtraidas) imgsExtraidas = "// Nenhuma imagem encontrada.";
        return { htmlFinal: doc.documentElement.outerHTML, imgs: imgsExtraidas };
    }
};