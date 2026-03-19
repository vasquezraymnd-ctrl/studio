// Mocking Firebase Auth and Firestore for local demonstration
export type User = {
  uid: string;
  email: string;
  role: 'student' | 'teacher';
};

export type Module = {
  id: string;
  title: string;
  description: string;
  downloadLink: string;
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

const INITIAL_MODULES: Module[] = [
  { id: '1', title: 'Hematology Fundamentals', description: 'Comprehensive guide to CBC and blood morphology.', downloadLink: 'https://github.com' },
  { id: '2', title: 'Clinical Chemistry Review', description: 'Metabolic panels and electrolyte imbalances.', downloadLink: 'https://google.com' }
];

const GAUNTLET_QUESTIONS: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  text: `Question ${i + 1}: Which of the following is a characteristic of clinical laboratory science item #${i + 1}?`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: Math.floor(Math.random() * 4)
}));

export const FirebaseMock = {
  auth: {
    signIn: async (email: string): Promise<User> => {
      await new Promise(r => setTimeout(r, 800));
      return {
        uid: 'user_123',
        email,
        role: email.includes('admin') ? 'teacher' : 'student'
      };
    }
  },
  db: {
    getModules: async () => {
      return INITIAL_MODULES;
    },
    addModule: async (module: Omit<Module, 'id'>) => {
      console.log('Mock: Module added to Firestore', module);
      return { ...module, id: Math.random().toString() };
    },
    getQuestions: async () => {
      return GAUNTLET_QUESTIONS;
    }
  }
};