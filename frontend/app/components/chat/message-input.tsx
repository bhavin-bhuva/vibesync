import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useRef, useState, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Force re-render on update
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start Typing...",
        // Use absolute positioning for placeholder to fix cursor position issue
        emptyEditorClass: 'is-editor-empty relative before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:left-0 before:top-0 before:pointer-events-none before:h-0',
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        // Enforce no outline/border to prevent dual highlighting
        class: 'prose prose-sm dark:prose-invert max-w-none !outline-none !border-none !ring-0 focus:outline-none focus:ring-0 focus:border-none min-h-[40px] px-2 py-2.5 max-h-[200px] overflow-y-auto [&_p]:m-0',
      },
    },
    onUpdate: ({ editor }) => {
       setContent(editor.getHTML());
    }
  });

  const handleSendMessage = () => {
    if (editor && !editor.isEmpty) {
        let html = editor.getHTML();
        onSendMessage(html);
        editor.commands.clearContent();
    }
  };

  const handleAttachmentClick = () => {
     fileInputRef.current?.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 border-t border-gray-200 dark:border-white/10 glass-dark">
      <div className={`bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[24px] focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all shadow-sm relative flex flex-col ${isExpanded ? 'ring-1 ring-purple-500/20 border-purple-500/30' : ''}`}>
          
          {/* Top Row: Plus, Editor, Send */}
          <div className="flex items-end gap-2 p-2">
            
            {/* Plus Toggle */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className={`flex-shrink-0 h-10 w-10 rounded-full transition-all duration-300 flex items-center justify-center ${isExpanded ? 'bg-gray-100 dark:bg-white/10 rotate-45 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                title={isExpanded ? "Close options" : "More options"}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>

            {/* Input Area */}
            <div className="flex-1 min-w-0">
                <div className="editor-container relative"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                >
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Send Button */}
             <button
                onClick={handleSendMessage}
                disabled={editor.isEmpty}
                className="flex-shrink-0 h-10 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all flex items-center gap-2"
              >
                <span className="hidden sm:inline text-sm font-medium">Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
          </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        {/* Collapsible Format Toolbar */}
        {isExpanded && (
             <div className="flex items-center gap-1 px-3 pb-2 border-t border-gray-100 dark:border-white/5 pt-2 animate-fade-in-down origin-top">
                
                {/* File Attachment */}
                <button 
                  onClick={handleAttachmentClick} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                  title="Attach File"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-2"></div>

                {/* Direct Formatting Tools */}
                <button 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 font-bold ${editor.isActive('bold') ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    title="Bold"
                >B</button>
                <button 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 italic font-serif ${editor.isActive('italic') ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    title="Italic"
                >I</button>
                <button 
                    onClick={() => editor.chain().focus().toggleStrike().run()} 
                    className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 line-through ${editor.isActive('strike') ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    title="Strikethrough"
                >S</button>
                <button 
                    onClick={() => editor.chain().focus().toggleCode().run()} 
                    className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 font-mono text-sm ${editor.isActive('code') ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    title="Code"
                >&lt;/&gt;</button>
                <button 
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 ${editor.isActive('bulletList') ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    title="List"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
             </div>
        )}
      </div>
    </div>
  );
}
