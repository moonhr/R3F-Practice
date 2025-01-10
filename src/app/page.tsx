"use client";
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

const SubtractModel = () => {
  const aMeshRef = useRef<THREE.Mesh>(null);
  const bMeshRef = useRef<THREE.Mesh>(null);

  // 버튼 클릭 시 A - B 모델링 처리
  const handleSubtract = () => {
    if (!aMeshRef.current || !bMeshRef.current) return;

    // A 모델링과 B 모델링의 CSG 객체 생성
    const aCSG = CSG.fromMesh(aMeshRef.current);
    const bCSG = CSG.fromMesh(bMeshRef.current);

    // CSG 연산으로 A - B 수행
    const subtractedCSG = aCSG.subtract(bCSG);

    // A의 geometry를 갱신
    const newGeometry = CSG.toMesh(
      subtractedCSG,
      aMeshRef.current.matrix,
      aMeshRef.current.material
    ).geometry;
    aMeshRef.current.geometry.dispose(); // 기존 geometry 메모리 해제
    aMeshRef.current.geometry = newGeometry; // 새 geometry로 갱신

    // B의 geometry 제거
    bMeshRef.current.geometry.dispose(); // 기존 geometry 메모리 해제
    bMeshRef.current.visible = false; // B를 씬에서 숨김
  };

  return (
    <>
      {/* A 모델링 */}
      <mesh ref={aMeshRef} position={[-1.5, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>

      {/* B 모델링 */}
      <mesh ref={bMeshRef} position={[-0.5, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>

      {/* 버튼: Html 컴포넌트를 사용 */}
      <Html position={[0, 3, 0]} center>
        <button
          style={{
            padding: "10px 20px",
            background: "lightblue",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleSubtract}
        >
          Subtract A - B
        </button>
      </Html>
    </>
  );
};

export default function App() {
  return (
    <Canvas
      camera={{ position: [10, 10, 10], fov: 50 }}
      className="w-full h-full"
    >
      <ambientLight />
      <OrbitControls />
      <directionalLight position={[10, 10, 10]} />
      <SubtractModel />
    </Canvas>
  );
}
