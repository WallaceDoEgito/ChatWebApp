import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brazilianDatePipe'
})
export class BrazilianDatePipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if(value == null)
      return ""

    let date = new Date(value);

    if(Number.isNaN(date.valueOf())) return ""
    let stringFormated = "";

    stringFormated += date.getDate();
    stringFormated += " de "
    switch (date.getMonth())
    {
      case 0:
        stringFormated += "janeiro";
        break;
      case 1:
        stringFormated += "fevereiro";
        break;
      case 2:
        stringFormated += "março";
        break;
      case 3:
        stringFormated += "abril";
        break;
      case 4:
        stringFormated += "maio";
        break;
      case 5:
        stringFormated += "junho";
        break;
      case 6:
        stringFormated += "julho";
        break;
      case 7:
        stringFormated += "agosto";
        break;
      case 8:
        stringFormated += "setembro";
        break;
      case 9:
        stringFormated += "outubro";
        break;
      case 10:
        stringFormated += "novembro";
        break;
      case 11:
        stringFormated += "dezembro";
        break;
    }
    stringFormated += " de "
    stringFormated += date.getFullYear()
    return stringFormated;
  }

}
