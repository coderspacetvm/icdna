import * as React from 'react';

interface WalletSvgProps {
  color?: string;
  size?: number;
}

export const WalletSvg: React.FC<WalletSvgProps> = ({ color = "#0C1D2E", size = 24 }) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round" 
        className="lucide lucide-wallet-minimal-icon lucide-wallet-minimal">

            <path d="M17 14h.01"/>
            <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/>
    </svg>
  );
};
