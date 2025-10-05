import anime from 'animejs';

export default function DotNav({ total = 4, index = 0, onChange }) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Slide dots">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-current={i === index ? 'true' : 'false'}
          className="w-2.5 h-2.5 rounded-full bg-white/30 focus-ring"
          onClick={() => {
            onChange?.(i);
            anime({
              targets: event.currentTarget,
              scale: [{ value: 1.4, duration: 120, easing: 'easeOutQuad' }, { value: 1, duration: 160, easing: 'easeOutQuad' }],
              backgroundColor: [{ value: 'rgba(255,255,255,.8)', duration: 120 }, { value: 'rgba(255,255,255,.3)', duration: 160 }],
            });
          }}
          style={i === index ? { backgroundColor: 'rgba(255,255,255,.8)', transform: 'scale(1.1)' } : undefined}
          aria-label={`Go to item ${i + 1}`}
        />
      ))}
    </div>
  );
}
