import {useRef, useState, type FormEvent, type RefObject} from 'react';
import {X} from 'lucide-react';

async function requestContact(body: object) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Contact request failed');
  return response.json();
}

export function ContactDialog({dialogRef}: {dialogRef: RefObject<HTMLDialogElement | null>}) {
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const session = useRef(0);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true);
    setNotice('');
    try {
      const result = await requestContact({action: 'message', name: fields.get('name'), email: fields.get('email'), message: fields.get('message')});
      if (result.accepted !== true) throw new Error();
      form.reset();
      setNotice('Thanks. Your message was accepted for delivery.');
    } catch {
      setNotice('Your message couldn’t be confirmed. Your draft is here. You can also reach me on LinkedIn.');
    } finally {
      setSending(false);
    }
  }

  async function revealPhone() {
    const opened = session.current;
    setPhoneBusy(true);
    setPhoneError(false);
    try {
      const result = await requestContact({action: 'phone'});
      if (typeof result.phone !== 'string') throw new Error();
      if (opened === session.current) setPhone(result.phone);
    } catch {
      if (opened === session.current) setPhoneError(true);
    } finally {
      if (opened === session.current) setPhoneBusy(false);
    }
  }

  return <dialog id="contact-dialog" ref={dialogRef} aria-labelledby="contact-title" onClose={() => {
    session.current++;
    setPhone('');
    setPhoneBusy(false);
    setPhoneError(false);
  }}>
    <button type="button" className="close" aria-label="Close contact form" onClick={() => dialogRef.current?.close()}><X/></button>
    <h2 id="contact-title">Get in touch</h2>
    <form onSubmit={send}>
      <label>Your name<input autoFocus required name="name" autoComplete="name" maxLength={100}/></label>
      <label>Your email<input required type="email" name="email" autoComplete="email" maxLength={254}/></label>
      <label>Message<textarea required name="message" rows={4} maxLength={4000}/></label>
      <button className="primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
      <p role="status">{notice}</p>
    </form>
    <div className="contact-options">
      {phone ? <a href={'tel:+' + (phone.replace(/\D/g, '').length === 10 ? '1' : '') + phone.replace(/\D/g, '')}>{phone}</a>
        : <button type="button" disabled={phoneBusy} onClick={revealPhone}>{phoneBusy ? 'Checking…' : 'Show phone number'}</button>}
      <a href="https://www.linkedin.com/in/jp0624/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
    </div>
    {phoneError && <p role="status">The number couldn’t be shown. Try again or use LinkedIn.</p>}
  </dialog>;
}
