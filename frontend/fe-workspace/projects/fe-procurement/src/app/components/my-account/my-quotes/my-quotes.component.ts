import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.scss']
})
export class MyQuotesComponent implements OnInit {

  public ELEMENT_DATA = [
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Alto', scadenza: '15/03/2022',bilancio: '€ 200',tuoPrezzo: '€ 150',dataPresentazione: '13/03/2022',stato: 'Aprire'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Medio', scadenza: '15/03/2022',bilancio: '€ 250',tuoPrezzo: '€ 180',dataPresentazione: '13/03/2022',stato: 'Vicina'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Basso', scadenza: '15/03/2022',bilancio: '€ 240',tuoPrezzo: '€ 100',dataPresentazione: '13/03/2022',stato: 'Aprire'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Alto', scadenza: '15/03/2022',bilancio: '€ 300',tuoPrezzo: '€ 250',dataPresentazione: '13/03/2022',stato: 'Vicina'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Medio', scadenza: '15/03/2022',bilancio: '€ 210',tuoPrezzo: '€ 700',dataPresentazione: '13/03/2022',stato: 'Aprire'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Basso', scadenza: '15/03/2022',bilancio: '€ 250',tuoPrezzo: '€ 750',dataPresentazione: '13/03/2022',stato: 'Vicina'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Alto', scadenza: '15/03/2022',bilancio: '€ 280',tuoPrezzo: '€ 800',dataPresentazione: '13/03/2022',stato: 'Aprire'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Medio', scadenza: '15/03/2022',bilancio: '€ 300',tuoPrezzo: '€ 120',dataPresentazione: '13/03/2022',stato: 'Vicina'},
    {id: '#435684253', titoloCitazione: 'Lorem Ipsum', priorita: 'Basso', scadenza: '15/03/2022',bilancio: '€ 250',tuoPrezzo: '€ 150',dataPresentazione: '13/03/2022',stato: 'Aprire'},
  ];

  constructor() { }

  displayedColumns: string[] = ['id', 'titoloCitazione', 'priorita', 'scadenza','bilancio','tuoPrezzo','dataPresentazione','stato'];
  dataSource = this.ELEMENT_DATA;

  ngOnInit(): void {
  }

}
