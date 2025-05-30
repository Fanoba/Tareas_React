import React, { useState, useEffect } from 'react';
import { MAIN_HEADER } from '../components/Main_Header';
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  Collapse
} from '@mui/material';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "../styles/Main_Page.css"; // Asegúrate de que la ruta sea correcta

export const MAIN_PAGE = () => {

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('openai');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);


  const PROVIDERS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    headerPrefix: 'Bearer'
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-3.5-turbo',
    headerPrefix: 'Bearer'
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    headerPrefix: 'Bearer'
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-opus-20240229',
    headerPrefix: 'Bearer'
  },
  perplexity: {
    url: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3-sonar-large-32k-online',
    headerPrefix: 'Bearer'
  },
  mistral: {
    url: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-medium',
    headerPrefix: 'Bearer'
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'mixtral-8x7b-32768',
    headerPrefix: 'Bearer'
  },
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    headerPrefix: 'Bearer'
  },
  moonshot: {
    url: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-128k',
    headerPrefix: 'Bearer'
  },
  zeroone: {
    url: 'https://api.01wise.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    headerPrefix: 'Bearer'
  }
};

  // Efecto para el typing animation
  useEffect(() => {
    if (response && typingIndex < response.length) {
      const timeout = setTimeout(() => {
        setDisplayedResponse(prev => prev + response[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 20); // Velocidad de escritura (ms por caracter)

      return () => clearTimeout(timeout);
    }
  }, [response, typingIndex]);

  const handleSend = async () => {
  setError('');
  setResponse('');
  setDisplayedResponse('');
  setTypingIndex(0);
  setIsLoading(true);

  const selected = PROVIDERS[provider];

  if (!selected) {
    setError('Proveedor no soportado');
    setIsLoading(false);
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${selected.headerPrefix} ${apiKey}`
  };

  const body = {
    model: selected.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  };

  try {
    const res = await fetch(selected.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    // Algunas APIs (como Anthropic) devuelven en formatos distintos
    const content =
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.delta?.content ||
      data.content ||
      'No se pudo obtener respuesta.';

    setResponse(content);
  } catch (err) {
    console.error(err);
    setError(err.message || 'API Key inválida o error en la petición.');
  } finally {
    setIsLoading(false);
  }
};

  

  return (
    <div className="main-page-container">
      <MAIN_HEADER />

      <Box
        sx={{
          maxWidth: '800px',
          margin: '40px auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Selección del proveedor */}
        <Select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b6196'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5883AD'
            }
          }}
        >
           <MenuItem value="openai">OpenAI (GPT-3.5)</MenuItem>
            <MenuItem value="openrouter">OpenRouter</MenuItem>
            <MenuItem value="deepseek">DeepSeek</MenuItem>
            <MenuItem value="anthropic">Anthropic (Claude 3)</MenuItem>
            <MenuItem value="perplexity">Perplexity</MenuItem>
            <MenuItem value="mistral">Mistral</MenuItem>
            <MenuItem value="groq">Groq</MenuItem>
            <MenuItem value="together">Together AI</MenuItem>
            <MenuItem value="moonshot">Moonshot AI</MenuItem>
            <MenuItem value="zeroone">ZeroOne</MenuItem>
        </Select>

        {/* API Key */}
        <TextField
            label="Enter your API Key"
            variant="outlined"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type={showApiKey ? 'text' : 'password'}
            sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#3b6196' },
                '&:hover fieldset': { borderColor: '#5883AD' }
                }
            }}
        InputProps={{
            endAdornment: (
            <InputAdornment position="end">
                <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowApiKey(!showApiKey)}
                edge="end"
                sx={{ color: '#3b6196' }}
                >
                {showApiKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            )
        }}
        />

        {/* Prompt */}
        <TextField
          label="What would you like to ask?"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#3b6196' },
              '&:hover fieldset': { borderColor: '#5883AD' }
            }
          }}
        />

        {/* Botón con estado de carga */}
        <Button
          variant="contained"
          disabled={isLoading || !apiKey || !prompt}
          onClick={handleSend}
          sx={{
            backgroundColor: '#3b6196',
            '&:hover': { backgroundColor: '#5883AD' },
            '&:disabled': { backgroundColor: '#cccccc' },
            padding: '12px 0',
            fontSize: '1rem',
            height: '48px',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Send Query'
          )}
        </Button>

        {/* Mensaje de error */}
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        {/* Respuesta con efecto de escritura */}
        <Fade in={!!displayedResponse} timeout={500}>
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #3b6196',
              minHeight: '100px',
              transition: 'all 0.3s ease'
            }}
          >
            <Typography variant="h6" sx={{ color: '#3b6196', mb: 2 }}>
              Response:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                '&:after': {
                  content: '""',
                  width: '8px',
                  height: '16px',
                  backgroundColor: '#5883AD',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                  animation: 'blink 1s step-end infinite',
                  opacity: typingIndex < response.length ? 1 : 0
                }
              }}
            >
              {displayedResponse}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Estilos para el cursor parpadeante */}
      <style jsx global>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};