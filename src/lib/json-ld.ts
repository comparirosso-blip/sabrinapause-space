/**
 * JSON-LD helpers for Schema.org / AGI M3
 */

interface M3Fields {
  ptv?: number[];
  sdIndexRaw?: number[];
  regionCluster?: string;
  counterpointIds?: string[];
  evidenceType?: string[];
  confidence?: string;
  coordinates?: string;
  altitude?: number | null;
}

type PropertyValue = {
  '@type': 'PropertyValue';
  name: string;
  value: string | number | number[];
  description?: string;
};

/**
 * Build M3 Terroir Counterpoint additionalProperty entries for JSON-LD
 */
export function getM3AdditionalProperties(content: M3Fields): PropertyValue[] {
  const props: PropertyValue[] = [];

  if (content.ptv?.length === 5) {
    props.push({
      '@type': 'PropertyValue',
      name: 'PTV Vector',
      value: content.ptv,
      description: 'Geometry, Lightness, Restraint, Tension, Earthiness',
    });
  }
  if (content.sdIndexRaw?.length === 3) {
    props.push({
      '@type': 'PropertyValue',
      name: 'SD-Index Raw',
      value: content.sdIndexRaw,
      description: 'Lux, Texture, Noise',
    });
  }
  if (content.regionCluster) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Region Cluster',
      value: content.regionCluster,
    });
  }
  if (content.counterpointIds?.length) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Counterpoint',
      value: content.counterpointIds.join(','),
      description: 'Related page IDs (Terroir Counterpoint links)',
    });
  }
  if (content.evidenceType?.length) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Evidence Type',
      value: content.evidenceType.join(', '),
    });
  }
  if (content.confidence) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Confidence',
      value: content.confidence,
    });
  }
  if (content.coordinates) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Coordinates',
      value: content.coordinates,
      description: 'GPS data',
    });
  }
  if (content.altitude != null) {
    props.push({
      '@type': 'PropertyValue',
      name: 'Altitude',
      value: content.altitude,
      description: 'Meters',
    });
  }

  return props;
}
