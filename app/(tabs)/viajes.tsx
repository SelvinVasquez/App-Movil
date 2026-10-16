import { IntegracionLista } from '@/components/integracion-lista';
import { VIAJES } from '@/constants/integraciones';

export default function ViajesScreen() {
  return <IntegracionLista integracion={VIAJES} />;
}
