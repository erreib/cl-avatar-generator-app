import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as saveAs from 'file-saver';
import * as canvg from 'canvg';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, AfterViewInit {

  showAvatar = false;

  svgWidth = 234;  // Width of the SVG container
  svgHeight = 244;  // Height of the SVG container
  clothesY = 0;  // Y-coordinate for the clothes SVG (aligned to the bottom)
  bodyX = 0;  // X-coordinate for the body SVG (aligned to the center)


  bodySvgMap: { [key: string]: string } = {
    'body1': 'assets/avatar-parts/body/body1.svg',
    'body2': 'assets/avatar-parts/body/body2.svg',
    'body3': 'assets/avatar-parts/body/body3.svg',
  };

  hairSvgMap: { [key: string]: string } = {
    'hair1': 'assets/avatar-parts/hair/hair1.svg',
    'hair2': 'assets/avatar-parts/hair/hair2.svg',
    'hair3': 'assets/avatar-parts/hair/hair3.svg',
  };

  faceSvgMap: { [key: string]: string } = {
    'face1': 'assets/avatar-parts/face/face1.svg',
    'face2': 'assets/avatar-parts/face/face2.svg',
    'face3': 'assets/avatar-parts/face/face3.svg',
  };

  clothesSvgMap: { [key: string]: string } = {
    'clothes1': 'assets/avatar-parts/clothes/clothes1.svg',
    'clothes2': 'assets/avatar-parts/clothes/clothes2.svg',
    'clothes3': 'assets/avatar-parts/clothes/clothes3.svg',
  };

  selectedBody = 'body1';  // Default to the first body set
  selectedHair = 'hair1';  // Default to the first hair set
  selectedFace = 'face1';  // Default to the first face set
  selectedClothes = 'clothes1';  // Default to the first clothes set

  objectKeys = Object.keys;  // Expose Object.keys to the template

  constructor(
    private http: HttpClient,
    private elRef: ElementRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadClothesSVG();  // Add this line to load the default clothes SVG
  }

  toggleAvatar(): void {
    this.showAvatar = !this.showAvatar;
  }

  changeBody(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBody = selectElement.value;
    this.loadBodySVG();  // Add this line to reload the body SVG
  }

  changeHair(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedHair = selectElement.value;
    this.loadSvg('hair', this.hairSvgMap[this.selectedHair]);
  }

  changeFace(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFace = selectElement.value;
    this.loadSvg('face', this.faceSvgMap[this.selectedFace]);

  }

  changeClothes(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedClothes = selectElement.value;
    this.loadClothesSVG();  // Add this line to reload the clothes SVG
  }  

// Method for dynamically fetching and injecting SVGs
loadSvg(layer: string, url: string): void {
  this.http.get(url, { responseType: 'text' }).subscribe(
    data => {
      const svgElement = this.elRef.nativeElement.querySelector(`#avatar-${layer}`);
      this.renderer.setProperty(svgElement, 'innerHTML', data);

      // Retrieve the inserted SVG element
      const svg = svgElement.querySelector('svg');
      if (!svg) return; // Exit if SVG is not found

      const layerWidth = +svg.getAttribute('width')! || 0;  // Get width attribute from SVG

      // Calculate the x coordinate to center-align the layer
      const layerX = (this.svgWidth - layerWidth) / 2;

      // Update the x attribute of the layer SVG
      this.renderer.setAttribute(svg, 'x', String(layerX));

      // Apply specific behavior based on the layer type
      if (layer === 'hair') {
        const currentY = parseFloat(svg.getAttribute('y') || '0');
        this.renderer.setAttribute(svg, 'y', String(currentY - 23));  // Move up by 20 pixels

        // Re-append the hair SVG to its parent container to make it the last child
        const parentContainer = svg.parentElement;
        if (parentContainer) {
          parentContainer.appendChild(svg);
        }
      }

      if (layer === 'face') {
        const currentY = parseFloat(svg.getAttribute('y') || '0');
        this.renderer.setAttribute(svg, 'y', String(currentY + 52));  // Move down by 20 pixels
      }
    },
    err => {
      console.log(`Error loading ${layer} SVG: ${err}`);
    }
  );
}


  loadClothesSVG(): void {
    this.http.get(this.clothesSvgMap[this.selectedClothes], { responseType: 'text' }).subscribe(
      data => {
        const parser = new DOMParser();
        const svg = parser.parseFromString(data, 'image/svg+xml').documentElement;
        const clothesWidth = +svg.getAttribute('width')! || 0;  // Get width attribute from SVG
        const clothesHeight = +svg.getAttribute('height')! || 0;  // Get height attribute from SVG
          
        // Calculate the x and y coordinates for clothes
        const clothesX = (this.svgWidth - clothesWidth) / 2; // Calculate x to center-align clothes
        const clothesY = this.svgHeight - clothesHeight; // Y-coordinate to align to the bottom
  
        // Clear previous SVG and append the new one
        const clothesContainer = this.el.nativeElement.querySelector('#avatar-clothes');
        while (clothesContainer.firstChild) {
          this.renderer.removeChild(clothesContainer, clothesContainer.firstChild);
        }
        this.renderer.appendChild(clothesContainer, svg);
  
        // Update the x and y attributes of the clothes SVG
        this.renderer.setAttribute(svg, 'x', String(clothesX));
        this.renderer.setAttribute(svg, 'y', String(clothesY));
      },
      err => {
        console.error(err);
      }
    );
  }

  loadBodySVG(): void {
    this.http.get(this.bodySvgMap[this.selectedBody], { responseType: 'text' }).subscribe(
      data => {
        const parser = new DOMParser();
        const svg = parser.parseFromString(data, 'image/svg+xml').documentElement;
        const bodyWidth = +svg.getAttribute('width')! || 0;  // Get width attribute from SVG

        // Calculate the x coordinate for body to center-align it
        const bodyX = (this.svgWidth - bodyWidth) / 2;

        // Clear previous SVG and append the new one
        const bodyContainer = this.el.nativeElement.querySelector('#avatar-body');
        while (bodyContainer.firstChild) {
          this.renderer.removeChild(bodyContainer, bodyContainer.firstChild);
        }
        this.renderer.appendChild(bodyContainer, svg);

        // Update the x attribute of the body SVG
        this.renderer.setAttribute(svg, 'x', String(bodyX));
      },
      err => {
        console.error(err);
      }
    );
  }

  
  
}
