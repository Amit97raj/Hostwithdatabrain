'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Eraser,
  Code2,
  Eye,
  Clock,
  Sparkles
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onApplyReadingTime?: (readingTime: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your long article description here...',
  onApplyReadingTime
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [internalHtml, setInternalHtml] = useState(value || '');

  // Keep internal state in sync with external value if changed externally
  useEffect(() => {
    if (value !== internalHtml) {
      setInternalHtml(value || '');
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Synchronize when switching back to visual mode
  useEffect(() => {
    if (mode === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = internalHtml;
    }
  }, [mode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      onChange(html);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInternalHtml(val);
    onChange(val);
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (mode !== 'visual') setMode('visual');
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand(command, false, arg);
        handleInput();
      }
    }, 10);
  };

  const insertLink = () => {
    const url = prompt('Enter URL link (e.g. https://example.com):');
    if (url) {
      exec('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL (e.g. https://images.unsplash.com/...):');
    if (url) {
      exec('insertImage', url);
    }
  };

  const insertCodeBlock = () => {
    if (mode !== 'visual') setMode('visual');
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        const codeSample = prompt('Enter code snippet:', 'console.log("Hello from DataBrain Cloud!");');
        if (codeSample !== null) {
          const pre = `<pre><code>${codeSample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre><p><br></p>`;
          document.execCommand('insertHTML', false, pre);
          handleInput();
        }
      }
    }, 10);
  };

  // Word count & reading time calculation
  const textContent = internalHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent ? textContent.split(' ').length : 0;
  const estimatedMin = Math.max(1, Math.ceil(wordCount / 180));
  const estimatedReadingTime = `${estimatedMin} min read`;

  return (
    <div className="rich-editor-box">
      <div className="rich-editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('strikeThrough')}
            title="Strikethrough"
          >
            <Strikethrough />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className="editor-btn editor-btn-text"
            onClick={() => exec('formatBlock', '<h2>')}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className="editor-btn editor-btn-text"
            onClick={() => exec('formatBlock', '<h3>')}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            className="editor-btn editor-btn-text"
            onClick={() => exec('formatBlock', '<p>')}
            title="Paragraph"
          >
            P
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('insertUnorderedList')}
            title="Bullet list"
          >
            <List />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('insertOrderedList')}
            title="Numbered list"
          >
            <ListOrdered />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('formatBlock', '<blockquote>')}
            title="Blockquote"
          >
            <Quote />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={insertCodeBlock}
            title="Code Block"
          >
            <Code />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className="editor-btn"
            onClick={insertLink}
            title="Insert Link"
          >
            <LinkIcon />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={insertImage}
            title="Insert Image URL"
          >
            <ImageIcon />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('insertHorizontalRule')}
            title="Horizontal Divider"
          >
            <Minus />
          </button>
          <button
            type="button"
            className="editor-btn"
            onClick={() => exec('removeFormat')}
            title="Clear Formatting"
          >
            <Eraser />
          </button>
        </div>

        <div className="toolbar-mode-switch">
          <button
            type="button"
            className={`mode-btn ${mode === 'visual' ? 'active' : ''}`}
            onClick={() => setMode('visual')}
          >
            Visual
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'code' ? 'active' : ''}`}
            onClick={() => setMode('code')}
          >
            <Code2 size={12} /> HTML
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => setMode('preview')}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
      </div>

      {mode === 'visual' && (
        <div
          ref={editorRef}
          className="rich-editor-canvas"
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      )}

      {mode === 'code' && (
        <textarea
          className="rich-editor-html"
          value={internalHtml}
          onChange={handleCodeChange}
          placeholder="<p>Write raw HTML content here...</p>"
          rows={12}
        />
      )}

      {mode === 'preview' && (
        <div className="rich-editor-canvas article-rich-content">
          {internalHtml ? (
            <div dangerouslySetInnerHTML={{ __html: internalHtml }} />
          ) : (
            <p style={{ color: '#9bb0b8', fontStyle: 'italic' }}>
              No content yet. Type something in Visual or HTML mode to see a live preview.
            </p>
          )}
        </div>
      )}

      <div className="rich-editor-footer">
        <div className="editor-stats">
          <span>
            <strong>{wordCount}</strong> words
          </span>
          <span>
            <Clock /> ~{estimatedReadingTime}
          </span>
        </div>

        {onApplyReadingTime && (
          <button
            type="button"
            className="auto-calc-btn"
            onClick={() => onApplyReadingTime(estimatedReadingTime)}
            title="Auto-fill the Reading Time field with this estimate"
          >
            <Sparkles size={11} /> Apply "{estimatedReadingTime}" to post
          </button>
        )}
      </div>
    </div>
  );
}
