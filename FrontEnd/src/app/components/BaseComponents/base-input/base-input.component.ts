import {Component, input, model} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-base-input',
    imports: [
        FormsModule
    ],
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.css'
})
export class BaseInputComponent {
    public Model = model.required<string>()
    public Type = input<string>("text")
    public Readonly = model<boolean>(false)
    public Label = input<string>()
    public MaxLength = input<string>('100');

    IsDisabled() : boolean
    {
        switch (this.Type())
        {
            case "text":
                return this.CheckDisabledText()

            case "password":
                return this.CheckDisabledPassword()
            default:
                return false
        }
    }

    CheckDisabledText() : boolean
    {
        return this.Readonly();
    }
    CheckDisabledPassword() : boolean
    {
        return this.Readonly();
    }
}
