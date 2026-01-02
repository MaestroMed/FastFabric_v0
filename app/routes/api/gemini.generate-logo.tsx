import type { ActionFunctionArgs } from 'react-router';
import { generateLogoSuggestions } from '~/lib/gemini.server';

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json();
  const { businessName, description, style, colors } = data;
  
  const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
  
  const concepts = await generateLogoSuggestions(
    businessName,
    description,
    style,
    parsedColors
  );
  
  return Response.json({ concepts });
}



