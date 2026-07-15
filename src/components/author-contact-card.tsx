'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, QrCode, X } from 'lucide-react';
import { authorContacts, type AuthorContact } from '@/lib/site-content';

function ContactPreview({ contact }: { contact: AuthorContact }) {
  return (
    <div className="author-contact-preview" aria-live="polite">
      <img
        src={contact.imageSrc}
        alt={contact.imageAlt}
        width={216}
        height={216}
        className="author-contact-qr"
      />
      <p>微信扫一扫，{contact.label}</p>
    </div>
  );
}

export function AuthorContactCard() {
  const [previewId, setPreviewId] = useState<AuthorContact['id']>('wechat');
  const [dialogContact, setDialogContact] = useState<AuthorContact | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previewContact = authorContacts.find((contact) => contact.id === previewId) ?? authorContacts[0];

  useEffect(() => {
    if (!dialogContact) return;

    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogContact(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [dialogContact]);

  const closeDialog = () => {
    setDialogContact(null);
    triggerRef.current?.focus();
  };

  return (
    <section className="author-contact-card" aria-labelledby="author-contact-title">
      <div className="author-contact-intro">
        <p className="eyebrow">认识作者</p>
        <h2 id="author-contact-title">和丘彬彬一起，把 AI 用进真实工作。</h2>
        <p>
          微信 <strong>binStudy</strong>，公众号 <strong>彬彬说</strong>。关注后可收到新教程与实践记录。
        </p>
      </div>

      <div className="author-contact-actions">
        <div className="author-contact-buttons" aria-label="联系作者">
          {authorContacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              className="author-contact-trigger"
              onMouseEnter={() => setPreviewId(contact.id)}
              onFocus={() => setPreviewId(contact.id)}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setPreviewId(contact.id);
                setDialogContact(contact);
              }}
            >
              {contact.id === 'wechat' ? <MessageCircle size={18} /> : <QrCode size={18} />}
              <span>{contact.label}</span>
              <span className="author-contact-handle">{contact.handle}</span>
            </button>
          ))}
        </div>
        <ContactPreview contact={previewContact} />
      </div>

      {dialogContact ? (
        <div className="author-contact-dialog-backdrop" role="presentation" onMouseDown={closeDialog}>
          <div
            className="author-contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-contact-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="author-contact-close"
              onClick={closeDialog}
              aria-label="关闭二维码预览"
            >
              <X size={20} />
            </button>
            <h3 id="author-contact-dialog-title">{dialogContact.label}</h3>
            <ContactPreview contact={dialogContact} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
