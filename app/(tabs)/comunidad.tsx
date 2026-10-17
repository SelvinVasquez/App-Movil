import { IntegracionLista } from '@/components/integracion-lista';
import { COMUNIDAD } from '@/constants/integraciones';

export default function ComunidadScreen() {
  return <IntegracionLista integracion={COMUNIDAD} />;
}
