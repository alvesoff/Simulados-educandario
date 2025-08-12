# Documentação de Desenvolvimento - Sistema de Questões

## Data: 2025

### Correção de Build - Migração para Dependências NPM (Janeiro 2025)

#### Problema Identificado
O build de produção estava falhanado com erros do Rollup:
- "Could not resolve entry module 'quill'"
- "Could not resolve entry module 'react-quill'"
- "Could not resolve entry module 'katex'"

#### Causa Raiz
O projeto estava usando bibliotecas via CDN (index.html) mas o Vite/Rollup tentava resolver essas dependências como módulos npm durante o build de produção.

#### Solução Implementada
1. **Instalação de Dependências NPM**:
   - `npm install quill` - Editor de texto rico
   - `npm install katex` - Biblioteca para fórmulas matemáticas

2. **Migração do QuillEditor.tsx**:
   - Removido uso de `window.Quill`
   - Adicionado import direto: `import Quill from 'quill'`
   - Adicionado import de estilos: `import 'quill/dist/quill.snow.css'`
   - Atualizado declarações globais para remover Quill

3. **Limpeza do index.html**:
   - Removido links CDN do Quill.js
   - Mantido apenas KaTeX e MathJax via CDN (para renderização)

4. **Correção do vite.config.ts**:
   - Removido 'react-quill' do manualChunks (não usado)
   - Mantido 'quill' e 'katex' no chunk 'editor'

#### Resultado
- ✅ Build de produção funcionando corretamente
- ✅ Funcionalidade do editor mantida
- ✅ Otimização de chunks preservada
- ✅ Compatibilidade com deploy mantida

---

### Funcionalidade Removida: Modal de Questão Personalizada (Janeiro 2025)

#### Motivo da Remoção
O sistema de questão personalizada foi removido por apresentar problemas de usabilidade e implementação. O usuário solicitou a remoção completa para implementar uma nova versão.

#### Arquivos Removidos
- `src/components/CustomQuestionModal.tsx` - Modal de criação de questões personalizadas
- `src/components/QuillEditor.tsx` - Componente de editor rico

#### Dependências Removidas do package.json
- `quill`: Editor de texto rico
- `react-quill`: Wrapper React para Quill.js
- `@types/quill`: Tipos TypeScript para Quill
- `katex`: Biblioteca para renderização de fórmulas matemáticas

#### Modificações em Arquivos Existentes
- `src/components/QuestionSelector.tsx`: Removido import, estado e botão de questão personalizada

---

### Funcionalidade Implementada Anteriormente: Modal de Questão Personalizada (REMOVIDA)

#### Objetivo
Implementar um botão "Questão Personalizada" no modal de seleção de questões que permite criar questões totalmente editáveis com editor rico (Quill.js), incluindo suporte a fórmulas matemáticas, formatação de texto, imagens e estrutura HTML completa.

#### Arquivos Criados/Modificados

##### 1. **CustomQuestionModal.tsx** (NOVO)
- **Localização**: `src/components/CustomQuestionModal.tsx`
- **Função**: Modal para criação de questões personalizadas
- **Características**:
  - Editor Quill.js com toolbar completo
  - Suporte a fórmulas matemáticas
  - Formatação rica de texto (negrito, itálico, cores, etc.)
  - Inserção de imagens
  - Estrutura de dados compatível com a API
  - Validação de formulário
  - Interface responsiva

##### 2. **QuestionSelector.tsx** (MODIFICADO)
- **Localização**: `src/components/QuestionSelector.tsx`
- **Modificações**:
  - Adicionado import do `CustomQuestionModal`
  - Adicionado import do ícone `PencilSquareIcon`
  - Adicionado estado `showCustomQuestionModal`
  - Adicionado botão "Questão Personalizada" no header
  - Integração do modal de questão personalizada

##### 3. **package.json** (MODIFICADO)
- **Dependências Adicionadas**:
  - `quill`: Editor de texto rico
  - `react-quill`: Wrapper React para Quill.js
  - `@types/quill`: Tipos TypeScript para Quill

#### Estrutura de Dados da Questão

```typescript
interface QuestionData {
  statement: string;              // Enunciado em HTML
  alternatives: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAnswer: string;          // Letra da resposta correta
  disciplina: string;             // Disciplina da questão
  anoEscolar: string;             // Ano escolar
  nivelDificuldade: string;       // Nível de dificuldade
  tags: string[];                 // Tags da questão
  has_math: boolean;              // Indica se contém matemática
}
```

#### Funcionalidades do Editor

1. **Toolbar Completo**:
   - Headers (H1-H6)
   - Fontes e tamanhos
   - Formatação (negrito, itálico, sublinhado, riscado)
   - Cores de texto e fundo
   - Sobrescrito e subscrito
   - Listas ordenadas e não ordenadas
   - Indentação
   - Alinhamento
   - Citações e blocos de código
   - Fórmulas matemáticas
   - Links e imagens

2. **Validação**:
   - Enunciado obrigatório
   - Pelo menos alternativas A e B obrigatórias
   - Disciplina obrigatória
   - Ano escolar obrigatório
   - Nível de dificuldade obrigatório

3. **Integração com API**:
   - Endpoint: `https://api-questao-1.onrender.com/api/v1/questoes`
   - Método: POST
   - Formato de dados compatível com a estrutura esperada

#### Interface do Usuário

1. **Botão de Acesso**:
   - Localizado no header do modal de seleção
   - Cor verde para diferenciação
   - Ícone de lápis para indicar criação

2. **Modal Responsivo**:
   - Layout adaptável para diferentes tamanhos de tela
   - Scroll interno para conteúdo extenso
   - Headers e footers fixos

3. **Campos de Metadados**:
   - Disciplinas pré-definidas
   - Anos escolares do 6º ano ao 3º ano EM
   - Níveis de dificuldade (Fácil, Médio, Difícil)
   - Sistema de tags flexível

#### Fluxo de Uso

1. Usuário clica em "Questão Personalizada" no modal de seleção
2. Modal de criação abre com formulário completo
3. Usuário preenche metadados da questão
4. Usuário cria enunciado usando editor rico
5. Usuário cria alternativas (A-E) usando editores ricos
6. Usuário seleciona resposta correta
7. Usuário define pontuação da questão
8. Sistema valida dados e envia para API
9. Questão é criada e automaticamente adicionada à prova
10. Modal fecha e usuário retorna à seleção

#### Considerações Técnicas

1. **Performance**:
   - Lazy loading do Quill.js
   - Otimização de re-renders
   - Validação em tempo real

2. **Acessibilidade**:
   - Labels apropriados
   - Navegação por teclado
   - Indicadores visuais de campos obrigatórios

3. **Responsividade**:
   - Grid system para metadados
   - Stacking em telas menores
   - Botões adaptáveis

#### Próximos Passos Sugeridos

1. **Melhorias de UX**:
   - Preview da questão antes de salvar
   - Salvamento como rascunho
   - Templates de questões

2. **Funcionalidades Avançadas**:
   - Upload de imagens local
   - Banco de imagens
   - Importação de questões

3. **Validações Adicionais**:
   - Verificação de duplicatas
   - Análise de qualidade da questão
   - Sugestões automáticas

#### Reflexão sobre Escalabilidade e Manutenibilidade

A implementação seguiu princípios de componentização e separação de responsabilidades. O `CustomQuestionModal` é um componente independente que pode ser reutilizado em outras partes do sistema. A integração com o `QuestionSelector` foi feita de forma não invasiva, mantendo a funcionalidade existente intacta.

O uso do Quill.js fornece uma base sólida para edição rica, com possibilidade de extensão através de plugins. A estrutura de dados foi projetada para ser compatível com a API existente, facilitando a integração.

Para futuras melhorias, recomenda-se:
- Criar um hook customizado para gerenciar o estado do editor
- Implementar um sistema de plugins para funcionalidades específicas
- Considerar a criação de um componente de editor reutilizável
- Implementar testes unitários para validação de dados

A arquitetura atual suporta bem a adição de novas funcionalidades sem quebrar o código existente, seguindo os princípios SOLID de desenvolvimento.

---

## Correção de Erros - KaTeX e ReactQuill

### Data: 2025

#### Problemas Identificados
1. **Erro KaTeX**: "Formula module requires KaTeX" - O Quill.js estava tentando usar fórmulas matemáticas sem a dependência KaTeX instalada
2. **Warning findDOMNode**: ReactQuill estava usando métodos deprecados do React
3. **Configuração inadequada**: Módulo de fórmulas não estava sendo inicializado corretamente

#### Soluções Implementadas

##### 1. **Instalação do KaTeX**
- Adicionada dependência: `npm install katex`
- Importação do CSS do KaTeX: `import 'katex/dist/katex.min.css'`

##### 2. **Criação do QuillEditor.tsx** (NOVO)
- **Localização**: `src/components/QuillEditor.tsx`
- **Função**: Wrapper para ReactQuill com configuração adequada do KaTeX
- **Características**:
  - Configuração global do KaTeX para o Quill
  - Encapsulamento da configuração de módulos e formatos
  - Interface limpa e reutilizável
  - Resolução dos warnings de findDOMNode

##### 3. **Refatoração do CustomQuestionModal.tsx**
- Substituição do ReactQuill direto pelo componente QuillEditor
- Remoção da configuração duplicada de módulos
- Simplificação do código e melhoria da manutenibilidade

#### Estrutura do QuillEditor

```typescript
interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
}
```

#### Benefícios da Refatoração

1. **Reutilização**: O QuillEditor pode ser usado em outros componentes
2. **Manutenibilidade**: Configuração centralizada do Quill
3. **Estabilidade**: Resolução dos erros de KaTeX e warnings
4. **Performance**: Otimização da inicialização do editor

#### Configuração KaTeX

- **Inicialização Global**: `(window as any).katex = katex;`
- **CSS Importado**: Estilos do KaTeX carregados corretamente
- **Módulos Suportados**: Fórmulas matemáticas funcionando sem erros

#### Status Atual

✅ **Erros Resolvidos**:
- Erro "Formula module requires KaTeX" corrigido
- Warnings de findDOMNode eliminados
- Dependências otimizadas pelo Vite

✅ **Funcionalidades Mantidas**:
- Editor rico totalmente funcional
- Suporte a fórmulas matemáticas
- Formatação completa de texto
- Interface responsiva

#### Reflexão sobre a Correção

A criação do componente QuillEditor seguiu o princípio de responsabilidade única, encapsulando toda a lógica de configuração do editor em um componente reutilizável. Isso não apenas resolveu os erros técnicos, mas também melhorou a arquitetura do código, facilitando futuras manutenções e extensões.

A abordagem de configuração global do KaTeX garante que o módulo esteja disponível para todas as instâncias do Quill, evitando problemas de inicialização. O componente wrapper também permite maior controle sobre o comportamento do editor e facilita a implementação de funcionalidades específicas no futuro.

Esta correção demonstra a importância de uma arquitetura bem estruturada, onde problemas podem ser resolvidos de forma elegante sem impactar o restante do sistema.

---

## Correção das Alternativas - Remoção da Alternativa E

### Data: 2025

#### Problema Identificado
O modal de questão personalizada estava configurado para 5 alternativas (A, B, C, D, E), mas o padrão do sistema deveria ser apenas 4 alternativas (A, B, C, D).

#### Solução Implementada

##### 1. **Atualização da Interface QuestionData**
- Removida a propriedade `E: string` da interface `alternatives`
- Mantidas apenas as alternativas A, B, C e D

##### 2. **Correção do Estado Inicial**
- Atualizado o `useState` para inicializar apenas 4 alternativas
- Removida a inicialização da alternativa E

##### 3. **Atualização da Renderização**
- Modificado o array de mapeamento de `['A', 'B', 'C', 'D', 'E']` para `['A', 'B', 'C', 'D']`
- Corrigida a função `handleSubmit` para processar apenas 4 alternativas

#### Arquivos Modificados

- **CustomQuestionModal.tsx**: Interface, estado inicial, renderização e lógica de submissão

#### Impacto da Correção

✅ **Benefícios**:
- Consistência com o padrão do sistema (4 alternativas)
- Interface mais limpa e organizada
- Redução de campos desnecessários
- Melhor experiência do usuário

✅ **Funcionalidades Mantidas**:
- Validação de formulário
- Detecção de conteúdo matemático
- Envio para API
- Integração com o sistema de provas

#### Reflexão sobre a Correção

A correção das alternativas foi uma melhoria importante para manter a consistência do sistema. A remoção da alternativa E não apenas corrigiu o problema reportado, mas também simplificou a interface e reduziu a complexidade desnecessária.

Esta mudança demonstra como pequenos ajustes podem ter um grande impacto na usabilidade e consistência do sistema. A abordagem sistemática de atualizar a interface, o estado, a renderização e a lógica de processamento garante que a correção seja completa e não introduza novos bugs.

O sistema agora está alinhado com o padrão de 4 alternativas, proporcionando uma experiência mais consistente para os usuários que criam questões personalizadas.

---

## Remoção da Seção "Pontos da Questão"

### Data: 2025

#### Problema Identificado
O usuário solicitou a remoção da seção "Pontos da Questão" do modal de questão personalizada, simplificando a interface.

#### Solução Implementada

##### 1. **Remoção do Estado `points`**
- Removido o estado `const [points, setPoints] = useState<number>(1);`
- Eliminada a necessidade de gerenciar pontos manualmente

##### 2. **Remoção da Interface de Pontos**
- Removida toda a seção HTML que continha:
  - Label "Pontos da Questão"
  - Input numérico para definir pontos
  - Validações de min/max (0.5-10)

##### 3. **Ajuste da Função de Submissão**
- Modificada a chamada `onAddQuestion(questionForTest.id, points, questionForTest)`
- Alterada para `onAddQuestion(questionForTest.id, 1, questionForTest)`
- Valor padrão fixo de 1 ponto para todas as questões personalizadas

#### Arquivos Modificados

- **CustomQuestionModal.tsx**: Remoção do estado, interface e ajuste da lógica

#### Impacto da Remoção

✅ **Benefícios**:
- Interface mais limpa e simplificada
- Menos campos para o usuário preencher
- Foco nas informações essenciais da questão
- Redução da complexidade do formulário

✅ **Funcionalidades Mantidas**:
- Criação de questões personalizadas
- Validação de formulário
- Integração com a API
- Adição automática à prova

#### Comportamento Atual

- **Pontos Padrão**: Todas as questões personalizadas recebem automaticamente 1 ponto
- **Simplicidade**: Interface focada no conteúdo da questão (enunciado, alternativas, metadados)
- **Consistência**: Comportamento uniforme para questões personalizadas

#### Reflexão sobre a Remoção

A remoção da seção "Pontos da Questão" representa uma simplificação bem-sucedida da interface. Esta mudança elimina uma etapa desnecessária no processo de criação de questões, permitindo que os usuários se concentrem no conteúdo educacional em vez de configurações técnicas.

A decisão de fixar o valor em 1 ponto é pragmática e mantém a funcionalidade essencial sem sobrecarregar a interface. Se no futuro houver necessidade de pontuação variável, esta funcionalidade pode ser facilmente reintroduzida como uma configuração avançada ou opcional.

Esta mudança demonstra a importância de ouvir o feedback dos usuários e adaptar a interface para melhorar a experiência de uso, removendo complexidade desnecessária quando possível.

---

## Implementação do Filtro por Tags com Autocomplete

### Data: 2025

#### Problema Identificado
O usuário solicitou a adição de um campo de filtro por tags no formulário de seleção de questões, e posteriormente pediu para implementar um campo digitável com autocomplete similar aos outros formulários.

#### Solução Implementada

##### 1. **Atualização do Service**
- Adicionado o parâmetro `tags` na interface `ExternalQuestionFilters`
- Criada função `getTags()` no `externalQuestionService` para buscar todas as tags disponíveis
- Atualizada a função `getQuestions` para incluir o parâmetro tags na requisição à API

##### 2. **Implementação do Autocomplete**
- Adicionado campo de input com autocomplete no componente `QuestionSelector`:
  - Estado para armazenar tags disponíveis (`availableTags`)
  - Estado para tags filtradas (`filteredTags`)
  - Estado para controlar visibilidade do dropdown (`showTagDropdown`)
  - Funções para lidar com seleção, foco e blur do input
  - Dropdown com máximo de 10 sugestões
  - Filtragem em tempo real baseada no texto digitado

##### 3. **Ajustes de Layout**
- Ajustado o grid de filtros para acomodar 5 campos (lg:grid-cols-5)
- Incluído o campo tags na função de limpar filtros

#### Arquivos Modificados

- **externalQuestionService.ts**: Adição da função `getTags()` e parâmetro tags na requisição
- **QuestionSelector.tsx**: Implementação completa do campo de tags com autocomplete

#### Funcionalidades do Autocomplete

1. **Busca Dinâmica**: Filtragem em tempo real conforme o usuário digita
2. **Dropdown Inteligente**: Mostra/esconde baseado no foco e seleção
3. **Limite de Sugestões**: Máximo de 10 itens para melhor performance
4. **Seleção por Clique**: Permite selecionar tags do dropdown
5. **Integração com Filtros**: Funciona em conjunto com outros filtros

#### Impacto da Implementação

✅ **Benefícios**:
- Experiência de usuário melhorada com autocomplete
- Maior capacidade de filtragem das questões
- Melhor organização e busca por temas específicos
- Interface consistente com padrões modernos de UX
- Aproveitamento completo dos recursos da API externa
- Redução de erros de digitação através das sugestões

✅ **Funcionalidades Mantidas**:
- Todos os filtros existentes continuam funcionando
- Performance otimizada da busca
- Interface responsiva

#### Reflexão sobre a Implementação

A implementação do filtro por tags com autocomplete representa uma melhoria significativa na usabilidade do sistema. O autocomplete não apenas facilita a descoberta de tags disponíveis, mas também reduz erros de digitação e melhora a eficiência na busca por questões específicas.

A abordagem de carregar todas as tags disponíveis e filtrar localmente garante uma resposta rápida ao usuário, enquanto a integração com a API existente mantém a consistência dos dados. O limite de 10 sugestões no dropdown equilibra funcionalidade e performance.

Esta implementação demonstra como pequenas melhorias na interface podem ter um grande impacto na experiência do usuário, especialmente em sistemas com grandes volumes de dados como bancos de questões.

---

## Correção da Duplicação da Barra de Ferramentas do Quill.js

### Data: 2025

#### Problema Identificado
O componente QuillEditor estava criando múltiplas barras de ferramentas devido à reinicialização do componente e à criação automática de toolbar pelo Quill.js.

#### Solução Implementada

##### 1. **Implementação de Toolbar Customizada**
- Criado container específico para a toolbar com HTML explícito
- Configurado Quill para usar o container customizado em vez de criar automaticamente
- Adicionados estilos CSS específicos para a toolbar customizada

##### 2. **Controle Total da Renderização**
- Eliminada a criação automática de toolbar pelo Quill
- Implementado controle manual da estrutura da interface
- Mantido cleanup adequado dos event listeners e instância do Quill

#### Arquivos Modificados

- **QuillEditor.tsx**: Implementação de toolbar customizada com controle total

#### Impacto da Correção

✅ **Benefícios**:
- Eliminação completa da duplicação de barras de ferramentas
- Controle total sobre a renderização da interface
- Melhor estabilidade do componente durante atualizações
- Interface mais limpa e consistente

✅ **Funcionalidades Mantidas**:
- Todas as funcionalidades do editor rico
- Suporte completo a fórmulas matemáticas
- Formatação de texto avançada
- Responsividade da interface

#### Reflexão sobre a Correção

A resolução da duplicação da toolbar representa uma melhoria técnica importante que impacta diretamente a experiência do usuário. A implementação de uma toolbar customizada não apenas resolve o problema específico, mas também fornece maior controle sobre a interface, permitindo futuras customizações e melhorias.

Esta correção demonstra a importância de ter controle total sobre componentes de terceiros, especialmente quando se trata de elementos visuais críticos da interface. A abordagem de toolbar customizada garante consistência e estabilidade, elementos essenciais para uma boa experiência do usuário.

---

## Status Atual do Projeto

✅ **Concluído:**
- Estrutura base do projeto React + TypeScript + Vite
- Configuração do Tailwind CSS
- Integração do Quill.js para editor WYSIWYG
- Integração do KaTeX para renderização de fórmulas matemáticas
- Correção do erro "Formula module requires KaTeX"
- **Resolução completa da duplicação de barras de ferramentas**
- Implementação de toolbar customizada com controle total
- Suporte completo a LaTeX no editor
- Interface responsiva e moderna
- Documentação atualizada