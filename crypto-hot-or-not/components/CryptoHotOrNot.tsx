// components/CryptoHotOrNot.tsx

interface Crypto {
    id: string;
    name: string;
    symbol: string;
    image?: string;
    current_price?: number;
    market_cap?: number;
    market_cap_rank?: number;
    total_volume?: number;
    price_change_24h?: number;
    circulating_supply?: number;
  }
  
  interface SocialMetrics {
    social_score: number;
    likes: number;
    trending_score: number;
    community_growth: string;
  }
  
  import React, { useState, useEffect } from 'react';
  import { Card } from '@/components/ui/card';
  import { Loader2, Flame, ThumbsUp, Trophy, TrendingUp, ArrowUpRight } from 'lucide-react';
  
  const retroStyles = `
    @keyframes hotGlow {
      0% { text-shadow: 0 0 5px #ff4444, 0 0 10px #ff4444, 0 0 15px #ff4444; }
      50% { text-shadow: 0 0 10px #ff8866, 0 0 20px #ff8866, 0 0 30px #ff8866; }
      100% { text-shadow: 0 0 5px #ff4444, 0 0 10px #ff4444, 0 0 15px #ff4444; }
    }
  
    @keyframes fireEffect {
      0% { transform: scale(1) rotate(-2deg); }
      50% { transform: scale(1.1) rotate(2deg); }
      100% { transform: scale(1) rotate(-2deg); }
    }
  
    @keyframes cardIntroLeft {
      0% { transform: translateX(-200%) rotate(-20deg); opacity: 0; }
      100% { transform: translateX(0) rotate(0deg); opacity: 1; }
    }
  
    @keyframes cardIntroRight {
      0% { transform: translateX(200%) rotate(20deg); opacity: 0; }
      100% { transform: translateX(0) rotate(0deg); opacity: 1; }
    }
  
    @keyframes scorePopup {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
  
    .hot-title {
      animation: hotGlow 2s infinite;
      color: #ff4444;
    }
  
    .fire-icon {
      animation: fireEffect 2s infinite;
    }
  
    .score-popup {
      animation: scorePopup 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  
    .pixel-border {
      box-shadow: 0 0 0 2px #ff4444, 0 0 0 4px #ff8866;
    }
  
    .card-left {
      animation: cardIntroLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  
    .card-right {
      animation: cardIntroRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  
  const formatPrice = (price: number | null | undefined) => {
    if (!price && price !== 0) return "N/A";
    
    if (price >= 1) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else if (price >= 0.01) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    } else {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      });
    }
  };
  
  const ScoreCard = ({ score, label, Icon }: { score: string | number; label: string; Icon: any }) => (
    <div className="bg-gradient-to-r from-red-900 to-orange-900 p-1.5 md:p-2 rounded flex items-center gap-1 md:gap-2 score-popup">
      <Icon className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
      <span className="text-orange-200 text-sm md:text-base">{label}:</span>
      <span className="text-orange-400 font-bold text-sm md:text-base">{score}</span>
    </div>
  );
  
  const CryptoCard = ({ crypto, position }: { crypto: Crypto; position: string }) => {
    if (!crypto) return null;
  
    const socialMetrics: SocialMetrics = {
      social_score: Math.floor(Math.random() * 30) + 70,
      likes: Math.floor(Math.random() * 100000) + 50000,
      trending_score: Math.floor(Math.random() * 20) + 80,
      community_growth: (Math.random() * 20 + 5).toFixed(1)
    };
  
    const calculateHotScore = () => {
      const scores = {
        price: Math.min(100, (crypto.current_price || 0) / 1000),
        market: Math.min(100, ((crypto.market_cap || 0) / 1e12) * 100),
        volume: Math.min(100, ((crypto.total_volume || 0) / 1e10) * 100),
        social: socialMetrics.social_score,
        trending: socialMetrics.trending_score
      };
      
      return Math.floor(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
    };
  
    const hotScore = calculateHotScore();
  
    return (
      <div className={`flex-1 ${position === 'left' ? 'card-left' : 'card-right'}`}>
        <div className="bg-gradient-to-b from-red-950 to-orange-950 rounded-lg p-3 md:p-6 pixel-border w-full">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <img
              src={crypto.image || '/api/placeholder/64/64'}
              alt={crypto.name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg pixel-border"
            />
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-orange-400">{crypto.name}</h2>
              <p className="text-sm md:text-base text-orange-300">${formatPrice(crypto.current_price)}</p>
            </div>
          </div>
  
          <div className="space-y-4 mb-6">
            <ScoreCard score={socialMetrics.social_score} label="Social Score" Icon={Trophy} />
            <ScoreCard score={socialMetrics.likes.toLocaleString()} label="Likes" Icon={ThumbsUp} />
            <ScoreCard score={socialMetrics.trending_score} label="Trending" Icon={TrendingUp} />
            <ScoreCard score={`${socialMetrics.community_growth}%`} label="Growth" Icon={ArrowUpRight} />
          </div>
  
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold hot-title mb-2">
              HOT SCORE
            </div>
            <div className="text-4xl md:text-6xl font-bold text-orange-400 score-popup">
              {hotScore}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const CryptoHotOrNot = () => {
    const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPair, setSelectedPair] = useState([0, 1]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/cryptos');
          if (!response.ok) {
            throw new Error('Failed to fetch crypto data');
          }
          const data = await response.json();
          setCryptoData(data);
        } catch (error) {
          console.error('Error:', error);
          setError('Failed to load crypto data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return (
        <div className="min-h-screen bg-black text-orange-400 font-mono p-4 flex items-center justify-center">
          <div className="text-2xl text-center flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            LOADING HOT CRYPTO...
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen bg-black text-red-400 font-mono p-4 flex items-center justify-center">
          <div className="text-2xl text-center">{error}</div>
        </div>
      );
    }
  
    if (!cryptoData || cryptoData.length < 2) {
      return (
        <div className="min-h-screen bg-black text-orange-400 font-mono p-4 flex items-center justify-center">
          <div className="text-2xl text-center">No crypto data available</div>
        </div>
      );
    }
  
    return (
      <>
        <style>{retroStyles}</style>
        <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-orange-100 font-mono p-2 md:p-4">
          <div className="max-w-6xl mx-auto px-2 md:px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-6xl font-bold hot-title mb-2">CRYPTO HOT OR NOT</h1>
              <div className="text-orange-400 text-base md:text-xl">Rate • Compare • Choose</div>
            </div>
  
            <div className="relative flex flex-col md:flex-row justify-center items-center md:items-stretch gap-4 md:gap-8">
              <CryptoCard crypto={cryptoData[selectedPair[0]]} position="left" />
              
              <div className="flex md:hidden justify-center w-full my-2">
                <Flame className="w-12 h-12 text-orange-500 fire-icon" />
              </div>
              
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <Flame className="w-16 h-16 text-orange-500 fire-icon" />
              </div>
  
              <CryptoCard crypto={cryptoData[selectedPair[1]]} position="right" />
            </div>
  
            <div className="mt-8 text-center">
              <button 
                className="bg-gradient-to-r from-red-600 to-orange-600 px-4 md:px-8 py-2 md:py-3 rounded-lg text-lg md:text-xl font-bold text-white hover:from-red-500 hover:to-orange-500 transition-all pixel-border"
                onClick={() => {
                  const newPair = [
                    Math.floor(Math.random() * cryptoData.length),
                    Math.floor(Math.random() * cryptoData.length)
                  ];
                  setSelectedPair(newPair);
                }}
              >
                NEXT HOT PAIR 🔥
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default CryptoHotOrNot;