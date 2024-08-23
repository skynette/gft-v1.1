declare module 'react-simple-maps' {
    import * as React from 'react';
  
    export interface ComposableMapProps {
      // Add any specific props you might need here, or use `any` for flexibility
      [key: string]: any;
    }
  
    export class ComposableMap extends React.Component<ComposableMapProps> {}
  
    export interface GeographiesProps {
      // Add any specific props you might need here, or use `any` for flexibility
      [key: string]: any;
    }
  
    export class Geographies extends React.Component<GeographiesProps> {}
  
    export interface GeographyProps {
      // Add any specific props you might need here, or use `any` for flexibility
      [key: string]: any;
    }
  
    export class Geography extends React.Component<GeographyProps> {}
  }
  