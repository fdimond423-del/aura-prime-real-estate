"""OpenRouter Free Models Client

Automatically uses active free models with fallback support.
Reads the API key directly from `.agents/mcp_config.json` or `OPENROUTER_API_KEY` env var.
"""

import json
import os
import sys
import urllib.request
import urllib.error

CONFIG_PATH = os.path.join(os.path.dirname(__file__), ".agents", "mcp_config.json")
MODELS_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "openrouter_config.json")

DEFAULT_FREE_MODELS = [
    "particle-ai/particle-1:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free",
    "inclusionai/ling-3.2-flash:free",
    "baidu/ernie-5.5-flash-preview:free",
    "nvidia/nemotron-3.5-lightning:free",
    "google/gemma-4-31b-it:free",
    "liquid/lfm-3-1.7b:free",
]


def get_api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY")
    if key:
        return key

    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                key = data.get("mcpServers", {}).get("openrouter", {}).get("headers", {}).get("Authorization", "")
                if key.startswith("Bearer "):
                    return key[7:].strip()
                elif key:
                    return key.strip()
        except Exception:
            pass

    return ""


def call_openrouter(prompt: str, model: str = None, system_prompt: str = "") -> dict:
    api_key = get_api_key()
    if not api_key:
        raise ValueError("OpenRouter API key not found in environment or .agents/mcp_config.json")

    models_to_try = [model] if model else DEFAULT_FREE_MODELS

    last_error = None
    for target_model in models_to_try:
        if not target_model:
            continue
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            payload = {
                "model": target_model,
                "messages": messages,
            }

            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://local-agent.workspace",
                    "X-Title": "Local Agent",
                },
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choice = data.get("choices", [{}])[0]
                text = choice.get("message", {}).get("content", "")
                return {
                    "model": target_model,
                    "content": text,
                    "usage": data.get("usage", {}),
                    "raw": data,
                }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            last_error = f"HTTP {e.code} on {target_model}: {err_body}"
            # If rate limited (429), try next free model
            continue
        except Exception as e:
            last_error = str(e)
            continue

    raise RuntimeError(f"All free models failed. Last error: {last_error}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_prompt = " ".join(sys.argv[1:])
    else:
        user_prompt = "Hello! Tell me a one-line motivational quote."

    print(f">> Sending prompt: {user_prompt}")
    try:
        result = call_openrouter(user_prompt)
        print(f"\n[Model Used: {result['model']}]")
        print(f"\nResponse:\n{result['content']}")
    except Exception as exc:
        print(f"\n[Error]: {exc}")
