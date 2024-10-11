"use client";

// src/components/BoxScene.tsx
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";

// GLTF 모델을 불러오는 컴포넌트
function HouseModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/house/scene.gltf"); // public/models 폴더의 GLTF 파일 경로
  // 모든 자식 객체에 그림자 활성화
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).castShadow = true;
      (child as THREE.Mesh).receiveShadow = true;
    }
  });

  return <primitive object={scene} {...props} />;
}

function HouseScene() {
  return (
    <>
      <HouseModel scale={new Vector3(1, 1, 1)} position={[0, 0, 0]} />
      <OrbitControls />
    </>
  );
}

export default HouseScene;
