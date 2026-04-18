import { motion, useScroll, useSpring, useTransform } from "motion/react";

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { damping: 50 });

  const layer7Y = useTransform(x, [0, 0.5], ["0%", "70%"]);
  const layer6Y = useTransform(x, [0, 0.5], ["0%", "60%"]);
  const layer5Y = useTransform(x, [0, 0.5], ["0%", "50%"]);
  const layer4Y = useTransform(x, [0, 0.5], ["0%", "40%"]);
  const layer3Y = useTransform(x, [0, 0.5], ["0%", "30%"]);
  const layer2Y = useTransform(x, [0, 0.5], ["0%", "20%"]);
  const layer1Y = useTransform(x, [0, 0.5], ["0%", "0%"]);

  return (
    <section className="absolute inset-0 bg-black/40">
      <div className="relative h-screen overflow-y-hidden">
        {/* Layer8 */}
        <div
          className="absolute inset-0 w-full h-screen -z-80"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_8.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />

        {/* Layer7 */}
        <motion.div
          className="absolute inset-0 -z-70"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_7.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer7Y,
          }}
        />

        {/* Layer6 */}
        <motion.div
          className="absolute inset-0 -z-60"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_6.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer6Y,
          }}
        />

        {/* Layer5 */}
        <motion.div
          className="absolute inset-0 -z-50"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_5.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer5Y,
          }}
        />

        {/* Layer4 */}
        <motion.div
          className="absolute inset-0 -z-40"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_4.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer4Y,
          }}
        />

        {/* Layer3 */}
        <motion.div
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_3.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer3Y,
          }}
        />

        {/* Layer2 */}
        <motion.div
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_2.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer2Y,
          }}
        />

        {/* Layer1 */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(/assets/Starry_night_Layer_1.png)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
            y: layer1Y,
          }}
        />
      </div>
    </section>
  );
};

export default ParallaxBackground;
