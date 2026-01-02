const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateLogoSuggestions(
  businessName: string,
  description: string,
  style: string,
  colors: string[]
): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    // Fallback si pas de clé API
    return [
      `Logo minimaliste avec les initiales "${businessName.split(' ').map(w => w[0]).join('')}" dans un cercle`,
      `Logo typographique moderne avec "${businessName}" en police géométrique`,
      `Icône abstraite représentant l'activité avec le nom en dessous`,
      `Logo combiné avec symbole et typographie élégante`,
    ];
  }

  const prompt = `Tu es un expert en design de logos. Génère 4 concepts de logos professionnels et modernes pour:

Entreprise: ${businessName}
Description: ${description}
Style souhaité: ${style}
Couleurs: ${colors.join(', ')}

Pour chaque concept, décris en détail:
1. La forme/structure du logo
2. La typographie utilisée
3. Les couleurs et leur utilisation
4. L'impression générale

Réponds en français, avec des descriptions visuelles précises.`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Parse les concepts
    const concepts = text.split(/\d+\./).filter(s => s.trim()).slice(0, 4);
    return concepts.map(c => c.trim());
  } catch (error) {
    console.error('Gemini error:', error);
    return [
      `Logo minimaliste avec les initiales "${businessName.split(' ').map(w => w[0]).join('')}"`,
      `Logo typographique avec "${businessName}" en police moderne`,
      `Icône abstraite avec le nom en dessous`,
      `Logo combiné symbole + typographie`,
    ];
  }
}

export async function generateProjectSuggestions(
  sector: string,
  style: string,
  objective: string
): Promise<{ name: string; description: string }[]> {
  if (!GEMINI_API_KEY) {
    return [];
  }

  const prompt = `Suggère 3 sites web d'inspiration pour:
Secteur: ${sector}
Style: ${style}
Objectif: ${objective}

Pour chaque site, donne:
- Le nom du site
- Une brève description de pourquoi c'est inspirant

Réponds en JSON: [{"name": "...", "description": "..."}]`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) throw new Error('API error');

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '[]';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch {
    return [];
  }
}



