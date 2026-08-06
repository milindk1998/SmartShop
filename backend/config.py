"""
config.py — loads backend settings from config.yaml with env var overrides.

Priority (highest → lowest):
  1. Environment variable
  2. config.yaml value
  3. Built-in default
"""
import os
import yaml

_HERE = os.path.dirname(__file__)
_CONFIG_PATH = os.path.join(_HERE, "config.yaml")

def _load() -> dict:
    if os.path.exists(_CONFIG_PATH):
        with open(_CONFIG_PATH) as f:
            return yaml.safe_load(f) or {}
    return {}

_cfg = _load()

def _get(section: str, key: str, env_var: str, default):
    env_val = os.environ.get(env_var)
    if env_val is not None:
        # Coerce to the same type as the default
        if isinstance(default, bool):
            return env_val.lower() in ("1", "true", "yes")
        if isinstance(default, int):
            return int(env_val)
        if isinstance(default, float):
            return float(env_val)
        return env_val
    return _cfg.get(section, {}).get(key, default)


# ── OpenRouter (embeddings) ──────────────────────────────────────────────────
OPENROUTER_BASE_URL = _get("openrouter", "base_url",   "OPENROUTER_BASE_URL",  "https://openrouter.ai/api/v1")
OPENROUTER_API_KEY  = _get("openrouter", "api_key",    "OPENROUTER_API_KEY",   "")
EMBED_MODEL         = _get("openrouter", "embed_model","OPENROUTER_EMBED_MODEL","nvidia/nemotron-3-embed-1b:free")

# ── Groq (LLM) ───────────────────────────────────────────────────────────────
GROQ_API_KEY  = _get("groq", "grok_api_key", "GROQ_API_KEY",  "")
GROQ_BASE_URL = _get("groq", "base_url",     "GROQ_BASE_URL", "https://api.groq.com/openai/v1")
CHAT_MODEL    = _get("groq", "chat_model",   "GROQ_CHAT_MODEL", "openai/gpt-oss-20b")

# ── LLM generation ───────────────────────────────────────────────────────────
TEMPERATURE      = _get("llm", "temperature",  "LLM_TEMPERATURE",        0.7)
MAX_TOKENS       = _get("llm", "max_tokens",   "LLM_MAX_TOKENS",         400)
REASONING        = _get("llm", "reasoning",    "LLM_REASONING",          False)

# ── Chat behaviour ────────────────────────────────────────────────────────────
MAX_HISTORY_TURNS    = _get("chat", "max_history_turns",    "CHAT_MAX_HISTORY_TURNS",    8)
VAGUE_QUERY_MAX_WORDS = _get("chat", "vague_query_max_words", "CHAT_VAGUE_QUERY_MAX_WORDS", 8)
