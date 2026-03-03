import { H3 } from '@components/Typography';
import type {
  SpeciesCareSection,
  SpeciesDetailsData,
} from '../types/speciesDetails';
import ImagePreview from '@components/ImagePreview';

export default function SpeciesDetailsMainContent({
  speciesDetails,
}: {
  speciesDetails: SpeciesDetailsData;
}) {
  return (
    <div className="w-5/8 flex flex-col gap-6">
      <p>{speciesDetails.description}</p>
      <SpeciesDetailsSection
        header="Watering"
        content={speciesDetails.watering}
      />
      <SpeciesDetailsSection
        header="Light Requirements"
        content={speciesDetails.light}
      />
      <SpeciesDetailsSection
        header="Humidity"
        content={speciesDetails.humidity}
      />
      <SpeciesDetailsSection
        header="Temperature"
        content={speciesDetails.temperature}
      />
      <SpeciesDetailsSection
        header="Soil & Repotting"
        content={speciesDetails.soilAndRepotting}
      />
      <SpeciesDetailsSection
        header="Fertilizing"
        content={speciesDetails.fertilizing}
      />
      <SpeciesDetailsSection
        header="Pests & Problems"
        content={speciesDetails.pestsAndProblems}
      />
      <SpeciesDetailsSection
        header="Propagation"
        content={speciesDetails.propagation}
      />
    </div>
  );
}

function SpeciesDetailsSection({
  header,
  content,
}: {
  header: string;
  content: SpeciesCareSection;
}) {
  return (
    <div className="flex flex-col">
      <H3>{header}</H3>
      <p>{content.text}</p>
      {content.images.length > 0 && (
        <div className="flex gap-4 mt-4">
          {content.images.map((img, index) => (
            <div key={index} className="w-1/3">
              <ImagePreview
                url={img.url}
                alt={img.description}
                description={img.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
