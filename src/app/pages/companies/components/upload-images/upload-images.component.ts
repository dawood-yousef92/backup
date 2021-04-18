import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})

export class UploadImagesComponent implements OnInit {
  
  @Output() selectedImages: EventEmitter<any> = new EventEmitter();
  @ViewChild('cropModal', { static: false }) cropModal: ElementRef;
  imageChangedEvent: any = '';
  images:any = [];
  closeResult = '';
  croppedImage: any = '';
  errorImg:boolean = false;
  constructor(private modalService: NgbModal) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.modalService.open(this.cropModal, { centered: true } );
  }

  selectFile() {
    let inputFile = document.getElementById('select-file');
    inputFile.click();
  }

  deleteImg(img) {
    this.images.splice(this.images.indexOf(img),1);
    this.emitImages();
  }

  imageCropped(event: ImageCroppedEvent) {
    let inputFile = document.getElementById('select-file');
    this.croppedImage = {base64: event?.base64 , file: this.dataURLtoFile(event.base64, (inputFile as HTMLInputElement)?.files[0]?.name)};
  }

  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  addCroppedImage(img) {
    if(img.file.size > 2097152) {
      this.errorImg = true;
    }
    else {
      this.errorImg = false;
      this.images.push(img);
      this.modalService.dismissAll();
      this.emitImages();
    }
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  openModal(content) {
    this.modalService.open(content, { centered: true } ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  emitImages() {
    this.selectedImages.emit(this.images);
  }

  ngOnInit(): void {
  }

}
