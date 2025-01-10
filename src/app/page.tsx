"use client";
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

const SubtractModel = () => {
  const aMeshRef = useRef<THREE.Mesh>(null);
  const bMeshRef = useRef<THREE.Mesh>(null);

  const [actions, setActions] = useState<THREE.BufferGeometry[]>([]); // 작업 기록
  const [currentGeometry, setCurrentGeometry] =
    useState<THREE.BufferGeometry | null>(null); // 현재 A의 상태

  // A에서 B를 빼는 작업
  const handleSubtract = () => {
    if (!aMeshRef.current || !bMeshRef.current) return;

    // A와 B의 CSG 생성
    const aCSG = CSG.fromMesh(aMeshRef.current);
    const bCSG = CSG.fromMesh(bMeshRef.current);

    // CSG 연산으로 A - B 수행
    const subtractedCSG = aCSG.subtract(bCSG);
    const newGeometry = CSG.toMesh(
      subtractedCSG,
      aMeshRef.current.matrix,
      aMeshRef.current.material
    ).geometry;

    // 이전 상태 저장
    const previousGeometry = aMeshRef.current.geometry.clone();
    setActions((prev) => [...prev, previousGeometry]); // 스택에 기록

    // A 업데이트
    aMeshRef.current.geometry.dispose(); // 기존 geometry 메모리 해제
    aMeshRef.current.geometry = newGeometry;
    setCurrentGeometry(newGeometry); // 현재 상태 업데이트

    // B 숨기기
    bMeshRef.current.visible = false;
  };

  // Undo 작업
  const handleUndo = () => {
    if (actions.length === 0 || !aMeshRef.current) return;

    // 마지막 작업 상태 가져오기
    const lastGeometry = actions[actions.length - 1];
    setActions((prev) => prev.slice(0, -1)); // 스택에서 제거

    // A 상태 복구
    aMeshRef.current.geometry.dispose(); // 기존 geometry 메모리 해제
    aMeshRef.current.geometry = lastGeometry;
    setCurrentGeometry(lastGeometry); // 현재 상태 업데이트

    // B 다시 보이기 (Undo된 상태에서는 다시 보이도록 설정)
    bMeshRef.current.visible = true;
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

      {/* 버튼 UI */}
      <Html position={[0, 3, 0]} center>
        <div style={{ display: "flex", gap: "10px" }}>
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
          <button
            style={{
              padding: "10px 20px",
              background: "lightcoral",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      </Html>
    </>
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight />
      <OrbitControls />
      <directionalLight position={[10, 10, 10]} />
      <SubtractModel />
    </Canvas>
  );
}
