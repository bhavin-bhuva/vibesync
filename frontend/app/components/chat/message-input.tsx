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
  const [showToolbar, setShowToolbar] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Message @Friend...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-500 before:float-left before:pointer-events-none',
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        // Force single line feel by removing P margins
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[40px] px-4 py-2 max-h-[200px] overflow-y-auto [&_p]:m-0',
      },
    },
    // Ensure we trigger re-render on updates so button state changes
    onUpdate: ({ editor }) => {
        // We can force update if needed, but wait, editor.isEmpty is a property access.
        // It relies on React state change to re-render component.
        // useEditor doesn't re-render component on every keystroke by default?
        // Actually it usually does if we access state, but let's be sure.
        // We can just set a dummy state.
        setShowToolbar(prev => prev); // Hack trigger? No.
        // Proper way:
    },
  });

  // Force re-render when editor content changes to update disabled state of button
  const [content, setContent] = useState("");
  useEffect(() => {
      if (!editor) return;
      
      const updateHandler = () => {
          setContent(editor.getHTML());
      };
      
      editor.on('update', updateHandler);
      
      return () => {
          editor.off('update', updateHandler);
      };
  }, [editor]);

  const handleSendMessage = () => {
    if (editor && !editor.isEmpty) {
        let html = editor.getHTML();
        // Remove empty P tags if any at start/end to clean up
        // Or just send.
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
    <div className="p-4 border-t border-gray-200 dark:border-white/10 glass-dark">
      <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-purple-500 transition-colors shadow-sm relative flex flex-col">
          
          <div className="editor-container"
               onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage();
                   }
               }}
          >
              <EditorContent editor={editor} />
          </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between px-2 pb-2 mt-1 border-gray-200/50 dark:border-white/5 pt-1">
            <div className="flex items-center gap-1">
                {/* Attach Button */}
                <button 
                    onClick={handleAttachmentClick} 
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400" 
                    title="Attach"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>

                {/* Format Toggle */}
                <button 
                    onClick={() => setShowToolbar(!showToolbar)} 
                    className={`p-1.5 rounded-lg transition-colors ${showToolbar ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                    title="Format Text"
                >
                    <span className="font-bold font-serif text-sm">Aa</span>
                </button>
            </div>

            {/* Send Button */}
             <button
                onClick={handleSendMessage}
                disabled={editor.isEmpty}
                className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all w-9 h-9 flex items-center justify-center transform"
              >
                <svg className="w-4 h-4 translate-x-0.5 translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
        </div>

        {/* Collapsible Format Toolbar */}
        {showToolbar && (
             <div className="flex items-center gap-1 px-3 pb-2 border-t border-gray-200/50 dark:border-white/5 pt-2 animate-fade-in-down">
                <button 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 font-bold ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-white/20 text-purple-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >B</button>
                <button 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 italic font-serif ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-white/20 text-purple-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >I</button>
                <button 
                    onClick={() => editor.chain().focus().toggleStrike().run()} 
                    className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 line-through ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-white/20 text-purple-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >S</button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1"></div>
                <button 
                    onClick={() => editor.chain().focus().toggleCode().run()} 
                    className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 font-mono text-sm ${editor.isActive('code') ? 'bg-gray-200 dark:bg-white/20 text-purple-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >&lt;/&gt;</button>
                <button 
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-white/20 text-purple-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
             </div>
        )}
      </div>
    </div>
  );
}
