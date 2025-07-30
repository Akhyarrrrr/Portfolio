import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { MaterialNode, BufferGeometryNode } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: BufferGeometryNode<
      MeshLineGeometry,
      typeof MeshLineGeometry
    >;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

export {};
