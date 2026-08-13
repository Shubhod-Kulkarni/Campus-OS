'use client';

// ============================================================
// Campus OS — Quote Widget
// Daily motivational quote for students
// ============================================================
import { motion } from 'framer-motion';

const QUOTES = [
  { quote: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { quote: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { quote: 'Great things never come from comfort zones.', author: 'Unknown' },
  { quote: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { quote: 'Success doesn\'t just find you. You have to go out and get it.', author: 'Unknown' },
  { quote: 'Small steps in the right direction can turn out to be the biggest step of your life.', author: 'Unknown' },
  { quote: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
];

export default function QuoteWidget() {
  // Pick a daily quote using day-of-year index
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const { quote, author } = QUOTES[dayOfYear % QUOTES.length];

  return (
    <motion.div
      className="absolute top-4 left-4 glass rounded-2xl p-4 w-64 select-none cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
      drag
      dragMomentum={false}
      style={{ touchAction: 'none' }}
    >
      <p className="text-[#34d399] text-xs font-medium mb-2 uppercase tracking-wider">💡 Daily Quote</p>
      <p className="text-[#e2e8f0] text-sm leading-relaxed italic">&quot;{quote}&quot;</p>
      <p className="text-[#475569] text-xs mt-2">— {author}</p>
    </motion.div>
  );
}
