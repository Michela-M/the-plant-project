import PlantCard from '../components/PlantCard';
import ButtonRadio from '../components/ButtonRadio';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useState } from 'react';

export default function Encyclopedia() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const icons = [
    { Icon: LayoutGrid, id: 'grid' },
    { Icon: LayoutList, id: 'list' },
  ];

  function handleChange(index: number) {
    console.log('Selected index: ', index);
    setSelectedIndex(index);
  }

  return (
    <div className="w-1/2 mx-auto my-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Encyclopedia</h1>
        <ButtonRadio
          icons={icons}
          selectedIndex={selectedIndex}
          onChange={handleChange}
        />
      </div>

      {selectedIndex === 0 ? (
        <div className="grid grid-cols-3 gap-4">
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard
            imageUrl="https://images.plnts.com/optimize/w:1920/plain/https://webshop.plnts.com/media/catalog/product/cache/aa5d334f459227518b6c3cf7ea9d29ed/p/_/p.002976-1.jpg"
            family="Asparagaceae"
            commonName="Snake Plant"
          />
          <PlantCard />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
