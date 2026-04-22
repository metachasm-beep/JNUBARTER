import { ThreeElement } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
      meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
    }
  }
}
