import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getUser, isAuthenticated, logout } from '@/utils/auth';

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const navigate = useNavigate();
  const user = getUser();

  // ⛔ Hide header if not logged in
  if (!isAuthenticated()) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9" />
        <Separator orientation="vertical" className="h-6" />
        {title && (
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-medium text-foreground">
            {user?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.email}
          </span>
        </div>

        <ThemeToggle />

        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
