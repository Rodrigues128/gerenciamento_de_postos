// Variáveis Globais
let pessoas = [];
let postos = [];
let indexEdicao = null;

// Adicionar Pessoa
function adicionarPessoa() {
    const inputNome = document.getElementById('nome-pessoa');
    const inputFuncao = document.getElementById('funcao-pessoa');
    const prioridade = document.getElementById('pessoa-fixa').value; // Obtém o valor selecionado

    if (!inputNome.value.trim()) {
        alert('Por favor, insira o nome.');
        return;
    }

    // Converte o nome e a função para o formato com a primeira letra maiúscula
    const nome = inputNome.value.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const funcao = inputFuncao.value.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    // Adiciona a pessoa na lista
    pessoas.push({ nome, funcao, prioridade });
    salvarPessoas();
    listarPessoas();

    // Reseta o formulário
    inputNome.value = '';
    inputFuncao.value = 'monitor';
    document.getElementById('pessoa-fixa').value = 'nao';
}

// Exibir Modal para editar pessoa
function iniciarEdicaoPessoa(index) {
    indexEdicao = index;
    const pessoa = pessoas[index];

    document.getElementById('editar-nome-pessoa').value = pessoa.nome;
    document.getElementById('editar-funcao-pessoa').value = pessoa.funcao;
    document.getElementById('editar-pessoa-fixa').value = pessoa.prioridade;

    abrirModal('modal-editar-pessoa');
}

// Confirmar edição de pessoa
function confirmarEdicaoPessoa() {
    const nome = document.getElementById('editar-nome-pessoa').value.trim();
    const funcao = document.getElementById('editar-funcao-pessoa').value;
    const prioridade = document.getElementById('editar-pessoa-fixa').value;

    if (nome === '') {
        alert('Por favor, insira o nome.');
        return;
    }

    // Atualiza os dados da pessoa no array
    pessoas[indexEdicao] = { nome, funcao, prioridade };

    salvarPessoas();
    listarPessoas();
    fecharModal('modal-editar-pessoa');
}

// Adicionar Posto
function adicionarPosto() {
    const nomeInput = document.getElementById('nome-posto');
    const radioInput = document.getElementById('radio-posto').value; // Obter valor do select
    const minInput = document.getElementById('min-pessoas');
    const maxInput = document.getElementById('max-pessoas');
    const tipoInput = document.getElementById('tipo-pessoas');

    const nome = nomeInput.value.trim();
    const radio = radioInput === 'sim'; // Convertendo valor para booleano
    const min = parseInt(minInput.value, 10);
    const max = parseInt(maxInput.value, 10);
    const tipo = tipoInput.value;

    if (!nome || isNaN(min) || isNaN(max) || min > max) {
        alert('Por favor, preencha os campos corretamente. O mínimo não pode ser maior que o máximo.');
        return;
    }

    const formattedNome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

    if (postos.some(posto => posto.nome === formattedNome)) {
        alert('Já existe um posto com esse nome. Por favor, insira um nome único.');
        return;
    }

    postos.push({ nome: formattedNome, radio, min, max, tipo, pessoas: [] });
    salvarPostos();
    listarPostos();

    nomeInput.value = '';
    document.getElementById('radio-posto').value = 'nao'; // Reseta o campo select
    minInput.value = '';
    maxInput.value = '';
    tipoInput.value = 'monitor';
}


// Exibir Modal para editar posto
function iniciarEdicaoPosto(index) {
    indexEdicao = index;
    const posto = postos[index];

    document.getElementById('editar-nome-posto').value = posto.nome;
    document.getElementById('editar-radio-posto').checked = posto.radio;
    document.getElementById('editar-min-pessoas').value = posto.min;
    document.getElementById('editar-max-pessoas').value = posto.max;
    document.getElementById('editar-tipo-pessoas').value = posto.tipo;

    abrirModal('modal-editar-posto');
}

// Confirmar edição de posto
function confirmarEdicaoPosto() {
    const nome = document.getElementById('editar-nome-posto').value.trim();
    const radio = document.getElementById('editar-radio-posto').checked;
    const min = parseInt(document.getElementById('editar-min-pessoas').value, 10);
    const max = parseInt(document.getElementById('editar-max-pessoas').value, 10);
    const tipo = document.getElementById('editar-tipo-pessoas').value;

    if (!nome || isNaN(min) || isNaN(max) || min > max) {
        alert('Por favor, preencha os campos corretamente. O mínimo não pode ser maior que o máximo.');
        return;
    }

    const formattedNome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

    if (postos.some((posto, idx) => posto.nome === formattedNome && idx !== indexEdicao)) {
        alert('Já existe um posto com esse nome. Por favor, insira um nome único.');
        return;
    }

    postos[indexEdicao] = { nome: formattedNome, radio, min, max, tipo, pessoas: postos[indexEdicao].pessoas };
    salvarPostos();
    listarPostos();

    fecharModal('modal-editar-posto');
}

// Listar Pessoas
function listarPessoas() {
    const tabela = document.getElementById('tabela-pessoas');
    const tbody = document.getElementById('lista-pessoas');
    const thead = tabela.querySelector('thead');
    const toggleButton = document.getElementById('toggle-pessoas-btn'); // Botão de alternância

    tbody.innerHTML = ''; // Limpa o corpo da tabela

    if (pessoas.length === 0) {
        // Oculta o cabeçalho e desativa o botão de alternância
        thead.style.display = 'none';
        toggleButton.disabled = true;
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">Nenhuma pessoa cadastrada.</td>
            </tr>
        `;
        return;
    }

    // Exibe o cabeçalho da tabela e ativa o botão de alternância
    thead.style.display = 'table-header-group';
    toggleButton.disabled = false;

    // Adiciona as pessoas cadastradas na tabela
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
    const tabela = document.getElementById('tabela-postos');
    const tbody = document.getElementById('lista-postos');
    const thead = tabela.querySelector('thead');
    const toggleButton = document.getElementById('toggle-postos-btn');

    tbody.innerHTML = '';

    if (postos.length === 0) {
        thead.style.display = 'none';
        toggleButton.disabled = true;
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">Nenhum posto cadastrado.</td>
            </tr>
        `;
        return;
    }
    // Exibe o cabeçalho da tabela e ativa o botão de alternância
    thead.style.display = 'table-header-group';
    toggleButton.disabled = false;

    // Adiciona os postos cadastrados na tabela
    const postosUnicos = Array.from(new Set(postos.map(p => JSON.stringify(p)))).map(p => JSON.parse(p));
    postos = postosUnicos;
    postos.forEach((posto, index) => {
        const row = `<tr>
            <td>${posto.nome}</td>
            <td>${posto.radio ? 'Sim' : 'Não'}</td>
            <td>${posto.min}</td>
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

// Daqui para cima está funcionado corretamente, agora precisa arrumar as funções abaixo
function toggleVisibility(id) {
    const table = document.getElementById(id);
    if (table) {
        table.classList.toggle('hidden');
    }
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

            // Cabeçalho da tabela
            doc.setFontSize(12);
            doc.text('Posto', 10, y);
            doc.text('Nome(s)', 60, y);
            doc.text('Tem Rádio', 150, y);
            y += 7;

            postosDoTipo.forEach(posto => {
                const nomes = posto.pessoas.map(pessoa => pessoa.nome).join(', ');
                doc.text(posto.nome, 10, y);
                doc.text(nomes || '-', 60, y);
                doc.text(posto.radio ? 'Sim' : 'Não', 150, y);
                y += 7;
            });

            y += 10;
        }
    });

    // Resumo final
    const totalMonitores = pessoas.filter(p => p.funcao === 'monitor').length;
    const totalGuardaVidas = pessoas.filter(p => p.funcao === 'guarda-vida').length;
    const totalSeguranca = pessoas.filter(p => p.funcao === 'seguranca').length;

    doc.setFontSize(12);
    y += 10;
    doc.text('Legenda:', 10, y);
    y += 7;
    doc.text(`Total de Monitores: ${totalMonitores}`, 10, y);
    y += 7;
    doc.text(`Total de Guarda-Vidas: ${totalGuardaVidas}`, 10, y);
    y += 7;
    doc.text(`Total de Segurança: ${totalSeguranca}`, 10, y);

    doc.save('escala_do_dia.pdf');
}



// Função revisada para distribuir pessoas aos postos
function distribuirPostos() {
    // Certifique-se de que a limpeza de pessoas em cada posto está sendo chamada corretamente
    if (!postos || postos.length === 0) {
        console.warn('Nenhum posto disponível para limpar ou distribuir.');
        return;
    }

    postos.forEach(posto => (posto.pessoas = []));

    let avisos = [];

    // Verificar se há pessoas e postos disponíveis
    if (pessoas.length === 0) {
        alert('Não há pessoas cadastradas para realizar a distribuição.');
        return;
    }

    if (postos.length === 0) {
        alert('Não há postos cadastrados para realizar a distribuição.');
        return;
    }

    // Verificar se existem tipos específicos de pessoas cadastradas
    const tiposPresentes = ['monitor', 'guarda-vida', 'seguranca'].filter(tipo => 
        pessoas.some(pessoa => pessoa.funcao === tipo)
    );

    if (tiposPresentes.length === 0) {
        alert('Não há pessoas cadastradas para as funções exigidas (monitor, guarda-vida, segurança).');
        return;
    }

    console.log("Tipos de pessoas cadastradas presentes:", tiposPresentes);

    // Separar pessoas por tipo para evitar manipulação incorreta
    const candidatosPorTipo = {
        monitor: [...pessoas.filter(pessoa => pessoa.funcao === 'monitor')],
        'guarda-vida': [...pessoas.filter(pessoa => pessoa.funcao === 'guarda-vida')],
        seguranca: [...pessoas.filter(pessoa => pessoa.funcao === 'seguranca')],
    };

    console.log("Candidatos por Tipo:", candidatosPorTipo);

    // Distribuir pessoas para cada tipo de posto
    Object.keys(candidatosPorTipo).forEach(tipo => {
        const candidatos = candidatosPorTipo[tipo];
        const postosDoTipo = postos.filter(posto => posto.tipo === tipo);

        console.log(`Distribuindo para postos do tipo ${tipo}:`, postosDoTipo);

        postosDoTipo.forEach(posto => {
            // Alocar o mínimo necessário
            while (posto.pessoas.length < posto.min && candidatos.length > 0) {
                const pessoaSelecionada = candidatos.shift();
                posto.pessoas.push(pessoaSelecionada);
            }

            console.log(`Após alocação mínima no posto ${posto.nome}:`, posto.pessoas);

            // Verifica se o mínimo foi atendido
            if (posto.pessoas.length < posto.min) {
                avisos.push(`O posto "${posto.nome}" (${tipo}) não atingiu o mínimo de ${posto.min} pessoas.`);
            }
        });

        // Alocar excedentes até o máximo
        postosDoTipo.forEach(posto => {
            while (posto.pessoas.length < posto.max && candidatos.length > 0) {
                const pessoaSelecionada = candidatos.shift();
                posto.pessoas.push(pessoaSelecionada);
            }

            console.log(`Após alocação máxima no posto ${posto.nome}:`, posto.pessoas);
        });
    });

    // Exibir resultados e avisos
    exibirResultadoDistribuicao();

    if (avisos.length > 0) {
        alert(avisos.join('\n'));
    }
}

// Função para exibir o resultado da distribuição
function exibirResultadoDistribuicao() {
    const detalhesSorteio = document.getElementById('detalhes-distribuicao');
    detalhesSorteio.innerHTML = '';

    if (postos.length === 0) {
        detalhesSorteio.innerHTML = '<p>Nenhum posto disponível para exibir.</p>';
        return;
    }

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

    console.log("Resultado Final:", postos);
}
window.onload = carregarDados;
