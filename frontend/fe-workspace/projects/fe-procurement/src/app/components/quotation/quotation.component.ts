import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {
  quotationForm: FormGroup;

  documentInput: any;
  documentName: any;
  serviceList: any;
  constructor(private formBuilder: FormBuilder,) {
    this.quotationForm = this.formBuilder.group({
      prezzo: [null, Validators.required],
      messaggioAggiuntivo: [null, Validators.required],

    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {}

  onFileChanged(input: HTMLInputElement): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    // @ts-ignore
    const file = input.files[0];
    this.documentInput = file;
    this.documentName = `${file.name} (${formatBytes(file.size)})`;
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
  }

}
