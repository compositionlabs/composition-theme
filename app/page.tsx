import Link from 'next/link';
import PointCloudViewer from '@/components/PointCloud';

export default function Home() {
  return (
    <div className='h-full my-auto'>
      <PointCloudViewer />
    </div>
  );
}