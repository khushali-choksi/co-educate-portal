import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';

export const metadata: Metadata = {
  title: 'Login - CORE EDUCATE Portal',
  description: 'Secure login portal for CORE EDUCATE healthcare management system. Access your physiotherapy and Pilates practice management tools with professional-grade security.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <LoginInteractive />
    </main>
  );
}