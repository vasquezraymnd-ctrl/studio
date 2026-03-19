'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, onError?: (error: any) => void): void {
  signInAnonymously(authInstance).catch(onError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(onError);
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(authInstance: Auth, email: string, onSuccess?: () => void, onError?: (error: any) => void): void {
  sendPasswordResetEmail(authInstance, email)
    .then(onSuccess)
    .catch(onError);
}
