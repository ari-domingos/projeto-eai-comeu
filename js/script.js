let carrinho = [];

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Adiciona um produto ao carrinho
function adicionar(imagem, nome, preco) {
  let encontrado = false;
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome == nome) {
      carrinho[i].quantidade++;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let novoProduto = {
      imagem: imagem,
      nome: nome,
      preco: preco,
      quantidade: 1,
    };
    carrinho.push(novoProduto);
  }
  atualizarContador();
  let botao = document.querySelector(".botao-carrinho");
  botao.style.transform = "scale(1.3)";
  setTimeout(function () {
    botao.style.transform = "scale(1)";
  }, 200);
}

// Atualiza o número em cima do ícone do carrinho
function atualizarContador() {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].quantidade;
  }
  document.getElementById("contador").textContent = total;
}

// Calcula o valor total do carrinho
function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

// Aumenta ou diminui a quantidade de um produto
function mudarQuantidade(posicao, valor) {
  carrinho[posicao].quantidade = carrinho[posicao].quantidade + valor;
  if (carrinho[posicao].quantidade <= 0) {
    carrinho.splice(posicao, 1);
  }
  atualizarContador();
  mostrarProdutosNoCarrinho();
}

// Remove um produto do carrinho
function removerProduto(posicao) {
  carrinho.splice(posicao, 1);
  atualizarContador();
  mostrarProdutosNoCarrinho();
}

// Esvazia o carrinho
function esvaziarCarrinho() {
  carrinho = [];
  atualizarContador();
  mostrarProdutosNoCarrinho();
}

// Monta e exibe os produtos dentro do painel do carrinho
function mostrarProdutosNoCarrinho() {
  let lista = document.getElementById("lista-carrinho");
  let avisoVazio = document.getElementById("aviso-vazio");
  let rodape = document.getElementById("rodape-carrinho");

  let cards = lista.querySelectorAll(".card-produto-carrinho");
  for (let i = 0; i < cards.length; i++) {
    cards[i].remove();
  }

  if (carrinho.length == 0) {
    avisoVazio.style.display = "block";
    rodape.style.display = "none";
    return;
  }

  avisoVazio.style.display = "none";
  rodape.style.display = "block";

  // Cria um card na tela para cada produto da lista
  for (let i = 0; i < carrinho.length; i++) {
    let produto = carrinho[i];
    let card = document.createElement("div");
    card.className = "card-produto-carrinho";
    card.innerHTML =
      '<div class="foto-produto">' +
      '<img src="' +
      produto.imagem +
      '" alt="' +
      produto.nome +
      '">' +
      "</div>" +
      '<div class="info-produto">' +
      '<div class="nome-produto">' +
      produto.nome +
      "</div>" +
      '<div class="preco-unitario">' +
      formatarPreco(produto.preco) +
      " / unidade</div>" +
      '<div class="controles-quantidade">' +
      '<button class="botao-quantidade" onclick="mudarQuantidade(' +
      i +
      ', -1)">−</button>' +
      '<span class="numero-quantidade">' +
      produto.quantidade +
      "</span>" +
      '<button class="botao-quantidade" onclick="mudarQuantidade(' +
      i +
      ', 1)">+</button>' +
      "</div>" +
      "</div>" +
      '<div style="text-align:right">' +
      '<div class="subtotal-produto">' +
      formatarPreco(produto.preco * produto.quantidade) +
      "</div>" +
      '<button class="botao-remover" onclick="removerProduto(' +
      i +
      ')">✕</button>' +
      "</div>";
    lista.appendChild(card);
  }

  // Atualiza os valores no rodapé do painel
  let total = calcularTotal();
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }

  document.getElementById("valor-subtotal").textContent = formatarPreco(total);
  document.getElementById("valor-total").textContent = formatarPreco(total);

  if (totalItens == 1) {
    document.getElementById("quantidade-itens").textContent = "1 unidade";
  } else {
    document.getElementById("quantidade-itens").textContent =
      totalItens + " unidades";
  }
}

// Abre o painel lateral do carrinho
function abrirCarrinho() {
  mostrarProdutosNoCarrinho();
  document.getElementById("fundo-escuro").classList.add("aberto");
  document.body.style.overflow = "hidden";
}

// Fecha o painel lateral do carrinho
function fecharCarrinho() {
  document.getElementById("fundo-escuro").classList.remove("aberto");
  document.body.style.overflow = "";
}

// Fecha o painel se clicar no fundo escuro (fora do painel)
function fecharAoClicarFora(evento) {
  if (evento.target == document.getElementById("fundo-escuro")) {
    fecharCarrinho();
  }
}

// Abre o formulário de finalização do pedido
function abrirFormulario() {
  fecharCarrinho();

  let container = document.getElementById("lista-produtos-pedido");
  container.innerHTML = "";

  for (let i = 0; i < carrinho.length; i++) {
    let produto = carrinho[i];
    let linha = document.createElement("div");
    linha.className = "linha-produto-pedido";
    linha.innerHTML =
      "<span>" +
      produto.nome +
      " × " +
      produto.quantidade +
      "</span>" +
      "<strong>" +
      formatarPreco(produto.preco * produto.quantidade) +
      "</strong>";
    container.appendChild(linha);
  }

  document.getElementById("total-pedido").textContent =
    formatarPreco(calcularTotal());
  document.getElementById("mensagem-sucesso").style.display = "none";
  document.getElementById("formulario-pedido").classList.add("aberto");
}

// Fecha o formulário e volta para o carrinho
function fecharFormulario() {
  document.getElementById("formulario-pedido").classList.remove("aberto");
  abrirCarrinho();
}

// Envia o pedido
function enviarPedido() {
  let nome = document.getElementById("campo-nome").value;
  let whats = document.getElementById("campo-whatsapp").value;

  nome = nome.trim();
  whats = whats.trim();

  if (nome == "" || whats == "") {
    alert("Por favor, preencha seu nome e WhatsApp.");
    return;
  }

  document.getElementById("mensagem-sucesso").style.display = "block";

  setTimeout(function () {
    document.getElementById("formulario-pedido").classList.remove("aberto");
    esvaziarCarrinho();
    document.getElementById("mensagem-sucesso").style.display = "none";
    document.getElementById("campo-nome").value = "";
    document.getElementById("campo-whatsapp").value = "";
    document.getElementById("campo-data").value = "";
    document.getElementById("campo-observacoes").value = "";
  }, 3500);
}

// Navega entre as páginas do site
function irParaPagina(pagina) {
  let paginas = document.querySelectorAll(".pagina");
  for (let i = 0; i < paginas.length; i++) {
    paginas[i].classList.remove("ativa");
  }

  document.getElementById("pagina-" + pagina).classList.add("ativa");

  let links = document.querySelectorAll(".links-nav li a");
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove("ativo");
  }
  document.getElementById("nav-" + pagina).classList.add("ativo");

  // Volta para o topo
  window.scrollTo({ top: 0, behavior: "smooth" });
}
