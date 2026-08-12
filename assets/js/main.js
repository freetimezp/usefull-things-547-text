gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const headings = gsap.utils.toArray(".row h1");
const splits = [];

headings.forEach((heading) => {
    const split = SplitText.create(heading, {
        type: "chars",
        charsClass: "ch",
    });
    splits.push(split);

    split.chars.forEach((char, index) => {
        const startY = index % 2 === 0 ? -150 : 150;
        gsap.set(char, { y: startY });
    });
});

gsap.utils.toArray(".row").forEach((row, rowIndex) => {
    const track = row.querySelector(".track");
    const slideFrom = rowIndex === 1 ? -100 : 100;
    const split = splits[rowIndex];
    const charCount = split.chars.length;

    ScrollTrigger.create({
        trigger: row,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate(self) {
            gsap.set(track, {
                x: `${slideFrom - self.progress * slideFrom}%`,
            });

            split.chars.forEach((char, index) => {
                const staggerIndex =
                    rowIndex === 1 ? charCount - 1 - index : index;
                const delay = 0.1 + (staggerIndex / charCount) * 0.675;
                const duration = 0.9 - (0.675 * (charCount - 1)) / charCount;

                let charProgress = 0;
                if (self.progress >= delay) {
                    charProgress = Math.min(
                        1,
                        (self.progress - delay) / duration,
                    );
                }

                const startY = index % 2 === 0 ? -150 : 150;
                gsap.set(char, { y: startY * (1 - charProgress) });
            });
        },
    });
});
