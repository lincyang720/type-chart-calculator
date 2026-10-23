import { TypeId } from '@/lib/types';
import { getContrastTextColor } from '@/lib/colorContrast';
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
    rounded-md font-semibold
    shadow-sm transition-all duration-200
    ${sizeClasses[size]}
    ${clickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}
  `;

  return (
    <span
      className={`${baseClasses} ${clickable ? 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2' : ''}`}
      style={{ backgroundColor: type.color, color: getContrastTextColor(type.color) }}
      onClick={onClick}
      onKeyDown={onClick ? event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      } : undefined}
      role={clickable && onClick ? 'button' : undefined}
      tabIndex={clickable && onClick ? 0 : undefined}
      aria-label={clickable && onClick ? `${type.name} type` : undefined}
      title={`${type.name} type`}
    >
      {type.name}
    </span>
  );
}
