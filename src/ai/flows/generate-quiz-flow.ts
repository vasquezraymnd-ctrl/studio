'use server';
/**
 * @fileOverview AI Quiz Generator for RMT Board Exam preparation.
 * 
 * - generateQuiz - Generates a 5-item clinical quiz based on a medical topic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The clinical subject or topic for the quiz (e.g., "Hematology: Anemias").'),
  difficulty: z.enum(['Easy', 'Moderate', 'Hard', 'Board Exam']).default('Board Exam'),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string(),
  difficulty: z.string(),
  questions: z.array(z.object({
    q: z.string(),
    options: z.array(z.string()).length(4),
    a: z.number().min(0).max(3),
    rationale: z.string(),
  })),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const quizPrompt = ai.definePrompt({
  name: 'quizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert Clinical Laboratory Science (CLS) educator and RMT board exam reviewer.
  
Generate a high-yield, high-quality quiz about: {{{topic}}}
Difficulty level: {{{difficulty}}}

REQUIREMENTS:
1. Provide exactly 5 multiple-choice questions.
2. Each question must have exactly 4 options.
3. The questions should focus on clinical significance, laboratory findings, or diagnostic procedures.
4. Provide a detailed rationale for the correct answer.
5. Ensure the "a" field is the 0-indexed integer of the correct option.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await quizPrompt(input);
    if (!output) throw new Error('AI failed to generate quiz content.');
    return output;
  }
);
