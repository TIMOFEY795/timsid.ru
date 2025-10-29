// === Год в футере ===
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// === LOADER: дождёмся анимации и уберём ===
window.addEventListener('load', ()=>{
  // время = длительность столкновения + запас (в мс)
  setTimeout(()=> document.body.classList.add('loaded'), 1400);
});

// === Меню (бургер) ===
(function(){
  const nav   = document.getElementById('topnav');
  const toggle= document.getElementById('navToggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', ()=>{
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('nav-hover'); else nav.classList.remove('nav-hover');
  });
})();

// === Discord карточка (без «онлайн») ===
const DISCORD_INVITE = 'https://discord.gg/UsCkjrPPJd';
const DISCORD_GUILD_ID = ''; // если включишь Server Widget — вставь ID (иначе оставь пустым)

document.addEventListener('DOMContentLoaded', ()=>{
  const title = document.getElementById('dc-title');
  const sub   = document.getElementById('dc-sub');
  const join  = document.getElementById('dc-join');
  const wrap  = document.getElementById('dc-channels');

  if (join) join.href = DISCORD_INVITE;

  if (!DISCORD_GUILD_ID){
    if (title) title.textContent = 'Discord сервер';
    if (sub)   sub.textContent   = 'Нажми «Присоединиться», чтобы ворваться';
    if (wrap)  wrap.hidden = true;
    return;
  }

  fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`, {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data=>{
      if (title) title.textContent = data?.name || 'Discord';
      if (sub)   sub.textContent   = data?.instant_invite ? 'Сервер открыт для приглашений' : 'Виджет активен';
      if (wrap){
        wrap.innerHTML = '';
        const channels = (data?.channels || []).slice(0,6);
        if (channels.length){
          channels.forEach(c=>{
            const d = document.createElement('div');
            d.className = 'discord-channel';
            d.textContent = `# ${c.name}`;
            wrap.appendChild(d);
          });
          wrap.hidden = false;
        } else wrap.hidden = true;
      }
      if (data?.instant_invite && join) join.href = data.instant_invite;
    })
    .catch(()=>{
      if (sub)  sub.textContent = 'Не удалось получить данные. Используй кнопку.';
      if (wrap) wrap.hidden = true;
    });
});
