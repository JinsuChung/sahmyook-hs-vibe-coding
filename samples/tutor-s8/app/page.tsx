import { Tutor } from '@/components/tutor';
import { publicConfig } from '@/lib/tutor-config';

// 설정 파일에서 학생 화면에 보여도 되는 값(과목·단원·학습 목표 등)만 골라 화면으로 넘긴다.
// 수업 코드와 API 키는 여기로 오지 않는다.
export default function Page() {
  return <Tutor config={publicConfig} />;
}
