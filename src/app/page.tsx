"use client";
import React from "react";
import BottleScene from "@/components/Bottle";
import HouseScene from "@/components/House";
import { OceanScene } from "@/components/Ocean";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import KeyboardControlledCamera from "../components/KeyboardControlledCamera";

function App() {
  return (
    <div>
      <Canvas style={{ height: "100vh", background: "#f0f0f0" }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight
          intensity={1.2}
          color="white"
          position={[7, 10, 13]}
          castShadow
        />
        <Suspense fallback={null}>
          <OceanScene />
          <BottleScene />
          <HouseScene />
          <KeyboardControlledCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
