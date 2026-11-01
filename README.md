# Agentic Hacking — Skills & Agents

[![Skills](https://img.shields.io/badge/Skills-28-orange?style=for-the-badge)](https://ebooks.hlaingbwar.me/)
[![MCP](https://img.shields.io/badge/MCP-1-blue?style=for-the-badge)](https://ebooks.hlaingbwar.me/)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge)](https://ebooks.hlaingbwar.me/)

> **AI-Powered Web Security & Automation** — Official Bonus Repository

ဒီ repo က **["Agentic Hacking"](https://ebooks.hlaingbwar.me/)** ebook ရဲ့ bonus material ပါ။

ကျွန်တော် ကိုယ်တိုင် လက်တွေ့ သုံးနေတဲ့ skill.md တွေ၊ agent နဲ့ MCP config တွေ အကုန် ဒီမှာ ထည့်ပေးထားပါတယ်။

---

## စာအုပ်ကို ဝယ်ချင်ရင်

**[https://ebooks.hlaingbwar.me/](https://ebooks.hlaingbwar.me/)**

စာအုပ်အပြည့်အစုံ (Module ၆ ခု) + SKILL.md template ၂၈ ခု ပါဝင်ပါတယ်။

---

## ဘယ်လို သုံးမလဲ

အလွယ်ဆုံးက — ကိုယ့် AI ကို ဒီ repo ရဲ့ link ပေးပြီး ပြောလိုက်ရုံပါပဲ။

```
ဒီ GitHub repo က skill တွေ၊ agent တွေ၊ MCP config တွေ အကုန် 
OpenCode ထဲ ထည့်ပေးပါ —
https://github.com/mrhlaingbwardev/agentic-hacking-skills
```

AI က သူ့ဘာသာ download လုပ်၊ မှန်တဲ့ folder တွေထဲ ထည့်ပေးပါလိမ့်မယ်။

ပြီးရင် **OpenCode ကို ပိတ်ပြီး ပြန်ဖွင့်** လိုက်ရုံပါပဲ။

> **အရေးကြီး — Model ကိုလည်း မှန်အောင် ရွေးပါ**
>
> **DeepSeek Flash** လို ပေါ့ပါးပြီး reasoning နည်းတဲ့ model ရွေးပါ။ "Deep" reasoning model တွေက security request ကို ငြင်းတတ်လို့ပါ။

---

## ပါဝင်တာ

| Folder | ဘာတွေပါလဲ |
|--------|-----------|
| `skills/` | SKILL.md templates ၂၈ ခု |
| `agents/` | web-pentest agent |
| `mcp-servers/` | wsl-security-tools (custom MCP server) |
| `opencode.jsonc` | MCP config |

---

## Install (Manual)

Linux / macOS / WSL:

```bash
git clone https://github.com/mrhlaingbwardev/agentic-hacking-skills
cp -r agentic-hacking-skills/skills/* ~/.config/opencode/skills/
cp -r agentic-hacking-skills/agents/* ~/.config/opencode/agents/
cp -r agentic-hacking-skills/mcp-servers/* ~/.config/opencode/mcp-servers/
```

Windows PowerShell:

```powershell
git clone https://github.com/mrhlaingbwardev/agentic-hacking-skills
Copy-Item -Recurse agentic-hacking-skills\skills\* "$HOME\.config\opencode\skills\"
Copy-Item -Recurse agentic-hacking-skills\agents\* "$HOME\.config\opencode\agents\"
Copy-Item -Recurse agentic-hacking-skills\mcp-servers\* "$HOME\.config\opencode\mcp-servers\"
```

`opencode.jsonc` ကို ကိုယ့် လက်ရှိ config နဲ့ ပေါင်းထည့်ပါ။

---

## မှတ်ထားစရာ

- `opencode.jsonc` ထဲက API keys တွေက placeholder ပါ။ ကိုယ့် key အစစ်တွေနဲ့ အစားထိုးပါ။
- ဒီ skill/agent တွေက authorized testing အတွက်သာ ဖြစ်ပါတယ်။
- ဒီ repo က တစ်ခုခုကြောင့် ပျက်သွားရင်တောင် — **ဒီ username နဲ့ repo နာမည်အတိုင်းပဲ ပြန်တင်ပေးမှာပါ**။

---

## Author

**Hlaing Bwar** — [https://hlaingbwar.me](https://hlaingbwar.me) · [https://ebooks.hlaingbwar.me](https://ebooks.hlaingbwar.me/)
