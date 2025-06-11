import { Gallery as GalleryComponent } from '../../components/Gallery';

export const GalleryPage = () => {
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#FCFAF7' }}>
      <div className="max-w-7xl mx-auto">
        <GalleryComponent showTitle={true} className="py-8" />
      </div>
    </div>
  );
};
