// Установка текущего года в футере
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// ------- КАСТОМНЫЙ DISCORD ВИДЖЕТ -------
// 1) Включи "Виджет сервера" в настройках Discord
// 2) Вставь сюда ID сервера (число) и инвайт (у тебя: https://discord.gg/UsCkjrPPJd)
const DISCORD_GUILD_ID = 'YOUR_SERVER_ID';           // <-- замени на свой ID
const DISCORD_INVITE_URL = 'https://discord.gg/UsCkjrPPJd';

async function loadDiscordWidget() {
  const titleEl = document.getElementById('dc-title');
  const subEl   = document.getElementById('dc-sub');
  const onlineEl= document.getElementById('dc-online');
  const joinBtn = document.getElementById('dc-join');
  const chWrap  = document.getElementById('dc-channels');

  // Кнопка "Присоединиться" работает всегда
  joinBtn.href = DISCORD_INVITE_URL;

  if (!DISCORD_GUILD_ID || DISCORD_GUILD_ID.includes('YOUR')) {
    titleEl.textContent = 'Discord сервер';
    onlineEl.textContent = '—';
    chWrap.hidden = true;
    return;
  }

  const url = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Заголовки
    titleEl.textContent = data.name || 'Discord';
    subEl.textContent = data.instant_invite ? 'Сервер открыт для приглашений' : 'Виджет активен';
    onlineEl.textContent = (data.presence_count ?? '—');

    // Каналы (покажем до 6 штук)
    chWrap.innerHTML = '';
    const channels = (data.channels || []).slice(0, 6);
    if (channels.length) {
      channels.forEach(c => {
        const div = document.createElement('div');
        div.className = 'discord-channel';
        div.textContent = `# ${c.name}`;
        chWrap.appendChild(div);
      });
      chWrap.hidden = false;
    } else {
      chWrap.hidden = true;
    }
  } catch (e) {
    // Фолбек: если не включён серверный виджет или CORS не дали
    titleEl.textContent = 'Discord сервер';
    subEl.textContent = 'Не удалось получить данные. Проверь «Виджет сервера» в настройках Discord.';
    onlineEl.textContent = '—';
    chWrap.hidden = true;
    // консоль для отладки
    console.debug('Discord widget load error:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadDiscordWidget);
