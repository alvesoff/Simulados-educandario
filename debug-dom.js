// Script para debugar as barras de ferramentas duplicadas
console.log('=== DEBUG: Analisando barras de ferramentas do Quill ===');

// Encontrar todas as barras de ferramentas
const toolbars = document.querySelectorAll('.ql-toolbar');
console.log(`Total de barras de ferramentas encontradas: ${toolbars.length}`);

toolbars.forEach((toolbar, index) => {
  console.log(`\n--- Toolbar ${index + 1} ---`);
  console.log('Element:', toolbar);
  console.log('Parent:', toolbar.parentElement);
  console.log('Classes:', toolbar.className);
  console.log('Data attributes:', [...toolbar.attributes].filter(attr => attr.name.startsWith('data-')));
  console.log('Siblings:', toolbar.parentElement?.children);
  
  // Verificar se tem editor associado
  const container = toolbar.closest('.quill-editor-container');
  const editor = container?.querySelector('.ql-editor');
  console.log('Container:', container);
  console.log('Editor associado:', editor);
  
  // Verificar se os botões funcionam
  const buttons = toolbar.querySelectorAll('button');
  console.log(`Botões encontrados: ${buttons.length}`);
  
  // Testar se o primeiro botão responde a cliques
  if (buttons[0]) {
    console.log('Primeiro botão:', buttons[0]);
    console.log('Primeiro botão tem event listeners:', getEventListeners ? getEventListeners(buttons[0]) : 'N/A');
  }
});

// Verificar instâncias do Quill
if (window.Quill) {
  console.log('\n=== Instâncias do Quill ===');
  const quillInstances = document.querySelectorAll('[data-quill-initialized]');
  console.log(`Elementos com data-quill-initialized: ${quillInstances.length}`);
  
  quillInstances.forEach((element, index) => {
    console.log(`Instância ${index + 1}:`, element);
    console.log('Valor do atributo:', element.getAttribute('data-quill-initialized'));
  });
}

console.log('=== FIM DEBUG ===');