import { useState } from 'react';
import { Search as SearchIcon, Tag, Flame, Sparkles, Heart, Loader2 } from 'lucide-react';
import { CATEGORIES, UserProfile, Book } from '../types';
import { getBooksByCategory, searchBooks, getBooksByTag } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export default function Explore({ profile, onUpdateProfile }: Props) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'cat' | 'tag' | 'search', name: string } | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const tags = ['#30분안에읽는', '#전공자용', '#위로가되는', '#지루함타파', '#베스트셀러'];

  const handleCategoryClick = async (cat: string) => {
    setSelectedItem({ type: 'cat', name: cat });
    setLoading(true);
    const books = await getBooksByCategory(cat, profile.level);
    setResults(books);
    setLoading(false);
  };

  const handleTagClick = async (tag: string) => {
    setSelectedItem({ type: 'tag', name: tag });
    setLoading(true);
    const books = await getBooksByTag(tag, profile.level);
    setResults(books);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSelectedItem({ type: 'search', name: query });
    setLoading(true);
    const books = await searchBooks(query, profile.level);
    setResults(books);
    setLoading(false);
  };

  const toggleWishlist = (book: Book) => {
    const isWished = profile.wishlist.some(b => b.title === book.title);
    const newWishlist = isWished 
      ? profile.wishlist.filter(b => b.title !== book.title)
      : [...profile.wishlist, book];
    
    onUpdateProfile({ ...profile, wishlist: newWishlist });
  };

  const getTitle = () => {
    if (!selectedItem) return '';
    if (selectedItem.type === 'cat') return `'${selectedItem.name}' 추천 도서 🎁`;
    if (selectedItem.type === 'tag') return `'${selectedItem.name}' 가득한 책들 🎈`;
    return `'${selectedItem.name}' 검색 결과 🧸`;
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
      <h1 className="text-3xl font-bold text-[#8B5E3C] mb-6 flex items-center gap-2">
        <span>🎨</span> 탐색하기
      </h1>

      <form onSubmit={handleSearch} className="relative mb-8 text-lg">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFA8]" size={20} />
        <input
          type="text"
          placeholder="어떤 책을 찾으시나요? 🧸"
          className="w-full bg-white border-2 border-[#E6D5C3] rounded-3xl pl-12 pr-6 py-4 transition-all focus:outline-none focus:ring-4 focus:ring-[#8B5E3C]/10 placeholder:text-[#D1D1CB]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={20} className="text-[#8B5E3C]" />
          <h2 className="text-xl font-bold">카테고리 픽!</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                selectedItem?.type === 'cat' && selectedItem.name === cat 
                  ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white' 
                  : 'bg-white border-[#E6D5C3] hover:border-[#8B5E3C]'
              }`}
            >
              <span className="text-xl">📚</span>
              <span className="font-bold">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white rounded-3xl border-2 border-[#E6D5C3] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles size={80} />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#8B5E3C]">{getTitle()}</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-xs text-[#AFAFA8] hover:text-[#8B5E3C] underline"
              >
                닫기
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={32} className="animate-spin text-[#8B5E3C]" />
                <p className="text-[#6D6D6D]">어울리는 책을 고르고 있어요...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.length > 0 ? results.map((book) => (
                  <div key={book.id} className="p-4 bg-[#F5F2ED] rounded-2xl border border-[#E6D5C3] group">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-[#1A1A1A] group-hover:text-[#8B5E3C] transition-colors leading-tight">{book.emoji} {book.title}</h4>
                       <button 
                        onClick={() => toggleWishlist(book)}
                        className={`p-1 transition-colors ${profile.wishlist.some(b => b.title === book.title) ? 'text-red-500' : 'text-[#AFAFA8]'}`}
                      >
                        <Heart size={16} fill={profile.wishlist.some(b => b.title === book.title) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <p className="text-[10px] text-[#6D6D6D] mb-2">{book.author} · {book.category}</p>
                    <p className="text-xs text-[#6D6D6D] line-clamp-2 leading-relaxed">{book.description}</p>
                  </div>
                )) : (
                  <p className="text-center py-8 text-[#AFAFA8]">검색 결과가 없어요 📭</p>
                )}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={20} className="text-[#8B5E3C]" />
          <h2 className="text-xl font-bold">인기 태그 🎈</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all border-2 ${
                selectedItem?.type === 'tag' && selectedItem.name === tag
                  ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                  : 'bg-white border-[#E6D5C3] text-[#6D6D6D] hover:bg-[#8B5E3C] hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
