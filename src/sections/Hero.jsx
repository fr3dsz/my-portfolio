import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import { Ghost } from "../components/Ghost";
import { OrbitControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });

  return (
    <section className="flex items-start justify-center md:items-start md:justify-start min-h-screen overflow-hidden c-space">
      <HeroText />
      <ParallaxBackground />
      <figure className="absolute inset-0" style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          {" "}
          {/* ✅ centered camera */}
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 6, 3]} intensity={1} />
            <Ghost isMobile={isMobile} /> {/* ✅ clean — no conflicting props */}
            <OrbitControls enableZoom={false} />
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(state.camera.position, [state.mouse.x / 10, state.mouse.y / 10, 5], 0.5, delta);
  });
}

export default Hero;
