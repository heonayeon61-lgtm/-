import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, Book, THEME } from '../types';
import { getRecommendedBooks } from '../services/geminiService';
import { ChevronRight, ExternalLink, Sparkles, Heart, BookOpen } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function Home({ profile, onUpdateProfile }: Props) {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleWishlist = (book: Book) => {
    const isWished = profile.wishlist.some(b => b.title === book.title);
    const newWishlist = isWished 
      ? profile.wishlist.filter(b => b.title !== book.title)
      : [...profile.wishlist, book];
    
    onUpdateProfile({ ...profile, wishlist: newWishlist });
  };

  useEffect(() => {
    async function load() {
      const books = await getRecommendedBooks(profile);
      setRecommendations(books);
      setLoading(false);
    }
    load();
  }, [profile]);

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#8B5E3C]">반가워요, {profile.name}님!</h1>
          <p className="text-[#6D6D6D] text-sm">오늘의 독서 체력: <span className="font-semibold text-[#8B5E3C]">{profile.level}</span></p>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl border border-[#E6D5C3]">
          📖
        </div>
      </header>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-[#8B5E3C]" />
          <h2 className="text-lg font-bold">오늘의 추천 북다리</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-[#E6D5C3]" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recommendations.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-3xl border border-[#E6D5C3] shadow-[0_4px_12px_rgba(139,94,60,0.05)] hover:shadow-[0_8px_20px_rgba(139,94,60,0.1)] transition-all group"
              >
                <div className="flex gap-4">
                  <div className="text-4xl bg-[#F5F2ED] w-16 h-20 rounded-xl flex items-center justify-center border border-[#E6D5C3]">
                    {book.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#8B5E3C]">
                        {book.category}
                      </span>
                      <button 
                        onClick={() => toggleWishlist(book)}
                        className={`p-1 transition-colors ${profile.wishlist.some(b => b.title === book.title) ? 'text-red-500' : 'text-[#AFAFA8]'}`}
                      >
                        <Heart size={16} fill={profile.wishlist.some(b => b.title === book.title) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-[#8B5E3C] transition-colors">{book.title}</h3>
                    <p className="text-xs text-[#6D6D6D] mb-3">{book.author}</p>
                    <p className="text-xs text-[#6D6D6D] line-clamp-2 leading-relaxed opacity-80">{book.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F5F2ED] flex items-center justify-between">
                  <div className="flex gap-2">
                    <a href={book.priceInfo.kyobo} target="_blank" rel="noreferrer" className="text-[10px] text-[#AFAFA8] hover:text-[#8B5E3C] underline">교보문고</a>
                    <a href={book.priceInfo.yes24} target="_blank" rel="noreferrer" className="text-[10px] text-[#AFAFA8] hover:text-[#8B5E3C] underline">YES24</a>
                    <a href={book.priceInfo.aladin} target="_blank" rel="noreferrer" className="text-[10px] text-[#AFAFA8] hover:text-[#8B5E3C] underline">알라딘</a>
                  </div>
                  <button className="flex items-center gap-1 text-[#8B5E3C] text-xs font-bold bg-[#F5F2ED] px-3 py-1.5 rounded-full hover:bg-[#8B5E3C] hover:text-white transition-all">
                    자세히 보기 <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#8B5E3C] p-6 rounded-3xl text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">성장하는 독서 습관 🧗‍♂️</h2>
          <p className="text-white/80 text-sm mb-4">현재 레벨에서 완독하면 다음 난이도로 안내해드려요.</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            기록 시작하기
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <BookOpen size={120} />
        </div>
      </section>
    </div>
  );
}
