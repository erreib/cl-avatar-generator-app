import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  showAvatar = false;

  skinColors = ['white', 'tan', 'brown', 'black'];
  selectedSkin = this.skinColors[0];

  hairColors = ['black', 'brown', 'blonde', 'red'];
  selectedHair = this.hairColors[0];

  clothesColors = ['blue', 'green', 'red', 'black'];
  selectedClothes = this.clothesColors[0];

  constructor() { }

  ngOnInit(): void {
  }

  toggleAvatar(): void {
    this.showAvatar = !this.showAvatar;
  }

  changeSkin(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSkin = selectElement.value;
  }

  changeHair(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedHair = selectElement.value;
  }

  changeClothes(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedClothes = selectElement.value;
  }

}
