import { useState } from 'react';
import { BookOpen, Bookmark, CheckCircle2, Heart, PlayCircle, CheckCircle } from 'lucide-react';
import { UserProfile, Book } from '../types';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export default function Library({ profile, onUpdateProfile }: Props) {
  const [tab, setTab] = useState<'wish' | 'reading' | 'done'>('wish');

  const updateBookStatus = (bookTitle: string, newStatus: 'wish' | 'reading' | 'done') => {
    const updatedWishlist = profile.wishlist.map(b => 
      b.title === bookTitle ? { ...b, status: newStatus } : b
    );
    
    onUpdateProfile({ ...profile, wishlist: updatedWishlist });
  };

  const tabs = [
    { id: 'wish', label: '읽고 싶은', icon: Bookmark },
    { id: 'reading', label: '열독 중', icon: BookOpen },
    { id: 'done', label: '완독 기쁨', icon: CheckCircle2 },
  ] as const;

  const currentList = profile.wishlist.filter(b => (b.status || 'wish') === tab);

  return (
    <div className="max-w-md mx-auto px-6 py-8 pb-32">
       <h1 className="text-3xl font-bold text-[#8B5E3C] mb-6 flex items-center gap-2">
        <span>🏰</span> 내 서재
      </h1>

      <div className="flex bg-white p-2 rounded-3xl border-2 border-[#E6D5C3] mb-8 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl text-xs font-bold transition-all ${
              tab === t.id ? 'bg-[#8B5E3C] text-white shadow-md scale-105' : 'text-[#AFAFA8] hover:bg-[#F5F2ED]'
            }`}
          >
            <t.icon size={18} />
            {t.label}
          </button>
        ))}
      </div>

      {currentList.length > 0 ? (
        <div className="flex flex-col gap-4">
          {currentList.map((book, idx) => (
            <div
              key={`${book.id}-${idx}`}
              className="bg-white p-5 rounded-3xl border-2 border-[#E6D5C3] shadow-sm flex gap-4 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="text-3xl bg-[#F5F2ED] w-14 h-18 rounded-2xl flex items-center justify-center border border-[#E6D5C3]">
                {book.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#8B5E3C]">
                    {book.category}
                  </span>
                  <div className="flex gap-2">
                    {tab === 'wish' && (
                      <button 
                        onClick={() => updateBookStatus(book.title, 'reading')}
                        className="text-[#8B5E3C] hover:scale-110 transition-transform"
                        title="독서 시작하기"
                      >
                        <PlayCircle size={18} />
                      </button>
                    )}
                    {tab === 'reading' && (
                      <button 
                        onClick={() => updateBookStatus(book.title, 'done')}
                        className="text-green-600 hover:scale-110 transition-transform"
                        title="완독 체크!"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1 leading-tight">{book.title}</h3>
                <p className="text-xs text-[#6D6D6D]">{book.author}</p>
                
                <div className="flex gap-2 mt-3">
                   <a href={book.priceInfo?.kyobo} target="_blank" rel="noreferrer" className="text-[10px] text-[#8B5E3C] hover:underline">구매처 가기</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center opacity-50">
          <div className="text-7xl mb-4">
            {tab === 'wish' ? '🏠' : tab === 'reading' ? '📖' : '🎉'}
          </div>
          <p className="text-xl font-bold text-[#8B5E3C] mb-2">
            {tab === 'wish' ? '서재가 비어있어요!' : tab === 'reading' ? '지금 읽는 책이 없어요' : '아직 완독한 책이 없어요'}
          </p>
          <p className="text-sm text-[#6D6D6D] px-10">
            {tab === 'wish' ? '추천 탭에서 예쁜 책들을 채워보세요' : tab === 'reading' ? '서재에서 읽기 시작을 눌러보세요!' : '한 권씩 차근차근 다 읽어볼까요?'}
          </p>
        </div>
      )}
    </div>
  );
}
