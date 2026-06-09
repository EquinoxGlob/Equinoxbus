import { useAppContext } from '../context/AppContext';
import { BookOpen, Lock, PlayCircle, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const { stats } = useAppContext();
  const navigate = useNavigate();

  const isPremium = stats.rank !== 'Starter';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-neon-blue" />
          Nexora Academy
        </h1>
        <p className="text-gray-400 mt-2">Master Web3 networks, community scaling, and the creator economy.</p>
      </header>

      {!isPremium ? (
         <div className="glassmorphism p-12 text-center rounded-3xl border border-rose-500/20 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px]" />
            <Lock className="w-16 h-16 text-rose-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Membership Protected Area</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
               Unlock Slot 3 to achieve Rising rank and gain full access to all premium courses, strategies, and network scaling tools.
            </p>
            <button onClick={() => navigate('/membership')} className="px-8 py-4 bg-neon-blue text-navy font-bold rounded-xl hover:bg-neon-blue-dark transition-colors inline-flex items-center gap-2">
               <Shield className="w-5 h-5" /> Activate Membership
            </button>
         </div>
      ) : (
         <div className="glassmorphism p-6 rounded-2xl mb-8 flex items-center gap-4 border border-emerald-500/30 bg-emerald-500/5">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
               <Star className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white">Premium Access Unlocked</h3>
               <p className="text-sm text-emerald-400">You have full access to all academy modules.</p>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
            { id: 1, title: 'Web3 & Earning Fundamentals', lessons: 5, duration: '1.5h', level: 'Basic', locked: false },
            { id: 2, title: 'Strategic Business Architecture', lessons: 8, duration: '2.5h', level: 'Premium', locked: !isPremium },
            { id: 3, title: 'Advanced Referral Systems', lessons: 12, duration: '4h', level: 'Premium', locked: !isPremium },
            { id: 4, title: 'Digital Community Growth', lessons: 6, duration: '2h', level: 'Premium', locked: !isPremium },
            { id: 5, title: 'Creator Economy Systems', lessons: 10, duration: '3.5h', level: 'Premium', locked: !isPremium },
            { id: 6, title: 'Matrix Wealth Multiplication', lessons: 7, duration: '2h', level: 'Elite', locked: stats.rank === 'Starter' || stats.rank === 'Rising' }
         ].map((course) => (
            <div key={course.id} className={`glassmorphism rounded-2xl overflow-hidden flex flex-col ${course.locked ? 'opacity-70' : 'hover:-translate-y-2'} transition-transform duration-300`}>
               <div className="h-40 bg-navy relative border-b border-navy-border flex items-center justify-center">
                  {course.locked ? (
                     <Lock className="w-12 h-12 text-gray-600" />
                  ) : (
                     <PlayCircle className="w-16 h-16 text-neon-blue/50" />
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-widest">
                     {course.level}
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold text-white mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-400 mb-6 flex items-center gap-3">
                     <span>{course.lessons} Lessons</span> • <span>{course.duration}</span>
                  </p>
                  
                  <div className="mt-auto">
                     {course.locked ? (
                        <button disabled className="w-full py-3 bg-navy border border-navy-border text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2">
                           <Lock className="w-4 h-4" /> Locked
                        </button>
                     ) : (
                        <button className="w-full py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-navy rounded-xl font-bold transition-colors">
                           Start Learning
                        </button>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
