

document.addEventListener('DOMContentLoaded', () => {
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));
    const formatTime = ts => {
        const d = new Date(ts);
        return d.toLocaleString();
    };
    (function createMessagingWidget() {
        // root container
        const widget = document.createElement('div');
        widget.id = 'chat-widget';
        widget.style.position = 'fixed';
        widget.style.right = '16px';
        widget.style.bottom = '16px';
        widget.style.width = '360px';
        widget.style.maxWidth = 'calc(100% - 40px)';
        widget.style.height = '480px';
        widget.style.maxHeight = '80vh';
        widget.style.background = 'linear-gradient(180deg,#0b1220,#0e1726)';
        widget.style.borderRadius = '12px';
        widget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
        widget.style.overflow = 'hidden';
        widget.style.display = 'flex';
        widget.style.flexDirection = 'column';
        widget.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
        widget.style.zIndex = '10050';
        widget.style.color = '#e6eef8';
        widget.style.border = '1px solid rgba(255,255,255,0.03)';
        widget.style.transition = 'transform .25s ease, opacity .25s ease';
        document.body.appendChild(widget);

        // header
        const header = document.createElement('div');
        header.style.padding = '12px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        header.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:44px;height:44px;border-radius:10px;background:#0f2336;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">MSG</div>
        <div>
          <div style="font-weight:700">Messages</div>
          <div style="font-size:12px;color:#b7c7db">Chat with demo contacts</div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button id="chat-collapse" title="Collapse" style="background:transparent;border:0;color:inherit;cursor:pointer">—</button>
      </div>
    `;
        widget.appendChild(header);

        const bodyWrap = document.createElement('div');
        bodyWrap.style.display = 'flex';
        bodyWrap.style.flex = '1';
        bodyWrap.style.minHeight = '0';
        widget.appendChild(bodyWrap);

        const contactsPane = document.createElement('div');
        contactsPane.style.width = '120px';
        contactsPane.style.minWidth = '100px';
        contactsPane.style.borderRight = '1px solid rgba(255,255,255,0.03)';
        contactsPane.style.overflowY = 'auto';
        contactsPane.style.padding = '8px';
        contactsPane.style.boxSizing = 'border-box';
        bodyWrap.appendChild(contactsPane);

        const chatPane = document.createElement('div');
        chatPane.style.flex = '1';
        chatPane.style.display = 'flex';
        chatPane.style.flexDirection = 'column';
        chatPane.style.minHeight = '0';
        bodyWrap.appendChild(chatPane);

        const messagesArea = document.createElement('div');
        messagesArea.style.flex = '1';
        messagesArea.style.padding = '12px';
        messagesArea.style.overflowY = 'auto';
        messagesArea.style.gap = '8px';
        messagesArea.style.display = 'flex';
        messagesArea.style.flexDirection = 'column';
        chatPane.appendChild(messagesArea);

        const inputBar = document.createElement('div');
        inputBar.style.display = 'flex';
        inputBar.style.padding = '10px';
        inputBar.style.borderTop = '1px solid rgba(255,255,255,0.03)';
        inputBar.style.gap = '8px';
        inputBar.innerHTML = `
      <input id="chat-name" placeholder="Your name" style="width:110px;padding:8px;border-radius:8px;border:0;background:#0b1a2a;color:inherit" />
      <input id="chat-input" placeholder="Type a message..." style="flex:1;padding:8px;border-radius:8px;border:0;background:#0b1a2a;color:inherit"/>
      <button id="chat-send" style="padding:8px 12px;border-radius:8px;border:0;background:#2b80ff;color:white;cursor:pointer">Send</button>
    `;
        chatPane.appendChild(inputBar);

        const collapseBtn = header.querySelector('#chat-collapse');
        let collapsed = false;
        collapseBtn.addEventListener('click', () => {
            collapsed = !collapsed;
            if (collapsed) {
                widget.style.transform = 'translateY(240px)';
                widget.style.opacity = '0.18';
                collapseBtn.textContent = '+';
            } else {
                widget.style.transform = 'translateY(0)';
                widget.style.opacity = '1';
                collapseBtn.textContent = '—';
            }
        });

        const MSG_KEY = 'demo_messages_v1'; 
        function loadMessages() {
            try {
                const raw = localStorage.getItem(MSG_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (e) {
                return {};
            }
        }
        function saveMessages(obj) {
            localStorage.setItem(MSG_KEY, JSON.stringify(obj));
        }

        const CONTACTS = [
            { id: 'alice', name: 'Alice' },
            { id: 'bob', name: 'Bob' },
            { id: 'support', name: 'Support' }
        ];

        function renderContacts(selectedId) {
            contactsPane.innerHTML = '';
            CONTACTS.forEach(c => {
                const btn = document.createElement('button');
                btn.style.width = '100%';
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.gap = '8px';
                btn.style.padding = '8px';
                btn.style.borderRadius = '8px';
                btn.style.border = '0';
                btn.style.background = (c.id === selectedId) ? 'linear-gradient(90deg,#12314c,#1d4665)' : 'transparent';
                btn.style.color = 'inherit';
                btn.style.cursor = 'pointer';
                btn.innerHTML = `<div style="width:36px;height:36px;border-radius:8px;background:#092033;display:flex;align-items:center;justify-content:center;font-weight:700">${c.name[0]}</div>
                         <div style="text-align:left"><div style="font-weight:700">${c.name}</div><div style="font-size:12px;color:#99b6d7">tap to open</div></div>`;
                btn.addEventListener('click', () => openChat(c.id));
                contactsPane.appendChild(btn);
            });
        }

        let activeContact = CONTACTS[0].id;
        function renderMessagesFor(contactId) {
            messagesArea.innerHTML = '';
            const store = loadMessages();
            const arr = store[contactId] || [];
            arr.forEach(m => {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = m.from === 'me' ? 'row-reverse' : 'row';
                wrapper.style.gap = '10px';
                wrapper.style.alignItems = 'flex-end';
                wrapper.style.marginBottom = '6px';

                const bubble = document.createElement('div');
                bubble.style.maxWidth = '78%';
                bubble.style.padding = '8px 10px';
                bubble.style.borderRadius = '10px';
                bubble.style.fontSize = '14px';
                bubble.style.lineHeight = '1.2';
                bubble.style.background = m.from === 'me' ? '#2b80ff' : '#0f2030';
                bubble.style.color = m.from === 'me' ? '#fff' : '#d6e6f8';
                bubble.innerHTML = `<div style="font-weight:700;font-size:12px;margin-bottom:6px">${escapeHtml(m.name || (m.from === 'me' ? 'You' : 'Contact'))}</div>
                            <div>${escapeHtml(m.text)}</div>
                            <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:6px">${formatTime(m.ts)}</div>`;
                wrapper.appendChild(bubble);
                messagesArea.appendChild(wrapper);
            });
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        function openChat(contactId) {
            activeContact = contactId;
            renderContacts(contactId);
            renderMessagesFor(contactId);
        }

        const sendBtn = inputBar.querySelector('#chat-send');
        const msgInput = inputBar.querySelector('#chat-input');
        const nameInput = inputBar.querySelector('#chat-name');

        sendBtn.addEventListener('click', () => doSend());
        msgInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                doSend();
            }
        });

        function doSend() {
            const text = msgInput.value.trim();
            const name = nameInput.value.trim() || 'You';
            if (!text) return;
            const store = loadMessages();
            if (!store[activeContact]) store[activeContact] = [];
            const msg = { from: 'me', name, text, ts: Date.now() };
            store[activeContact].push(msg);
            saveMessages(store);
            msgInput.value = '';
            renderMessagesFor(activeContact);

            setTimeout(() => {
                const replyText = autoReplyFor(activeContact, text);
                const reply = { from: 'them', name: CONTACTS.find(c => c.id === activeContact)?.name || 'Contact', text: replyText, ts: Date.now() };
                const s2 = loadMessages();
                if (!s2[activeContact]) s2[activeContact] = [];
                s2[activeContact].push(reply);
                saveMessages(s2);
                renderMessagesFor(activeContact);
            }, 700 + Math.random() * 900);
        }

        function autoReplyFor(contactId, received) {
            // lightweight heuristics for reply
            const lower = received.toLowerCase();
            if (lower.includes('hello') || lower.includes('hi')) return 'Hi! How can I help?';
            if (lower.includes('help') || lower.includes('issue')) return 'Tell me more about the issue and I will try to help.';
            if (lower.includes('thanks') || lower.includes('thank')) return 'You’re welcome! 😊';
            return 'Thanks — I got that. I will check and reply shortly.';
        }

        function escapeHtml(s) {
            return (s + '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }

        renderContacts(activeContact);
        openChat(activeContact);

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm' && !(e.ctrlKey || e.metaKey || e.altKey)) {
                widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
            }
        });

    })();

    (function enableImageComments() {
        const imgs = qsa('.center-div img');

        if (!imgs.length) return;

        function commentsKeyFor(img) {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('src') || (img.alt || '');
            // simple base64-ish key (not secure, just local)
            return 'comments_' + btoa(unescape(encodeURIComponent(src))).replace(/=/g, '');
        }

        function loadComments(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        }
        function saveComments(key, arr) {
            localStorage.setItem(key, JSON.stringify(arr));
        }

        imgs.forEach((img, idx) => {
            // create a small comments button element below the image
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'flex-start';
            container.style.gap = '8px';
            container.style.marginTop = '8px';

            const btn = document.createElement('button');
            btn.textContent = '💬 Comments';
            btn.style.padding = '6px 10px';
            btn.style.borderRadius = '8px';
            btn.style.border = '0';
            btn.style.cursor = 'pointer';
            btn.style.background = '#0f2030';
            btn.style.color = '#fff';
            btn.style.fontWeight = '600';

            container.appendChild(btn);
            if (img.parentElement) {
                img.parentElement.insertBefore(container, img.nextSibling);
            } else {
                img.insertAdjacentElement('afterend', container);
            }

            const panel = document.createElement('div');
            panel.style.position = 'fixed';
            panel.style.left = '0';
            panel.style.top = '0';
            panel.style.width = '100%';
            panel.style.height = '100%';
            panel.style.background = 'rgba(0,0,0,0.6)';
            panel.style.display = 'none';
            panel.style.zIndex = '10060';
            panel.style.justifyContent = 'center';
            panel.style.alignItems = 'center';

            const box = document.createElement('div');
            box.style.width = '520px';
            box.style.maxWidth = 'calc(100% - 40px)';
            box.style.maxHeight = '80vh';
            box.style.background = '#ffffff';
            box.style.borderRadius = '12px';
            box.style.overflow = 'hidden';
            box.style.display = 'flex';
            box.style.flexDirection = 'column';
            box.style.boxShadow = '0 18px 60px rgba(0,0,0,0.4)';
            panel.appendChild(box);

            
            const header = document.createElement('div');
            header.style.padding = '12px';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
            header.innerHTML = `<div style="font-weight:700">Comments</div><button style="border:0;background:transparent;cursor:pointer;font-size:18px">✕</button>`;
            box.appendChild(header);

            
            const previewWrap = document.createElement('div');
            previewWrap.style.display = 'flex';
            previewWrap.style.gap = '12px';
            previewWrap.style.padding = '12px';
            previewWrap.style.borderBottom = '1px solid rgba(0,0,0,0.04)';
            previewWrap.innerHTML = `
        <div style="flex:0 0 110px;line-height:0">
          <img src="${img.src}" alt="${escapeHtml(img.alt || '')}" style="width:110px;height:auto;border-radius:8px;display:block"/>
        </div>
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(img.alt || `Image ${idx + 1}`)}</div>
          <div style="font-size:13px;color:#666;margin-top:6px">Add and read comments for this image.</div>
        </div>
      `;
            box.appendChild(previewWrap);

            
            const commentsList = document.createElement('div');
            commentsList.style.padding = '12px';
            commentsList.style.overflowY = 'auto';
            commentsList.style.flex = '1';
            commentsList.style.display = 'flex';
            commentsList.style.flexDirection = 'column';
            commentsList.style.gap = '8px';
            box.appendChild(commentsList);

            
            const formBar = document.createElement('div');
            formBar.style.padding = '12px';
            formBar.style.display = 'flex';
            formBar.style.gap = '8px';
            formBar.style.borderTop = '1px solid rgba(0,0,0,0.04)';
            formBar.innerHTML = `
        <input placeholder="Your name" id="cm-name" style="width:110px;padding:8px;border-radius:8px;border:1px solid #ddd"/>
        <input placeholder="Write a comment..." id="cm-text" style="flex:1;padding:8px;border-radius:8px;border:1px solid #ddd"/>
        <button id="cm-send" style="padding:8px 10px;border-radius:8px;border:0;background:#2b80ff;color:white;cursor:pointer">Post</button>
      `;
            box.appendChild(formBar);

            document.body.appendChild(panel);

            // functions to render comments
            const key = commentsKeyFor(img);
            function renderComments() {
                commentsList.innerHTML = '';
                const arr = loadComments(key);
                if (!arr.length) {
                    commentsList.innerHTML = '<div style="color:#666">No comments yet. Be the first to comment!</div>';
                    return;
                }
                arr.forEach(c => {
                    const r = document.createElement('div');
                    r.style.padding = '8px';
                    r.style.borderRadius = '8px';
                    r.style.background = '#f7f9fb';
                    r.style.border = '1px solid #e6eef8';
                    r.innerHTML = `<div style="font-weight:700">${escapeHtml(c.name || 'Anonymous')} <span style="font-weight:400;color:#888;font-size:12px;margin-left:8px">${formatTime(c.ts)}</span></div>
                         <div style="margin-top:6px">${escapeHtml(c.text)}</div>`;
                    commentsList.appendChild(r);
                });
                commentsList.scrollTop = commentsList.scrollHeight;
            }

            
            btn.addEventListener('click', () => {
                panel.style.display = 'flex';
                renderComments();
            });
            header.querySelector('button').addEventListener('click', () => panel.style.display = 'none');
            panel.addEventListener('click', (e) => { if (e.target === panel) panel.style.display = 'none'; });

            
            const nameInput = formBar.querySelector('#cm-name');
            const textInput = formBar.querySelector('#cm-text');
            const send = formBar.querySelector('#cm-send');

            send.addEventListener('click', () => {
                const name = (nameInput.value || 'Anonymous').trim();
                const text = (textInput.value || '').trim();
                if (!text) return alert('Please write a comment before posting.');
                const arr = loadComments(key);
                arr.push({ name, text, ts: Date.now() });
                saveComments(key, arr);
                textInput.value = '';
                renderComments();
            });

            
            document.addEventListener('keydown', (e) => {
                if (panel.style.display === 'flex' && e.key === 'Escape') {
                    panel.style.display = 'none';
                }
            });
        });

        window.openImageComments = function (imageIndex = 0) {
            const panels = Array.from(document.querySelectorAll('div[style*="position: fixed"]'));
            // naive: show first panel that was created
            if (panels[0]) panels[0].style.display = 'flex';
        };

    })();

    function escapeHtml(s) {
        return (s || '').toString().replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

});
