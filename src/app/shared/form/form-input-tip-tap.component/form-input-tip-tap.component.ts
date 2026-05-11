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
import { Color } from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';

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

  // =====================
  // INIT
  // =====================
  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorEl.nativeElement,

      extensions: [
      StarterKit.configure({ textStyle: true, } as Partial<any>),

        TextStyle,
        Color,
        Underline,

        TaskList,
        TaskItem,

        Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true, } as any),
      ],

      content: this.pendingValue || '<p></p>',

      onUpdate: ({ editor }) => {
        this.onChange(editor.getHTML());
      }
    });

    if (this.pendingValue) {
      this.editor.commands.setContent(this.pendingValue);
      this.pendingValue = null;
    }
  }

  // =====================
  // EMOJI
  // =====================
  addEmoji(event: any) {
    const emoji = event?.detail?.unicode || event?.detail?.emoji;
    if (!emoji) return;

    this.editor?.chain().focus().insertContent(emoji).run();
    this.showEmojiPicker = false;
  }

/*
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInside = target.closest('.emoji-container');
    console.log(event)
    if (!clickedInside) {
      this.showEmojiPicker = false;
    }
  }*/

  // =====================
  // FORMATO
  // =====================
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

  toggleStrike() {
    this.editor?.chain().focus().toggleStrike().run();
  }

  isStrikeActive() {
    return this.editor?.isActive('strike') ?? false;
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

  // =====================
  // COLOR
  // =====================
  setColor(color: string) {
    this.editor
      ?.chain()
      .focus()
      .setColor(color)
      .run();
  }

  unsetColor() {
    this.editor
      ?.chain()
      .focus()
      .unsetColor()
      .run();
  }

  // =====================
  // LINK
  // =====================
  setLink() {
    const url = prompt('URL');
    if (!url) return;

    const finalUrl = /^https?:\/\//i.test(url)
      ? url
      : 'https://' + url;

    this.editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: finalUrl })
      .run();
  }

  unsetLink() {
    this.editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run();
  }

  // =====================
  // CVA
  // =====================
  writeValue(value: any): void {
    if (!value) value = '<p></p>';

    if (!this.editor) {
      this.pendingValue = value;
      return;
    }

    this.editor.commands.setContent(value);
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

  // =====================
  // SANITIZE (IMPORTANTE: NO ROMPER MARKS)
  // =====================
  private sanitize(value: string): string {
    if (!value || value === '<>' || value === '<li></li>') {
      return '<p></p>';
    }

    // SOLO seguridad básica
    return value.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }

  // =====================
  // DESTROY
  // =====================
  ngOnDestroy(): void {
    this.editor?.destroy();
  }
}
