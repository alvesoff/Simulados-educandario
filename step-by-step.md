# Documentação do Projeto - Sistema de Simulados EducaSmart

## Visão Geral
Sistema web para criação e gerenciamento de simulados educacionais com suporte a questões personalizadas, editor WYSIWYG e renderização de fórmulas matemáticas.

## Tecnologias Utilizadas
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Editor**: Quill.js v1.3.6 (tema Snow)
- **Matemática**: MathJax v3
- **Ícones**: Heroicons
- **Notificações**: React Hot Toast

## Estrutura do Projeto

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── QuestionSelector.tsx     # Seletor principal de questões
│   ├── CreateQuestionModal.tsx  # Modal para criação de questões
│   └── QuillEditor.tsx         # Editor WYSIWYG personalizado
├── styles/
│   └── quill-custom.css        # Estilos personalizados para Quill
├── main.tsx                    # Ponto de entrada da aplicação
└── index.css                   # Estilos globais
```

## Funcionalidades Implementadas

### 1. Sistema de Criação de Questões
**Arquivo**: `CreateQuestionModal.tsx`
- Modal responsivo para criação de questões personalizadas
- Formulário completo com validação
- Integração com API externa
- Sistema de tags dinâmico
- Detecção automática de fórmulas matemáticas

**Campos disponíveis**:
- Enunciado (editor WYSIWYG)
- 4 alternativas (editores WYSIWYG)
- Seleção da resposta correta
- Disciplina (seletor)
- Ano escolar (1º ao 12º ano)
- Nível de dificuldade (Fácil, Médio, Difícil)
- Tags personalizadas
- Detecção automática de conteúdo matemático

### 2. Editor WYSIWYG com Quill.js
**Arquivo**: `QuillEditor.tsx`
- Editor rico de texto com tema Snow
- Toolbar personalizada com funcionalidades essenciais
- Suporte completo a LaTeX/MathJax
- Responsivo para dispositivos móveis
- Integração automática com MathJax para renderização

**Funcionalidades do Editor**:
- **Cabeçalhos**: H1, H2, H3
- **Formatação básica**: Negrito, Itálico, Sublinhado, Riscado
- **Listas**: Numeradas e com marcadores
- **Links**: Inserção de hyperlinks
- **Imagens**: Upload e redimensionamento
- **Fórmulas**: Integração com LaTeX/MathJax
- **Limpeza**: Remover formatação

### 3. Renderização de Fórmulas Matemáticas
**Biblioteca**: MathJax v3
- Suporte completo a LaTeX e MathML
- Renderização automática após inserção
- Configuração otimizada para editores
- Suporte a fórmulas inline (`$formula$`) e em bloco (`$$formula$$`)

### 4. Integração com APIs
**Endpoint**: `https://api-questao-1.onrender.com/api/v1/questoes`
- Criação de questões via POST
- Tratamento de erros e feedback visual
- Recarregamento automático da lista após criação

## Bibliotecas Externas Integradas

### CDNs Adicionados (`index.html`)
```html
<!-- KaTeX para fórmulas matemáticas (requerido pelo Quill) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>

<!-- Quill.js Editor WYSIWYG -->
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>

<!-- MathJax para renderização de fórmulas matemáticas -->
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

## Estilos Personalizados

### Arquivo: `quill-custom.css`
- Estilos otimizados para editores de enunciado e alternativas
- Responsividade para dispositivos móveis
- Melhorias visuais na toolbar
- Estilização de fórmulas matemáticas
- Ajustes de altura para diferentes contextos

## Detecção Automática de Matemática

### Função: `detectMath()`
Detecta automaticamente a presença de fórmulas matemáticas no conteúdo:
- Sintaxe LaTeX: `$formula$`, `$$formula$$`
- Elementos Quill: `<span class="ql-formula">`
- Notação matemática padrão
- Atualiza automaticamente o flag `has_math`

## Responsividade

### Breakpoints Implementados
- **Desktop**: Layout completo com editores em tamanho normal
- **Tablet**: Ajustes de espaçamento e tamanho de fonte
- **Mobile**: Editores compactos, toolbar simplificada

## Melhorias de UX

### Feedback Visual
- Indicador de fórmulas matemáticas detectadas
- Dicas de uso do editor LaTeX
- Notificações de sucesso/erro
- Loading states durante submissão

### Acessibilidade
- Labels apropriados para todos os campos
- Navegação por teclado
- Contraste adequado
- Textos alternativos

## Correções e Melhorias

### Erro KaTeX Resolvido
**Problema**: O Quill.js apresentava erro "Formula module requires KaTeX" ao tentar usar o módulo de fórmulas.

**Solução**: Adicionado KaTeX v0.16.8 como dependência antes do Quill.js:
- CSS: `https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css`
- JS: `https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js`

**Resultado**: Editor de fórmulas funcionando corretamente com renderização LaTeX.

### Duplicação da Barra de Ferramentas
**Problema**: Múltiplas barras de ferramentas do Quill aparecendo devido à reinicialização do componente.

**Solução**: 
- Adicionado verificação de inicialização com atributo `data-quill-initialized`
- Implementado cleanup adequado dos listeners e instâncias do Quill
- Limpeza do container do editor no cleanup

**Resultado**: Apenas uma barra de ferramentas por editor, funcionamento correto.

## Status do Projeto
✅ **Concluído**: Sistema de criação de questões com editor WYSIWYG
✅ **Concluído**: Integração Quill.js + MathJax + KaTeX
✅ **Concluído**: Interface responsiva e moderna
✅ **Concluído**: Validação e tratamento de erros
✅ **Concluído**: Estilos personalizados e otimizados
✅ **Concluído**: Correção de dependências e erros
✅ **Concluído**: Prevenção de duplicação de barras de ferramentas

## Próximos Passos Sugeridos
- [ ] Implementar preview das questões criadas
- [ ] Adicionar sistema de upload de imagens
- [ ] Implementar busca e filtros avançados
- [ ] Adicionar sistema de categorização
- [ ] Implementar exportação de questões

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0
**Desenvolvedor**: Assistente IA - Engenheiro de Software Sênior