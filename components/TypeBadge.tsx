import { TypeId } from '@/lib/types';
import typesData from '@/data/types.json';

interface TypeBadgeProps {
  typeId: TypeId;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

export default function TypeBadge({
  typeId,
  size = 'md',
  clickable = false,
  onClick
}: TypeBadgeProps) {
  const type = typesData.types.find(t => t.id === typeId);

  if (!type) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-md font-semibold text-white
    shadow-sm transition-all duration-200
    ${sizeClasses[size]}
    ${clickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}
  `;

  return (
    <span
      className={baseClasses}
      style={{ backgroundColor: type.color }}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {type.name}
    </span>
  );
}
