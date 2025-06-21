import { Component } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";

@Component({
  selector: 'app-default-chat-page',
  imports: [
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './default-chat-page.component.html',
  styleUrl: './default-chat-page.component.css'
})
export class DefaultChatPageComponent {
  public Solicitacoes = [];
  public AdicionadosSelecionados = true;
  public SolicitacoesSelecionados = false;

  public SelectSolicitacoes()
  {
    this.SolicitacoesSelecionados = true;
    this.AdicionadosSelecionados = false;
  }

  public SelectAdicionados()
  {
    this.SolicitacoesSelecionados = false;
    this.AdicionadosSelecionados = true;
  }
}
