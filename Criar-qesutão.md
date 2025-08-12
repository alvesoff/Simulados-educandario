# 📚 Guia Completo: Como Usar o Sistema de Criação de Questões

## 🎯 Visão Geral

O Sistema de Criação de Questões é uma ferramenta completa para criar questões de múltipla escolha com editor WYSIWYG (What You See Is What You Get). O sistema suporta texto rico, imagens, fórmulas matemáticas, código e muito mais.

## 🚀 Como Começar

### 2. Interface Principal
O modal de criação possui três seções principais:
- **Editor de Conteúdo**: Para o enunciado e alternativas
- **Metadados**: Informações sobre disciplina, ano escolar, etc.

### Passo 2: Criar o Enunciado

#### Editor WYSIWYG
O editor oferece ferramentas completas:
- **Formatação de texto**: Negrito, itálico, sublinhado
- **Listas**: Numeradas e com marcadores
- **Links**: Inserção de links externos
- **Imagens**: Upload e inserção de imagens
- **Fórmulas**: Suporte ao LaTeX/MathJax

#### Dicas para um Bom Enunciado:
1. **Seja claro e objetivo**
2. **Use linguagem adequada ao ano escolar**
3. **Inclua contexto suficiente**
4. **Evite ambiguidades**

#### Exemplos de Fórmulas Matemáticas:
```latex
# Fórmula inline
$E = mc^2$

# Fórmula em bloco
$$ \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

# Frações
$\frac{1}{2} + \frac{3}{4} = \frac{5}{4}$

# Potências e índices
$x^2 + y^2 = z^2$
$H_2O$ ou $CO_2$
```

### Passo 3: Criar as Alternativas

#### Estrutura das Alternativas
- **4 alternativas obrigatórias** (A, B, C, D)
- **1 alternativa correta** (marque o radio button)
- **Editor WYSIWYG** para cada alternativa

#### Boas Práticas para Alternativas:
1. **Mantenha tamanho similar**
2. **Evite "todas as anteriores" ou "nenhuma das anteriores"**
3. **Crie distratores plausíveis**
4. **Use linguagem consistente**

#### Exemplo de Alternativas Bem Estruturadas:
```
Questão: Qual é a capital do Brasil?

A) São Paulo
B) Rio de Janeiro  
C) Brasília ✓
D) Belo Horizonte
```

### Passo 4: Definir Metadados

#### Campos Obrigatórios:
- **Disciplina**: Selecione da lista disponível
  - Português, Matemática, Ciências, História, Geografia
  - Física, Química, Biologia, Inglês, Artes, Educação Física

- **Ano Escolar**: Do 1º ano ao 3º ano do Ensino Médio

- **Nível de Dificuldade**: Fácil, Médio ou Difícil

#### Campos Opcionais:
- **Tags**: Palavras-chave separadas por vírgula
  - Exemplo: `álgebra, equações, frações`
  - Útil para filtros e busca

### Passo 5: Salvar a Questão
- Clique em **"Salvar Questão"**
- A questão será validada automaticamente
- Aparecerá na lista de "Questões Criadas"

## 🔍 Sistema de Filtros

### Filtros Disponíveis:
- **Por Disciplina**: Filtre questões de uma matéria específica
- **Por Ano Escolar**: Visualize questões de um ano específico
- **Por Nível de Dificuldade**: Separe por complexidade
- **Por Tags**: Busque por palavras-chave

### Como Usar os Filtros:
1. Vá para a seção "Questões Criadas"
2. Use os campos de filtro
3. Clique em **"Aplicar Filtro"**
4. Use **"Limpar Filtro"** para resetar

## 💡 Dicas Avançadas

### Inserindo Imagens
1. Clique no ícone de imagem no editor
2. Selecione o arquivo (JPG, PNG, GIF)
3. A imagem será redimensionada automaticamente
4. Adicione texto alternativo para acessibilidade

### Trabalhando com Fórmulas
1. Use `$...$` para fórmulas inline
2. Use `$$...$$` para fórmulas em bloco
3. Consulte a documentação do MathJax para sintaxe avançada
4. Teste sempre a renderização antes de salvar

### Formatando Código
1. Use o botão de código no editor
2. Ou digite manualmente com \`\`\`
3. Especifique a linguagem para syntax highlighting

```javascript
function exemplo() {
    return "Hello World";
}
```

### Organizando com Tags
- Use tags descritivas e consistentes
- Exemplos por disciplina:
  - **Matemática**: `álgebra`, `geometria`, `trigonometria`
  - **História**: `brasil-colônia`, `segunda-guerra`, `república`
  - **Física**: `mecânica`, `termodinâmica`, `eletromagnetismo`

## ⚠️ Validações e Erros Comuns

### Validações Automáticas:
- ✅ Enunciado não pode estar vazio
- ✅ Todas as alternativas devem ter conteúdo
- ✅ Uma alternativa deve estar marcada como correta
- ✅ Disciplina e ano escolar são obrigatórios

### Erros Comuns e Soluções:

#### "Questão não pode ser salva"
- **Causa**: Campos obrigatórios vazios
- **Solução**: Verifique se todos os campos marcados com * estão preenchidos

#### "Fórmula não renderiza"
- **Causa**: Sintaxe LaTeX incorreta
- **Solução**: Verifique chaves, parênteses e comandos

#### "Imagem não aparece"
- **Causa**: Arquivo muito grande ou formato não suportado
- **Solução**: Use JPG/PNG com menos de 2MB

## 📊 Recursos Adicionais

### Atalhos do Editor:
- **Ctrl+B**: Negrito
- **Ctrl+I**: Itálico
- **Ctrl+U**: Sublinhado
- **Ctrl+Z**: Desfazer
- **Ctrl+Y**: Refazer

### Exportação e Backup:
- As questões são salvas automaticamente no navegador
- Para backup, exporte as questões via API
- Use o formato JSON para integração com outros sistemas

### Integração com API:
O sistema se conecta automaticamente com a API backend para:
- Salvar questões permanentemente
- Sincronizar entre dispositivos
- Gerar relatórios e estatísticas

## 🔌 API e Requisições HTTP

### URL Base da API
```
https://api-questao-1.onrender.com/api/v1/questoes
```

### Rotas Disponíveis

#### 1. **Criar Questão**
- **Método**: `POST`
- **Endpoint**: `/api/v1/questoes`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  ```
- **Body** (JSON):
  ```json
  {
    "statement": "Qual é a capital do Brasil?",
    "alternatives": [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Belo Horizonte"
    ],
    "correctAnswer": 2,
    "disciplina": "Geografia",
    "anoEscolar": 7,
    "nivelDificuldade": "Fácil",
    "tags": ["geografia", "brasil", "capitais"],
    "has_math": false
  }
  ```
- **Resposta** (201 Created):
  ```json
  {
    "id": "507f1f77bcf86cd799439011",
    "statement": "Qual é a capital do Brasil?",
    "alternatives": [...],
    "correctAnswer": 2,
    "disciplina": "Geografia",
    "anoEscolar": 7,
    "nivelDificuldade": "Fácil",
    "tags": ["geografia", "brasil", "capitais"],
    "has_math": false
  }
  ```

#### 2. **Listar Questões (com Paginação e Filtros)**
- **Método**: `GET`
- **Endpoint**: `/api/v1/questoes`
- **Parâmetros de Query**:
  - `skip`: Número de registros para pular (padrão: 0)
  - `limit`: Número máximo de registros (padrão: 10)
  - `disciplina`: Filtrar por disciplina (opcional)
  - `anoEscolar`: Filtrar por ano escolar (opcional)
  - `nivelDificuldade`: Filtrar por nível de dificuldade (opcional)
  - `tags`: Filtrar por tags separadas por vírgula (opcional)

- **Exemplo de URL**:
  ```
  /api/v1/questoes?skip=0&limit=10&disciplina=Matemática&anoEscolar=9&nivelDificuldade=Médio
  ```

- **Resposta** (200 OK):
  ```json
  {
    "items": [
      {
        "id": "507f1f77bcf86cd799439011",
        "statement": "Resolva a equação...",
        "alternatives": [...],
        "correctAnswer": 0,
        "disciplina": "Matemática",
        "anoEscolar": 9,
        "nivelDificuldade": "Médio",
        "tags": ["álgebra", "equações"],
        "has_math": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasMore": true
    }
  }
  ```

#### 3. **Obter Questão Específica**
- **Método**: `GET`
- **Endpoint**: `/api/v1/questoes/{questao_id}`
- **Parâmetros**: `questao_id` (ID da questão)
- **Resposta** (200 OK): Objeto da questão completo

#### 4. **Atualizar Questão**
- **Método**: `PUT`
- **Endpoint**: `/api/v1/questoes/{questao_id}`
- **Headers**: Mesmo do POST
- **Body**: Campos a serem atualizados (parcial ou completo)
- **Resposta** (200 OK): Questão atualizada

#### 5. **Excluir Questão**
- **Método**: `DELETE`
- **Endpoint**: `/api/v1/questoes/{questao_id}`
- **Resposta** (204 No Content): Sucesso na exclusão

### Estrutura de Dados da Questão

#### Campos Obrigatórios:
- `statement` (string): Enunciado da questão
- `alternatives` (array): Lista com 4 alternativas
- `correctAnswer` (integer): Índice da alternativa correta (0-3)
- `disciplina` (string): Disciplina da questão
- `anoEscolar` (integer): Ano escolar (1-12)
- `nivelDificuldade` (string): "Fácil", "Médio" ou "Difícil"

#### Campos Opcionais:
- `tags` (array): Lista de tags para categorização
- `has_math` (boolean): Indica se contém fórmulas matemáticas

### Códigos de Status HTTP

- **200 OK**: Operação realizada com sucesso
- **201 Created**: Questão criada com sucesso
- **204 No Content**: Questão excluída com sucesso
- **400 Bad Request**: Dados inválidos na requisição
- **404 Not Found**: Questão não encontrada
- **422 Unprocessable Entity**: Erro de validação dos dados
- **500 Internal Server Error**: Erro interno do servidor

### Exemplo de Uso com JavaScript

```javascript
// Criar uma nova questão
async function criarQuestao() {
  const questao = {
    statement: "Qual é o resultado de 2 + 2?",
    alternatives: ["3", "4", "5", "6"],
    correctAnswer: 1,
    disciplina: "Matemática",
    anoEscolar: 1,
    nivelDificuldade: "Fácil",
    tags: ["aritmética", "soma"],
    has_math: false
  };

  try {
    const response = await fetch('https://api-questao-1.onrender.com/api/v1/questoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(questao)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar questão');
    }

    const questaoSalva = await response.json();
    console.log('Questão criada:', questaoSalva);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Listar questões com filtros
async function listarQuestoes() {
  const params = new URLSearchParams({
    skip: '0',
    limit: '10',
    disciplina: 'Matemática',
    nivelDificuldade: 'Fácil'
  });

  try {
    const response = await fetch(`https://api-questao-1.onrender.com/api/v1/questoes?${params}`);
    const data = await response.json();
    
    console.log('Questões encontradas:', data.items.length);
    console.log('Total de questões:', data.pagination.totalItems);
  } catch (error) {
    console.error('Erro ao listar questões:', error);
  }
}
```

### Tratamento de Erros

```javascript
// Exemplo de tratamento de erros
async function exemploTratamentoErros() {
  try {
    const response = await fetch('/api/v1/questoes/id_inexistente');
    
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 404:
          console.error('Questão não encontrada');
          break;
        case 400:
          console.error('Dados inválidos:', errorData.detail);
          break;
        case 422:
          console.error('Erro de validação:', errorData.detail);
          break;
        default:
          console.error('Erro desconhecido:', errorData.detail);
      }
    }
  } catch (error) {
    console.error('Erro de rede:', error);
  }
}
```

## 🆘 Suporte e Solução de Problemas

### Problemas Técnicos:
1. **Recarregue a página** se o editor não responder
2. **Limpe o cache** do navegador se houver problemas de carregamento
3. **Verifique a conexão** com a internet para salvamento

### Contato:
- Para dúvidas técnicas, consulte a documentação da API
- Para sugestões de melhorias, abra uma issue no repositório

---

## 📝 Exemplo Prático Completo

### Criando uma Questão de Matemática:

1. **Clique em "Criar Questão"**
2. **Selecione o template "Questão com Fórmula"**
3. **Edite o enunciado**:
   ```
   Resolva a equação do segundo grau:
   $$ 2x^2 - 8x + 6 = 0 $$
   Quais são as raízes da equação?
   ```

4. **Configure as alternativas**:
   - A) $x = 1$ e $x = 3$ ✓
   - B) $x = 2$ e $x = 4$
   - C) $x = -1$ e $x = -3$
   - D) $x = 0$ e $x = 2$

5. **Preencha os metadados**:
   - Disciplina: Matemática
   - Ano Escolar: 9º Ano
   - Nível: Médio
   - Tags: `equação, segundo grau, álgebra`

6. **Salve a questão**

### Resultado:
Uma questão completa, bem formatada e pronta para uso em avaliações!

---

*Este guia cobre todas as funcionalidades do sistema. Para dúvidas específicas, consulte a documentação técnica ou entre em contato com o suporte.*