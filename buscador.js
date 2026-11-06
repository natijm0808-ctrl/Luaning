// ==========================================
// LUANING - BUSCADOR.JS (O Retorno)
// ==========================================

console.log("✅ Buscador em JavaScript carregado!");

document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("url");
    const btnIr = document.getElementById("btnIr");

    function executarBusca() {
        let valor = inputElement.value.trim(); 
        const iconeTLS = document.getElementById("iconeTLS");
        
        if (!valor) return;

        const temEspaco = valor.includes(" ");
        const ehUrlValida = /^(https?:\/\/|www\.)/i.test(valor) || /^[\w-]+\.[a-z]{2,}(\/.*)?$/i.test(valor);

        let destino;

        if (!temEspaco && ehUrlValida) {
            if (valor.toLowerCase().startsWith("http://")) {
                valor = valor.replace("http://", "https://");
            } else if (!valor.toLowerCase().startsWith("https://")) {
                valor = "https://" + valor;
            }
            destino = valor;
        } else {
            destino = "https://www.bing.com/search?q=" + encodeURIComponent(valor);
        }

        if (iconeTLS) {
            if (destino.startsWith("https://")) {
                iconeTLS.textContent = "🔒"; 
                iconeTLS.style.color = "#22c55e"; 
            } else {
                iconeTLS.textContent = "⚠️"; 
                iconeTLS.style.color = "#ef4444"; 
            }
        }

        if (typeof historico !== 'undefined' && typeof posicao !== 'undefined') {
            historico = historico.slice(0, posicao + 1); 
            historico.push(destino); 
            posicao = historico.length - 1; 
        }
        
        if (typeof abrirURL === "function") {
            abrirURL(destino);
        } else {
            console.error("Função abrirURL não encontrada!");
        }
    }

    if (btnIr) {
        btnIr.onclick = (e) => {
            e.preventDefault();
            executarBusca();
        };
    }

    if (inputElement) {
        inputElement.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                executarBusca();
            }
        };
    }
});