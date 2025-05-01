import './styles.scss'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, EditorProvider, useCurrentEditor, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faCircle, faCode, faFileCode, faItalic, faListOl, faListUl, faQuoteLeft, faUnderline } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef } from 'react'
import { insertBeforeLastClosingTag } from '~/utils/utils'


export function TextFormatSelector({ editor }: Route.ComponentProps) {
  const handleChange = (e: Event) => {
    const value = e.target.value;
    editor.chain().focus();

    switch (value) {
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "h4":
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case "h5":
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case "h6":
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      default:
        break;
    }
  };

  return (
    <select
      onChange={handleChange}
      value={
        editor.isActive('paragraph') ? 'paragraph'
          : editor.isActive('heading', { level: 1 }) ? 'h1'
            : editor.isActive('heading', { level: 2 }) ? 'h2'
              : editor.isActive('heading', { level: 3 }) ? 'h3'
                : editor.isActive('heading', { level: 4 }) ? 'h4'
                  : editor.isActive('heading', { level: 5 }) ? 'h5'
                    : editor.isActive('heading', { level: 6 }) ? 'h6' : 'paragraph'
      }
      className="outline-none p-2 bg-primary dark:bg-primary"
    >
      <option value="paragraph">Paragraph</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
      <option value="h4">H4</option>
      <option value="h5">H5</option>
      <option value="h6">H6</option>
    </select>
  );
}

function MenuBarToggleButton({ onClick, disabled, isActive, children }: Route.ComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${isActive ? 'text-onSurfaceActive dark:text-onSurfaceActive' : 'text-onSurface dark:text-onSurface'} p-1 mx-1 cursor-pointer hover:text-onSurfaceActive dark:hover:text-onSurfaceActive`}
    >
      {children}
    </button>
  )
}

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-toolbar border-b border-separator py-2">
      <div className="button-group flex items-center gap-4">
        <TextFormatSelector editor={editor} />

        <div>
          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            isActive={editor.isActive('bold')}
          >
            <FontAwesomeIcon icon={faBold} />
          </MenuBarToggleButton>

          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            isActive={editor.isActive('italic')}
          >
            <FontAwesomeIcon icon={faItalic} />
          </MenuBarToggleButton>

          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleUnderline()
                .run()
            }
            isActive={editor.isActive('underline')}
          >
            <FontAwesomeIcon icon={faUnderline} />
          </MenuBarToggleButton>

        </div>

        <div>
          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <FontAwesomeIcon icon={faListUl} />
          </MenuBarToggleButton>

          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <FontAwesomeIcon icon={faListOl} />
          </MenuBarToggleButton>
        </div>

        <div>
          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            isActive={editor.isActive('code')}
          >
            <FontAwesomeIcon icon={faCode} />
          </MenuBarToggleButton>

          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          >
            <FontAwesomeIcon icon={faFileCode} />
          </MenuBarToggleButton>

          <MenuBarToggleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <FontAwesomeIcon icon={faQuoteLeft} />
          </MenuBarToggleButton>
        </div>

      </div>
    </div>
  )
}

const extensions = [
  Underline,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

function TextEditorContentUpdater({ content }) {
  const { editor } = useCurrentEditor()

  useEffect(() => {
    document.getElementById('suggestionText')?.remove()
    editor?.commands.setContent(content)
  }, [content])

  return null
}

export default function TextEditor({ content, suggestion, onChange, onLastCharacterChange, onSuggestionAccept }) {
  const editorContainerRef = useRef(null)
  const ghostContainerRef = useRef(null)
  const ghostContainerContentRef = useRef(null)


  useEffect(() => {
    function resizeGhostContainer() {
      if (editorContainerRef.current && ghostContainerRef.current) {
        console.log('yes  ')
        const { top, right, bottom, left, width, height } = editorContainerRef.current.getBoundingClientRect()
        ghostContainerRef.current.style.top = top + 'px'
        ghostContainerRef.current.style.right = right + 'px'
        ghostContainerRef.current.style.bottom = bottom + 'px'
        ghostContainerRef.current.style.left = left + 'px'

        ghostContainerRef.current.style.width = width + 'px'
        ghostContainerRef.current.style.height = height + 'px'

        ghostContainerRef.current.style.paddingTop = '1rem'
      }
    }

    const observer = new ResizeObserver(resizeGhostContainer)
    if (editorContainerRef.current && ghostContainerRef.current) {
      observer.observe(editorContainerRef.current)

      // window.addEventListener('resize', resizeGhostContainer)
    }

    return () => {
      editorContainerRef.current && observer.disconnect(editorContainerRef.current)
      // window.removeEventListener('resize', resizeGhostContainer)
    }
  }, [editorContainerRef.current, ghostContainerRef.current])

  useEffect(()=>{
    if(ghostContainerContentRef.current) {
      ghostContainerContentRef.current.innerHTML = content
    }
  }, [])

  useEffect(()=>{
    document.getElementById('suggestionText')?.remove()
    if(ghostContainerContentRef.current) {
      const contentLastChar = ghostContainerContentRef.current.lastChild.innerHTML.slice(-1)
      const isSpace = contentLastChar===' '
      const isNewLine = contentLastChar===''
      const suggestionElement = `<span id="suggestionText" style="opacity: 0.6;">${(!isSpace && !isNewLine) ? ' ' : ''}${suggestion}</span>`
      ghostContainerContentRef.current.innerHTML = insertBeforeLastClosingTag(ghostContainerContentRef.current.innerHTML, suggestionElement)
    }
  }, [suggestion])

  const handleEditorKeydown = useCallback((view, e) => {
    const key = e.key

    if(key==='Tab') {
      e.preventDefault()

      const ele = e.currentTarget

      const contentLastChar = ele.lastChild.innerHTML.slice(-1)
      const isSpace = contentLastChar===' '
      const isNewLine = contentLastChar===''
      ele.innerHTML = insertBeforeLastClosingTag(ele.innerHTML, `${(!isSpace && !isNewLine) ? ' ' : ''}${suggestion}`)
      console.log(ele.innerHTML)

      const range = document.createRange();
      const selection = window.getSelection();
      
      range.selectNodeContents(ele);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      onChange(ele.innerHTML)

      onSuggestionAccept()
    }
  }, [suggestion])

  return (
    <>
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          ghostContainerContentRef.current.innerHTML = editor.getHTML()
          onChange(editor.getHTML())
        }}
        onTransaction={({ editor, transaction }) => {
          // transaction.docChanged
          if (editor.state.selection.empty) {
            const cursorPos = editor.state.selection.from
            const docEnd = editor.state.doc.content.size
            if((cursorPos===docEnd-1) && (editor.isFocused)) {
              console.log('yesahh')
              onLastCharacterChange(editor.getText())
            }
          }
        }}
        immediatelyRender={false}
        editorContainerProps={{
          className: 'overflow-auto whitespace-pre-wrap break-words max-h-full',
          ref: editorContainerRef
        }}
        editorProps={{
          handleKeyDown: handleEditorKeydown
        }}
      >
        <TextEditorContentUpdater content={content} />
      </EditorProvider>

      <div ref={ghostContainerRef} className='tiptap absolute -z-10'>
        <span
          ref={ghostContainerContentRef}
        >
        </span>
      </div>
    </>
  )
}