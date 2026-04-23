import { UserProfile, ReadingLevel, THEME } from '../types';
import { LogOut, User, RefreshCcw, ShoppingBag } from 'lucide-react';

interface Props {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

export default function Settings({ profile, onUpdate }: Props) {
  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-10">설정</h1>

      <section className="mb-10 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-[#8B5E3C]/20 flex items-center justify-center text-4xl shadow-inner">
          🙋‍♂️
        </div>
        <h2 className="text-xl font-bold">{profile.name}님</h2>
        <p className="text-sm text-[#6D6D6D]">{profile.level}</p>
      </section>

      <div className="space-y-4">
        {[
          { icon: User, label: '이름 변경' },
          { icon: RefreshCcw, label: '독서 레벨 재설정' },
          { icon: ShoppingBag, label: '연동 서점 관리' },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full bg-white px-6 py-4 rounded-2xl flex items-center gap-4 border border-[#E6D5C3] hover:bg-[#F5F2ED] transition-colors"
          >
            <item.icon size={20} className="text-[#8B5E3C]" />
            <span className="font-medium text-[#1A1A1A]">{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem('bookBridge_profile');
            window.location.reload();
          }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 text-[#FF4D4D] font-medium"
        >
          <LogOut size={20} />
          <span>로그아웃 (로컬 데이터 초기화)</span>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-[#AFAFA8]">Book-Bridge v1.0.0</p>
      </div>
    </div>
  );
}
