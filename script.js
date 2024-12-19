
// Variáveis Globais
let pessoas = [];
let postos = [];
let indexEdicao = null;

// Adicionar Pessoa
function adicionarPessoa() {
    const nome = document.getElementById('nome-pessoa').value;
    const funcao = document.getElementById('funcao-pessoa').value;
    const prioridade = document.getElementById('prioridade-pessoa').checked;

    if (nome === '') {
        alert('Por favor, insira o nome.');
        return;
    }

    pessoas.push({ nome, funcao, prioridade });
    salvarPessoas();
    listarPessoas();
    document.getElementById('form-pessoa').reset();
}

// Exibir Modal para editar pessoa
function iniciarEdicaoPessoa(index) {
    indexEdicao = index;
    const pessoa = pessoas[index];

    document.getElementById('editar-nome-pessoa').value = pessoa.nome;
    document.getElementById('editar-funcao-pessoa').value = pessoa.funcao;
    document.getElementById('editar-prioridade-pessoa').checked = pessoa.prioridade;

    abrirModal('modal-editar-pessoa');
}

// Confirmar edição de pessoa
function confirmarEdicaoPessoa() {
    const nome = document.getElementById('editar-nome-pessoa').value;
    const funcao = document.getElementById('editar-funcao-pessoa').value;
    const prioridade = document.getElementById('editar-prioridade-pessoa').checked;

    if (nome === '') {
        alert('Por favor, insira o nome.');
        return;
    }

    pessoas[indexEdicao] = { nome, funcao, prioridade };
    salvarPessoas();
    listarPessoas();
    fecharModal('modal-editar-pessoa');
}

// Adicionar Posto
function adicionarPosto() {
    const nome = document.getElementById('nome-posto').value;
    const radio = document.getElementById('radio-posto').checked;
    const min = parseInt(document.getElementById('min-pessoas').value);
    const med = parseInt(document.getElementById('med-pessoas').value);
    const max = parseInt(document.getElementById('max-pessoas').value);
    const tipo = document.getElementById('tipo-pessoas').value;

    if (nome === '' || isNaN(min) || isNaN(med) || isNaN(max)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    postos.push({ nome, radio, min, med, max, tipo, pessoas: [] });
    salvarPostos();
    listarPostos();
    document.getElementById('form-posto').reset();
}

// Exibir Modal para editar posto
function iniciarEdicaoPosto(index) {
    indexEdicao = index;
    const posto = postos[index];

    document.getElementById('editar-nome-posto').value = posto.nome;
    document.getElementById('editar-radio-posto').checked = posto.radio;
    document.getElementById('editar-min-pessoas').value = posto.min;
    document.getElementById('editar-med-pessoas').value = posto.med;
    document.getElementById('editar-max-pessoas').value = posto.max;
    document.getElementById('editar-tipo-pessoas').value = posto.tipo;

    abrirModal('modal-editar-posto');
}

// Confirmar edição de posto
function confirmarEdicaoPosto() {
    const nome = document.getElementById('editar-nome-posto').value;
    const radio = document.getElementById('editar-radio-posto').checked;
    const min = parseInt(document.getElementById('editar-min-pessoas').value);
    const med = parseInt(document.getElementById('editar-med-pessoas').value);
    const max = parseInt(document.getElementById('editar-max-pessoas').value);
    const tipo = document.getElementById('editar-tipo-pessoas').value;

    if (nome === '' || isNaN(min) || isNaN(med) || isNaN(max)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    postos[indexEdicao] = { nome, radio, min, med, max, tipo, pessoas: postos[indexEdicao].pessoas };
    salvarPostos();
    listarPostos();
    fecharModal('modal-editar-posto');
}

// Listar Pessoas
function listarPessoas() {
    const tbody = document.getElementById('lista-pessoas');
    tbody.innerHTML = '';

    pessoas.forEach((pessoa, index) => {
        const row = `<tr>
            <td>${pessoa.nome}</td>
            <td>${pessoa.funcao}</td>
            <td>${pessoa.prioridade ? 'Sim' : 'Não'}</td>
            <td>
                <button onclick="iniciarEdicaoPessoa(${index})">Editar</button>
                <button onclick="removerPessoa(${index})">Remover</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Listar Postos
function listarPostos() {
    const tbody = document.getElementById('lista-postos');
    tbody.innerHTML = '';

    postos.forEach((posto, index) => {
        const row = `<tr>
            <td>${posto.nome}</td>
            <td>${posto.radio ? 'Sim' : 'Não'}</td>
            <td>${posto.min}</td>
            <td>${posto.med}</td>
            <td>${posto.max}</td>
            <td>${posto.tipo}</td>
            <td>
                <button onclick="iniciarEdicaoPosto(${index})">Editar</button>
                <button onclick="removerPosto(${index})">Remover</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Abrir Modal
function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

// Fechar Modal
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Remover Pessoa
function removerPessoa(index) {
    pessoas.splice(index, 1);
    salvarPessoas();
    listarPessoas();
}

// Remover Posto
function removerPosto(index) {
    postos.splice(index, 1);
    salvarPostos();
    listarPostos();
}

// Salvar Pessoas e Postos
function salvarPessoas() {
    localStorage.setItem('pessoas', JSON.stringify(pessoas));
}

function salvarPostos() {
    localStorage.setItem('postos', JSON.stringify(postos));
}

// Carregar Dados
function carregarDados() {
    const pessoasSalvas = localStorage.getItem('pessoas');
    const postosSalvos = localStorage.getItem('postos');

    if (pessoasSalvas) pessoas = JSON.parse(pessoasSalvas);
    if (postosSalvos) postos = JSON.parse(postosSalvos);

    listarPessoas();
    listarPostos();
}

// Inicializar
window.onload = carregarDados;


// Função de Sorteio
function sortearPessoas() {
    // Limpa os postos
    postos.forEach(posto => posto.pessoas = []);

    let candidatos = [...pessoas];
    let avisos = [];

    // Distribuir pessoas de acordo com o mínimo
    postos.forEach(posto => {
        const aptos = candidatos.filter(pessoa => pessoa.funcao === posto.tipo);

        while (posto.pessoas.length < posto.min && aptos.length > 0) {
            const randomIndex = Math.floor(Math.random() * aptos.length);
            posto.pessoas.push(aptos[randomIndex]);
            candidatos = candidatos.filter(p => p !== aptos[randomIndex]);
        }

        // Verificar se não foi possível atingir o mínimo
        if (posto.pessoas.length < posto.min) {
            avisos.push(`Não há pessoas suficientes para preencher o mínimo no posto ${posto.nome}.`);
        }
    });

    // Distribuir uniformemente até atingir o máximo
    while (candidatos.length > 0) {
        let distribuido = false;

        for (const posto of postos) {
            if (posto.pessoas.length < posto.max) {
                const aptos = candidatos.filter(pessoa => pessoa.funcao === posto.tipo);

                if (aptos.length > 0) {
                    const randomIndex = Math.floor(Math.random() * aptos.length);
                    posto.pessoas.push(aptos[randomIndex]);
                    candidatos = candidatos.filter(p => p !== aptos[randomIndex]);
                    distribuido = true;
                }
            }
        }

        if (!distribuido) break;
    }

    exibirResultadoSorteio();

    // Exibir avisos, se houver
    if (avisos.length > 0) {
        alert(avisos.join('\n'));
    }
}

// Exibir Resultado do Sorteio
function exibirResultadoSorteio() {
    const detalhesSorteio = document.getElementById('detalhes-sorteio');
    detalhesSorteio.innerHTML = '';

    postos.forEach(posto => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h4>${posto.nome} (${posto.radio ? 'Com Rádio' : 'Sem Rádio'})</h4>
            <ul>
                ${posto.pessoas.map(pessoa => `<li>${pessoa.nome}</li>`).join('')}
            </ul>
        `;
        detalhesSorteio.appendChild(div);
    });
}


// Função para realizar cortes
function realizarCortes() {
    const qtde = parseInt(document.getElementById('qtde-corte').value);
    const setor = document.getElementById('setor-corte').value;

    if (isNaN(qtde) || qtde <= 0) {
        alert('Quantidade inválida para cortes.');
        return;
    }

    let candidatos = pessoas.filter(pessoa => pessoa.funcao === setor && !pessoa.prioridade);
    if (candidatos.length < qtde) {
        alert(`Não há pessoas suficientes para cortar no setor ${setor}.`);
        return;
    }

    // Cortar aleatoriamente respeitando o mínimo dos postos
    for (let i = 0; i < qtde; i++) {
        if (candidatos.length === 0) break;
        const randomIndex = Math.floor(Math.random() * candidatos.length);
        const removido = candidatos[randomIndex];
        
        // Remover da lista global de pessoas
        pessoas = pessoas.filter(p => p !== removido);

        // Remover dos postos relacionados
        postos.forEach(posto => {
            if (posto.tipo === setor) {
                posto.pessoas = posto.pessoas.filter(p => p.nome !== removido.nome);
            }
        });

        // Atualizar candidatos restantes
        candidatos = candidatos.filter(p => p !== removido);
    }

    // Verificar se os postos atendem ao mínimo após os cortes
    const avisos = [];
    postos.forEach(posto => {
        if (posto.tipo === setor && posto.pessoas.length < posto.min) {
            avisos.push(`O posto ${posto.nome} não atende mais ao mínimo necessário (${posto.min}).`);
        }
    });

    if (avisos.length > 0) {
        alert(avisos.join('\n'));
    }

    salvarPessoas();
    listarPessoas();
    listarPostos();
}

// Função para gerar o PDF da escala do dia
function gerarEscalaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Escala do Dia', 10, 10);

    const tipos = ['monitor', 'guarda-vida', 'seguranca'];
    let y = 20;

    tipos.forEach(tipo => {
        const postosDoTipo = postos.filter(posto => posto.tipo === tipo);
        if (postosDoTipo.length > 0) {
            doc.setFontSize(14);
            doc.text(tipo.charAt(0).toUpperCase() + tipo.slice(1), 10, y);
            y += 10;

            postosDoTipo.forEach(posto => {
                doc.setFontSize(12);
                doc.text(`${posto.nome} (${posto.radio ? 'Com Rádio' : 'Sem Rádio'})`, 10, y);
                y += 7;

                posto.pessoas.forEach(pessoa => {
                    doc.setFontSize(10);
                    doc.text(`- ${pessoa.nome}`, 15, y);
                    y += 5;
                });

                y += 5;
            });

            y += 10;
        }
    });

    // Resumo final
    const totalMonitores = pessoas.filter(p => p.funcao === 'monitor').length;
    const totalGuardaVidas = pessoas.filter(p => p.funcao === 'guarda-vida').length;
    const totalSeguranca = pessoas.filter(p => p.funcao === 'seguranca').length;

    doc.setFontSize(12);
    doc.text('Resumo:', 10, y);
    y += 10;
    doc.text(`Total de Monitores: ${totalMonitores}`, 10, y);
    y += 7;
    doc.text(`Total de Guarda-Vidas: ${totalGuardaVidas}`, 10, y);
    y += 7;
    doc.text(`Total de Segurança: ${totalSeguranca}`, 10, y);

    doc.save('escala_do_dia.pdf');
}
