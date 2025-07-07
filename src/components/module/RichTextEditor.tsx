import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline,
  List, 
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ content, onChange, placeholder, className }: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 border rounded-md',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageDialogOpen(false);
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    disabled = false 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="border rounded-t-md p-2 bg-gray-50 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Links and Images */}
        <div className="flex gap-1">
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Lien</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addLink} disabled={!linkUrl}>
                    Ajouter le Lien
                  </Button>
                  <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">URL de l'Image</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addImage} disabled={!imageUrl}>
                    Ajouter l'Image
                  </Button>
                  <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-t-0 rounded-b-md">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
        />
      </div>
      
      {/* Word Count */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{editor.storage.characterCount?.characters() || 0} caractères</span>
        <span>{editor.storage.characterCount?.words() || 0} mots</span>
      </div>
    </div>
  );
};

export default RichTextEditor;