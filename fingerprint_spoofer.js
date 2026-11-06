// ==========================================
// LUANING - FINGERPRINT_SPOOFER.JS
// Finge ser um celular real para enganar o Cloudflare
// ==========================================

window.FingerprintSpoofer = {
    // Injeta as mentiras no HTML antes de renderizar
    injetar: function(html) {
        const scriptSpoofer = `
            <script>
                // 1. Finge que a tela é de um celular top de linha
                Object.defineProperty(window.screen, 'width', { get: () => 1080 });
                Object.defineProperty(window.screen, 'height', { get: () => 2400 });
                Object.defineProperty(window.screen, 'colorDepth', { get: () => 24 });
                Object.defineProperty(window.screen, 'pixelDepth', { get: () => 24 });

                // 2. Finge que tem 8 núcleos de processador
                Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });

                // 3. Finge que o celular tem 8GB de RAM
                Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

                // 4. Finge ser um Chrome real no Android
                Object.defineProperty(navigator, 'userAgent', { 
                    get: () => "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36" 
                });

                // 5. Finge que a placa de vídeo é uma Adreno (padrão de celular Samsung)
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(parameter) {
                    if (parameter === 37445) { return 'Qualcomm'; } // Fabricante
                    if (parameter === 37446) { return 'Adreno (TM) 750'; } // Modelo
                    return getParameter.apply(this, arguments);
                };

                // 6. Esconde que estamos dentro de um iframe (para o window.top não bloquear)
                try {
                    Object.defineProperty(window, 'top', { get: () => window.self });
                    Object.defineProperty(window, 'parent', { get: () => window.self });
                } catch(e) {}

                console.log("🥷 Fingerprint Spoofer ativado! O Cloudflare acha que somos um Galaxy S24.");
            <\/script>
        `;

        // Coloca o script o mais cedo possível no <head>
        if (html.includes("<head>")) {
            return html.replace("<head>", "<head>" + scriptSpoofer);
        } else {
            return scriptSpoofer + html;
        }
    }
};

console.log("✅ FingerprintSpoofer.js carregado.");