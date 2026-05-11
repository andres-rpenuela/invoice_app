import {
  Component,
  Input,
  OnDestroy,
  forwardRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';

import 'emoji-picker-element';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'form-input-tiptap',
  templateUrl: './form-input-tip-tap.component.html',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputTiptapComponent),
      multi: true
    }
  ]
})
export class FormInputTiptapComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild('editorEl', { static: false })
  editorEl!: ElementRef;

  @Input() placeholder = 'Escribe aquí...';

  editor!: Editor;

  private pendingValue: string | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  showEmojiPicker = false;

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorEl.nativeElement,

      extensions: [
        StarterKit,
        Underline,
        TaskList,
        TaskItem,
        Link.configure({
          openOnClick: true,
        }),
      ],

      content: this.sanitize(this.pendingValue || '<p></p>'),

      onUpdate: ({ editor }) => {
        this.onChange(editor.getHTML());
      }
    });

    if (this.pendingValue) {
      this.editor.commands.setContent(
        this.sanitize(this.pendingValue)
      );
      this.pendingValue = null;
    }
  }

  addEmoji(event: any) {

    const emoji =
      event?.detail?.unicode ||
      event?.detail?.emoji;

    if (!emoji) return;

    this.editor
      ?.chain()
      .focus()
      .insertContent(emoji)
      .run();

    // cerrar popup
    this.showEmojiPicker = false;
  }

  // cerrar al hacer click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {

    const path = event.composedPath();

    const clickedInside = path.some((el: any) =>
      el?.classList?.contains?.('emoji-container')
    );

    if (!clickedInside) {
      this.showEmojiPicker = false;
    }
  }

 toggleBold() {
  this.editor?.chain().focus().toggleBold().run();
}

toggleItalic() {
  this.editor?.chain().focus().toggleItalic().run();
}

toggleUnderline() {
  this.editor?.chain().focus().toggleUnderline().run();
}

isUnderlineActive() {
  return this.editor?.isActive('underline') ?? false;
}

toggleBulletList() {
  this.editor?.chain().focus().toggleBulletList().run();
}

toggleOrderedList() {
  this.editor?.chain().focus().toggleOrderedList().run();
}

isOrderedListActive() {
  return this.editor?.isActive('orderedList') ?? false;
}

toggleTaskList() {
  this.editor?.chain().focus().toggleTaskList().run();
}

isTaskListActive() {
  return this.editor?.isActive('taskList') ?? false;
}

setLink() {
  const url = prompt('URL');

  if (!url) return;

  this.editor?.chain().focus().setLink({ href: url }).run();
}

unsetLink() {
  this.editor?.chain().focus().unsetLink().run();
}

toggleStrike() {
  this.editor?.chain().focus().toggleStrike().run();
}

isStrikeActive() {
  return this.editor?.isActive('strike') ?? false;
}

  writeValue(value: any): void {
    const clean = this.sanitize(value);

    if (!this.editor) {
      this.pendingValue = clean;
      return;
    }

    this.editor.commands.setContent(clean);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.editor?.setEditable(!isDisabled);
  }

  private sanitize(value: string): string {
    if (!value || value === '<>' || value === '<li></li>') {
      return '<p></p>';
    }
    return value;
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }
}
