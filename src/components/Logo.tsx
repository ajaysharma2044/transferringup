interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const iconSizeClasses = {
    sm: 'h-10 w-10 scale-150',
    md: 'h-14 w-14 scale-150',
    lg: 'h-16 w-16 scale-150'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img src="/tupng.png" alt="Transferring Up" className={`${iconSizeClasses[size]} object-contain`} />
      <span className="font-bold text-xl font-display"><span className="text-[#F5EDD9]">Transferring</span> <span className="text-[#8B1A1A]">Up</span></span>
    </div>
  );
};

export default Logo;
