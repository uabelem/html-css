/* =============================================
   COFFEE SHOP — script.js
   ============================================= */

// ─── ESTADO GLOBAL ──────────────────────────
const carrinho = {};
let descontoAtivo = 0;
let totalGasto = 0;

const CUPONS = {
    'CAFE10': 10,
    'PRIMEIRA': 15,
    'ESPECIAL': 20,
};

// ─── UTILITÁRIOS ────────────────────────────
function fmt(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function mostrarToast(msg, duracao = 2500) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('visivel');
    setTimeout(() => t.classList.remove('visivel'), duracao);
}

// ─── RELÓGIO E STATUS ───────────────────────
function atualizarRelogio() {
    const agora = new Date();
    const h = agora.getHours();
    const m = String(agora.getMinutes()).padStart(2, '0');
    const s = String(agora.getSeconds()).padStart(2, '0');

    const relogio = document.getElementById('relogio');
    const status  = document.getElementById('status-aberto');

    if (relogio) relogio.textContent = `${h}:${m}:${s}`;

    const aberto = h >= 7 && h < 22;
    if (status) {
        status.textContent = aberto ? '● Aberto' : '● Fechado';
        status.className   = aberto ? 'aberto'   : 'fechado';
    }
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// ─── MODAIS ─────────────────────────────────
function abrirModal(id) {
    document.getElementById(id).classList.add('aberto');
}

function fecharModal(id) {
    document.getElementById(id).classList.remove('aberto');
}

// Fechar ao clicar fora da box
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('aberto');
    });
});

// ─── RESERVA ────────────────────────────────
let numPessoas = 2;

function alterarPessoas(delta) {
    numPessoas = Math.max(1, Math.min(20, numPessoas + delta));
    document.getElementById('num-pessoas').textContent = numPessoas;
}

function confirmarReserva() {
    const nome = document.getElementById('res-nome').value.trim();
    const data = document.getElementById('res-data').value;
    const hora = document.getElementById('res-hora').value;

    if (!nome || !data) {
        mostrarToast('⚠️ Preencha nome e data!');
        return;
    }

    const dataFmt = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR');
    mostrarToast(`✅ Mesa reservada para ${nome} — ${dataFmt} às ${hora}`, 4000);
    fecharModal('modal-reserva');
}

// ─── VAGAS ──────────────────────────────────
function candidatar(cargo) {
    mostrarToast(`📩 Candidatura para "${cargo}" enviada! Entraremos em contato.`, 3500);
    fecharModal('modal-vagas');
}

// ─── FILTRO POR CATEGORIA ───────────────────
function filtrarCategoria(cat) {
    document.querySelectorAll('#menu li[data-cat]').forEach(li => {
        li.classList.toggle('ativo', li.dataset.cat === cat);
    });

    document.querySelectorAll('.produto').forEach(p => {
        const visivel = cat === 'todos' || p.dataset.cat === cat;
        p.style.display = visivel ? 'flex' : 'none';
    });

    verificarSemResultado();
}

// ─── BUSCA ──────────────────────────────────
function buscarProduto(termo) {
    const t = termo.toLowerCase();
    document.querySelectorAll('.produto').forEach(p => {
        const nome = p.dataset.nome.toLowerCase();
        const tags = (p.dataset.tags || '').toLowerCase();
        const desc = (p.dataset.desc || '').toLowerCase();
        p.style.display = (nome.includes(t) || tags.includes(t) || desc.includes(t)) ? 'flex' : 'none';
    });
    verificarSemResultado();
}

function verificarSemResultado() {
    const visiveis = [...document.querySelectorAll('.produto')].filter(p => p.style.display !== 'none');
    document.getElementById('sem-resultado').style.display = visiveis.length === 0 ? 'flex' : 'none';
}

// ─── DETALHES DO PRODUTO ────────────────────
function abrirProduto(btn) {
    const p    = btn.closest('.produto');
    const nome = p.dataset.nome;
    const preco = parseFloat(p.dataset.preco);
    const desc  = p.dataset.desc || '';
    const tags  = (p.dataset.tags || '').split(',').map(t => t.trim());
    const img   = p.querySelector('img').src;
    const estrelas = p.querySelector('.estrelas').textContent;

    const html = `
        <img src="${img}" alt="${nome}" class="modal-produto-img">
        <h2>${nome}</h2>
        <div style="margin:4px 0 8px; color:#F2D3AC; font-size:.85em">${estrelas}</div>
        <p class="modal-sub" style="color:#fdfef9cc; font-size:.92em; line-height:1.6">${desc}</p>
        <div class="modal-produto-preco">${fmt(preco)}</div>
        <div class="modal-produto-tags">
            ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <button class="btn-primario" onclick="adicionarCarrinhoPorNome('${nome}', ${preco}); fecharModal('modal-produto')">
            <span class="material-symbols-outlined" style="vertical-align:-4px;font-size:1.1em">add_shopping_cart</span>
            Adicionar ao Carrinho
        </button>
    `;
    document.getElementById('modal-produto-conteudo').innerHTML = html;
    abrirModal('modal-produto');
}

// ─── FAVORITOS ──────────────────────────────
function toggleFavorito(btn) {
    btn.classList.toggle('favoritado');
    const nome = btn.closest('.produto').dataset.nome;
    const msg  = btn.classList.contains('favoritado')
        ? `❤️ "${nome}" adicionado aos favoritos!`
        : `🤍 "${nome}" removido dos favoritos.`;
    mostrarToast(msg);
}

// ─── CARRINHO ───────────────────────────────
function adicionarCarrinhoPorNome(nome, preco) {
    if (carrinho[nome]) {
        carrinho[nome].quantidade++;
    } else {
        carrinho[nome] = { nome, preco, quantidade: 1 };
    }
    mostrarToast(`🛒 "${nome}" adicionado!`);
    atualizarCarrinho();
}

function adicionarCarrinho(btn) {
    const p     = btn.closest('.produto');
    const nome  = p.dataset.nome;
    const preco = parseFloat(p.dataset.preco);
    adicionarCarrinhoPorNome(nome, preco);

    // feedback visual no botão
    const icone = btn.querySelector('.material-symbols-outlined');
    icone.textContent = 'check';
    setTimeout(() => { icone.textContent = 'add_shopping_cart'; }, 900);
}

function alterarQuantidade(nome, delta) {
    if (!carrinho[nome]) return;
    carrinho[nome].quantidade += delta;
    if (carrinho[nome].quantidade <= 0) delete carrinho[nome];
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const container = document.getElementById('itens-carrinho');
    container.innerHTML = '';

    const itens = Object.values(carrinho);

    if (itens.length === 0) {
        container.innerHTML = '<p id="placeholder">Nenhum item ainda</p>';
        setTotais(0);
        atualizarFidelidade(0);
        return;
    }

    let subtotal = 0;
    itens.forEach(item => {
        subtotal += item.preco * item.quantidade;
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <span class="item-nome">${item.nome}</span>
            <div class="item-qtd-ctrl">
                <button onclick="alterarQuantidade('${item.nome}', -1)">−</button>
                <span class="item-qtd">${item.quantidade}</span>
                <button onclick="alterarQuantidade('${item.nome}', 1)">+</button>
            </div>
            <span class="item-valor">${fmt(item.preco * item.quantidade)}</span>
            <span class="item-remover" onclick="removerItem('${item.nome}')">✕</span>
        `;
        container.appendChild(div);
    });

    setTotais(subtotal);
    atualizarFidelidade(subtotal);
}

function removerItem(nome) {
    delete carrinho[nome];
    atualizarCarrinho();
    mostrarToast('🗑️ Item removido do carrinho.');
}

function setTotais(subtotal) {
    const desconto = subtotal * (descontoAtivo / 100);
    const total    = subtotal - desconto;

    document.getElementById('subtotal-val').textContent = fmt(subtotal);
    document.getElementById('total-val').textContent    = fmt(total);

    const lDesconto = document.getElementById('desconto-linha');
    if (descontoAtivo > 0 && subtotal > 0) {
        lDesconto.style.display = 'flex';
        document.getElementById('desconto-val').textContent = '− ' + fmt(desconto);
    } else {
        lDesconto.style.display = 'none';
    }
}

// ─── CUPOM ──────────────────────────────────
function aplicarCupom() {
    const codigo = document.getElementById('cupom-input').value.trim().toUpperCase();
    if (!codigo) { mostrarToast('⚠️ Digite um cupom!'); return; }

    if (CUPONS[codigo]) {
        descontoAtivo = CUPONS[codigo];
        mostrarToast(`🎉 Cupom "${codigo}" aplicado! ${descontoAtivo}% de desconto!`, 3000);
        atualizarCarrinho();
        document.getElementById('cupom-input').value = '';
    } else {
        mostrarToast('❌ Cupom inválido. Tente: CAFE10, PRIMEIRA ou ESPECIAL', 3500);
    }
}

// ─── PROGRAMA DE FIDELIDADE ─────────────────
const META_FIDELIDADE = 50; // reais para ganhar café grátis

function atualizarFidelidade(subtotal) {
    totalGasto += 0; // só atualiza ao finalizar
    const progresso = Math.min((subtotal / META_FIDELIDADE) * 100, 100);
    document.getElementById('fidelidade-fill').style.width = progresso + '%';

    const pontos = Math.floor(subtotal * 2);
    document.getElementById('pontos-label').textContent = pontos + ' pontos';

    const faltam = Math.max(0, META_FIDELIDADE - subtotal);
    const metaEl = document.getElementById('fidelidade-meta');
    if (faltam <= 0) {
        metaEl.textContent = '🎉 Você ganhou um café grátis!';
        metaEl.style.color = '#F2D3AC';
    } else {
        metaEl.textContent = `Faltam ${fmt(faltam)} para um café grátis!`;
        metaEl.style.color = '';
    }
}

// ─── FINALIZAR PEDIDO ───────────────────────
function finalizarPedido() {
    const itens = Object.values(carrinho);
    if (itens.length === 0) {
        mostrarToast('⚠️ Seu carrinho está vazio!');
        return;
    }

    const subtotal  = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const desconto  = subtotal * (descontoAtivo / 100);
    const total     = subtotal - desconto;
    const numPedido = Math.floor(Math.random() * 9000) + 1000;

    let resumoHtml = `<p style="margin-bottom:8px; color:#F2D3ACaa; font-size:.8em">Pedido #${numPedido}</p>`;
    itens.forEach(i => {
        resumoHtml += `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #fdfef910; font-size:.85em">
                <span>${i.nome} ×${i.quantidade}</span>
                <span style="color:#F2D3AC">${fmt(i.preco * i.quantidade)}</span>
            </div>`;
    });
    if (descontoAtivo > 0) {
        resumoHtml += `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.85em"><span>Desconto ${descontoAtivo}%</span><span style="color:#F2D3AC">− ${fmt(desconto)}</span></div>`;
    }
    resumoHtml += `<div style="display:flex;justify-content:space-between;padding:8px 0 0;font-weight:bold;border-top:1px solid #fdfef920;margin-top:4px"><span>Total</span><span style="color:#F2D3AC">${fmt(total)}</span></div>`;

    document.getElementById('pedido-resumo').innerHTML = resumoHtml;

    // Limpa o carrinho
    Object.keys(carrinho).forEach(k => delete carrinho[k]);
    descontoAtivo = 0;
    atualizarCarrinho();

    abrirModal('modal-pedido');
}

// ─── TECLA ESC FECHA MODAL ──────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.aberto').forEach(m => m.classList.remove('aberto'));
    }
});