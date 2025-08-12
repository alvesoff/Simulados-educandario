import React from 'react';
import DOMPurify from 'dompurify';
import '../styles/safe-html.css';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ 
  html, 
  className = '', 
  tag: Tag = 'div' 
}) => {
  // Configuração do DOMPurify para permitir imagens base64 e formatação
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'sub', 'sup', 'mark', 'del', 'ins'
    ],
    ALLOWED_ATTR: [
      'src', 'alt', 'title', 'width', 'height', 'style',
      'class', 'id', 'data-*'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  return (
    <Tag 
      className={`safe-html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default SafeHtmlRenderer;