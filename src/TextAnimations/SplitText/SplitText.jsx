/*
	Installed from https://reactbits.dev/tailwind/
*/

import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

const SplitText = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'easeOutCubic',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const words = text.split(' ').map(word => word.split(''));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef();
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: { 
        opacity: 0, 
        transform: 'translateY(20px)',
        config: {
          mass: 1,
          tension: 210,
          friction: 20
        }
      },
      to: inView ? { 
        opacity: 1,
        transform: 'translateY(0)',
        config: {
          mass: 1,
          tension: 210,
          friction: 20,
          duration: 800
        }
      } : {},
      delay: inView ? i * 40 : 0
    }))
  );

  return (
    <p
      ref={ref}
      className={`