"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
} from "@react-three/postprocessing";
import { Vector3, Euler } from "three";

function BottleModel(
  props: JSX.IntrinsicElements["group"] & { hover: boolean }
) {
  const { scene } = useGLTF("/models/bottle/scene.gltf");
  const { hover } = props;
  const groupRef = useRef<THREE.Group>(null);

  // 모든 자식 객체에 그림자 활성화
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  // 호버 효과를 위한 스프링 애니메이션
  const { scale } = useSpring({
    scale: hover ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const AnimatedGroup = animated("group");

  return (
    <Select enabled={hover}>
      <AnimatedGroup ref={groupRef} {...props} scale={scale}>
        <primitive object={scene} />
      </AnimatedGroup>
    </Select>
  );
}

function BottleScene() {
  const bottleRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  useFrame(({ clock }) => {
    if (bottleRef.current) {
      const elapsedTime = clock.getElapsedTime();
      bottleRef.current.position.y = 5.5 + Math.sin(elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = () => {
    console.log("Bottle clicked!");
    // 여기에 클릭 시 수행할 동작을 추가하세요
  };

  return (
    <Selection>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          blur
          visibleEdgeColor={0xffffff}
          hiddenEdgeColor={0x22090a}
          edgeStrength={100}
          width={1000}
        />
      </EffectComposer>
      <BottleModel
        ref={bottleRef}
        hover={hover}
        position={[3, 5.5, 5]}
        rotation={new Euler(Math.PI / 2.7, Math.PI / 30, 0)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      />
    </Selection>
  );
}

export default BottleScene;
