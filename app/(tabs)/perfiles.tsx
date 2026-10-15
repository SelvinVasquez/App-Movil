import { IntegracionLista } from '@/components/integracion-lista';
import { PERFILES } from '@/constants/integraciones';

export default function PerfilesScreen() {
  return <IntegracionLista integracion={PERFILES} />;
}
