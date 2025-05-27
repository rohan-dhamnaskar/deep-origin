import { Link2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="header text-center space-y-4">
      <div className="header__icon-container">
        <div className="header__icon-wrapper">
          <Link2 className="header__icon" />
        </div>
      </div>
      <h1 className="header__title">{title}</h1>
      <p className="header__subtitle">{subtitle}</p>
    </div>
  );
}
