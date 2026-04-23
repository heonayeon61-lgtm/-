import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, ReadingLevel, UserProfile } from '../types';
import { BookOpen, Check } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [level, setLevel] = useState<ReadingLevel>(ReadingLevel.LEVEL1);
  const [style, setStyle] = useState('부드러운 에세이형');

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    onComplete({
      name,
      categories: selectedCategories,
      level,
      preferredStyle: style,
      weeklyHours: 0,
      completedBooks: [],
      wishlist: [],
    });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center gap-8"
          >
            <div className="text-center">
              <span className="text-4xl mb-4 block">📚</span>
              <h1 className="text-3xl font-bold text-[#8B5E3C] mb-2">북다리에 오신 걸 환영해요!</h1>
              <p className="text-[#6D6D6D]">먼저, 당신의 이름을 알려주세요.</p>
            </div>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="w-full bg-white border border-[#E6D5C3] rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 transition-shadow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
            />
            <button
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              className="w-full bg-[#8B5E3C] text-white rounded-2xl py-4 font-bold disabled:opacity-50 transition-opacity"
            >
              시작하기
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#8B5E3C] mb-2">어떤 분야를 좋아하시나요?</h2>
              <p className="text-[#6D6D6D]">관심 있는 카테고리를 모두 골라주세요.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                    selectedCategories.includes(cat)
                      ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white shadow-lg'
                      : 'bg-white border-[#E6D5C3] text-[#1A1A1A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              disabled={selectedCategories.length === 0}
              onClick={() => setStep(3)}
              className="mt-auto w-full bg-[#8B5E3C] text-white rounded-2xl py-4 font-bold disabled:opacity-50"
            >
              다음으로
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#8B5E3C] mb-2">나의 독서 체력은?</h2>
              <p className="text-[#6D6D6D]">현재 본인에게 가장 잘 맞는 수준을 선택해주세요.</p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { level: ReadingLevel.LEVEL1, desc: '완독 경험이 적고, 쉬운 어휘와 짧은 글을 선호해요.' },
                { level: ReadingLevel.LEVEL2, desc: '월 1~2권 정도 읽으며, 어느 정도 전문적인 글도 괜찮아요.' },
                { level: ReadingLevel.LEVEL3, desc: '두꺼운 고전이나 전문 서적도 즐기는 다독가예요.' },
              ].map(opt => (
                <button
                  key={opt.level}
                  onClick={() => setLevel(opt.level)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    level === opt.level
                      ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                      : 'bg-white border-[#E6D5C3] text-[#1A1A1A]'
                  }`}
                >
                  <div className="font-bold mb-1">{opt.level}</div>
                  <div className={`text-xs ${level === opt.level ? 'text-white/80' : 'text-[#6D6D6D]'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="mt-auto w-full bg-[#8B5E3C] text-white rounded-2xl py-4 font-bold"
            >
              분석 완료
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
