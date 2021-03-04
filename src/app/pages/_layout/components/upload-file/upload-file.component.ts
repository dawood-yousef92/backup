import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  @Input() selectedFile: File;
  @Input() type: string;
  @Input() extentions: string;
  @Input() size: number;
  @Input() color: number;
  @Input() icon: string;
  
  @Output() selectFile: EventEmitter<any> = new EventEmitter();

  errorImageSize:boolean = false;

  constructor() { }

  readfiles(files) {
    if(files[0].size > ((this.size * 1024) * 1024) || !files[0].type.includes(this.type)) {
      this.errorImageSize = true;
      this.selectedFile = null;
      this.emitPhoto();
      return;
    }
    else {
      this.errorImageSize = false;
    }

    this.selectedFile = files[0];
    this.emitPhoto();
  }

  readURL(e) {
    let inputTarget = e.target;
    if (inputTarget.files && inputTarget.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          if(inputTarget.files[0].size > ((this.size * 1024) * 1024) || !inputTarget.files[0].type.includes(this.type)) {
            this.errorImageSize = true;
            this.selectedFile = null;
            this.emitPhoto();
            return;
          }
          else {
            this.errorImageSize = false;
          }
        }
        reader.readAsDataURL(inputTarget.files[0]);
        this.selectedFile = inputTarget.files[0];
        this.emitPhoto();
    }
  }

  dragOverEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dragendEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dropEvent(event) {
    event.stopPropagation();
    event.preventDefault();
    this.readfiles(event.dataTransfer.files);
  }

  clickInput() {
    let element = document.getElementById('dropFiles');
    element.click();
  }

  emitPhoto() {
    this.selectFile.emit({file:this.selectedFile});
  }

  ngOnInit(): void { }
}
