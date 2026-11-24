/**
 * OpenRouter Free Models Client (Node.js)
 * 
 * Automatically uses active free models with fallback support.
 * Reads API key directly from .agents/mcp_config.json or OPENROUTER_API_KEY env var.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '.agents', 'mcp_config.json');

const DEFAULT_FREE_MODELS = [
  'particle-ai/particle-1:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'inclusionai/ling-3.2-flash:free',
  'baidu/ernie-5.5-flash-preview:free',
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-31b-it:free',
  'liquid/lfm-3-1.7b:free'
];

function getApiKey() {
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      const auth = data?.mcpServers?.openrouter?.headers?.Authorization;
      if (auth && auth.startsWith('Bearer ')) {
        return auth.substring(7).trim();
      } else if (auth) {
        return auth.trim();
      }
    } catch (e) {
      // ignore
    }
  }
  return '';
}

function requestChat(model, prompt, apiKey, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const payload = JSON.stringify({
      model,
      messages
    });

    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://local-agent.workspace',
        'X-Title': 'Local Agent',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 45000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              model,
              content: parsed.choices?.[0]?.message?.content || '',
              usage: parsed.usage,
              raw: parsed
            });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function callOpenRouter(prompt, preferredModel = null, systemPrompt = '') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenRouter API key not found in .agents/mcp_config.json or environment.');
  }

  const models = preferredModel ? [preferredModel] : DEFAULT_FREE_MODELS;
  let lastErr = null;

  for (const m of models) {
    try {
      return await requestChat(m, prompt, apiKey, systemPrompt);
    } catch (err) {
      lastErr = err;
      // Try next model on error (e.g. rate limit 429)
    }
  }

  throw new Error(`All free models failed. Last error: ${lastErr?.message}`);
}

module.exports = { callOpenRouter, getApiKey, DEFAULT_FREE_MODELS };

if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ') || 'Hello! Tell me a one-line motivational quote.';
  console.log(`>> Sending prompt: "${prompt}"`);
  callOpenRouter(prompt)
    .then(res => {
      console.log(`\n[Model Used: ${res.model}]`);
      console.log(`\nResponse:\n${res.content}`);
    })
    .catch(err => {
      console.error(`\n[Error]: ${err.message}`);
    });
}
