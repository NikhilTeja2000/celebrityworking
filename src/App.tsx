import React, { useState } from 'react';
import { Sparkles, Heart, Star, Loader2 } from 'lucide-react';
import { marked } from 'marked';

interface CelebrityMatchResponse {
  success: boolean;
  data?: string;
  error?: string;
}

function App() {
  const [interests, setInterests] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filledInterests = interests.filter(interest => interest.trim() !== '');
    if (filledInterests.length < 2) {
      setError('Please enter at least 2 interests to find your celebrity matches!');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/.netlify/functions/celebrityMatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: filledInterests }),
      });

      const data: CelebrityMatchResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to find celebrity matches. Please try again!');
      }
    } catch (err) {
      setError('Something went wrong! Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (markdown: string) => {
    const html = marked(markdown);
    return { __html: html };
  };

  return (
    <div className="min-h-screen bg-krico-beige relative overflow-hidden">
      {/* Bolt.new Badge */}
      <a 
        href="https://bolt.new" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 hover:scale-110 transition-transform duration-300"
      >
        <img 
          src="/white_circle_360x360.png" 
          alt="Built with Bolt.new" 
          className="w-12 h-12 rounded-full shadow-lg"
        />
      </a>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">⭐</div>
        <div className="absolute top-32 right-20 text-4xl">🎭</div>
        <div className="absolute bottom-20 left-20 text-5xl">🎪</div>
        <div className="absolute bottom-32 right-32 text-3xl">🎨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">🎵</div>
        <div className="absolute top-1/3 right-1/3 text-5xl">🎬</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl krico-text mb-4 animate-pulse">
            CELEBRITY MATCH
          </h1>
          <p className="text-xl md:text-2xl text-krico-navy font-bold">
            Find Famous People Who Share Your Interests! ✨
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="krico-glass rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl krico-text mb-2">
                  Tell Us What You Love!
                </h2>
                <p className="text-krico-navy">Enter 3 things you're passionate about</p>
              </div>

              {interests.map((interest, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {index === 0 && <Heart className="w-6 h-6 text-red-500" />}
                      {index === 1 && <Star className="w-6 h-6 text-yellow-500" />}
                      {index === 2 && <Sparkles className="w-6 h-6 text-purple-500" />}
                    </div>
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => handleInterestChange(index, e.target.value)}
                      placeholder={`Interest #${index + 1} (e.g., ${
                        index === 0 ? 'pizza' : index === 1 ? 'jazz music' : 'coding'
                      })`}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-krico-navy/20 focus:border-krico-lime focus:outline-none text-krico-navy font-bold placeholder-krico-navy/50 bg-white/80"
                      maxLength={50}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full krico-button text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Finding Your Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Find My Celebrity Matches!</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl font-bold">
              {error}
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="max-w-4xl mx-auto">
            <div className="krico-glass rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl md:text-4xl krico-text text-center mb-6">
                Your Celebrity Matches! 🌟
              </h2>
              <div 
                className="markdown-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={renderMarkdown(result)}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <p className="text-krico-navy font-bold text-lg">
            Built for One-Shot Competition – Built with only a single prompt.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;